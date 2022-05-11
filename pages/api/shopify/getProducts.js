import withJWT from "@/server/auth/withJWT";
import nc from "next-connect";
import Shopify from "@shopify/shopify-api";
import getAccessToken from "@/server/resolvers/getAccessToken";
import logger from "@/server/logger";

const handler = nc().get(async (req, res) => {
  try {
    const shop = req.shop;
    const { access_token } = await getAccessToken({ shop });
    const client = new Shopify.Clients.Graphql(shop, access_token);
    const products = await client.query({
      data: `{
        products(first: 10) {
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
    res.status(200).json({ products });
  } catch (error) {
    logger.error({
      msg: `error retrieving products through GraphQL API`,
      error,
    });
    res.status(422).json({
      msg: "error retreiving products through GraphQL API",
    });
  }
});

export default withJWT(handler);

export const config = {
  api: {
    externalResolver: true,
  },
};
