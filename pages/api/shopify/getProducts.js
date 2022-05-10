import nc from "next-connect";
import withJWT from "@/server/auth/withJWT";
import getAccessToken from "@/server/resolvers/getAccessToken";
import Shopify from "@shopify/shopify-api";
import logger from "@/server/logger";
import { withSentry } from "@sentry/nextjs";
import * as Sentry from "@sentry/nextjs";

const handler = nc().get(async (req, res) => {
  try {
    const shop = req.shop;
    const { access_token } = getAccessToken({ shop });
    const client = Shopify.Clients.Graphql(shop, access_token);
    const products = client.query({
      data: `{
        products(first: 10, reverse: true) {
          edges {
            node {
              id
              title
              handle
              description
            }
          }
        }
      }`,
    });
    res.statusCode(200).json({ products });
  } catch (error) {
    logger.error({
      msg: "error retrieving products through Graphql API",
      error,
    });
    Sentry.captureException(error);
    res.statusCode(422).json({
      msg: "error retrieving products through Graphql API",
    });
  }
});

export default withSentry(withJWT(handler));

export const config = {
  api: {
    externalResolver: true,
  },
};
