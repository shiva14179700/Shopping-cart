let user = new Object();

//Quuestions Array
const questions = [
  { question: "Enter Your Email", pattern: /\S+@\S+\.\S+/ },
  { question: "Enter Your Password", type: "password" }
];

//Transition Times
const shakeTime = 100; //shake transition Time
const switchTime = 200; //Transition between Questions

//Init position At First Question
let position = 0;

//Init DOM Elements
const formBox = document.querySelector("#form-box");
const nextBtn = document.querySelector("#next-btn");
const prevBtn = document.querySelector("#prev-btn");
const inputGroup = document.querySelector("#input-group");
const inputField = document.querySelector("#input-field");
const inputLabel = document.querySelector("#input-label");
const inputProgress = document.querySelector("#input-progress");
const progress = document.querySelector("#progress-bar");

//EVENTS

//get Question On DOM Load
document.addEventListener("DOMContentLoaded", getQuestion);

//Next Button Click
nextBtn.addEventListener("click", validate);

//Prev Button Click
prevBtn.addEventListener("click", goback);

//Input Field Enter Click
inputField.addEventListener("keyup", e => {
  if (e.keyCode == 13) {
    validate();
  }
});

//FUNCTIONS

//Get Question From Array & Add To Markup
function getQuestion() {
  //Get Current Question
  inputLabel.innerHTML = questions[position].question;
  //Get Current Type
  inputField.type = questions[position].type || "text";
  //Get Current Answer
  inputField.value = questions[position].answer || "";
  //focus On Element
  inputField.focus();

  //Set Progress Bar Width - Variable to the questions length
  progress.style.width = (position * 100) / questions.length + "%";

  //Add UserIcon Or Back Arrow Depending On Question
  prevBtn.className = position ? "fas fa-arrow-left" : "fas fa-user";

  showQuestion();
}

//Going Back
function goback() {
  position = position - 1;
  //Get Current Question
  inputLabel.innerHTML = questions[position].question;
  //Get Current Type
  inputField.type = questions[position].type || "text";
  //Get Current Answer
  inputField.value = questions[position].answer || "";
  //focus On Element
  inputField.focus();

  //Set Progress Bar Width - Variable to the questions length
  progress.style.width = (position * 100) / questions.length + "%";

  //Add UserIcon Or Back Arrow Depending On Question
  prevBtn.className = position ? "fas fa-arrow-left" : "fas fa-user";

  showQuestion();
}

//Display Question To User
function showQuestion() {
  inputGroup.style.opacity = 1;
  inputProgress.style.transition = "";
  inputProgress.style.width = "100%";
}

//Hide Question From User
function hideQuestion() {
  inputGroup.style.opacity = 0;
  inputLabel.style.marginLeft = 0;
  inputProgress.style.width = 0;
  inputProgress.style.transition = "none";
  inputGroup.style.border = null;
}

//Transform To create shake motion
function transform(x, y) {
  formBox.style.transform = `translate(${x}px,${y}px)`;
}

//Validate Field
function validate() {
  //Make Sure Pattern Matches if there is one
  if (!inputField.value.match(questions[position].pattern || /.+/)) {
    inputFail();
  } else {
    if (position === 0) {
      user.email = inputField.value;
      user.password = "";
      fetch("http://localhost:3000/users/validateuser", {
        method: "post",
        body: JSON.stringify(user),
        headers: new Headers({
          "Content-Type": "application/json"
        })
      })
        .then(res => res.json())
        .then(data => {
          if (data.errors.email) {
            console.log(data.errors.email);
            inputLabel.innerHTML = data.errors.email;
            inputFail();
          } else {
            inputPass();
          }
        })
        .catch(err => console.log(err));
    } else if (position === 1) {
      checkPassword(inputField.value);
    } else {
      inputPass();
    }
  }
}

//checking if email exists or not
//function checkifemailexists(emailvalue) {}

//checking if password and confirm password match
function checkPassword(confirmpassword) {
  user.email = questions[0].answer;
  user.password = confirmpassword;
  console.log(user);
  fetch("http://localhost:3000/users/validateuser", {
    method: "post",
    body: JSON.stringify(user),
    headers: new Headers({
      "Content-Type": "application/json"
    })
  })
    .then(res => res.json())
    .then(data => {
      if (data.errors.password) {
        inputLabel.innerHTML = data.errors.password;
        inputFail();
      } else {
        inputPass();
      }
    })
    .catch(err => console.log(err));
}

//Field Input Fail
function inputFail() {
  formBox.className = "error";
  //Repeat Shake Motion - Set i to number of shakes
  for (let i = 0; i < 6; i++) {
    setTimeout(transform, shakeTime * i, ((i % 2) * 2 - 1) * 20, 0);
    setTimeout(transform, shakeTime * 6, 0, 0);
    inputField.focus();
  }
}

//Field Input Pass
function inputPass() {
  formBox.className = "";
  setTimeout(transform, shakeTime * 0, 0, 10);
  setTimeout(transform, shakeTime * 1, 0, 0);

  //Store Answer In Array
  questions[position].answer = inputField.value;

  //INCREMENT Position
  position++;

  //If New Position,Hide Current and get Next
  if (questions[position]) {
    hideQuestion();
    getQuestion();
  } else {
    //Remove If no More Questions Left
    hideQuestion();
    formBox.className = "close";
    progress.style.width = "100%";

    //Form Complete
    formComplete();
  }
}

//All Fields Complete Show h1

function formComplete() {
  let h1 = document.createElement("h1");
  h1.className = "end";
  h1.appendChild(
    document.createTextNode(
      `Thanks ${questions[0].answer} You are Successfully Logged in`
    )
  );
  setTimeout(() => {
    formBox.parentElement.appendChild(h1);
    setTimeout(() => (h1.style.opacity = 1), 50);
  }, 1000);

  user.username = questions[0].answer;
  user.password = questions[1].answer;
  console.log(user);

  fetch("http://localhost:3000/users/login", {
    method: "post",
    body: JSON.stringify(user),
    headers: new Headers({
      "Content-Type": "application/json"
    })
  }).then(res => {
    redirect: window.location.reload(true);
  });
}
