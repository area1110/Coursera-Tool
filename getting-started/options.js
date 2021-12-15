// let page = document.getElementById("buttonDiv");
// let selectedClassName = "current";
// const presetButtonColors = ["#3aa757", "#e8453c", "#f9bb2d", "#4688f1"];

chrome.storage.sync.get("isChoosingMax", ({isChoosingMax}) => {
  if(isChoosingMax){
    document.querySelector("#chooseMax").checked = true;
  } else {
    document.querySelector("#chooseMin").checked = true;
  }
});

let pointSelects =  document.getElementsByName("pointType");
pointSelects.forEach((pointSelect) => {
  pointSelect.addEventListener("click", checkSelect)
});

function checkSelect(){
  let pointType = document.querySelector('input[name="pointType"]:checked').value;
  if(pointType === "max"){
    let isChoosingMax = true;
    chrome.storage.sync.set({isChoosingMax});
  }else if(pointType === "min"){
    let isChoosingMax = false;
    chrome.storage.sync.set({isChoosingMax});
  }
}
// chrome.storage.sync.get("color", ({ color }) => {
//   changeColor.style.backgroundColor = color;
// });

// Reacts to a button click by marking marking the selected button and saving
// the selection
// function handleButtonClick(event) {
//   // Remove styling from the previously selected color
//   let current = event.target.parentElement.querySelector(
//     `.${selectedClassName}`
//   );
//   if (current && current !== event.target) {
//     current.classList.remove(selectedClassName);
//   }

//   // Mark the button as selected
//   let color = event.target.dataset.color;
//   event.target.classList.add(selectedClassName);
//   chrome.storage.sync.set({ color });
// }

// // Add a button to the page for each supplied color
// function constructOptions(buttonColors) {
//   chrome.storage.sync.get("color", (data) => {
//     let currentColor = data.color;

//     // For each color we were provided…
//     for (let buttonColor of buttonColors) {
//       // …crate a button with that color…
//       let button = document.createElement("button");
//       button.dataset.color = buttonColor;
//       button.style.backgroundColor = buttonColor;

//       // …mark the currently selected color…
//       if (buttonColor === currentColor) {
//         button.classList.add(selectedClassName);
//       }

//       // …and register a listener for when that button is clicked
//       button.addEventListener("click", handleButtonClick);
//       page.appendChild(button);
//     }
//   });
// }

// // Initialize the page by constructing the color options
// constructOptions(presetButtonColors);
