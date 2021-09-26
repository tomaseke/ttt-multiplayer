const cross = `<svg width=\"170\" height=\"166\" viewBox=\"0 0 170 166\" fill=\"none\" xmlns=\"http://www.w3.org/2000/svg\">\n<rect width=\"170\" height=\"166\" fill=\"black\" fill-opacity=\"0.01\"></rect>\n<g filter=\"url(#filter0_d)\">\n<line x1=\"8.46447\" y1=\"154.464\" x2=\"158.464\" y2=\"4.46447\" stroke=\"black\" stroke-width=\"10\"></line>\n</g>\n<line x1=\"15.5355\" y1=\"4.46447\" x2=\"165.536\" y2=\"154.464\" stroke=\"black\" stroke-width=\"10\"></line>\n<defs>\n<filter id=\"filter0_d\" x=\"0.92894\" y=\"0.928932\" width=\"165.071\" height=\"165.071\" filterUnits=\"userSpaceOnUse\" color-interpolation-filters=\"sRGB\">\n<feFlood flood-opacity=\"0\" result=\"BackgroundImageFix\"></feFlood>\n<feColorMatrix in=\"SourceAlpha\" type=\"matrix\" values=\"0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0\"></feColorMatrix>\n<feOffset dy=\"4\"></feOffset>\n<feGaussianBlur stdDeviation=\"2\"></feGaussianBlur>\n<feColorMatrix type=\"matrix\" values=\"0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0.25 0\"></feColorMatrix>\n<feBlend mode=\"normal\" in2=\"BackgroundImageFix\" result=\"effect1_dropShadow\"></feBlend>\n<feBlend mode=\"normal\" in=\"SourceGraphic\" in2=\"effect1_dropShadow\" result=\"shape\"></feBlend>\n</filter>\n</defs>\n</svg>\n`;
const circle = `<svg width=\"150\" height=\"150\" viewBox=\"0 0 150 150\" fill=\"none\" xmlns=\"http://www.w3.org/2000/svg\">\n<circle cx=\"75\" cy=\"75\" r=\"70\" stroke=\"black\" stroke-width=\"10\"></circle>\n</svg>\n`;
const whoWon = document.getElementById("paragraph");
let arrOfElements = document.getElementsByClassName("grid-item");
let counter = 0;

// gets value of all the divs into 2D array, something like this [[x,o,x], [o,x,o], [x,o,x]]
function valuesOfDivs() {
  let arr = [];
  for (let i = 0; i < 9; i++) {
    arr.push(arrOfElements[i].innerHTML);
  }
  const newArr = [];
  while (arr.length) newArr.push(arr.splice(0, 3));
  return newArr;
}

// refactored win condition
function isGameOver(arr) {
  //horizontal
  for (let i = 0; i < arr.length; i++) {
    if (arr[i][0] == arr[i][1] && arr[i][0] == arr[i][2]) {
      if (arr[i][0] == cross) {
        whoWon.innerHTML = "X HAS WON";
        whoWon.dataset.gameOver = "true";
        return;
      }
      if (arr[i][0] == circle) {
        whoWon.innerHTML = "O HAS WON";
        whoWon.dataset.gameOver = "true";
        return;
      }
    }
  }
  //vertical
  for (let i = 0; i < arr.length; i++) {
    if (arr[0][i] == arr[1][i] && arr[2][i] == arr[0][i]) {
      if (arr[0][i] == cross) {
        whoWon.innerHTML = "X HAS WON";
        whoWon.dataset.gameOver = "true";
        return;
      }
      if (arr[0][i] == circle) {
        whoWon.innerHTML = "O HAS WON";
        whoWon.dataset.gameOver = "true";
        return;
      }
    }
  }
  //diagonal
  if (
    (arr[0][0] == arr[1][1] && arr[0][0] == arr[2][2]) ||
    (arr[0][2] == arr[1][1] && arr[0][2] == arr[2][0])
  ) {
    if (arr[1][1] == cross) {
      whoWon.innerHTML = "X HAS WON";
      whoWon.dataset.gameOver = "true";
      return;
    }
    if (arr[1][1] == circle) {
      whoWon.innerHTML = "O HAS WON";
      whoWon.dataset.gameOver = "true";
      return;
    }
  }

  if (counter === 9) {
    whoWon.innerHTML = "DRAW";
    whoWon.dataset.gameOver = "true";
  }
}

function finalFunc(i) {
  return function () {
    if (
      whoWon.dataset.gameOver == "false" &&
      document.getElementsByClassName("grid-item")[i].innerHTML == ""
    ) {
      if (counter % 2 === 0) {
        document.getElementsByClassName("grid-item")[i].innerHTML = cross;
      } else {
        document.getElementsByClassName("grid-item")[i].innerHTML = circle;
      }
      counter++;
      isGameOver(valuesOfDivs());
    }
  };
}

// adds event listener for the whole htmlCollection
for (let i = 0; i < arrOfElements.length; i++) {
  arrOfElements[i].addEventListener("click", finalFunc(i));
}

//
function removeAll() {
  for (let i = 0; i < arrOfElements.length; i++) {
    arrOfElements[i].innerHTML = "";
  }
  whoWon.dataset.gameOver = "false";
  whoWon.innerHTML = "";
  counter = 0;
}

// new game button
const newGame = document.getElementsByTagName("button")[0];
newGame.onclick = () => removeAll();
