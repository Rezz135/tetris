
const btnRestart = document.querySelector('.restart');
const gameOverBlock = document.querySelector('.game-over');
const PLAYFIELD_COLUMNS = 10;
const PLAYFIELD_ROWS = 20;
let count = 0;
let combo = 0;
let record = 0;
let dom_count = document.querySelector('.count');
let dom_combo = document.querySelector('.combo');
let dom_record = document.querySelector('.record');
let playfield;
let tetromino;
let isPaused = false, isGameOver = false;
let cells; 

console.log(dom_combo);
const TETROMINO_NAMES = [
    'O',
    'L',
    'J',
    'S',
    'Z',
    'T',
    'I'
];

const TETROMINOES = {
    'O': [
        [1, 1],
        [1, 1]
    ],
    'L': [
        [0, 0, 1],
        [1, 1, 1],
        [0, 0, 0],
    ],
    "J": [
        [0, 0, 1],
        [1, 1, 1],
        [0, 0, 0],
    ],
    S: [
        [0, 1, 1],
        [1, 1, 0],
        [0, 0, 0],
    ],
    Z: [
        [1, 1, 0],
        [0, 1, 1],
        [0, 0, 0],
    ],
    T: [
        [1, 1, 1],
        [0, 1, 0],
        [0, 0, 0],
    ],
    I: [
        [0, 0, 0, 0],
        [1, 1, 1, 1],
        [0, 0, 0, 0],
        [0, 0, 0, 0],
    ]
};

document.addEventListener('keydown', onKeyDown);
btnRestart.addEventListener('click', function () {

    init();
});

init();

function init() {
    gameOverBlock.style.display = 'none';
    isGameOver = false;
    generatePlayfield();
    generateTetromino();
    startLoop();
    cells = document.querySelectorAll('.tetris div');
}

function togglePauseGame() {
    isPaused = !isPaused;

    if (isPaused) {
        stopLoop();
    } else {
        startLoop();
    }
}


function gameOver(){
    stopLoop();
    gameOverBlock.style.display = 'flex';
}
function getRandomElement(array){
    const randomIndex = Math.floor(Math.random() * array.length);
    return array[randomIndex];
}

function convertPositionToIndex(row, column) {
    return row * PLAYFIELD_COLUMNS + column;
}

function generatePlayfield() {

    for (let i = 0; i < (PLAYFIELD_ROWS) * PLAYFIELD_COLUMNS ; i++) {
        const div = document.createElement('div');
        document.querySelector('.tetris').append(div);
    }
    playfield = new Array(PLAYFIELD_ROWS).fill()
        .map(() => new Array(PLAYFIELD_COLUMNS).fill(0))
    //console.log(playfield);
}
function generateTetromino() {
    const nameTetro = getRandomElement(TETROMINO_NAMES);
    const matrixTetro = TETROMINOES[nameTetro];

    const rowTetro = -2;

    const columnTetro = Math.floor(PLAYFIELD_COLUMNS / 2 - matrixTetro.length / 2);

    tetromino = {
        name: nameTetro,
        matrix: matrixTetro,
        row: rowTetro,
        column: columnTetro,
        gostrow: this.row, 
        gostcolumn: this.column, 
    }
}
function drawghost(cells) {
    const tetrominoMatrixSize = tetromino.matrix.length;

    for (let row = 0; row < tetrominoMatrixSize; row++) {
        for (let column = 0; column < tetrominoMatrixSize; column++) {
            if (tetromino.matrix[row][column] == 0) { continue; }
            if (tetromino.gostrow + row < 0) continue;

            const cellIndex = convertPositionToIndex(tetromino.gostrow + row, tetromino.gostcolumn + column);

            if (cells[cellIndex] !== undefined) {
                cells[cellIndex].classList.add('ghost');
                
            }
        }
    }
    gosttetro()
}


// generatePlayfield();

// generateTetromino();


// console.log(cells);
// drawTetromino();
function drawPlayField() {
    
    for (let row = 0; row < PLAYFIELD_ROWS; row++) {
        for (let column = 0; column < PLAYFIELD_COLUMNS; column++) {
            // if(playfield[row][column] == 0) { continue };
            const name = playfield[row][column];
            const cellIndex = convertPositionToIndex(row, column);
            cells[cellIndex].classList.add(name);
        }
    }

}
function gosttetro(){
    if (!tetromino) {
        return;
    }

    let gostroW = tetromino.row;
    tetromino.row++;
    for (; !isValid();) {
        tetromino.row++;
    }
    tetromino.gostrow = tetromino.row -1;
    tetromino.gostcolumn = tetromino.column;
    tetromino.row = gostroW;
    
}

function drawTetromino() {
    const name = tetromino.name;
    const tetrominoMatrixSize = tetromino.matrix.length;

    for (let row = 0; row < tetrominoMatrixSize; row++) {
        for (let column = 0; column < tetrominoMatrixSize; column++) {
            if (tetromino.matrix[row][column] == 0) { continue; }

            const cellIndex = convertPositionToIndex(tetromino.row + row, tetromino.column + column);

            if (cells[cellIndex]) {
                cells[cellIndex].classList.add(name);
            }
        }
    }
}
// let array = [
//     [1,2,3],
//     [4,5,6],
//     [7,8,9],
// ]


function draw() {

    cells.forEach(function (cell) { cell.removeAttribute('class') });

    drawPlayField();
    drawTetromino();
    drawghost(cells);


}

