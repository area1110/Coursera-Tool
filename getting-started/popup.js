// Initialize butotn with users's prefered color
let changeColor = document.getElementById("changeColor");

chrome.storage.sync.get("color", ({ color }) => {
  changeColor.style.backgroundColor = color;
});



// When the button is clicked, inject setPageBackgroundColor into current page
changeColor.addEventListener("click", async () => {
  let [tab] = await chrome.tabs.query({ active: true, currentWindow: true });

  chrome.scripting.executeScript({
    target: { tabId: tab.id },
    function: markingPoints,
  });
});

// The body of this function will be execuetd as a content script inside the
// current page
function markingPoints() {

  function getPointNumber(option) {
    let optionContent = option.querySelector(".option-contents");
    let viewPoint = optionContent.firstChild.firstChild.innerHTML;
    return viewPoint.split(" ")[0];
  }
  
  function checkMaxPointOption(options) {
    let maxOption = options[0];
    let maxPoint = getPointNumber(options[0]);
    for (var i = 0; i < options.length; i++) {
      if (getPointNumber(options[i]) > maxPoint) {
        maxPoint = getPointNumber(options[i]);
        maxOption = options[i];
      }
    }
    maxOption.querySelector(".option-input").click();
  }

  let formparts = document.querySelectorAll(".rc-FormParts");
  formparts.forEach(function (formpart) {
    //process for mark
    let optionFormparts = formpart.querySelectorAll(".rc-OptionsFormPart");
    optionFormparts.forEach(function (optionFormpart) {
      let options = optionFormpart.querySelectorAll(".option");
      checkMaxPointOption(options);
    });
    //process for comment
    // let multilineInputFormParts = formpart.querySelectorAll(".rc-MultiLineInputFormPart");
    // multilineInputFormParts.forEach(function (multilineInputFormPart){
    //   multilineInputFormPart.querySelector("textarea").value = "Good";
    // });
  });
  // let submit = document.querySelector(".rc-FormSubmit button");
  // submit.click();
}



// function setPageBackgroundColor() {
//   chrome.storage.sync.get("color", ({ color }) => {
//     document.body.style.backgroundColor = color;
//   });
// }
