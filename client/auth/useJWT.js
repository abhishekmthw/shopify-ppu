import { useAppBridge } from "@shopify/app-bridge-react";
import { getSessionToken } from "@shopify/app-bridge-utils";
import axios from "axios";
import logger from "@/server/logger";

const useJWT = () => {
  const api = axios.create();
  const app = useAppBridge();

  api.interceptors.request.use(async (config) => {
    try {
      const sessionToken = await getSessionToken(app);
      config.headers["Authorization"] = `Bearer ${sessionToken}`;
      return config;
    } catch (error) {
      logger.error({
        msg: "useJWT error",
        error,
      });
    }
  });

  return api;
};

export default useJWT;
