import crypto from "crypto";
import getRawBody from "raw-body";

const verifyWebhook = async (req) => {
  const hmac =
    req.headers["X-Shopify-Hmac-Sha256"] ??
    req.headers["x-shopify-hmac-sha256"];
  const topic =
    req.headers["X-Shopify-Topic"] ?? req.headers["x-shopify-topic"];
  const shop =
    req.headers["X-Shopify-Shop-Domain"] ??
    req.headers["x-shopify-shop-domain"];
  const rawBody = await getRawBody(req);
  const body = JSON.parse(rawBody.toString("utf-8"));

  const computedHmac = crypto
    .createHmac("sha256", process.env.SHOPIFY_SECRET_KEY)
    .update(rawBody, "utf8", "hex")
    .digest("base64");

  const hmac_buffer = Buffer.from(hmac);
  const computedHmac_buffer = Buffer.from(computedHmac, "utf-8");

  const valid =
    hmac_buffer.length === computedHmac_buffer.length &&
    crypto.timingSafeEqual(hmac_buffer, computedHmac_buffer, "utf-8");

  return { valid, topic, shop, body };
};

export default verifyWebhook;
