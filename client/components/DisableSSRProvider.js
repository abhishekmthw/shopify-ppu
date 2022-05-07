const DisableSSRProvider = ({ children }) => {
  return (
    <div suppressHydrationWarning={true}>
      {typeof window !== "undefined" && children}
    </div>
  );
};

export default DisableSSRProvider;
