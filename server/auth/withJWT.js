import jwt from "jsonwebtoken";
import logger from "@/server/logger";

const withJWT = (handler) => {
  return async (req, res) => {
    try {
      const token = req.headers.authorization.replace(/^Bearer\s+/, "");
      const payload = jwt.verify(token, process.env.SHOPIFY_SECRET_KEY);
      req.token = token;
      req.shop = payload.dest.replace(/^https?:\/\//, "");
      return handler(req, res);
    } catch (error) {
      logger.error({
        msg: "withJWT error",
        error,
      });
      res.status(400).json({ msg: "JWT error" });
    }
  };
};

export default withJWT;