function placeTetromino() {
    const matrixSize = tetromino.matrix.length;
    for (let row = 0; row < matrixSize; row++) {
        for (let column = 0; column < matrixSize; column++) {
            if (!tetromino.matrix[row][column]) continue;
            if(isOutsideTopBoard(row)){ 
                isGameOver = true;
                return;
            }
            playfield[tetromino.row + row][tetromino.column + column] = tetromino.name;
        }
    }
    console.log(42343);
    const filledRows = findFilledRows();
    //console.log(filledRows);
    removeFillRows(filledRows);
    generateTetromino();
}
function isOutsideTopBoard(row){
    return tetromino.row + row < 0;
}
function moveDown(){
    moveTetrominoDown();
    draw();
    stopLoop();
    startLoop();
    if(isGameOver){
        gameOver();
    }
}

function removeFillRows(filledRows){
    // filledRows.forEach(row => {
    //     dropRowsAbove(row);
    // })

    for(let i = 0; i < filledRows.length; i++){
        const row = filledRows[i];
        dropRowsAbove(row);
    }
}

function dropRowsAbove(rowDelete){
    for(let row = rowDelete; row > 0; row--){
        playfield[row] = playfield[row - 1];
    }
    console.log('eas');
    playfield[0] = new Array(PLAYFIELD_COLUMNS).fill(0);
}


function findFilledRows(){
    
    const filledRows = [];
    for(let row = 0; row < PLAYFIELD_ROWS; row++){
        let filledColumns = 0;
        for(let column = 0; column < PLAYFIELD_COLUMNS; column++){
            if(playfield[row][column] != 0){
                filledColumns++;
            }
        }
        if(PLAYFIELD_COLUMNS == filledColumns){
            filledRows.push(row);
        }
    }
    console.log(filledRows);
    count += filledRows.length *100;
    let gconbo= filledRows.length;
    console.log(count);
    console.log(combo);
    if (gconbo>=2 ) { 
        combo = filledRows.length;
        gconbo = 0;

    }
    dom_record.textContent = record;
    dom_combo.textContent = combo;
    dom_count.textContent= count;
    return filledRows;
} 


function down () {
    tetromino.row =tetromino.gostrow;
    tetromino.row += 1;
    if (isValid()) {
        tetromino.row -= 1;
        placeTetromino();
    }else{
        gosttetro();
    }
}
function moveDown(){
    moveTetrominoDown();
    draw();
    stopLoop();
    startLoop();
    if(isGameOver){
        gameOver();
    }
}





function rotateTetromino(){
    const oldMatrix = tetromino.matrix;
    const rotatedMatrix = rotateMatrix(tetromino.matrix);
    // array = rotateMatrix(array);
    tetromino.matrix = rotatedMatrix;
    if(isValid()){
        tetromino.matrix = oldMatrix;
    }else{
        gosttetro();
    }
}

function rotateMatrix(matrixTetromino){
    const N = matrixTetromino.length;
    const rotateMatrix = [];
    for(let i = 0; i < N; i++){
        rotateMatrix[i] = [];
        for(let j = 0; j < N; j++){
            rotateMatrix[i][j] = matrixTetromino[N - j - 1][i];
        }
    }
    return rotateMatrix;
};

document.addEventListener('keydown', onKeyDown)

function onKeyDown(event) {

    if(event.key == 'p'){  
        togglePauseGame();
    }
    if(isPaused){
        return;
    }
    //console.log(event);
    switch (event.key) {
        
        case 'ArrowUp':
            rotateTetromino();
            break;
        case 'ArrowDown':
            moveTetrominoDown();
            
            break;
        case 'ArrowLeft':
            moveTetrominoLeft();
            break;
        case 'ArrowRight':
            moveTetrominoRight();
            break;
        case ' ':
            down();
            break;
        case 'w':
            gaimover();
            break;
    }

    draw();
}

function moveTetrominoDown() {
    tetromino.row += 1;
    if (isValid()) {
        tetromino.row -= 1;
        placeTetromino();
    }else{
        gosttetro();
    }
}
function moveTetrominoLeft() {
    tetromino.column -= 1;
    if (isValid()) {
        tetromino.column += 1;
    }else{
        gosttetro();
    }
}
function moveTetrominoRight() {
    tetromino.column += 1;
    if (isValid()) {
        tetromino.column -= 1;
    }else{
        gosttetro();
    }
}
function intervalDOWNtetromino () {
    
    moveTetrominoDown();
    draw();
    
    
}

function startLoop() {
    timeoutId = setTimeout(
        () => (requestId = requestAnimationFrame(moveDown)),
        700
    );
}

function stopLoop(){
    cancelAnimationFrame(requestId);
    timeoutId = clearTimeout(timeoutId);
}

function isValid(){
    
    const matrixSize = tetromino.matrix.length;
    for (let row = 0; row < matrixSize; row++) {
        for (let column = 0; column < matrixSize; column++) {
            if (!tetromino.matrix[row][column]) { continue; }
            // if(tetromino.matrix[row][column] == 0){ continue; }
            if(isOutsideOfGameBoard(row, column)){ return true}
            if(hasCollisions(row, column)){ return true}
        }
    }
    return false;
}

function isOutsideOfGameBoard(row, column) {
    
    return tetromino.column + column < 0 ||
    tetromino.column + column >= PLAYFIELD_COLUMNS ||
    tetromino.row + row >= playfield.length;

}

function hasCollisions(row, column){
    // return playfield[tetromino.row + row][tetromino.column +column]
    return playfield[tetromino.row + row] && playfield[tetromino.row + row][tetromino.column + column];
}

