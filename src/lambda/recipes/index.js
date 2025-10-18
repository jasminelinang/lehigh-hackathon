exports.handler = async (event) => {
  const recipes = [
    { id: 1, name: "Pasta", ingredients: ["noodles", "tomato"] },
    { id: 2, name: "Salad", ingredients: ["lettuce", "tomato"] }
  ];

  return {
    statusCode: 200,
    body: JSON.stringify(recipes),
  };
};
