(function () {
  "use strict";

  let autoMark = document.getElementById("auto-mark");
  let pointSelects = document.querySelectorAll(".switch");
  let commentContentBox = document.querySelector("#comment-content");
  // Initialize marking function
  chrome.storage.sync.get("isChoosingMax", ({ isChoosingMax }) => {
    if (isChoosingMax) {
      document.querySelector("#markingType").checked = true;
      autoMark.innerHTML = "Highest Point";
    } else {
      document.querySelector("#markingType").checked = false;
      autoMark.innerHTML = "Lowest Point";
    }
  });

  chrome.storage.sync.get("isAutomatic", ({ isAutomatic }) => {
    if (isAutomatic) {
      document.querySelector("#automatic-switch").checked = true;
      autoMark.style.display = "none";
      addingScriptMarking();
    } else {
      document.querySelector("#automatic-switch").checked = false;
      autoMark.style.display = "block";
    }
  });

  chrome.storage.sync.get("commentContent", ({ commentContent }) => {
    commentContentBox.value = commentContent;
    if(!commentContent){
      commentContentBox.title = "AutoFill: Fill the comment textbox on peer review page."
    }
  });

  pointSelects[0].addEventListener("click", checkSelectMarkingType);
  pointSelects[1].addEventListener("click", checkSelectAutoMarking);
  autoMark.addEventListener("click", addingScriptMarking);

  commentContentBox.addEventListener("change", function () {
    chrome.storage.sync.set({ commentContent: commentContentBox.value });
  });

  chrome.tabs.query({ active: true }, function (tabs) {
    var tab = tabs[0];
    chrome.scripting.executeScript(
      {
        target: { tabId: tab.id },
        func: () => {
          return document.querySelector(
            ".rc-CommentTextArea__input-container label"
          ).id;
        },
      },
      (injectionResults) => {
        if (!injectionResults || injectionResults[0].result == null) {
          document.querySelector("#review").innerHTML =
            "<p>Can not find reviewable link, Please go to <b>My submission</b> tab in Coursera</p>";
        } else {
          getReviewableLink(injectionResults[0].result);
        }
      }
    );
  });

  function checkSelectMarkingType() {
    let pointType = pointSelects[0].querySelector("#markingType").checked;
    if (pointType) {
      let isChoosingMax = true;
      chrome.storage.sync.set({ isChoosingMax });
      autoMark.innerHTML = "Highest Point";
    } else {
      let isChoosingMax = false;
      chrome.storage.sync.set({ isChoosingMax });
      autoMark.innerHTML = "Lowest Point";
    }
  }

  function checkSelectAutoMarking() {
    let pointType = pointSelects[1].querySelector("#automatic-switch").checked;
    if (pointType) {
      let isAutomatic = true;
      chrome.storage.sync.set({ isAutomatic });
      autoMark.style.display = "none";
    } else {
      let isAutomatic = false;
      chrome.storage.sync.set({ isAutomatic });
      autoMark.style.display = "block";
    }
  }

  document.getElementById("reviewUrl").addEventListener("click", copyText);
  
})();

async function addingScriptMarking() {
  let [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
  chrome.scripting.executeScript({
    target: { tabId: tab.id },
    function: markingPoints,
  });
}
// The body of this function will be execuetd as a content script inside the
// current page
function markingPoints() {
  let formparts = document.querySelectorAll(".rc-FormParts");
  formparts.forEach(function (formpart) {
    //process for mark
    let optionFormparts = formpart.querySelectorAll(".rc-OptionsFormPart");
    optionFormparts.forEach(function (optionFormpart) {
      let options = optionFormpart.querySelectorAll(".option");
      chrome.storage.sync.get("isChoosingMax", ({ isChoosingMax }) => {
        if (isChoosingMax) {
          checkMaxPointOption(options);
        } else {
          checkMinPointOption(options);
        }
      });
    });
    //process for comment
    chrome.storage.sync.get("commentContent", ({ commentContent }) => {
      if (
        commentContent !== "" ||
        commentContent !== null ||
        commentContent !== undefined
      ) {
        let multilineInputFormParts = formpart.querySelectorAll(
          ".rc-MultiLineInputFormPart"
        );
        multilineInputFormParts.forEach(function (multilineInputFormPart) {
          multilineInputFormPart.querySelector("textarea").focus();
          document.execCommand("insertText", false, commentContent);
        });
      }
    });
  });
  function getPointNumber(option) {
    let optionContent = option.querySelector(".option-contents");
    let viewPoint = optionContent.getElementsByTagName("span")[0].innerHTML;
    return viewPoint.split(" ")[0];
  }

  function checkMaxPointOption(options) {
    let maxOption = options[0];
    let maxPoint = getPointNumber(options[0]);
    for (var i = 0; i < options.length; i++) {
      if (getPointNumber(options[i]) > parseInt(maxPoint, 10)) {
        maxPoint = getPointNumber(options[i]);
        maxOption = options[i];
      }
    }
    maxOption.querySelector(".option-input").click();
  }

  function checkMinPointOption(options) {
    let minOption = options[0];
    let minPoint = getPointNumber(options[0]);
    for (var i = 0; i < options.length; i++) {
      if (getPointNumber(options[i]) < parseInt(minPoint, 10)) {
        minPoint = getPointNumber(options[i]);
        minOption = options[i];
      }
    }
    minOption.querySelector(".option-input").click();
  }
}
function getReviewableLink(rawReviewidComment) {
  var displayUrl = document.getElementById("reviewUrl");
  chrome.tabs.query({ active: true }, (tabs) => {
    let url = tabs[0].url;
    // https://www.coursera.org/learn/software-processes/peer/LGfLh/project-scenario-2/submit
    //count the slash to move the iteration to the end of url
    let slashCount = 0;
    let position = 0;
    for (let i = 0; i < url.length; i++) {
      if (url[i] === "/") {
        slashCount++;
      }
      if (slashCount === 8) {
        position = i;
        break;
      }
    }

    let reviewId = "";
    // let rawReviewIdComment = document.querySelector(
    //   ".rc-CommentTextArea__input-container label"
    // ).id;
    reviewId = rawReviewidComment.split("~")[0];
    //make new url string with review funtion and solution id
    url = url.substring(0, position) + "/review/" + reviewId;
    displayUrl.value = url;
  });
}

function copyText() {
  /* Get the text field */
  var copyText = document.getElementById("reviewUrl");

  /* Select the text field */
  copyText.select();
  copyText.setSelectionRange(0, 99999); /* For mobile devices */

   /* Copy the text inside the text field */
  navigator.clipboard.writeText(copyText.value);

  var tooltip = document.getElementById("myTooltip");
  tooltip.innerHTML = "Copied to clipboard";
}


