import { useEffect, useState } from "react";
import {
  AppProvider as PolarisProvider,
  SkeletonPage,
  Layout,
  Card,
  SkeletonBodyText,
  TextContainer,
  SkeletonDisplayText,
} from "@shopify/polaris";
import Screen1 from "@/client/screens/Screen1";

const Dashboard = () => {
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (window.self !== window.top) {
      setIsLoading(false);
    }
  }, []);

  return (
    <>
      {isLoading ? (
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
      ) : (
        <Screen1 />
      )}
    </>
  );
};

export default Dashboard;
