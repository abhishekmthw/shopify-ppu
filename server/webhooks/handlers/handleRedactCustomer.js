import logger from "@/server/logger";

const handleRedactCustomer = (shop, body) => {
  logger.notice({
    msg: `[mandatory webhook] request to redact customer`,
    body,
  });
};

export default handleRedactCustomer;
