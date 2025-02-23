let resultX = 0;
let resultO = 0;
let currentPlayer = 'x';
let canMove = true;
let scoreX = document.getElementById('scoreX');
let scoreO = document.getElementById('scoreO');
const boxes = document.querySelectorAll('.box');
const restart = document.getElementById('btn-restart');
const difficultySelect = document.getElementById('difficulty');

boxes.forEach(box => {
    box.addEventListener('click',  (event) => {
        if (!canMove || event.target.classList.contains('x') || event.target.classList.contains('o')) return;
        event.target.classList.add(currentPlayer);
        currentPlayer = currentPlayer === 'x' ? 'o' : 'x';
        canMove = false;
        
        if (checkWinX()) {
            setTimeout(() => {
                alert('Победил X!');
                restartGame();
                resultX++;
                scoreX.textContent = resultX;
            }, 0)
        }
        
        if (checkWinO()) {
            setTimeout(() => {
                alert('Победил O!');
                restartGame();
                resultO++;
                scoreO.textContent = resultO;
            }, 0)
        }
        
        if(checkAllFields() && !checkWinX() && !checkWinO()) {
            setTimeout(() => {
                alert('Ничья!');
                restartGame();
            }, 0)
        }
        
        if (difficultySelect.value !== 'two-players') {
            setTimeout(botMove, 1000);
        } else {
            canMove = true;
        }
    });
});

function checkWinX() {
    const horizontalFillingX = (
      (document.getElementById('0').classList.contains('x') &&
        document.getElementById('1').classList.contains('x') &&
        document.getElementById('2').classList.contains('x')) ||
      (document.getElementById('3').classList.contains('x') &&
        document.getElementById('4').classList.contains('x') &&
        document.getElementById('5').classList.contains('x')) ||
      (document.getElementById('6').classList.contains('x') &&
        document.getElementById('7').classList.contains('x') &&
        document.getElementById('8').classList.contains('x'))
    );
    
    const verticalFillingX = (
      (document.getElementById('0').classList.contains('x') &&
        document.getElementById('3').classList.contains('x') &&
        document.getElementById('6').classList.contains('x')) ||
      (document.getElementById('1').classList.contains('x') &&
        document.getElementById('4').classList.contains('x') &&
        document.getElementById('7').classList.contains('x')) ||
      (document.getElementById('2').classList.contains('x') &&
        document.getElementById('5').classList.contains('x') &&
        document.getElementById('8').classList.contains('x'))
    );
    
    const acuteAngleFillingX = (
      (document.getElementById('0').classList.contains('x') &&
        document.getElementById('4').classList.contains('x') &&
        document.getElementById('8').classList.contains('x')) ||
      (document.getElementById('2').classList.contains('x') &&
        document.getElementById('4').classList.contains('x') &&
        document.getElementById('6').classList.contains('x'))
    );
    
    return horizontalFillingX || verticalFillingX || acuteAngleFillingX;
}

function checkWinO() {
    const horizontalFillingO = (
      (document.getElementById('0').classList.contains('o') &&
        document.getElementById('1').classList.contains('o') &&
        document.getElementById('2').classList.contains('o')) ||
      (document.getElementById('3').classList.contains('o') &&
        document.getElementById('4').classList.contains('o') &&
        document.getElementById('5').classList.contains('o')) ||
      (document.getElementById('6').classList.contains('o') &&
        document.getElementById('7').classList.contains('o') &&
        document.getElementById('8').classList.contains('o'))
    );
    
    const verticalFillingO = (
      (document.getElementById('0').classList.contains('o') &&
        document.getElementById('3').classList.contains('o') &&
        document.getElementById('6').classList.contains('o')) ||
      (document.getElementById('1').classList.contains('o') &&
        document.getElementById('4').classList.contains('o') &&
        document.getElementById('7').classList.contains('o')) ||
      (document.getElementById('2').classList.contains('o') &&
        document.getElementById('5').classList.contains('o') &&
        document.getElementById('8').classList.contains('o'))
    );
    
    const acuteAngleFillingO = (
      (document.getElementById('0').classList.contains('o') &&
        document.getElementById('4').classList.contains('o') &&
        document.getElementById('8').classList.contains('o')) ||
      (document.getElementById('2').classList.contains('o') &&
        document.getElementById('4').classList.contains('o') &&
        document.getElementById('6').classList.contains('o'))
    );
    
    return horizontalFillingO || verticalFillingO || acuteAngleFillingO;
}

function checkAllFields() {
    const result = [];
    
    boxes.forEach(box => {
        if(box.classList.contains('x') || box.classList.contains('o')) {
            result.push(box);
        }
    })
    
    if(result.length === 9) return true;
}

function restartGame() {
    boxes.forEach(box => box.classList.remove('x', 'o'));
    currentPlayer = 'x';
}

restart.addEventListener('click', restartGame);

function botMove() {
    let bestMove = minimax(boxes, 'o').index;
    if (bestMove !== undefined) {
        document.getElementById(bestMove).classList.add('o');
        
        if (checkWinX()) {
            setTimeout(() => {
                alert('Победил X!');
                restartGame();
                resultX++;
                scoreX.textContent = resultX;
            }, 0)
        }

        if (checkWinO()) {
            setTimeout(() => {
                alert('Победил O!');
                restartGame();
                resultO++;
                scoreO.textContent = resultO;
            }, 0);
        }

        if (checkAllFields()) {
            setTimeout(() => {
                alert('Ничья!');
                restartGame();
            }, 0);
        }
        
        currentPlayer = 'x';
        canMove = true;
    }
}

function minimax(newBoard, player) {
    let availableSpots = [...newBoard].filter(box => !box.classList.contains('x') && !box.classList.contains('o'));
    
    if (checkWinX()) return { score: -1 };
    if (checkWinO()) return { score: 1 };
    if (availableSpots.length === 0) return { score: 0 };
    
    let moves = [];
    for (let box of availableSpots) {
        let move = { index: box.id };
        box.classList.add(player);
        move.score = player === 'o' ? minimax(newBoard, 'x').score : minimax(newBoard, 'o').score;
        box.classList.remove(player);
        moves.push(move);
    }
    
    return moves.reduce((best, move, i) =>
      (player === 'o' ? move.score > best.score : move.score < best.score) ? move : best, moves[0]);
}