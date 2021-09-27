const cross = `<svg width=\"170\" height=\"166\" viewBox=\"0 0 170 166\" fill=\"none\" xmlns=\"http://www.w3.org/2000/svg\">\n<rect width=\"170\" height=\"166\" fill=\"black\" fill-opacity=\"0.01\"></rect>\n<g filter=\"url(#filter0_d)\">\n<line x1=\"8.46447\" y1=\"154.464\" x2=\"158.464\" y2=\"4.46447\" stroke=\"black\" stroke-width=\"10\"></line>\n</g>\n<line x1=\"15.5355\" y1=\"4.46447\" x2=\"165.536\" y2=\"154.464\" stroke=\"black\" stroke-width=\"10\"></line>\n<defs>\n<filter id=\"filter0_d\" x=\"0.92894\" y=\"0.928932\" width=\"165.071\" height=\"165.071\" filterUnits=\"userSpaceOnUse\" color-interpolation-filters=\"sRGB\">\n<feFlood flood-opacity=\"0\" result=\"BackgroundImageFix\"></feFlood>\n<feColorMatrix in=\"SourceAlpha\" type=\"matrix\" values=\"0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0\"></feColorMatrix>\n<feOffset dy=\"4\"></feOffset>\n<feGaussianBlur stdDeviation=\"2\"></feGaussianBlur>\n<feColorMatrix type=\"matrix\" values=\"0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0.25 0\"></feColorMatrix>\n<feBlend mode=\"normal\" in2=\"BackgroundImageFix\" result=\"effect1_dropShadow\"></feBlend>\n<feBlend mode=\"normal\" in=\"SourceGraphic\" in2=\"effect1_dropShadow\" result=\"shape\"></feBlend>\n</filter>\n</defs>\n</svg>\n`;
const circle = `<svg width=\"150\" height=\"150\" viewBox=\"0 0 150 150\" fill=\"none\" xmlns=\"http://www.w3.org/2000/svg\">\n<circle cx=\"75\" cy=\"75\" r=\"70\" stroke=\"black\" stroke-width=\"10\"></circle>\n</svg>\n`;

const arrOfElements = document.getElementsByClassName("grid-item");
const whoWon = document.getElementById("paragraph");
let counter = 0;
let myWins = 0;
let hisWins = 0;
let mySymbol = "cross";
let myTurn = true;
let lastSymbol = "";

const socket = io.connect();
socket.on("changeTurn", (turn) => (myTurn = turn));
socket.on("yourSymbol", (symbol) => {
  mySymbol = symbol;
  if (mySymbol == "circle") {
    myTurn = false;
  }
});

socket.on("squareClicked", ([num, hisSymbol]) => {
  arrOfElements[num].dataset.symbol = hisSymbol;
  arrOfElements[num].dataset.symbol === "cross"
    ? (arrOfElements[num].innerHTML = cross)
    : (arrOfElements[num].innerHTML = circle);
  isGameOver(valuesOfDivs());
  computeScore();
});

// refactored win condition
function isGameOver(arr) {
  //horizontal
  for (let i = 0; i < arr.length; i++) {
    if (arr[i][0] == arr[i][1] && arr[i][0] == arr[i][2]) {
      if (arr[i][0] == "cross") {
        whoWon.innerHTML = "X HAS WON";
        whoWon.dataset.gameOver = "true";
        return;
      }
      if (arr[i][0] == "circle") {
        whoWon.innerHTML = "O HAS WON";
        whoWon.dataset.gameOver = "true";
        return;
      }
    }
  }
  //vertical
  for (let i = 0; i < arr.length; i++) {
    if (arr[0][i] == arr[1][i] && arr[2][i] == arr[0][i]) {
      if (arr[0][i] == "cross") {
        whoWon.innerHTML = "X HAS WON";
        whoWon.dataset.gameOver = "true";
        return;
      }
      if (arr[0][i] == "circle") {
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
    if (arr[1][1] == "cross") {
      whoWon.innerHTML = "X HAS WON";
      whoWon.dataset.gameOver = "true";
      return;
    }
    if (arr[1][1] == "circle") {
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

function computeScore() {
  if (mySymbol === "cross" && whoWon.innerHTML === "X HAS WON") {
    myWins++;
  }
  if (mySymbol === "cross" && whoWon.innerHTML === "O HAS WON") {
    hisWins++;
  }
  if (mySymbol === "circle" && whoWon.innerHTML === "X HAS WON") {
    hisWins++;
  }
  if (mySymbol === "circle" && whoWon.innerHTML === "O HAS WON") {
    myWins++;
  }
  document.getElementsByTagName(
    "h3"
  )[0].innerHTML = `Score: ${myWins}:${hisWins}`;
}

// gets value of all the divs into 2D array, something like this [[x,o,x], [o,x,o], [x,o,x]]
function valuesOfDivs() {
  let arr = [];
  for (let i = 0; i < 9; i++) {
    arr.push(document.getElementsByClassName("grid-item")[i].dataset.symbol);
  }
  const newArr = [];
  while (arr.length) newArr.push(arr.splice(0, 3));
  socket.emit("valuesOfDivs", newArr);
  return newArr;
}

function finalFunc(i) {
  return function () {
    if (myTurn) {
      if (arrOfElements[i].innerHTML == "") {
        arrOfElements[i].dataset.symbol = mySymbol;
        arrOfElements[i].dataset.symbol === "cross"
          ? (arrOfElements[i].innerHTML = cross)
          : (arrOfElements[i].innerHTML = circle);
      }
      counter++;
      isGameOver(valuesOfDivs());
      computeScore();
      socket.emit("squareClicked", [i, mySymbol]);
      socket.emit("changeTurn", myTurn);
      myTurn = !myTurn;
    }
  };
}

// adds event listener for the whole htmlCollection
for (let i = 0; i < arrOfElements.length; i++) {
  arrOfElements[i].addEventListener("click", finalFunc(i));
}

// for (let i = 0; i < arrOfElements.length; i++) {
//   arrOfElements[i].addEventListener("click", () => {
//     if (
//       whoWon.dataset.gameOver == "false" &&
//       arrOfElements[i].innerHTML == "" &&
//       myTurn
//     ) {
//       myTurn = !myTurn;
//       socket.emit("changeTurn", myTurn);
//     }
//   });
// }

function removeAll() {
  for (let i = 0; i < arrOfElements.length; i++) {
    arrOfElements[i].innerHTML = "";
    arrOfElements[i].dataset.symbol = "";
  }
  whoWon.dataset.gameOver = "false";
  whoWon.innerHTML = "";
  counter = 0;
  howManyTurnsIMade = 0;
  mySymbol === "circle" ? (mySymbol = "cross") : (mySymbol = "circle");
}

// new game button
const newGame = document.getElementsByTagName("button")[0];
newGame.onclick = () => {
  socket.emit("newGame", true);
};

socket.on("newGame", (boolean) => {
  if (boolean) {
    removeAll();
  }
});
