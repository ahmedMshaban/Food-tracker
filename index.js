import FetchWrapper from "./fetch-wrapper.js";

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
        throw new Error(data.error);
      }

      foodList.insertAdjacentHTML(
        "beforeend",
        `<li class="card">
          <div>
            <h3 class="name">${foodName.value}</h3>
            <div class="calories">0 calories</div>
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

      foodName.value = "";
      foodCarbs.value = "";
      foodProtein.value = "";
      foodFat.value = "";
    })
    .catch((error) => console.error(error));
}

trackerForm.addEventListener("submit", formHandler);
