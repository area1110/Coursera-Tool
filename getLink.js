let url = location.href;
// https://www.coursera.org/learn/software-processes/peer/LGfLh/project-scenario-2/submit

//count the slash to move the iteration to the end of url
let slashCount = 0;
let position = 0;
for (let i = 0; i<url.length; i++) {
  if(url[i] === "/"){
      slashCount++;
  }
  if(slashCount === 8 ){
    position = i;
    break;
  }  
}

let reviewId = "";

let rawReviewIdComment = document.querySelector(".rc-CommentTextArea__input-container label").id;
reviewId = rawReviewIdComment.split("~")[0];
//make new url string with review funtion and solution id
url = url.substring(0, position) + "/review/" + reviewId;


