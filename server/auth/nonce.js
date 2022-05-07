import crypto from "crypto";
import ddb from "@/server/db/ddb";
import logger from "@/server/logger";

const saveNonce = async (nonce, shop) => {
  try {
    const expires_at = Math.floor(Date.now() / 1000) + 60; // expires after 60 seconds
    const params = {
      TableName: process.env.DYNAMODB_TABLE,
      Item: {
        pk: `SHOP#${shop}`,
        sk: `NONCE#${nonce}`,
        expires_at,
      },
    };
    await ddb.put(params).promise();
  } catch (error) {
    logger.error({
      msg: `error saving nonce for ${shop}`,
      error,
    });
  }
};

export const createNonce = async (shop) => {
  const nonce = crypto.randomBytes(16).toString("hex");
  await saveNonce(nonce, shop);
  return nonce;
};

export const verifyNonce = async (nonce, shop) => {
  try {
    const params = {
      TableName: process.env.DYNAMODB_TABLE,
      Key: {
        pk: `SHOP#${shop}`,
        sk: `NONCE#${nonce}`,
      },
    };
    const result = await ddb.get(params).promise();
    if (result.Item && result.Item.expires_at > Math.floor(Date.now() / 1000)) {
      return true;
    } else {
      return false;
    }
  } catch (error) {
    logger.error({
      msg: `error verifying honce for ${shop}`,
      error,
    });
    return false;
  }
};
