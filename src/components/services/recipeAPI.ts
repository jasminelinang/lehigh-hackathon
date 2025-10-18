export type Recipe = {
  name: string;
};

export const getRecipes = async (ingredients: string[]): Promise<Recipe[]> => {
  // Mock recipes
  return [
    { name: "Chicken Fried Rice" },
    { name: "Vegetable Stir Fry" },
    { name: "Pasta with Tomato Sauce" },
  ];
};
