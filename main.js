// 3 variables will be declared to keep track of the player wins,
// ties, and computer wins
// these will be incremented/reset as appropriate
let playerWins = 0;
let tieCount = 0;
let computerWins = 0;

// boolean to track whether it is the player's turn or the computer's
// turn
let playersTurn = true;

function main() {
  const squares = document.querySelectorAll(".square");
  // create a 2d array with 3 rows and 3 cols
  // this will allow us to check if the player or computer has won
  let board = ["", "", "", "", "", "", "", "", ""];
  // modal variable
  const modal = document.querySelector('[data-id="modal"]');
  // modal text variable
  const modalText = document.querySelector('[data-id="modal-text"]');
  // variable for the node containing the player's stats
  const playerSpan = document.querySelector('[data-id="player-stats"]');
  // node containing the number of ties
  const tiesSpan = document.querySelector('[data-id="ties"]');
  // node containing the computer's stats
  const computerSpan = document.querySelector('[data-id="computer-stats"]');

  // displaying the intial stats
  playerSpan.textContent = playerWins.toString() + " Wins";
  tiesSpan.textContent = tieCount.toString() + " Ties";
  computerSpan.textContent = computerWins.toString() + " Wins";

  // set up menu functionality
  toggleMenu();

  // handle when the new round button is clicked
  const newRoundBtn = document.querySelector('[data-id="new-round-btn"]');
  newRoundBtn.addEventListener("click", (event) => newRound(squares, board));

  // handle when the reset button is clicked
  const resetBtn = document.querySelector('[data-id="reset-btn"]');
  resetBtn.addEventListener("click", (event) => {
    newRound(squares, board);
    playerWins = 0;
    tieCount = 0;
    computerWins = 0;
    playerSpan.textContent = playerWins.toString() + " Wins";
    tiesSpan.textContent = tieCount.toString() + " Ties";
    computerSpan.textContent = computerWins.toString() + " Wins";
    playersTurn = true;
  });

  // handles when the play again button is clicked
  const playAgainBtn = document.querySelector('[data-id="play-again-btn"]');
  playAgainBtn.addEventListener("click", (event) => newRound(squares, board));

  // handling the turn indicator
  const turnIndicator = document.querySelector('[data-id="turn-indicator"]');
  const x = document.createElement("i");
  x.classList.add("fa-solid", "fa-x", "turquoise");
  // changing the text
  const turnText = document.querySelector('[data-id="turn-text"]');
  turnText.innerHTML = "Player's Turn";
  turnIndicator.replaceChildren(x, turnText);

  // handle when a square is clicked
  squares.forEach((square) => {
    square.addEventListener("click", (event) => {
      if (!playersTurn || board[square.id - 1] != "") {
        return;
      }

      const icon = document.createElement("i");

      icon.classList.add("fa-solid", "fa-x", "yellow");
      board[parseInt(square.id) - 1] = "X";

      event.target.replaceChildren(icon);

      playersTurn = false;

      // check for win
      if (playerWin(board)) {
        modalText.innerHTML = "Player Wins!";
        modal.classList.toggle("hidden");
        // increment the player's win count and display the new count
        playerWins += 1;
        playerSpan.textContent = playerWins.toString() + " Wins";
        playersTurn = true;
      } else if (tieBoard(board)) {
        modalText.innerHTML = "Tie!";
        modal.classList.toggle("hidden");
        // increment the ties count and display the new count
        tieCount += 1;
        tiesSpan.textContent = tieCount.toString() + " Ties";
        playersTurn = true;
      } else {
        // handling the turn indicator
        const y = document.createElement("i");
        y.classList.add("fa-solid", "fa-o", "turquoise");
        // changing the text
        turnText.innerHTML = "Computer's Turn";
        turnIndicator.replaceChildren(y, turnText);

        setTimeout(function () {
          computerMove(
            board,
            modal,
            modalText,
            computerSpan,
            tiesSpan,
            turnIndicator,
            turnText
          );
        }, 1500);
      }
    });
  });
}

// function that deals with the actions drop down menu
function toggleMenu() {
  // handles toggling the menu when it is clicked
  const menu = document.querySelector('[data-id="menu"]');
  const menuItems = document.querySelector('[data-id="menu-items"]');
  menu.addEventListener("click", (event) => {
    menuItems.classList.toggle("hidden");
  });
}

// function that creates a new round
// this function will be called when the new round button is clicked
// or when the play again button is clicked
function newRound(squares, board) {
  // remove the x's and o's from each square
  // this will reset the game board
  squares.forEach((square) => {
    square.innerHTML = "";
  });

  // now reset the game board
  // all board elements will be set to an empty string
  for (let i = 0; i < board.length; i++) {
    board[i] = "";
  }

  // hide the modal if it is not already hidden
  const modal = document.querySelector('[data-id="modal"]');
  if (!modal.classList.contains("hidden")) {
    modal.classList.add("hidden");
  }

  // handling the turn indicator
  const turnIndicator = document.querySelector('[data-id="turn-indicator"]');
  const x = document.createElement("i");
  x.classList.add("fa-solid", "fa-x", "turquoise");
  // changing the text
  const turnText = document.querySelector('[data-id="turn-text"]');
  turnText.innerHTML = "Player's Turn";
  turnIndicator.replaceChildren(x, turnText);

  // reset the player's turn boolean to so the player moves
  // first again
  playersTurn = true;
}

