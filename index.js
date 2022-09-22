import FetchWrapper from "./fetch-wrapper.js";
import { capitalize, calculateCalories } from "./helpers.js";
import AppData from "./app-data.js";
import Snackbar from "https://cdn.skypack.dev/pin/snackbar@v1.1.0-hTNTl5YfU3b9FO86FHxb/mode=imports,min/optimized/snackbar.js";
import "https://cdnjs.cloudflare.com/ajax/libs/Chart.js/3.9.1/chart.min.js";

const trackerForm = document.querySelector("#create-form");
const foodName = document.querySelector("#create-name");
const foodCarbs = document.querySelector("#create-carbs");
const foodProtein = document.querySelector("#create-protein");
const foodFat = document.querySelector("#create-fat");
const foodList = document.querySelector("#food-list");
const totalCalories = document.querySelector("#total-calories");
const API = new FetchWrapper(
  "https://firestore.googleapis.com/v1/projects/jsdemo-3f387/databases/(default)/documents/ahmedshaban"
);
const appData = new AppData();
let myChart = null;

function redner() {
  totalCalories.textContent = appData.getTotalCalories();
  renderChart();
}

function renderChart() {
  myChart?.destroy();

  const ctx = document.querySelector("#app-chart").getContext("2d");
  myChart = new Chart(ctx, {
    type: "bar",
    data: {
      labels: ["Carbs", "Protein", "Fat"],
      datasets: [
        {
          label: "Macronutrients",
          data: [
            appData.getTotalCarbs(),
            appData.getTotalProtein(),
            appData.getTotalFat(),
          ],
          backgroundColor: ["#25AEEE", "#FECD52", "#57D269"],
        },
      ],
    },
    options: {
      scales: {
        yAxes: [
          {
            ticks: {
              beginAtZero: true,
            },
          },
        ],
      },
    },
  });
}

function displayEntry(list, name, carbs, protein, fat) {
  appData.addFood(carbs, protein, fat);

  list.insertAdjacentHTML(
    "beforeend",
    `<li class="card">
      <div>
        <h3 class="name">${capitalize(name)}</h3>
        <div class="calories">${calculateCalories(
          +carbs,
          +protein,
          +fat
        )} calories</div>
        <ul class="macros">
          <li class="carbs">
            <div>Carbs</div>
            <div class="value">${carbs}g</div>
          </li>
          <li class="protein">
            <div>Protein</div>
            <div class="value">${protein}g</div>
          </li>
          <li class="fat">
            <div>Fat</div>
            <div class="value">${fat}g</div>
          </li>
        </ul>
      </div>
    </li>`
  );
}

function formHandler(e) {
  e.preventDefault();

  if (
    !foodName.value ||
    !foodCarbs.value ||
    !foodProtein.value ||
    !foodFat.value
  ) {
    return;
  }

  API.post("/", {
    fields: {
      name: { stringValue: foodName.value },
      carbs: { integerValue: foodCarbs.value },
      protein: { integerValue: foodProtein.value },
      fat: { integerValue: foodFat.value },
    },
  })
    .then((data) => {
      if (data.error) {
        Snackbar.show("Some data is missing.");
        throw new Error(data.error);
      }
      displayEntry(
        foodList,
        foodName.value,
        foodCarbs.value,
        foodProtein.value,
        foodFat.value
      );
      redner();
      Snackbar.show("Food added successfully.");

      foodName.value = "";
      foodCarbs.value = "";
      foodProtein.value = "";
      foodFat.value = "";
    })
    .catch((error) => console.error(error));
}

function init() {
  API.get("/")
    .then((data) => {
      if (data?.documents.length > 0) {
        data.documents.forEach((doc) => {
          displayEntry(
            foodList,
            doc.fields.name.stringValue,
            doc.fields.carbs.integerValue,
            doc.fields.protein.integerValue,
            doc.fields.fat.integerValue
          );
        });
        redner();
      }
    })
    .catch((error) => console.error(error));
}

trackerForm.addEventListener("submit", formHandler);
init();
