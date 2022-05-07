import { useEffect } from "react";
import axios from "axios";
import {
  AppProvider as PolarisProvider,
  SkeletonPage,
  Layout,
  Card,
  SkeletonBodyText,
  TextContainer,
  SkeletonDisplayText,
} from "@shopify/polaris";
import logger from "@/server/logger";

const Index = () => {
  useEffect(() => {
    const redirect = async () => {
      try {
        const query = Object.fromEntries(
          URLSearchParams(window.location.search)
        );
        const { data } = await axios.post("/api/auth", { query });
        if (data.redirect) {
          window.location.href = data.redirect;
          // to do
        }
      } catch (error) {
        logger.error({
          error,
        });
      }
    };
    redirect();
  }, []);

  return (
    <PolarisProvider>
      <SkeletonPage primaryAction>
        <Layout>
          <Layout.Section>
            <Card sectioned>
              <SkeletonBodyText />
            </Card>
            <Card sectioned>
              <TextContainer>
                <SkeletonDisplayText size="small" />
                <SkeletonBodyText />
              </TextContainer>
            </Card>
          </Layout.Section>
        </Layout>
      </SkeletonPage>
    </PolarisProvider>
  );
};

export default Index;
