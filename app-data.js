export default class AppData {
  constructor() {
    this.food = [];
  }

  addFood(carbs, protein, fat) {
    this.food.push({
      carbs: +carbs,
      protein: +protein,
      fat: +fat,
    });
  }

  getTotalCarbs() {
    let total = 0;
    this.food.forEach((food) => {
      total += food.carbs;
    });
    return total;
  }

  getTotalProtein() {
    let total = 0;
    this.food.forEach((food) => {
      total += food.protein;
    });
    return total;
  }

  getTotalFat() {
    let total = 0;
    this.food.forEach((food) => {
      total += food.fat;
    });
    return total;
  }
}
