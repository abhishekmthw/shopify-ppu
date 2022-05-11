import { useEffect, useState } from "react";
import { Page, Layout, Card, EmptyState } from "@shopify/polaris";
import useJWT from "@/client/auth/useJWT";

const Screen1 = () => {
  const [shopDetails, setShopDetails] = useState(null);
  const [productsAvailable, setProductsAvailable] = useState(false);

  const api = useJWT();

  const getShopDetails = async () => {
    const { data } = await api.get("/api/getShopDetails");
    setShopDetails(data.shopDetails);
  };

  const getProducts = async () => {
    const { data } = await api.get("/api/shopify/getProducts");
    const products = data.products;
    console.log(products);
    setProductsAvailable(true);
  };

  useEffect(() => {
    getShopDetails();
    getProducts();
  }, []);

  return (
    <Page
      title="#1085"
      secondaryActions={[
        { content: "Print" },
        { content: "Unarchive" },
        { content: "Cancel order" },
      ]}
      pagination={{
        hasPrevious: true,
        hasNext: true,
      }}
    >
      <Layout>
        <Layout.Section>
          <Card sectioned>
            <EmptyState
              heading="Manage your inventory transfers"
              action={{ content: "Add transfer" }}
              secondaryAction={{
                content: "Learn more",
                url: "https://help.shopify.com",
              }}
              image="https://cdn.shopify.com/s/files/1/0262/4071/2726/files/emptystate-files.png"
            >
              <p>
                Store Country:{" "}
                <span>{shopDetails ? shopDetails.country : "loading..."}</span>
              </p>
              <p>
                {productsAvailable
                  ? "products loaded in console..."
                  : "loading products from GraphQL..."}
              </p>
            </EmptyState>
          </Card>
        </Layout.Section>
      </Layout>
    </Page>
  );
};

export default Screen1;
