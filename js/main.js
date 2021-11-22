let canvas;
let ctx;
let width;
let height;
let game;
let status;
let type;
let tileSize = 106;
let moves = 0;
let number_of_changes = 500;

function start() {
  const btn = document.createElement("div");
  const threeBtn = document.createElement("button");
  const fourBtn = document.createElement("button");
  const updateBtn = document.createElement("button");

  threeBtn.innerText = "ThreeBtn";
  fourBtn.innerText = "FourBtn";
  updateBtn.innerText = "UpdateBtn";

  threeBtn.addEventListener("click", () => {
    type = "three";
    init(3);
  });

  fourBtn.addEventListener("click", () => {
    type = "four";
    init(4);
  });

  updateBtn.addEventListener("click", () => {
    update(number_of_changes);
  });

  status = document.createElement("div");
  status.id = "status";
  btn.appendChild(threeBtn);
  btn.appendChild(fourBtn);
  btn.appendChild(updateBtn);

  document.body.appendChild(status);
  document.body.appendChild(btn);
}

function init(value) {
  createGame(value);
  canvas = document.createElement("canvas");
  let scale = window.devicePixelRatio;
  width = game[0].length * tileSize;
  height = game.length * tileSize;
  canvas.width = width * scale;
  canvas.height = height * scale;
  canvas.style.width = `${width}px`;
  canvas.style.height = `${height}px`;
  canvas.style.border = "5px solid black";
  ctx = canvas.getContext("2d");
  ctx.scale(scale, scale);
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";
  const fontSize = 24;
  ctx.font = `${fontSize}px Arial`;
  canvas.addEventListener("click", move);
  document.body.appendChild(canvas);
  update(number_of_changes);
}

function createGame(num) {
  game = Array(num)
    .fill()
    .map((_) => Array(num).fill("empty"));
  for (let i = 0; i < num; i++) {
    for (let j = 0; j < num; j++) {
      game[i][j] = (i * num + j + 1) % (num * num);
    }
  }
}

function update(num) {
  moves = 0;
  for (let i = 0; i < num; i++) {
    const emptyPos = findEmptyPos();
    const neighbour = getNeighbour(emptyPos);
    const move = neighbour[Math.floor(Math.random() * neighbour.length)];
    tradePos(move, emptyPos);
  }
  draw();
  if (!checkGameWin()) {
    status.innerText = "";
  }
}

function findEmptyPos() {
  for (let i = 0; i < game.length; i++) {
    for (let j = 0; j < game[0].length; j++) {
      if (!game[i][j]) {
        return { x: j, y: i };
      }
    }
  }
}

function getNeighbour(pos) {
  let neighbour = [];
  for (let i = -1; i < 2; i++) {
    for (let j = -1; j < 2; j++) {
      if (checkInvalid(pos.x, pos.y, i, j)) continue;
      if (game[pos.y + i][pos.x + j])
        neighbour.push({ x: pos.x + j, y: pos.y + i });
    }
  }
  return neighbour;
}

function draw() {
  ctx.clearRect(0, 0, width, height);
  ctx.strokeStyle = "black";

  for (let i = 0; i < game.length; i++) {
    for (let j = 0; j < game[0].length; j++) {
      const piece = game[i][j];
      const x = j * tileSize;
      const y = i * tileSize;
      ctx.lineWidth = 10;
      ctx.fillStyle = "white";
      ctx.fillRect(x, y, tileSize, tileSize);
      ctx.strokeRect(x, y, tileSize, tileSize);
      ctx.fillStyle = "black";

      if (!!piece) {
        const image = new Image();
        image.onload = function () {
          ctx.drawImage(image, x + 5, y + 5);
        };
        if (type === "three") {
          image.src = `../images/three/${piece}.jpg`;
        }
        if (type === "four") {
          image.src = `../images/four/${piece}.jpg`;
        }
      }
    }
  }
}

const checkInvalid = (x, y, i, j) =>
  y + i < 0 ||
  y + i > game.length - 1 ||
  x + j < 0 ||
  x + j > game[0].length - 1 ||
  i + j === 0 ||
  i === j;

function lookEmptyPos(pos) {
  for (let i = -1; i < 2; i++) {
    for (let j = -1; j < 2; j++) {
      if (checkInvalid(pos.x, pos.y, i, j)) continue;
      if (!game[pos.y + i][pos.x + j]) {
        return { x: pos.x + j, y: pos.y + i };
      }
    }
  }
  return null;
}

function tradePos(pos, newPos) {
  if (!newPos) return;
  game[newPos.y][newPos.x] = game[pos.y][pos.x];
  game[pos.y][pos.x] = 0;
}

function checkGameWin() {
  for (let i = 0; i < game.length * game[0].length - 1; i++) {
    const x = i % game[0].length;
    const y = Math.floor(i / game[0].length);
    if (game[y][x] != i + 1) return false;
  }
  return true;
}

function move(e) {
  const pos = {
    x: Math.floor(e.offsetX / tileSize),
    y: Math.floor(e.offsetY / tileSize),
  };
  const newPos = lookEmptyPos(pos);
  if (newPos !== null) {
    if (pos.x !== newPos.x || pos.y !== newPos.y) {
      tradePos(pos, newPos);
      status.innerText = checkGameWin() ? `Win - ${moves} moves` : "";
      if (checkGameWin()) {
        fetch("https://jsonplaceholder.typicode.com/posts", {
          method: "POST",
          body: JSON.stringify({
            title: "foo",
            body: "bar",
            userId: 1,
          }),
          headers: {
            "Content-type": "application/json; charset=UTF-8",
          },
        })
          .then((response) => response.json())
          .then((json) => console.log(json));
      }
      draw();
      moves += 1;
    }
  }
}

start();
