const game = document.getElementById("game-flex")
const gameContainer = document.getElementById('game-container')
let blackScore = 0;
let redScore = 0;
let victoryDiv;
let moveCount = 0;

let dataArray  = [
    [0,0,0,0,0,0,0],
    [0,0,0,0,0,0,0], 
    [0,0,0,0,0,0,0], 
    [0,0,0,0,0,0,0], 
    [0,0,0,0,0,0,0], 
    [0,0,0,0,0,0,0]
]


const createTemplate = () => {
    for(let i = 0; i < 7; i++){
        let column = document.createElement('div')
        gameContainer.appendChild(column)
        column.classList.add('column')

        for(let j = 5; j >= 0; j--){
            let line = document.createElement('div')
            line.dataset.columnLine = `${j}-${i}`
            line.classList.add('line')
            column.appendChild(line)
        }
    }
}

createTemplate()

const firstCells = document.querySelectorAll(".line[data-column-line|='0']");
const columnsArray = [...firstCells].map( cell => cell.parentElement );

let lastColor = 'red';

const getColor = () => {
    const switchColorObj = {
        red: 'black',
        black: 'red'
    };

    const color = lastColor;

    lastColor = switchColorObj[lastColor];

    return color;
}

const genDisc = () => {
    const newDisc = document.createElement('div');

    const discColor = getColor();

    newDisc.dataset.color = discColor;
    newDisc.classList.add('disc');

    return newDisc;
}

const colFilledMsg = (columnNode) => {
    const errorClass = 'filledColumnError'

    columnNode.classList.add(errorClass);

    setTimeout( function () {
        columnNode.classList.remove(errorClass);        
    }, 300 );
}

const setDiscFallBeginning = (disc, cellAddress, column ) => {
    const lineNum = Number(cellAddress.substring(0, 1));
    const colHeight = Number(column.clientHeight);
    const cellSection = colHeight / 6;
    const velocity = colHeight - cellSection;
    const initialDistance = colHeight - (lineNum * cellSection);
    const timeAnimation = initialDistance / velocity;
    disc.style.top = `-${initialDistance}px`;
    disc.style.animationDuration = `${timeAnimation}s`;
}

const colClickhandler = (event) => {
    const column = event.currentTarget;

    const cellNodes = column.childNodes;

    const lastWithoutADisc = [...cellNodes].reverse().find( (cell) => {
        return cell.childElementCount === 0;
    });

    if ( lastWithoutADisc ) {
        const disc = genDisc();
        const cellDataSet = lastWithoutADisc.dataset.columnLine;

        disc.dataset.discAddress = cellDataSet;

        lastWithoutADisc.appendChild(disc);

        setDiscFallBeginning(disc, cellDataSet, column);

        moveCount++
        modifyArray(disc)
        checkVertical(dataArray);
        checkHorizontal(dataArray);
        checkDownLeft(dataArray);
        checkDownRight(dataArray);
        checkDraw(moveCount)
        switchTurns();
    }
    if ( !lastWithoutADisc ) {
        colFilledMsg(column);
    }
}

const modifyArray = (currentAppend) => {
    const positionData = currentAppend.dataset.discAddress; 
    const indexOfHifen = positionData.indexOf('-');
    let positionLine = Number(positionData.slice(0, indexOfHifen))
    let positionColumn = Number(positionData.slice(indexOfHifen + 1))
    if(currentAppend.dataset.color === 'black'){
        dataArray[positionLine][positionColumn] = 'b'
    } else {
        dataArray[positionLine][positionColumn] = 'r'
    }
};



columnsArray.forEach((item) => item.addEventListener("click", colClickhandler));

const show4inARow = (line1, line2, line3, line4, column1, column2, column3, column4) => {
    let first = document.querySelector(`div[data-column-line='${line1}-${column1}']`);
    let second = document.querySelector(`div[data-column-line='${line2}-${column2}']`);
    let third = document.querySelector(`div[data-column-line='${line3}-${column3}']`);
    let fourth = document.querySelector(`div[data-column-line='${line4}-${column4}']`);
    first.firstChild.style.background = 'yellow'
    second.firstChild.style.background = 'yellow'
    third.firstChild.style.background = 'yellow'
    fourth.firstChild.style.background = 'yellow'
}

const checkColorMatch = (disc1Color, disc2Color, disc3Color, disc4Color) => {
    return ((disc1Color !== 0) && (disc1Color === disc2Color) && (disc1Color === disc2Color) && (disc1Color === disc3Color) && (disc1Color === disc4Color))
}

const checkDownRight = (dataBase) => {
    for(let line = 0; line < 3; line++){
        for(let column = 0; column < 4; column++){
            if(checkColorMatch(dataBase[line][column], dataBase[line + 1][column + 1], dataBase[line + 2][column + 2], dataBase[line + 3][column + 3])){
                show4inARow(line, line + 1, line + 2, line + 3,column,column + 1, column + 2, column + 3)
                let showVictory = victoryScreen()

                tranfVictoryCounter()
                
                return showVictory
            }
        }
    }
}

const checkDownLeft = (dataBase) => {
    for(let line = 0; line < 3; line++){
        for(column = 3; column < 7; column++){
            if(checkColorMatch(dataBase[line][column], dataBase[line + 1][column - 1], dataBase[line + 2][column - 2], dataBase[line + 3][column - 3])){
                show4inARow(line, line + 1, line + 2, line + 3,column,column - 1, column - 2, column - 3)
                let showVictory = victoryScreen()

                tranfVictoryCounter()
                
                return showVictory
            }
        }
    }
}

