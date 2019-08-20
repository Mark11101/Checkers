class Checker {

    constructor(id, cellNumber, slashDiagonal, backSlashDiagonal, color, number, left, top) {

        return {
            id,
            cellNumber,
            slashDiagonal,
            backSlashDiagonal,
            color,
            position: {
                number,
                left,
                top
            }
        }
    }
}