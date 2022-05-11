import crypto from "crypto";
import getRawBody from "raw-body";
import logger from "@/server/logger";

const verifyWebhook = async (req) => {
  const hmac =
    req.headers["X-Shopify-Hmac-Sha256"] ??
    req.headers["x-shopify-hmac-sha256"];
  const topic =
    req.headers["X-Shopify-Topic"] ?? req.headers["x-shopify-topic"];
  const shop =
    req.headers["X-Shopify-Shop-Domain"] ??
    req.headers["x-shopify-shop-domain"];

  if (!hmac || !topic || !shop) {
    return {
      valid: false,
    };
  }

  const rawBody = await getRawBody(req);
  try {
    const body = JSON.parse(rawBody.toString("utf8"));
    const computedHmac = crypto
      .createHmac("sha256", process.env.SHOPIFY_SECRET_KEY)
      .update(rawBody, "utf8", "hex")
      .digest("base64");
    const hmac_buffer = Buffer.from(hmac, "utf8");
    const computedHmac_buffer = Buffer.from(computedHmac, "utf8");

    const valid =
      hmac_buffer.length === computedHmac_buffer.length &&
      crypto.timingSafeEqual(hmac_buffer, computedHmac_buffer);

    return {
      valid,
      topic,
      shop,
      body,
    };
  } catch (error) {
    logger.error({
      msg: "error verifying webhook",
      error,
    });
    return {
      valid: false,
    };
  }
};

export default verifyWebhook;
