import { useEffect, useState } from "react";

const useHost = () => {
  const [host, setHost] = useState(null);

  useEffect(() => {
    const queryHost = new URLSearchParams(window.location.search).get("host");
    if (queryHost) {
      setHost(queryHost);
    }
  }, []);

  return host;
};

export default useHost;
