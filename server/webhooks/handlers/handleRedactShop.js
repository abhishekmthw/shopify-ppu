import logger from "@/server/logger";

const handleRedactShop = (shop, body) => {
  logger.notice({
    msg: `[mandatory webhook] request to redact shop`,
    body,
  });
};

export default handleRedactShop;
