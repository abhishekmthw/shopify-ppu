import logger from "server/logger";

const handleCustomerDataRequest = (shop, body) => {
  logger.notice({
    msg: "[mandatory webhook] customer data request",
    body,
  });
};

export default handleCustomerDataRequest;
