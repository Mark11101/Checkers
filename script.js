function drawBoard() {
    for (let i = 0; i < 8; i++) {
        const row = document.createElement("div");
        row.id = "row-" + i;

        document.querySelector(".cells").appendChild(row); // добавляем строку, в которой будут ячейки
        document.querySelector("#row-" + i).style.marginTop = 100 * i + "px"; // размещаем строки по рядам

        let cellCnt = i * 4 + 1; // инициализируем счетчик ячеек

        for (let j = 0; j < 4; j++) {
            const cell = document.createElement("div");
            cell.id = "cell-" + cellCnt;
            cell.className = "cell";
            cell.setAttribute('data-cellNumber', cellCnt); // позиция клетки на доске
            cell.setAttribute('data-slash-diagonal', slashDiagonal[cellCnt]); // номер слэш-диагонали
            cell.setAttribute('data-back-slash-diagonal', backslashDiagonal[cellCnt]); // номер бэк-слэш-диагонали

            document.querySelector("#row-" + i).appendChild(cell); // добавляем ячейку
            document.querySelector("#cell-" + cellCnt).style.left = 200 * j + "px"; // смещаем ее относительно соседней

            document.querySelector("#cell-" + cellCnt).textContent = String(cellCnt); // УДАЛИТЬ
            document.querySelector("#cell-" + cellCnt).style.color = "white"; // добавлено для облегчения работы

            cellCnt++;
        }

        if (i % 2 === 0) { // добавляем отступ четным рядам
            document.querySelector("#row-" + i).style.marginLeft = 100 + "px";
        }
    }

    for (let i = 1; i < 13; i++) {
        const checkerFirstPlayer = document.createElement("div");

        checkerFirstPlayer.id = "checker-" + i;
        checkerFirstPlayer.className = "checker black";

        checkerFirstPlayer.setAttribute('data-cellNumber', String(i));
        checkerFirstPlayer.setAttribute('data-slash-diagonal', slashDiagonal[i]);
        checkerFirstPlayer.setAttribute('data-back-slash-diagonal', backslashDiagonal[i]);

        document.querySelector(".checkers__firstPlayer").appendChild(checkerFirstPlayer); // добавляем шашки
        document.querySelector("#checker-" + i).style.left = positions[i].left; // и позиционируем их
        document.querySelector("#checker-" + i).style.top = positions[i].top;

        document.querySelector('#cell-' + i).classList.add('haschecker');

        const checkerSecondPlayer = document.createElement("div"); // то же самое для второго игрока

        checkerSecondPlayer.id = "checker-" + (i + 12);
        checkerSecondPlayer.className = "checker white";

        checkerSecondPlayer.setAttribute('data-cellNumber', String(i + 20));
        checkerSecondPlayer.setAttribute('data-slash-diagonal', slashDiagonal[i + 20]);
        checkerSecondPlayer.setAttribute('data-back-slash-diagonal', backslashDiagonal[i + 20]);

        document.querySelector(".checkers__secondPlayer").appendChild(checkerSecondPlayer);
        document.querySelector("#checker-" + (i + 12)).style.left = positions[i + 20].left;
        document.querySelector("#checker-" + (i + 12)).style.top = positions[i + 20].top;

        document.querySelector('#cell-' + (i + 20)).classList.add('haschecker');
    }
}

drawBoard();

$('.checker').on('click', (checker) => {

    $('.checker').each(() => {                      // Для правильной работы нужно добавить класс selected для выбранной
       $('.checker').removeClass('selected'); // клетки, но перед этим необходимо удалить этот класс у других клеток
    });

    $(checker.currentTarget).addClass('selected');

    $('.cell').on('click', (cell) => {
        let checkerSlashDiagonal = checker.currentTarget.dataset.slashDiagonal;         // номер слэш-диагонали шашки
        let checkerBackSlashDiagonal = checker.currentTarget.dataset.backSlashDiagonal; // номер бэк-слэш-диагонали шашки
        let cellSlashDiagonal = cell.currentTarget.dataset.slashDiagonal;           // номер слэш-диагонали клетки
        let cellBackSlashDiagonal = cell.currentTarget.dataset.backSlashDiagonal;   // номер бэк-слэш-диагонали клетки

        let isSlashDiagonal = checkerSlashDiagonal === cellSlashDiagonal;             // Проверка на то, что игрок нажал
        let isBackSlashDiagonal = checkerBackSlashDiagonal === cellBackSlashDiagonal; // на правильную диагональ

        let cellPosition = cell.currentTarget.dataset.cellnumber;                   // позиция клетки
        let checkerPosition = checker.currentTarget.dataset.cellnumber;                 // позиция шашки

        let threeDifferenceBlack = +cellPosition === +checkerPosition + 3; // Расчет разницы между номером клетки, на которую
        let fourDifferenceBlack = +cellPosition === +checkerPosition + 4;  // хочет сходить игрок, и номером шашки. Это
        let fiveDifferenceBlack = +cellPosition === +checkerPosition + 5;  // необходимо для того, чтобы шашки не вели себя как дамки

        let threeDifferenceWhite = +cellPosition === +checkerPosition - 3; // То же самое для белых шашек
        let fourDifferenceWhite = +cellPosition === +checkerPosition - 4;
        let fiveDifferenceWhite = +cellPosition === +checkerPosition - 5;

        let isBlack = $(checker.currentTarget).hasClass('black'); // Проверка на цвет нужна, чтобы шашки не могли
        let isWhite = $(checker.currentTarget).hasClass('white'); // ходить назад

        let isRegularBlackchecker = (threeDifferenceBlack || fourDifferenceBlack || fiveDifferenceBlack) && isBlack;
        let isRegularWhitechecker = (threeDifferenceWhite || fourDifferenceWhite || fiveDifferenceWhite) && isWhite;

        let isRegularchecker = isRegularBlackchecker || isRegularWhitechecker;

        let isSelected = $(checker.currentTarget).hasClass('selected');
                                                                               // Нужно для того, чтобы шашка не
        let cellHaschecker = $(cell.currentTarget).hasClass('haschecker'); // смогла сходить на занятую клетку

        if (isRegularchecker && (isSlashDiagonal || isBackSlashDiagonal) && isSelected && !cellHaschecker) {
            $(checker.currentTarget).css({        // При соблюдении всех условий шашка смещается на позицию
                left: positions[cellPosition].left,   // выбранной клетки. Позиционирование происходит путем выбора
                top: positions[cellPosition].top,     // позиции нужной клетки из объекта positions
            });

            $(cell.currentTarget).addClass('haschecker');

            let positionOfcheckerOnPreviousCell = checker.currentTarget.dataset.cellnumber;
            $('#cell-' + positionOfcheckerOnPreviousCell).removeClass('haschecker');

            checker.currentTarget.dataset.cellnumber = cellPosition;                 // меняем значения атрибутов клетки
            checker.currentTarget.dataset.slashDiagonal = cellSlashDiagonal;
            checker.currentTarget.dataset.backSlashDiagonal = cellBackSlashDiagonal;
        }

        $(checker.currentTarget).removeClass('selected');
    });
});


