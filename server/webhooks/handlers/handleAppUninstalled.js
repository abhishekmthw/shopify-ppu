import ddb from "@/server/db/ddb";
import logger from "@/server/logger";
import { UpdateCommand } from "@aws-sdk/lib-dynamodb";

const handleAppUninstalled = async (shop) => {
  try {
    logger.info(`uninstalling app from ddb for ${shop}`);
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
    await ddb.send(new UpdateCommand(params));
  } catch (error) {
    logger.error({
      msg: `error uninstalling app from ddb for ${shop}`,
      error,
    });
  }
};

export default handleAppUninstalled;
