/** Connect Four
 *
 * Player 1 and 2 alternate turns. On each turn, a piece is dropped down a
 * column until a player gets four-in-a-row (horiz, vert, or diag) or until
 * board fills (tie)
 */

const width = 7;
const height = 6;

let player = [1,2]; // array of players
let currPlayer = player[0]; // active player: 1 or 2

let board = []; // array of rows, each row is array of cells  (board[y][x]) 

//reset game with button
const resetButton = document.getElementById('button');
resetButton.addEventListener('click', (e)=>{
  e.preventDefault;
  //erase existing HTML Board
  document.getElementById('board').innerHTML='';
  //reset players
  player=[1,2];
  currPlayer = player[0];
  playerName();
  //new boards
  makeBoard();
  makeHtmlBoard();
});

/** makeBoard: create in-JS board structure:
 *    board = array of rows, each row is array of cells  (board[y][x])
 */

function makeBoard() {
  // set "board" to empty HEIGHT x WIDTH matrix array
  board = [...Array(height)].map(arr => [...Array(width)].map(e => ''));
}

/** makeHtmlBoard: make HTML table and row of column tops. */

function makeHtmlBoard() {
  // get "htmlBoard" variable from the item in HTML w/ID of "board"
  const htmlBoard = document.getElementById('board');

  // create the top line of the board to insert the token on click
  //create the row tr and assign an event listener/ID
  //the event listener only apply to the top row
  let top = document.createElement("tr");
  top.setAttribute("id", "column-top");
  top.addEventListener("click", handleClick);
  //add cells to the top line corresponding to the width of the board
  for (let x = 0; x < width; x++) {
    const headCell = document.createElement("td");
    headCell.setAttribute("id", x);
    top.append(headCell);
  }
  //append the top line to the board table
  htmlBoard.append(top);

  // create the cell in the table that will be the board spots for token
  //add rows along the height of the board ('height' rows)
  for (let y = 0; y < height; y++) {
    const row = document.createElement("tr");
    //add cells across each row ('width' per row)
    for (let x = 0; x < width; x++) {
      const cell = document.createElement("td");
      cell.setAttribute("id", `${y}-${x}`);
      row.append(cell);
    }
    htmlBoard.append(row);
  }
}


/** findSpotForCol: given column x, return top empty y (-1 if filled) */

function findSpotForCol(x) {
  //top of board = beginning of array but cells filled by the bottom so:
  //reverse the board to make sure the bottom cells come in firt for the selection of first empty cell
   board.reverse();
  // elements of board are rows (array of 'width' elts)
  // board.findIndex will return the index of the first cell in column x (row[x]) that is empty or if none, will return -1. it starts from the beginning of the reversed board array which corresponds to the bottom of the actual board
  let y = board.findIndex(row => row[x] === '');
  //reverse the board back
  board.reverse();
  //convert the index from the bottom of the board
  return height-1-y;
}

/** placeInTable: update DOM to place piece into HTML table of board */

function placeInTable(y, x) {
  // make a div and insert into correct table cell
  let token = document.createElement('div');
  currPlayer === 1? token.className = 'piece1': token.className = 'piece2';
  //select the (x,y) cell in the htmlBoard
  let correctCell = document.getElementById(`${y}-${x}`);
  //append the created dic to the correct cell
  correctCell.append(token);
}

/** endGame: announce game end */

function endGame(msg) {
  //pop up alert message
  alert (`${msg}`);
}

/** handleClick: handle click of column top to play piece */

function handleClick(evt) {
  // get x from ID of clicked cell in top row. All IDs are the value x of the column
  let clickedCell = evt.target;
  //retrieve the id
  let x = clickedCell.id;

  // get next spot in column (if none, ignore click)
  let y = findSpotForCol(x);
  if (y === -1) {
    return;
  }

  // place piece in board and add to HTML table
  placeInTable(y, x);
   // update in-memory board with the player occupyiong the cell
  board[y][x] = currPlayer;

  // check for win
  if (checkForWin()) {
    return endGame(`Player ${currPlayer} won!`);
  }

  // check for tie
  // check if all cells in board are filled; if so call, call endGame
  //row.findIndex will return the index of the first cell in the row that is empty, if none it returns -1. Goes through the 'row' array inside the board array
  //board.reduce will stock in the accumulator the value of this index going through each row in the board array. If there is no empty cell at all, the final value will be -1. The initial value is set to null
  //reverse the board because beginning of array and bottom of board are opposite
  board.reverse();
  let tie = board.reduce(((acc,row) => acc = row.findIndex(cell => cell==='')),);
  if (tie === -1){
    return endGame(`No winners!`);
  }
  //reverse the board back
  board.reverse();
  
  // switch players
  // switch currPlayer 1 <-> 2
  [player[0], player[1]]=[player[1],player[0]];
  currPlayer=player[0];
   //switch player name
  playerName();
}

/** checkForWin: check board cell-by-cell for "does a win start here?" */

function checkForWin() {
  function _win(cells) {
    // Check four cells to see if they're all color of current player
    //  - cells: list of four (y, x) cells
    //  - returns true if all are legal coordinates & all match currPlayer
    // array.every returns a boolean for a condition on every elements of an array
    return cells.every(
      ([y, x]) =>
        y >= 0 &&
        y < height &&
        x >= 0 &&
        x < width &&
        board[y][x] === currPlayer
    );
  }

  // For each cell of the board, build:
  // - an horizontal array: starting cell and next 3 cell to the right
  // - a verticql array: starting cell and the next 3 down
  // - a right diagonal array: starting cell and 3 next cells down right
  // - a left diagonal array: starting cell and 3 next cells down left

  for (let y = 0; y < height; y++) {
    for (let x = 0; x < width; x++) {
      const horiz = [[y, x], [y, x + 1], [y, x + 2], [y, x + 3]];
      const vert = [[y, x], [y + 1, x], [y + 2, x], [y + 3, x]];
      const diagDR = [[y, x], [y + 1, x + 1], [y + 2, x + 2], [y + 3, x + 3]];
      const diagDL = [[y, x], [y + 1, x - 1], [y + 2, x - 2], [y + 3, x - 3]];

      // use the _win function on each array and return true if one of them is true
      if(_win(horiz) || _win(vert) || _win(diagDR) || _win(diagDL)){
        return true;
      }
    }
  }
}


// Change player name on page
function playerName (){
  currPlayer === 1? color='blue' : color='red';
  const playerName = document.getElementById('player');
  playerName.innerText = `Player #${currPlayer} (${color})`;
}


makeBoard();
makeHtmlBoard();
//load currPlayer at first page load
playerName();
