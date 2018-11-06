let formbox = document.querySelector("#productform");

let input = document.querySelectorAll(".input");
let inputline = document.querySelectorAll(".input-line");
let label = document.querySelectorAll(".label");
let all = [];

let button = document.querySelector(".button");

document.addEventListener("DOMContentLoaded", function() {
  for (let i = 0; i < input.length; i++) {
    if (window.innerWidth <= 650 && window.innerWidth > 450) {
      inputline[i].style.width = 300 + "px";
    } else if (window.innerWidth <= 450 && window.innerWidth > 350) {
      inputline[i].style.width = 200 + "px";
    } else if (window.innerWidth <= 350) {
      inputline[i].style.width = 170 + "px";
    } else {
      inputline[i].style.width = 510 + "px";
    }
  }
});

function transform(x, y) {
  formbox.style.transform = `translate(${x}px,${y}px)`;
}

for (let i = 0; i < input.length; i++) {
  input[i].addEventListener("focus", function() {
    inputline[i].classList.add("extend");
  });

  input[i].addEventListener("blur", function() {
    if (i != 1 && i != 7) {
      if (input[i].value.match(/.+/)) {
        inputPass(i);
      } else {
        inputFail(i);
      }
    } else if (i == 1) {
      if (input[i].value != "") {
        console.log(input[i].value);
        inputPass(i);
      } else {
        inputFail(i);
      }
    } else if (i == 7) {
      if (input[i].value.match(/^[0-9]+$/)) {
        inputPass(i);
      } else {
        inputFail(i);
      }
    }
  });
}

function inputPass(i) {
  all.push(i);
  inputline[i].classList.remove("error");
  label[i].classList.remove("error1");
}

function inputFail(i) {
  all = all.filter(item => item !== i);
  inputline[i].classList.add("error");
  label[i].classList.add("error1");
  console.log("yyes");
  for (let j = 0; j < 8; j++) {
    setTimeout(transform, 100 * j, ((j % 2) * 2 - 1) * 20, 0);
    setTimeout(transform, 100 * 6, 0, 0);
  }
}

$("#Button").click(function(e) {
  var uniq = all
    .map(name => {
      return { count: 1, name: name };
    })
    .reduce((a, b) => {
      a[b.name] = (a[b.name] || 0) + b.count;
      return a;
    }, {});
  var sorted = Object.keys(uniq).sort((a, b) => uniq[a] < uniq[b]);

  var y = [0, 1, 2, 3, 4, 5, 6, 7];
  var c = sorted.map(Number);

  var z = $.grep(y, function(el) {
    return $.inArray(el, c) == -1;
  });

  for (let i = 0; i < z.length; i++) {
    inputline[z[i]].classList.add("error");
    label[z[i]].classList.add("error1");
  }

  if (sorted.length != 8) {
    e.preventDefault();
    for (let j = 0; j < 8; j++) {
      setTimeout(transform, 100 * j, ((j % 2) * 2 - 1) * 20, 0);
      setTimeout(transform, 100 * 6, 0, 0);
    }
  }
});
