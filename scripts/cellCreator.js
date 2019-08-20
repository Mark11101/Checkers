class Cell {

    constructor(id, cellNumber, slashDiagonal, backSlashDiagonal, column, number, left, top) {

        return {
            id,
            cellNumber,
            slashDiagonal,
            backSlashDiagonal,
            column,
            position: {
                number,
                left,
                top
            }
        }
    }
}