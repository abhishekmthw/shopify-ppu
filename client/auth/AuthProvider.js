import { Provider as AppBridgeProvider } from "@shopify/app-bridge-react";
import useHost from "@/client/auth/useHost";

const AuthProvider = ({ Component, pageProps, children }) => {
  const host = useHost();
  if (!host) {
    return <Component {...pageProps} />;
  }

  const config = {
    apiKey: process.env.NEXT_PUBLIC_SHOPIFY_API_KEY,
    host,
    forceRedirect: true,
  };

  return <AppBridgeProvider config={config}>{children}</AppBridgeProvider>;
};

export default AuthProvider;
