let resultX = 0;
let resultO = 0;
let currentPlayer = 'x';
let canMove = true;
let scoreX = document.getElementById('scoreX');
let scoreO = document.getElementById('scoreO');
const boxes = document.querySelectorAll('.box');
const restart = document.getElementById('btn-restart');
const difficultySelect = document.getElementById('difficulty');

const rows = [
    [0, 1, 2], [3, 4, 5], [6, 7, 8]
];

const cols = [
    [0, 3, 6], [1, 4, 7], [2, 5, 8]
];

const diags = [
    [0, 4, 8], [2, 4, 6]
];

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
        
        else if (checkWinO()) {
            setTimeout(() => {
                alert('Победил O!');
                restartGame();
                resultO++;
                scoreO.textContent = resultO;
            }, 0)
        }
        
        else if(checkAllFields()) {
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

function checkLine(line, player) {
    return line.every(index => document.getElementById(index).classList.contains(player));
}

function checkWinX() {
    return [
        rows.some(line => checkLine(line, 'x')),
        cols.some(line => checkLine(line, 'x')),
        diags.some(line => checkLine(line, 'x'))
    ].some(Boolean);
}

function checkWinO() {
    return [
        rows.some(line => checkLine(line, 'o')),
        cols.some(line => checkLine(line, 'o')),
        diags.some(line => checkLine(line, 'o'))
    ].some(Boolean);
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

        else if (checkWinO()) {
            setTimeout(() => {
                alert('Победил O!');
                restartGame();
                resultO++;
                scoreO.textContent = resultO;
            }, 0);
        }

        else if (checkAllFields()) {
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