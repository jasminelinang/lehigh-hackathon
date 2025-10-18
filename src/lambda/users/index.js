exports.handler = async (event) => {
  const users = [
    { id: 1, name: "Alice", email: "alice@example.com" },
    { id: 2, name: "Bob", email: "bob@example.com" }
  ];

  return {
    statusCode: 200,
    body: JSON.stringify(users),
  };
};
