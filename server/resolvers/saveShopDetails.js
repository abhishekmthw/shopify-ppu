import ddb from "@/server/db/ddb";
import logger from "@/server/logger";

const saveShopDetails = async ({ scope, access_token, shop, details }) => {
  try {
    const params = {
      TableName: process.env.DYNAMODB_TABLE,
      Item: {
        pk: `SHOP#${shop}`,
        sk: `SHOP#${shop}`,
        access_token,
        scope,
        details,
        installed: true,
        lastLoginAt: Math.floor(Date.now() / 1000),
      },
    };
    await ddb.put(params).promise();
  } catch (error) {
    logger.error({
      msg: `error saving the access token for ${shop}`,
      error,
    });
    return null;
  }
};

export default saveShopDetails;