const checkVertical = (dataBase) => {
    for(let line = 0; line < 3; line++){
        for(let column = 0; column < 7; column++){
            if(checkColorMatch(dataBase[line][column], dataBase[line + 1][column], dataBase[line + 2][column], dataBase[line + 3][column])){
                show4inARow(line, line + 1, line + 2, line + 3,column,column, column, column)
                let showVictory = victoryScreen()

                tranfVictoryCounter()
                
                return showVictory
            }
        }
    }
}

const checkHorizontal = (dataBase) => {
    for(let line = 0; line < 6; line++){
        for(let column = 0; column < 4; column++){
            if(checkColorMatch(dataBase[line][column], dataBase[line][column + 1], dataBase[line][column + 2], dataBase[line][column + 3])){
                show4inARow(line, line, line, line,column,column + 1, column + 2, column + 3)
                let showVictory = victoryScreen()

                tranfVictoryCounter()

                return showVictory
            }
        }
    }
}

const checkDraw = (database) => {
    if(database === 42){
        let showVictory = victoryScreen()

        tranfVictoryCounter()

        return showVictory
    }
}

const counter = (appendDraw) => {
    if(lastColor === 'red' && moveCount !== 42){
        blackScore++
        mainScoreUpdate('black');

    } else if(lastColor === 'black' && moveCount !== 42) {
        redScore++
        mainScoreUpdate('red');

    } else{
        appendDraw.innerHTML = '<h1>THATS A DRAW</h1>'
    }
}

const clearBoard = () => {
    const parents = document.querySelectorAll('[data-column-line]')
    for(let i = 0; i < parents.length; i++){
        if(parents[i].hasChildNodes()){
            let discAddress = parents[i].firstChild
            parents[i].removeChild(discAddress)
        }
    }
    if(victoryDiv.children[0] !== 'hidden'){
        victoryDiv.classList.add('hidden')
    }
    columnsArray.forEach((item) => item.addEventListener("click", colClickhandler));
    dataArray = [
            [0,0,0,0,0,0,0],
            [0,0,0,0,0,0,0], 
            [0,0,0,0,0,0,0], 
            [0,0,0,0,0,0,0], 
            [0,0,0,0,0,0,0], 
            [0,0,0,0,0,0,0],
    ]
    moveCount = 0;

    returnVictoryCounter();
}

const resetButton = (appendDiv) => {
    const resetButton = document.createElement('button');
    resetButton.setAttribute('id', 'playAgain');
    resetButton.innerText = 'Play Again?'
    appendDiv.appendChild(resetButton)
    resetButton.addEventListener('click', clearBoard)
}

const countersContainer = (appendDiv) => {
    const countersContainer = document.createElement('div');
    countersContainer.setAttribute('id', 'counterContainer');
    counterDiv(countersContainer);
    appendDiv.appendChild(countersContainer);
}

const counterDiv = (appendDiv) => {
    const DrawDiv = document.createElement('div');
    DrawDiv.classList.add('drawDiv');
    counter(DrawDiv)
    if(moveCount === 42){
        appendDiv.appendChild(DrawDiv);
    }
}

const switchTurns = () => {
    let arrowDiv = document.getElementById('arrowDiv');
    if(lastColor === 'red'){
        arrowDiv.classList.remove('arrowRight');
        arrowDiv.classList.add('arrowLeft');
    } else {
        arrowDiv.classList.remove('arrowLeft');
        arrowDiv.classList.add('arrowRight');
    }
}


const victoryScreen = () => {
    victoryDiv = document.createElement("div");
    victoryDiv.classList.add("victoryScreen");
    countersContainer(victoryDiv);
    resetButton(victoryDiv);
    game.appendChild(victoryDiv);
    victoryDiv.classList.remove("hidden")
    columnsArray.forEach((item) => item.removeEventListener("click", colClickhandler));
}

const crateVictoryCounter = (color) => {
    const newCounter = document.createElement('div');

    newCounter.classList.add('victoryCounter');
    newCounter.innerText = 0;
    newCounter.id = `${color}Counter`;
    
    return newCounter;
}

const mainVictoryCounter = () => {
    const header = document.querySelector('#header');
    
    const mainCounterDiv = document.createElement('div');
    mainCounterDiv.classList.add('mainCounterDiv');
    mainCounterDiv.classList.add('vicCounterInitial');
    
    const blackCounter = crateVictoryCounter('black');
    const redCounter = crateVictoryCounter('red');

    mainCounterDiv.appendChild(redCounter);
    mainCounterDiv.appendChild(blackCounter);
    
    header.appendChild(mainCounterDiv);
}

const mainScoreUpdate = (color) => {
    const counter = document.querySelector(`#${color}Counter`);

    const correspCounter = {
        black: blackScore,
        red: redScore
    };

    const score = correspCounter[color];
    counter.innerText = score;
}

const tranfVictoryCounter = () => {
    const mainCounterDiv = document.querySelector('.mainCounterDiv');
    mainCounterDiv.classList.add('toVictoryScreen');

    const gameFlex = document.querySelector('#game-flex');
    const lastVictoryScreen = gameFlex.lastChild;

    setTimeout ( function () {
        mainCounterDiv.classList.remove('toVictoryScreen');
        mainCounterDiv.classList.add('vicCounterVicScreen');
        lastVictoryScreen.appendChild(mainCounterDiv);
    }, 1000 )
}

const returnVictoryCounter = () => {
    const mainCounterDiv = document.querySelector('.mainCounterDiv');
    mainCounterDiv.classList.add('returnVictoryCounter');
    mainCounterDiv.classList.remove('vicCounterVicScreen');

    const header = document.querySelector('#header');
    header.appendChild(mainCounterDiv);

    setTimeout ( function () {
        mainCounterDiv.classList.remove('returnVictoryCounter');
    }, 1000 )
}

mainVictoryCounter()
