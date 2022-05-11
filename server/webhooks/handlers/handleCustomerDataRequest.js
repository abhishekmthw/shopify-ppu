import logger from "@/server/logger";

const handleCustomerDataRequest = (shop, body) => {
  logger.notice({
    msg: `[mandatory webhook] data request for customer`,
    body,
  });
};

export default handleCustomerDataRequest;
