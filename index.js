class Ship {
  constructor(length) {
    this.length = length;
    this.coordinates = this.genrateGrid();
    this.isPlaced = false;
    this.isSunk = false;
  }

  genrateGrid() {
    const grid = [];
    for (let row = 0; row < 10; row++) {
      const rowArray = [];
      for (let col = 0; col < 10; col++) {
        rowArray.push({ hit: false, isHere: false });
      }
      grid.push(rowArray);
    }
    return grid;
  }

  hit(row, col) {
    this.coordinates[row][col] = { ...this.coordinates[row][col], hit: true };
    this.checkisSunk();
  }

  checkisSunk() {
    let isSunk = true;
    for (let row = 0; row < 10; row++) {
      for (let col = 0; col < 10; col++) {
        if (this.coordinates[row][col].isHere === true && this.coordinates[row][col].hit === false) {
          isSunk = false;
        }
      }
    }
    this.isSunk = isSunk;
  }


}
class Grid {
  constructor(size) {
    this.size = size;
    this.grid = this.createGrid();
  }

  createGrid() {
    const grid = [];
    for (let row = 0; row < this.size; row++) {
      const rowArray = [];
      for (let col = 0; col < this.size; col++) {
        rowArray.push({ ship: null });
      }
      grid.push(rowArray);
    }
    return grid;
  }

  shipIsPlacable(ship_row, ship_col, ship_dir, ship) {
    if (ship_dir === 0) { // droite
      for (let col = ship_col; col < ship.length + ship_col; col++) {
        if (col > this.grid.size || ship_row > this.grid.size || typeof this.grid[ship_row][col] === "undefined") {
          return false;
        }
        if (this.grid[ship_row][col].ship !== null) {
          return false;
        }
      }
    } else if (ship_dir === 1) { //bas
      for (let row = ship_row; row < ship.length; row++) {
        if (row > grid.size || this.grid[row][ship_col].ship !== null) {
          return false;
        }
      }

    } else if (ship_dir === 2) { //gauche
      for (let col = ship_col; col > 0; col--) {
        if (this.grid[ship_row][col].ship !== null) {
          return false;
        }
      }

    } else if (ship_dir === 3) { //haut
      for (let row = ship_row; row > 0; row--) {
        if (this.grid[row][ship_col].ship !== null) {
          return false;
        }
      }
    }
    return true;
  }

  placeShip(ship_row, ship_col, ship_dir, ship) {
    if (!this.shipIsPlacable(ship_row, ship_col, ship_dir, ship)) {
      return false;
    }
    if (ship_dir === 0) { // droite
      for (let col = ship_col; col < ship.length + ship_col; col++) {
        this.grid[ship_row][col].ship = ship;
        ship.coordinates[ship_row][col].isHere = true;
      }
      ship.isPlaced = true;
    } else if (ship_dir === 1) { //bas
      for (let row = ship_row; row < ship.length + ship_row; row++) {
        this.grid[ship_row][col].ship = ship;
        ship.coordinates[ship_row][col].isHere = true;
      }
      ship.isPlaced = true;
    } else if (ship_dir === 2) { //gauche
      for (let col = ship_col; col > 0; col--) {
        this.grid[ship_row][col].ship = ship;
        ship.coordinates[ship_row][col].isHere = true;
      }
      ship.isPlaced = true;
    } else if (ship_dir === 1) { //haut
      for (let row = ship_row; row > 0; row--) {
        this.grid[ship_row][col].ship = ship;
        ship.coordinates[ship_row][col].isHere = true;
      }
      ship.isPlaced = true;
    }
    return ship
  }

  receiveAttack(row, col) {
    const cell = this.grid[row][col];
    if (cell.ship === null) return false; // Miss
    if (cell.ship.coordinates[row][col].hit === true) return false; // Already attackeds
    if (cell.ship.coordinates[row][col].hit === false) {
      cell.ship.hit(row, col);
    }
    return cell;
  }

  isGameOver() {
    let isGameOver = true;
    for (let row = 0; row < this.size; row++) {
      for (let col = 0; col < this.size; col++) {
        if (this.grid[row][col].ship !== null && this.grid[row][col].ship.isSunk === false) {
          isGameOver = false;
        }
      }
    }
    return isGameOver;
  }

}

class Game {
  constructor(gridSize) {
    this.playerGrid = new Grid(gridSize);
    this.computerGrid = new Grid(gridSize);
    this.currentPlayer = 'player';
    this.gameOver = false;
    this.initializeGame();
  }

  initializeGame() {
    this.randomlyPlaceShips(this.playerGrid);
    this.randomlyPlaceShips(this.computerGrid);
    this.renderGrid(this.playerGrid, document.getElementById('player-grid'), false);
    this.renderGrid(this.computerGrid, document.getElementById('computer-grid'), true);
    // console.log(this.playerGrid);
  }

