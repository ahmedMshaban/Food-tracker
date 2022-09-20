export function calculateCalories(carbs, protein, fats) {
  return carbs * 4 + protein * 4 + fats * 9;
}

export function capitalize(word) {
  return word.charAt(0).toUpperCase() + word.slice(1, word.length);
}
