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

const Index = () => {
  useEffect(() => {
    const redirect = async () => {
      try {
        const query = Object.fromEntries(
          new URLSearchParams(window.location.search)
        );
        const { data } = await axios.post("/api/auth", { query });
        if (data.redirect) {
          if (window.parent && !data.embeddedRedirect) {
            window.parent.location.href = data.redirect;
          } else {
            window.location.href = data.redirect;
          }
        }
      } catch (error) {
        console.log({
          msg: "error initiating auth",
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
