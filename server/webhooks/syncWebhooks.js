import Shopify from "@shopify/shopify-api";
import logger from "@/server/logger";

// which webhooks should be active?
const DEFAULT_WEB_HOOKS = ["app/uninstalled"];

// sync webhooks (remove outdated webhooks and add new ones)
const syncWebhooks = async ({ shop, access_token }) => {
  try {
    // create shopify API client
    const client = Shopify.Clients.Rest(shop, access_token);

    // get the currently active webhooks
    const data = await client.get({
      path: "webhooks",
    });
    const currentWebhooks = data.body.webhooks;

    // from the currently active webhooks, which ones are outdated?
    const outdatedWebhooks = currentWebhooks.filter(
      (w) =>
        !DEFAULT_WEB_HOOKS.includes(w.topic) ||
        w.address !== `${process.env.APP_URL}${process.env.WEBHOOK_PATH}`
    );

    // which default webhooksare not currently active?
    const newWebhooks = DEFAULT_WEB_HOOKS.filter(
      (topic) =>
        !currentWebhooks.some(
          (w) =>
            w.topic === topic &&
            w.address === `${process.env.APP_URL}${process.env.WEBHOOK_PATH}`
        )
    );

    // delete the outdated wehbooks, subscribe to the new ones
    await Promise.all([
      ...outdatedWebhooks.map(async (w) => {
        console.log(`Deleting old webhook ${w.topic} for ${shop}`);
        await client.delete({
          path: `webhooks/${w.id}`,
        });
      }),
      ...newWebhooks.map(async (topic) => {
        console.log(`Adding webhook ${topic} for ${shop}`);
        await client.post({
          path: "webhook",
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
