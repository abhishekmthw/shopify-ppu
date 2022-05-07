import nc from "next-connect";
import withJWT from "@/auth/withJWT";
import ddb from "@/db/ddb";
import logger from "@/server/logger";

const handler = nc().get(async (req, res) => {
  try {
    const shop = req.shop;
    const params = {
      TableName: process.env.DYNAMODB_TABLE,
      Key: {
        pk: `SHOP#${shop}`,
        sk: `SHOP#${shop}`,
      },
    };
    const result = await ddb.get(params).promise();
    if (result.Item && result.Item.details) {
      res.statusCode(200).json({
        shopDetails: result.Item.details,
        shop,
      });
    } else {
      res.statusCode(400).json({
        error: "SHOP_NOT_FOUND",
        msg: "shop not found",
      });
    }
  } catch (error) {
    logger.error({
      msg: "error getting shop details",
      error,
    });
  }
});

export default withJWT(handler);
