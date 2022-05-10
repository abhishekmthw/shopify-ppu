import crypto from "crypto";
import { createNonce } from "@/server/auth/nonce";
import checkInstalled from "@/server/resolvers/checkInstalled";
import { withSentry } from "@sentry/nextjs";

const handler = async (req, res) => {
  const shop = req.body.query.shop;
  const hmac = req.body.query.hmac;

  if (!shop) {
    res.status(422).json({
      error: "SHOP MISSING",
      msg: "shop parameter is missing",
    });
  }

  if (!hmac) {
    res.status(422).json({
      error: "HMAC MISSING",
      msg: "hmac parameter is missing",
    });
  }

  //check hmac
  const params = new URLSearchParams(req.body.query);
  params.delete("hmac");
  params.sort();
  const computedHmac = crypto
    .createHmac("SHA256", process.env.SHOPIFY_SECRET_KEY)
    .update(params.toString())
    .digest("hex");

  const hmac_buffer = Buffer.from(hmac);
  const computedHmac_buffer = Buffer.from(computedHmac, "utf-8");
  if (
    hmac_buffer.length !== computedHmac_buffer.length ||
    !crypto.timingSafeEqual(hmac_buffer, computedHmac_buffer, "utf-8")
  )
    res.status(422).json({
      error: "INVALID_HMAC",
      msg: "hmac is invalid",
    });

  const isInstalled = await checkInstalled({ shop });

  if (isInstalled) {
    const query = new URLSearchParams(req.body.query).toString();
    res.status(200).json({
      redirect: `${process.env.DASHBOARD_PATH}?${query}`,
    });
    return;
  }

  const nonce = await createNonce(shop);

  res.status(200).json({
    redirect: `https://${shop}.myshopify.com/admin/oauth/authorize?client_id=${process.env.SHOPIFY_API_KEY}&scope=${process.env.SCOPES}&redirect_uri=${process.env.APP_URL}${process.env.CALLBACK_PATH}&state=${nonce}`,
  });
};

export default withSentry(handler);

export const config = {
  api: {
    externalResolver: true,
  },
};
