import ClientOnly from "@/client/components/ClientOnly";
import AuthProvider from "@/client/auth/AuthProvider";
import { AppProvider as PolarisProvider } from "@shopify/polaris";
import enTranslations from "@shopify/polaris/locales/en.json";
import "@shopify/polaris/build/esm/styles.css";
import "@/styles/globals.css";

const App = ({ Component, pageProps }) => {
  return (
    <ClientOnly>
      <AuthProvider Component={Component} pageProps={pageProps}>
        <PolarisProvider i18n={enTranslations}>
          <Component {...pageProps} />
        </PolarisProvider>
      </AuthProvider>
    </ClientOnly>
  );
};

export default App;