// This function will be called when it is the computer's move
function computerMove(
  board,
  modal,
  modalText,
  computerSpan,
  tiesSpan,
  turnIndicator,
  turnText
) {
  let index = getBestMove(board);
  board[index] = "O";

  // display the O on the correct square
  const square = document.getElementById((index + 1).toString());
  const icon = document.createElement("i");
  icon.classList.add("fa-solid", "fa-o", "turquoise");
  square.replaceChildren(icon);

  // now check if the computer has won the game
  if (computerWin(board)) {
    modalText.innerHTML = "Computer Wins!";
    modal.classList.toggle("hidden");
    // increment the computer's win count and display the new count
    computerWins += 1;
    computerSpan.textContent = computerWins.toString() + " Wins";
  } else if (tieBoard(board)) {
    modalText.innerHTML = "Tie!";
    modal.classList.toggle("hidden");
    // increment the ties count and display the new count
    tieCount += 1;
    tiesSpan.textContent = tieCount.toString() + " Ties";
  }

  // handling the turn indicator
  const x = document.createElement("i");
  x.classList.add("fa-solid", "fa-x", "turquoise");
  // changing the text
  turnText.innerHTML = "Player's Turn";
  turnIndicator.replaceChildren(x, turnText);

  playersTurn = true;
}

// Utility function to get the number of spots left on the board
// This function will be called in the minimax function in order
// to determine the value of a board
function getAvailableSpots(board) {
  let count = 0;
  board.forEach((spot) => {
    if (spot === "") {
      count += 1;
    }
  });
  return count;
}

// This function returns the optimal move that the computer should
// make. The function will evaluate all possible moves using the
// minimax function. The best move will be the move that returns
// the maximum score when the minimax function is called.
function getBestMove(board) {
  // we are assuming that there is no need to check if the board
  // is in a terminal state
  // this will be checked before this function is called
  let maxVal = Number.NEGATIVE_INFINITY;
  let bestIndex = -1;
  for (let i = 0; i < board.length; i++) {
    if (board[i] === "") {
      let newBoard = board.slice();
      newBoard[i] = "O";
      let value = minimax(newBoard, false);
      if (value > maxVal) {
        maxVal = value;
        bestIndex = i;
      }
    }
  }

  return bestIndex;
}

// This function will implement the minimax algorithm
// A value will be returned that will indicate which square
// on the board the computer has chosen to place an O on
// maximizingPlayer is a boolean representing if it is the maximizing
// player's move or not
// the computer will be the maximizing player in this implementation
function minimax(board, maximizingPlayer) {
  // first we will check if the board is in a terminal state
  // if the player has won, the score will be negative
  // if the computer has won, the score will be positive
  // if it is a tie, the score will be 0
  if (playerWin(board)) {
    // we will base the score on the number of spots left on the board
    return -1 * (getAvailableSpots(board) + 1);
  } else if (computerWin(board)) {
    return getAvailableSpots(board) + 1;
  } else if (tieBoard(board)) {
    return 0;
  }

  // now we need to check each move and return either the min or max
  // move value based on the which player's turn it is
  if (maximizingPlayer) {
    let maxVal = Number.NEGATIVE_INFINITY;
    // loop through all possible moves
    for (let i = 0; i < board.length; i++) {
      if (board[i] === "") {
        let newBoard = board.slice();
        newBoard[i] = "O";
        let value = minimax(newBoard, false);
        maxVal = Math.max(maxVal, value);
      }
    }
    // now we just return the max value
    return maxVal;
  } else {
    let minVal = Number.POSITIVE_INFINITY;
    // loop through all moves
    for (let i = 0; i < board.length; i++) {
      if (board[i] === "") {
        let newBoard = board.slice();
        newBoard[i] = "X";
        let value = minimax(newBoard, true);
        minVal = Math.min(minVal, value);
      }
    }
    return minVal;
  }
}

// returns true if the player has won
function playerWin(board) {
  // This function will consist of a bunch of if statements
  // to check if there is a win
  // This is the best way to do this that I know of
  if (board[0] == "X" && board[0] == board[1] && board[1] == board[2]) {
    return true;
  } else if (board[3] == "X" && board[3] == board[4] && board[4] == board[5]) {
    return true;
  } else if (board[6] == "X" && board[6] == board[7] && board[7] == board[8]) {
    return true;
  } else if (board[0] == "X" && board[0] == board[3] && board[3] == board[6]) {
    return true;
  } else if (board[1] == "X" && board[1] == board[4] && board[4] == board[7]) {
    return true;
  } else if (board[2] == "X" && board[2] == board[5] && board[5] == board[8]) {
    return true;
  } else if (board[0] == "X" && board[0] == board[4] && board[4] == board[8]) {
    return true;
  } else if (board[2] == "X" && board[2] == board[4] && board[4] == board[6]) {
    return true;
  }
  return false;
}

// returns true if the computer has won
function computerWin(board) {
  if (board[0] == "O" && board[0] == board[1] && board[1] == board[2]) {
    return true;
  } else if (board[3] == "O" && board[3] == board[4] && board[4] == board[5]) {
    return true;
  } else if (board[6] == "O" && board[6] == board[7] && board[7] == board[8]) {
    return true;
  } else if (board[0] == "O" && board[0] == board[3] && board[3] == board[6]) {
    return true;
  } else if (board[1] == "O" && board[1] == board[4] && board[4] == board[7]) {
    return true;
  } else if (board[2] == "O" && board[2] == board[5] && board[5] == board[8]) {
    return true;
  } else if (board[0] == "O" && board[0] == board[4] && board[4] == board[8]) {
    return true;
  } else if (board[2] == "O" && board[2] == board[4] && board[4] == board[6]) {
    return true;
  }
  return false;
}

// This funciton returns true if the game has ended in a tie
// It is only necessary to check if the entire board is full since
// this function will only be called after the board has been checked
// for either a player win or a computer win
function tieBoard(board) {
  for (let i = 0; i < board.length; i++) {
    if (board[i] == "") {
      return false;
    }
  }
  return true;
}

main();
