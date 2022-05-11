import crypto from "crypto";
import axios from "axios";
import { verifyNonce } from "@/server/auth/nonce";
import scopesMatch from "@/server/resolvers/scopesMatch";
import getShopDetails from "@/server/shopify/getShopDetails";
import saveShopDetails from "@/server/resolvers/saveShopDetails";
import syncWebhooks from "@/server/webhooks/syncWebhooks";
import logger from "@/server/logger";

const handler = async (req, res) => {
  // code, hmac, host, shop, state
  if (
    !req?.query?.code ||
    !req?.query?.hmac ||
    !req?.query?.host ||
    !req?.query?.shop ||
    !req?.query?.state
  ) {
    res.status(422).json({
      error: "PARAMETERS MISSING",
      msg: "some required parameters are missing",
    });
    return;
  }

  const code = req.query.code;
  const hmac = req.query.hmac;
  const shop = req.query.shop;
  const state = req.query.state;

  // security check 1 - nonce is valid
  const nonceIsValid = verifyNonce(state, shop);
  if (!nonceIsValid) {
    res.status(422).json({
      error: "INVALID NONCE",
      msg: "nonce is invalid or expired",
    });
    return;
  }

  // security check 2 - hmac is valid and signed by Shopify
  const params = new URLSearchParams(req.query);
  params.delete("hmac");
  params.sort();
  const computedHmac = crypto
    .createHmac("SHA256", process.env.SHOPIFY_SECRET_KEY)
    .update(params.toString())
    .digest("hex");
  const hmac_buffer = Buffer.from(hmac, "utf8");
  const computedHmac_buffer = Buffer.from(computedHmac, "utf8");
  if (
    hmac_buffer.length !== computedHmac_buffer.length ||
    !crypto.timingSafeEqual(hmac_buffer, computedHmac_buffer)
  ) {
    res.status(422).json({
      error: "INVALID_HMAC",
      msg: "hmac is invalid",
    });
  }

  // security check 3 - shop has a valid format
  if (!/^[a-zA-Z0-9][a-zA-Z0-9\-]*\.myshopify\.com$/gi.test(shop)) {
    res.status(422).json({
      error: "INVALID_SHOP",
      msg: "shop is invalid",
    });
    return;
  }

  // exchange the authorization code for a permanent access token
  try {
    const { data } = await axios.post(
      `https://${shop}/admin/oauth/access_token`,
      {
        client_id: process.env.SHOPIFY_API_KEY,
        client_secret: process.env.SHOPIFY_SECRET_KEY,
        code,
      }
    );
    const { scope, access_token } = data;

    // check if the requested scopes match the provided scopes
    if (!scopesMatch(scope)) {
      res.status(422).json({
        error: "INVALID_SCOPE",
        msg: "scopes don't match",
      });
      return;
    }

    // get the shop details using from Shopify API
    // save the shop details along with the access token and scope
    const details = await getShopDetails({ shop, access_token });
    await saveShopDetails({ shop, details, access_token, scope });

    // subscribe to webhooks - e.g. uninstalled
    await syncWebhooks({ shop, access_token });

    // @todo: sync details with email autoresponder, or send to CRM

    // @todo: billing

    // redirect to dashboard
    const query = new URLSearchParams(req.query).toString();
    res.redirect(`${process.env.DASHBOARD_PATH}?${query}`);
  } catch (error) {
    logger.error({
      msg: "error exchanging authorization code for permanent access token",
      error,
    });
    res.status(503).json({
      error: "ACCESS_TOKEN_EXCHANGE_FAILED",
      msg: "Failed to exchange authorization code for permanent access token",
    });
  }
};

export default handler;

export const config = {
  api: {
    externalResolver: true,
  },
};
