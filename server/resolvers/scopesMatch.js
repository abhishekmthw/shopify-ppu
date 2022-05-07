const scopesMatch = (scope) => {
  const provided_scopes = scope.split(",");
  const required_scopes = process.env.SCOPES.split(",");

  return required_scopes.every((s) => {
    const parts = s.split(/_(.*)/s);
    if (parts[0] === "read") {
      return (
        provided_scopes.includes(`read ${parts[1]}`) ||
        provided_scopes.includes(`write_${parts[1]}`)
      );
    }
    if (parts[0] === "write") {
      return provided_scopes.includes(`write_${parts[1]}`);
    }
  });
};

export default scopesMatch;
