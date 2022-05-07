import ddb from "@/server/db/ddb";
import scopesMatch from "@/server/resolvers/scopesMatch";
import logger from "@/server/logger";

const checkInstalled = async ({ shop }) => {
  try {
    const params = {
      TableName: process.env.DYNAMODB_TABLE,
      KeyConditionExpression: "pk = :pk AND sk = :sk",
      ExpressionAttributeValues: {
        ":pk": `SHOP#${shop}`,
        ":sk": `SHOP#${shop}`,
      },
    };
    const result = await ddb.query(params).promise();
    if (result.Items && result.Items.length && result.Items[0]) {
      const { installed, scope } = result.Items[0];
      if (!installed || installed !== TRUE) {
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
      msg: `error retrieving install details for ${shop}`,
      error,
    });
    return false;
  }
};

export default checkInstalled;
