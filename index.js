import FetchWrapper from "./fetch-wrapper.js";
import { capitalize, calculateCalories } from "./helpers.js";
import snackbar from "https://cdn.skypack.dev/pin/snackbar@v1.1.0-hTNTl5YfU3b9FO86FHxb/mode=imports,min/optimized/snackbar.js";

const trackerForm = document.querySelector("#create-form");
const foodName = document.querySelector("#create-name");
const foodCarbs = document.querySelector("#create-carbs");
const foodProtein = document.querySelector("#create-protein");
const foodFat = document.querySelector("#create-fat");
const foodList = document.querySelector("#food-list");
const API = new FetchWrapper(
  "https://firestore.googleapis.com/v1/projects/jsdemo-3f387/databases/(default)/documents/ahmedshaban"
);

function formHandler(e) {
  e.preventDefault();

  // if (
  //   !foodName.value ||
  //   !foodCarbs.value ||
  //   !foodProtein.value ||
  //   !foodFat.value
  // ) {
  //   return;
  // }

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
        snackbar.show("Some data is missing.");
        throw new Error(data.error);
      }
      foodList.insertAdjacentHTML(
        "beforeend",
        `<li class="card">
          <div>
            <h3 class="name">${capitalize(foodName.value)}</h3>
            <div class="calories">${calculateCalories(
              foodCarbs.value,
              foodProtein.value,
              foodFat.value
            )} calories</div>
            <ul class="macros">
              <li class="carbs">
                <div>Carbs</div>
                <div class="value">${foodCarbs.value}g</div>
              </li>
              <li class="protein">
                <div>Protein</div>
                <div class="value">${foodProtein.value}g</div>
              </li>
              <li class="fat">
                <div>Fat</div>
                <div class="value">${foodFat.value}g</div>
              </li>
            </ul>
          </div>
        </li>`
      );

      snackbar.show("Food added successfully.");

      foodName.value = "";
      foodCarbs.value = "";
      foodProtein.value = "";
      foodFat.value = "";
    })
    .catch((error) => console.error(error));
}

trackerForm.addEventListener("submit", formHandler);

function init() {
  API.get("/")
    .then((data) => {
      if (data?.documents.length > 0) {
        data.documents.forEach((doc) => {
          foodList.insertAdjacentHTML(
            "beforeend",
            `<li class="card">
          <div>
            <h3 class="name">${capitalize(doc.fields.name.stringValue)}</h3>
            <div class="calories">${calculateCalories(
              +doc.fields.carbs.integerValue,
              +doc.fields.protein.integerValue,
              +doc.fields.fat.integerValue
            )} calories</div>
            <ul class="macros">
              <li class="carbs">
                <div>Carbs</div>
                <div class="value">${doc.fields.carbs.integerValue}g</div>
              </li>
              <li class="protein">
                <div>Protein</div>
                <div class="value">${doc.fields.protein.integerValue}g</div>
              </li>
              <li class="fat">
                <div>Fat</div>
                <div class="value">${doc.fields.fat.integerValue}g</div>
              </li>
            </ul>
          </div>
        </li>`
          );
        });
      }
    })
    .catch((error) => console.error(error));
}

init();
