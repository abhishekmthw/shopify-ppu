import ddb from "@/server/db/ddb";
import logger from "@/server/logger";

const getAccessToken = async ({ shop }) => {
  try {
    const params = {
      TableName: process.env.DYNAMODB_TABLE,
      Key: {
        pk: `SHOP#${shop}`,
        sk: `SHOP#${shop}`,
      },
    };
    const result = ddb.get(params).promise();
    if (result.Item && result.Item.access_token) {
      return { access_token: result.Item.access_token };
    } else {
      return { msg: "shop not found" };
    }
  } catch (error) {
    logger.error({
      msg: `error retrieving access token from ddb for ${shop}`,
      error,
    });
  }
};

export default getAccessToken;
