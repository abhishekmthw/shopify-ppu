import ddb from "@/server/db/ddb";
import logger from "@/server/logger";

const handleAppUninstalled = async (shop) => {
  try {
    const params = {
      TableName: process.env.DYNAMODB_TABLE,
      Key: {
        pk: `SHOP#${shop}`,
        sk: `SHOP#${shop}`,
      },
      UpdateExpression: "set installed = :f",
      ExpressionAttributeValues: {
        ":f": false,
      },
    };
    await ddb.update(params).promise();
  } catch (error) {
    logger.error({
      msg: `error uninstalling app from ddb for ${shop}`,
      error,
    });
  }
};

export default handleAppUninstalled;
