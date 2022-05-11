import verifyWebhook from "@/server/webhooks/verifyWebhook";
import handleAppUninstalled from "@/server/webhooks/handlers/handleAppUninstalled";
import handleCustomerDataRequest from "@/server/webhooks/handlers/handleCustomerDataRequest";
import handleRedactCustomer from "@/server/webhooks/handlers/handleRedactCustomer";
import handleRedactShop from "@/server/webhooks/handlers/handleRedactShop";
import logger from "@/server/logger";

// webhook event triggered by Shopify
const handler = async (req, res) => {
  const { valid, topic, shop, body } = await verifyWebhook(req);

  if (valid) {
    switch (topic) {
      case "app/uninstalled":
        await handleAppUninstalled(shop);
        break;
      case "customers/data_request":
        handleCustomerDataRequest(shop, body);
        break;
      case "customers/redact":
        handleRedactCustomer(shop, body);
        break;
      case "shop/redact":
        handleRedactShop(shop, body);
        break;
    }
  } else {
    logger.error({ valid, topic, shop, body });
  }

  res.status(200).json({});
};

export default handler;

export const config = {
  api: {
    bodyParser: false,
    externalResolver: true,
  },
};
