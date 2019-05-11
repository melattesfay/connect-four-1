// Setup the main game logic.

(function () {
  var primaryText = document.querySelector('.primary');
  var secondaryText = document.querySelector('.secondary');
  var currentPlayerNameEl = document.querySelector('#current-player');
  var otherPlayerNameEl = document.querySelector('#other-player');
  var playAgainEl = document.querySelector('#play-again');
  var playAgainBtnEl = document.querySelector('#play-again-btn');
  var gameBoardEl = document.querySelector('#board');

  currentPlayerNameEl.textContent = Game.config["blackPlayerName"];
  currentPlayerNameEl.classList.add("black");
  otherPlayerNameEl.textContent = Game.config["redPlayerName"];
  otherPlayerNameEl.classList.add("red");

  playAgainBtnEl.addEventListener('click', () => location.reload());
  gameBoardEl.addEventListener('click', placeGamePiece);
  currentPlayerNameEl.addEventListener("input", Game.do.handleNameChange);
  otherPlayerNameEl.addEventListener("input", Game.do.handleNameChange);

  function placeGamePiece(e) {
    if (e.target.tagName !== 'BUTTON') return;

    var targetCell = e.target.parentElement;
    var targetRow = targetCell.parentElement;
    var targetRowCells = [...targetRow.children];
    var gameBoardRowsEls = [...document.querySelectorAll('#board tr')];

    // Detect the x and y position of the button clicked.
    var y_pos = gameBoardRowsEls.indexOf(targetRow);
    var x_pos = targetRowCells.indexOf(targetCell);

    // Ensure the piece falls to the bottom of the column.
    y_pos = Game.do.dropToBottom(x_pos, y_pos);

    if (Game.check.isPositionTaken(x_pos, y_pos)) {
      alert(Game.config.takenMsg);
      return;
    }

    // Add the piece to the board.
    Game.do.addDiscToBoard(x_pos, y_pos);
    Game.do.printBoard();

    // Check to see if we have a winner.
    if (Game.check.isVerticalWin() || Game.check.isHorizontalWin() || Game.check.isDiagonalWin()) {
      gameBoardEl.removeEventListener('click', placeGamePiece);
      primaryText.textContent = Game.config.winMsg + ' ' + Game.config[Game.currentPlayer + "PlayerName"];
      secondaryText.remove();
      playAgainEl.classList.add('show');
      return;
    } else if (Game.check.isGameADraw()) {
      gameBoardEl.removeEventListener('click', placeGamePiece);
      primaryText.textContent = Game.config.drawMsg;
      secondaryText.remove();
      playAgainEl.classList.add('show');
      return;
    }

    // Change player.
    Game.do.changePlayer();
  };

})();
