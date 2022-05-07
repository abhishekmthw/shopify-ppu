import Shopify from "@shopify/shopify-api";

const getShopDetails = async ({ shop, access_token }) => {
  const client = new Shopify.Clients.Rest(shop, access_token);
  const data = await client.get({
    path: "shop",
  });
  return data.body.shop;
};

export default getShopDetails;
