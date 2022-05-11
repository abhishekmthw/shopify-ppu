import nc from "next-connect";
import withJWT from "@/server/auth/withJWT";
import ddb from "@/server/db/ddb";
import logger from "@/server/logger";
import { GetCommand } from "@aws-sdk/lib-dynamodb";

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
    const result = await ddb.send(new GetCommand(params));
    if (result.Item && result.Item.details) {
      res.status(200).json({
        shopDetails: result.Item.details,
        shop,
      });
    } else {
      res.status(400).json({
        error: "SHOP_NOT_FOUND",
        msg: "shop not found",
      });
      return;
    }
  } catch (error) {
    logger.error({
      msg: "error getting shop details",
      error,
    });
  }
});

export default withJWT(handler);

export const config = {
  api: {
    externalResolver: true,
  },
};
