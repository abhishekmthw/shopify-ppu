import Shopify, { DataType } from "@shopify/shopify-api";
import logger from "@/server/logger";

// which webhooks should be active?
const DEFAULT_WEBHOOKS = ["app/uninstalled"];

// sync webhooks (remove outdated webhooks and add new ones)
const syncWebhooks = async ({ shop, access_token }) => {
  try {
    // create the Shopify API client
    const client = new Shopify.Clients.Rest(shop, access_token);

    // get the currently active webhooks
    const data = await client.get({
      path: "webhooks",
    });
    const currentWebhooks = data.body.webhooks;

    // from the currently active webhooks, which ones are outdated?
    const outdatedWebhooks = currentWebhooks.filter(
      (w) =>
        !DEFAULT_WEBHOOKS.includes(w.topic) ||
        w.address !== `${process.env.APP_URL}${process.env.WEBHOOK_PATH}`
    );

    // which default webhooks are not currently active?
    const newWebhooks = DEFAULT_WEBHOOKS.filter(
      (topic) =>
        !currentWebhooks.some(
          (w) =>
            w.topic === topic &&
            w.address === `${process.env.APP_URL}${process.env.WEBHOOK_PATH}`
        )
    );

    // delete outdated webhooks, subscribe to the new ones
    await Promise.all([
      ...outdatedWebhooks.map(async (w) => {
        logger.info({
          msg: `Deleting old webhook ${w.topic} for ${shop}`,
        });
        await client.delete({
          path: `webhooks/${id}`,
        });
      }),
      ...newWebhooks.map(async (topic) => {
        logger.info({
          msg: `Adding webhook ${topic} for ${shop}`,
        });
        await client.post({
          path: "webhooks",
          data: {
            webhook: {
              topic,
              address: `${process.env.APP_URL}${process.env.WEBHOOK_PATH}`,
              format: "json",
            },
          },
          type: DataType.JSON,
        });
      }),
    ]);
  } catch (error) {
    logger.error({
      msg: `error syncing webhooks for ${shop}`,
      error,
    });
  }
};

export default syncWebhooks;
