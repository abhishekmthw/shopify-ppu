import logger from "server/logger";
import * as Sentry from "@sentry/nextjs";

const handleCustomerDataRequest = (shop, body) => {
  logger.notice({
    msg: `[mandatory webhook] data request for customer ${body.customer.email} in shop ${body.shop_domain}`,
    body,
  });
  Sentry.withScope((scope) => {
    scope.setExtra(
      "details",
      JSON.stringify({
        msg: `[mandatory webhook] data request for customer ${body.customer.email} in shop ${body.shop_domain}`,
        body,
      })
    );
  });
  Sentry.captureMessage(
    `[mandatory webhook] data request for customer ${body.customer.email} in shop ${body.shop_domain}`
  );
};

export default handleCustomerDataRequest;
