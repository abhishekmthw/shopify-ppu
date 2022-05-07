import logger from "server/logger";

const handleRedactShop = (shop, body) => {
  logger.notice({
    msg: "[mandatory webhook] shop redact request",
    body,
  });
};

export default handleRedactShop;