  randomlyPlaceShips(grid) {
    const aircraft_carrier = new Ship(5);
    const cruiser = new Ship(4);
    const destroyer1 = new Ship(3);
    const destroyer2 = new Ship(3);
    const torpedo_boat = new Ship(2);

    while (aircraft_carrier.isPlaced === false) {
      const row = Math.floor(Math.random() * grid.size);
      const col = Math.floor(Math.random() * grid.size);
      grid.placeShip(row, col, 0, aircraft_carrier);
    }

    while (cruiser.isPlaced === false) {
      const row = Math.floor(Math.random() * grid.size);
      const col = Math.floor(Math.random() * grid.size);
      grid.placeShip(row, col, 0, cruiser);
    }
    while (destroyer1.isPlaced === false) {
      const row = Math.floor(Math.random() * grid.size);
      const col = Math.floor(Math.random() * grid.size);
      grid.placeShip(row, col, 0, destroyer1);
    }
    while (destroyer2.isPlaced === false) {
      const row = Math.floor(Math.random() * grid.size);
      const col = Math.floor(Math.random() * grid.size);
      grid.placeShip(row, col, 0, destroyer2);
    }
    while (torpedo_boat.isPlaced === false) {
      const row = Math.floor(Math.random() * grid.size);
      const col = Math.floor(Math.random() * grid.size);
      grid.placeShip(row, col, 0, torpedo_boat);
    }
  }

  renderGrid(grid, container, isClickable = false) {
    container.innerHTML = '';
    for (let row = 0; row < grid.size; row++) {
      for (let col = 0; col < grid.size; col++) {
        const cell = document.createElement('div');
        cell.classList.add('cell', 'water');
        cell.dataset.row = row;
        cell.dataset.col = col;

        if (isClickable) {
          cell.addEventListener('click', () => {
            this.handleAttack(grid, row, col, cell)
            this.switchPlayer();
          });
        } else if (grid.grid[row][col].ship !== null) {
          cell.classList.add('ship');
        }

        container.appendChild(cell);
      }
    }
  }

  handleAttack(grid, row, col, cellElement) {
    const cell = grid.receiveAttack(row, col);
    if (cell) {
      // cellElement.classList.add('hit');
      const span = document.createElement('span');
      span.classList.add('red-cross'); // Assurez-vous d'avoir une classe CSS pour styliser la croix rouge
      span.innerHTML = '✖'; // Utilisez le caractère Unicode pour la croix rouge
      cellElement.appendChild(span);
      // console.log('Touché !', cell);

      if (cell.ship.isSunk) {
        // console.log('Coulé !');
        alert('Coulé !');
      } else {
        alert('Touché !');
      }
    } else {
      cellElement.classList.add('miss');
      // console.log('Manqué !', cell, row, col);
      // alert('Manqué !');
    }
  }

  getCellHTML(row, col) {
    const cells = document.querySelectorAll('#player-grid div');
    for (let cell of cells) {
      if (cell.dataset.row == row && cell.dataset.col == col) {
        return cell;
      }
    }
    console.error(`Cellule non trouvée pour row: ${row}, col: ${col}`);
    return null;
  }
  computerMoove() {
    const row = Math.floor(Math.random() * this.playerGrid.size);
    const col = Math.floor(Math.random() * this.playerGrid.size);
    // console.log('L\'ordinateur attaque la case', row, col);
    this.handleAttack(this.playerGrid, row, col, this.getCellHTML(row, col));
    this.switchPlayer();
  }

  switchPlayer() {
    const messageElement = document.getElementById('message');
    const computerGrid = document.getElementById('computer-grid');
    this.currentPlayer = this.currentPlayer === 'player' ? 'computer' : 'player';
    if (this.currentPlayer === 'computer') {
      messageElement.innerHTML = "L'ordinateur est en train de jouer";
      computerGrid.classList.add('computer-grid-disabled');
      setTimeout(() => {
        this.computerMoove();
        messageElement.innerHTML = "";
        computerGrid.classList.remove('computer-grid-disabled');
      }, 2000);
    } else {
      messageElement.innerHTML = "À toi de jouer";
    }
  }

  isGameOver() {
    if (this.playerGrid.isGameOver()) {
      // console.log('Game Over');
      alert('Game Over');
      this.gameOver = true;
    }
    if (this.computerGrid.isGameOver()) {
      // console.log('Game Won');
      alert('Gagné !');
      this.gameOver = true
    }
  }

  startGame() {
    // console.log('Game started');
    alert('Game started');
    if (this.currentPlayer === 'computer') {
      this.computerMoove();
    }
  }
}

// Lancer le jeu
const game = new Game(10);
game.startGame();