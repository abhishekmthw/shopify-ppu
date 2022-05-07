import { useEffect, useState } from "react";

const useShop = () => {
  const [shop, setShop] = useState(null);

  useEffect(() => {
    const queryShop = new URLSearchParams(window.location.search).get("shop");
    if (queryShop) {
      setShop(queryShop);
    }
  }, []);

  return shop;
};

export default useShop;
