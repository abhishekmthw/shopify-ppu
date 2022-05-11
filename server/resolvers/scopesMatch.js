const scopesMatch = (scope) => {
  const provided_scopes = scope.split(",");
  const required_scopes = process.env.SCOPES.split(",");

  const match = required_scopes.every((s) => {
    const parts = s.split(/_(.*)/s);
    if (parts[0] === "read") {
      return (
        provided_scopes.includes(`read_${parts[1]}`) ||
        provided_scopes.includes(`write_${parts[1]}`)
      );
    }
    if (parts[0] === "write") {
      return provided_scopes.includes(`write_${parts[1]}`);
    }
  });

  return match;
};

export default scopesMatch;
