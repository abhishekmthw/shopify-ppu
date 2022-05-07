import logger from "server/logger";

const handleRedactCustomer = (shop, body) => {
  logger.notice({
    msg: "[mandatory webhook] customer redact request",
    body,
  });
};

export default handleRedactCustomer;
