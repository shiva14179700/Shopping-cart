const fills = document.querySelectorAll(".fill");
// const fill1 = document.querySelector(".fill1");
// const fill2 = document.querySelector(".fill2");
// const fill3 = document.querySelector(".fill3");
// const fill4 = document.querySelector(".fill4");
// const fill5 = document.querySelector(".fill5");
// var filles = [fill1, fill2, fill3, fill4, fill5];
//Fill Listeners

var fillarray = ["fill1", "fill2", "fill3", "fill4", "fill5"];
var resultfills = [];
// for (var i = 0; i < fills.length; i++) {
//   for (var j = 0; j < fillarray.length; j++) {
//     if (i === j) {
//       console.log(j);
//       console.log(fills[0]);
//       //$(`#${id}`).addClass(fillarray[j]);
//       var addingid = fillarray[j];
//       console.log(addingid);
//       var classs = fills[i].className;
//       console.log(classs);
//       var parentid = $(`.${classs}`)
//         .parent()
//         .attr("id");
//       console.log(parentid);
//       //const parentdom = document.querySelector(`#${parentid}`);
//       $(`#${parentid} > .fill`).attr("id", addingid);
//     }
//   }
// }

const empties = document.querySelectorAll(".empty");

for (var i = 0; i < empties.length; i++) {
  for (var j = 0; j < fillarray.length; j++) {
    if (i === j) {
      var addID = fillarray[j];
      empties[i].children[0].setAttribute("id", addID);
    }
  }
}

for (const fill of fills) {
  fill.addEventListener("dragstart", dragStart);
  fill.addEventListener("dragend", dragEnd);
}

var filles = [];
length = fills.length + 1;
for (var i = 1; i < length; i++) {
  filles.push(document.querySelector(`#fill${i}`));
}
//const empties = document.querySelectorAll(".empty");

//Loop through empties and call drag events
for (const empty of empties) {
  empty.addEventListener("dragover", dragOver);
  empty.addEventListener("dragenter", dragEnter);
  empty.addEventListener("dragleave", dragLeave);
  empty.addEventListener("drop", dragDrop);
}

//Drag Functions
function dragStart(e) {
  e.dataTransfer.setData("startpoint", e.target.id);
  e.dataTransfer.setData("startparentpoint", e.target.parentNode.id);
  //this.className += " hold";
  //setTimeout(() => (this.className = "invisible"), 0);
}

function dragEnd() {
  //this.className = "fill";
}

function dragOver(e) {
  e.preventDefault();
}

function dragEnter(e) {
  e.preventDefault();
  //this.className += " hover";
}

function dragLeave(e) {
  this.className = "empty";
}

function dragDrop(e) {
  const startpoint = e.dataTransfer.getData("startpoint");
  const startparentpoint = e.dataTransfer.getData("startparentpoint");
  const appendd = this.children[0].id;
  filles.map(filll => {
    if (filll.id === startpoint) {
      this.append(filll);
      replace(appendd, startparentpoint);
    }
  });
}

function replace(appendd, startparentpoint) {
  filles.map(filll => {
    if (filll.id === appendd) {
      $("#" + startparentpoint).append(filll);
    }
  });
  resultfillss();
}

function resultfillss() {
  //console.log(empties[0].children[0].id);
  for (var i = 0; i < empties.length; i++) {
    resultfills.push(empties[i].children[0].id);
  }
  console.log(resultfills);
}
