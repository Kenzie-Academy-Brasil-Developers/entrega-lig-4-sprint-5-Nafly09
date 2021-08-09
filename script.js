const gameContainer = document.getElementById('game-container')

const createTemplate = () => {
    for(let i = 0; i < 7; i++){
        let column = document.createElement('div')
        gameContainer.appendChild(column)

        for(let j = 0; j < 6; j++){
            let line = document.createElement('div')
            line.dataset.columnLine = `${i}-${j}`
            line.classList.add('line')
            column.appendChild(line)
        }
    }
}

createTemplate()

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
        disc.classList.add('disc');

        lastWithoutADisc.appendChild(disc);
    }
    if ( !lastWithoutADisc ) {
        colFilldMsg();
    }
}