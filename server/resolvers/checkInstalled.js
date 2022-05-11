import ddb from "@/server/db/ddb";
import scopesMatch from "@/server/resolvers/scopesMatch";
import { GetCommand } from "@aws-sdk/lib-dynamodb";
import logger from "@/server/logger";

const checkInstalled = async ({ shop }) => {
  try {
    const params = {
      TableName: process.env.DYNAMODB_TABLE,
      Key: {
        pk: `SHOP#${shop}`,
        sk: `SHOP#${shop}`,
      },
    };
    const result = await ddb.send(new GetCommand(params));
    if (result.Item) {
      const { installed, scope } = result.Item;
      if (!installed || installed !== true) {
        return false;
      }
      if (!scope || !scopesMatch(scope)) {
        return false;
      }
      return true;
    } else {
      return false;
    }
  } catch (error) {
    logger.error({
      msg: `error retreieving install details for ${shop}`,
      error,
    });
    return false;
  }
};

export default checkInstalled;
