import FetchWrapper from "./fetch-wrapper.js";
const trackerForm = document.querySelector("#create-form");
let foodName = document.querySelector("#create-name");
let foodCarbs = document.querySelector("#create-carbs");
let foodProtein = document.querySelector("#create-protein");
let foodFat = document.querySelector("#create-fat");
const API = new FetchWrapper(
  "https://firestore.googleapis.com/v1/projects/jsdemo-3f387/databases/(default)/documents/ahmedshaban"
);

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
      if (!data.error) {
        foodName.value = "";
        foodCarbs.value = "";
        foodProtein.value = "";
        foodFat.value = "";
      }
    })
    .catch((error) => console.error(error));
}

trackerForm.addEventListener("submit", formHandler);
