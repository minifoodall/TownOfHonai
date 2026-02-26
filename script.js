let numDisks = 3;
let towers;
let moves = 0;
let draggedFrom = null;

let solutionMoves = [];
let isSolving = false;

const colors = ["#ef4444", "#f59e0b", "#22c55e", "#3b82f6", "#a855f7", "#ec4899", "#14b8a6"];

function calculateMinMoves(n) {
  return Math.pow(2, n) - 1;
}

function initTowers() {
  towers = [Array.from({ length: numDisks }, (_, i) => numDisks - i), [], []];
  moves = 0;
  draggedFrom = null;
  isSolving = false;
  solutionMoves = [];

  document.getElementById("winMsg").textContent = "";
  updateMoves();
  updateMinMoves();
  render();
}

function updateMoves() {
  document.getElementById("moveCount").textContent = moves;
}

function updateMinMoves() {
  document.getElementById("minMoves").textContent = calculateMinMoves(numDisks);
}

function render() {
  const game = document.getElementById("game");
  game.innerHTML = "";

  towers.forEach((tower, i) => {
    const towerDiv = document.createElement("div");
    towerDiv.className = "tower";

    const towerLabel = document.createElement("div");
    towerLabel.className = "tower-label";
    towerLabel.textContent =
      i === 0 ? "Start" : i === 2 ? "Destination" : "Auxiliary";
    towerDiv.appendChild(towerLabel);

    towerDiv.ondragover = (e) => {
      e.preventDefault();
      towerDiv.classList.add("drag-over");
    };

    towerDiv.ondragleave = () => towerDiv.classList.remove("drag-over");

    towerDiv.ondrop = () => {
      towerDiv.classList.remove("drag-over");
      handleDrop(i);
    };

    towerDiv.ontouchend = () => handleDrop(i);

    const rod = document.createElement("div");
    rod.className = "rod";
    towerDiv.appendChild(rod);

    tower.forEach((disk, index) => {
      const diskDiv = document.createElement("div");
      diskDiv.className = "disk";
      diskDiv.style.width = 30 + disk * 18 + "px";
      diskDiv.style.background = colors[disk % colors.length];

   
      if (index === tower.length - 1 && !isSolving) {
        diskDiv.draggable = true;
        diskDiv.ondragstart = () => (draggedFrom = i);
        diskDiv.ontouchstart = () => (draggedFrom = i);
      }

      towerDiv.appendChild(diskDiv);
    });

    game.appendChild(towerDiv);
  });
}

function handleDrop(target) {
  if (isSolving) return;
  if (draggedFrom === null || draggedFrom === target) return;

  const fromTower = towers[draggedFrom];
  const toTower = towers[target];
  const disk = fromTower[fromTower.length - 1];

  if (toTower.length === 0 || toTower[toTower.length - 1] > disk) {
    toTower.push(fromTower.pop());
    moves++;
    updateMoves();
  }

  draggedFrom = null;
  checkWin();
  render();
}

function checkWin() {
  if (towers[2].length === numDisks) {
    const minMoves = calculateMinMoves(numDisks);

    const msg =
      moves === minMoves
        ? `🏆 Perfect! Solved in minimum ${moves} moves!`
        : `🎉 Solved in ${moves} moves (minimum is ${minMoves}).`;

    document.getElementById("winMsg").textContent = msg;
  }
}

function resetGame() {
  initTowers();
}

function changeDisks(val) {
  if (isSolving) return;

  numDisks = Math.max(3, Math.min(7, numDisks + val));
  initTowers();
}


function generateSolution(n, from, to, aux) {
  if (n === 0) return;

  generateSolution(n - 1, from, aux, to);
  solutionMoves.push([from, to]);
  generateSolution(n - 1, aux, to, from);
}

function showSolution() {
  if (isSolving) return;

  initTowers(); 
  isSolving = true;

  solutionMoves = [];
  generateSolution(numDisks, 0, 2, 1);

  let i = 0;

  function playMove() {
    if (i >= solutionMoves.length) {
      isSolving = false;
      checkWin();
      render();
      return;
    }

    const [from, to] = solutionMoves[i];

    const disk = towers[from].pop();
    towers[to].push(disk);

    moves++;
    updateMoves();
    render();

    i++;
    setTimeout(playMove, 500); 
  }

  playMove();
}

initTowers();