let checkers = {};
let cells = {};

(function drawBoard() {

    for (let i = 0; i < 8; i++) {

        const row = document.createElement("div");
        row.id = "row-" + i;

        $('.cells').append(row); // добавляем строку, в которой будут ячейки

        let cellCnt = i * 4 + 1; // инициализируем счетчик ячеек

        for (let j = 0; j < 4; j++) {

            cells[cellCnt] = [];
            cells[cellCnt].position = [];
            cells[cellCnt].push(cellCnt);
            cells[cellCnt].id = cellCnt;
            cells[cellCnt].cellNumber = cellCnt;
            cells[cellCnt].position.number = cellCnt;
            cells[cellCnt].position.left = positions[cellCnt].left;
            cells[cellCnt].position.top = positions[cellCnt].top;
            cells[cellCnt].slashDiagonal = slashDiagonal[cellCnt];
            cells[cellCnt].backSlashDiagonal = backslashDiagonal[cellCnt];

            const cell = document.createElement("div");
            cell.id = "cell-" + cellCnt;
            cell.className = 'cell';

            $('#row-' + i).css('marginTop', 100 * i + 'px').append(cell); // размещаем строки по рядам и добавляем ячейку

            $('#cell-' + cellCnt).text(String(cellCnt)).css({
                left: 200 * j + "px",    // смещаем ее относительно соседней
                color: "white"
            });

            cellCnt++;
        }

        if (i % 2 === 0) { // добавляем отступ четным рядам
            $('#row-' + i).css('marginLeft', 100 + 'px');
        }
    }

    for (let i = 1; i < 25; i++) {

        checkers[i] = [];
        checkers[i].position = [];
        checkers[i].push(i);
        checkers[i].id = i;
        checkers[i].cellNumber = i;
        checkers[i].position.number = i;
        checkers[i].position.left = positions[i].left;
        checkers[i].position.top = positions[i].top;
        checkers[i].slashDiagonal = slashDiagonal[i];
        checkers[i].backSlashDiagonal = backslashDiagonal[i];

        if (i < 13) { // в зависимости от условия добавляем белые или черные шашки

            const firstChecker = document.createElement("div");
            firstChecker.id = checkers[i].id;
            firstChecker.className = 'checker black';

            $('.checkers__firstPlayer').append(firstChecker);      // добавляем шашки
            $('#' + i).css({                                       // и позиционируем их
                left: checkers[i].position.left,
                top: checkers[i].position.top
            });

            $('#cell-' + i).addClass('hasChecker');

        } else {

            checkers[i].position.left = positions[i + 8].left;
            checkers[i].position.top = positions[i + 8].top;

            checkers[i].cellNumber = i + 8;
            checkers[i].position.number = i + 8;

            checkers[i].slashDiagonal++;
            checkers[i].backSlashDiagonal++;

            const secondChecker = document.createElement("div");
            secondChecker.id = checkers[i].id;
            secondChecker.className = 'checker white';

            $('.checkers__secondPlayer').append(secondChecker);
            $('#' + i).css({
                left: checkers[i].position.left,
                top: checkers[i].position.top
            });

            $('#cell-' + (i + 8)).addClass('hasChecker');
        }
    }

    information();

}());

$('.checker').on('click', (checker) => {

    $('.checker').each(() => {                // Для правильной работы нужно добавить класс selected для выбранной
       $('.checker').removeClass('selected'); // клетки, но перед этим необходимо удалить этот класс у других клеток
    });

    if ($(checker.currentTarget).parent().hasClass('turn')) {
        $(checker.currentTarget).addClass('selected');
    }

    $('.cell').on('click', (cell) => {

        //alert("here");

        let canMove = $(checker.currentTarget).parent().hasClass('turn');

        let idChecker = checker.currentTarget.id;
        let idCell = cell.currentTarget.id.replace(/[^\d]/g, ''); // нужно записать число, т.к. id="cell-1" удаляяем лишние символы

        let checkerSlashDiagonal = checkers[idChecker].slashDiagonal;         // номер слэш-диагонали шашки
        let checkerBackSlashDiagonal = checkers[idChecker].backSlashDiagonal; // номер бэк-слэш-диагонали шашки
        let cellSlashDiagonal = cells[idCell].slashDiagonal;                  // номер слэш-диагонали клетки
        let cellBackSlashDiagonal = cells[idCell].backSlashDiagonal;          // номер бэк-слэш-диагонали клетки

        let isSlashDiagonal = +checkerSlashDiagonal === +cellSlashDiagonal;             // Проверка на то, что игрок нажал
        let isBackSlashDiagonal = +checkerBackSlashDiagonal === +cellBackSlashDiagonal; // на правильную диагональ

        let isCorrectDiagonal = isSlashDiagonal || isBackSlashDiagonal;

        let cellPosition = cells[idCell].cellNumber;          // позиция клетки
        let checkerPosition = checkers[idChecker].cellNumber; // позиция шашки на клетке

        let selectedCellRowID = $(cell.currentTarget).parent().attr("id").replace(/[^\d]/g, ''); // находим номер строки нажатой клетки
        let selectedCheckerRowID = $('#cell-' + checkerPosition).parent().attr("id").replace(/[^\d]/g, ''); // и шашки

        let isMoveBack; // был ли ход назад
        let isNextRow;  // является ли строка нажатой клетки следующей относительно шашки
        let isAfterNextRow;

        let beatenCellNum; // номер клетки, на которой стоит битая шашка
        let beatenCheckerID;  // ее ID

        if ($(checker.currentTarget).hasClass('black')) {

            isMoveBack = checkerPosition > cellPosition;

            isNextRow = (selectedCellRowID - selectedCheckerRowID) === 1;
            isAfterNextRow = (selectedCellRowID - selectedCheckerRowID) === 2;

            if (selectedCellRowID % 2 === 0) {

                if (isBackSlashDiagonal) {       // если номер строки нажатой клетки четный и действия происходят на
                    beatenCellNum = idCell - 4;  // бэк-слэш диагонали
                } else {
                    beatenCellNum = idCell - 3;
                }

            } else {

                if (isBackSlashDiagonal) {
                    beatenCellNum = idCell - 5;
                } else {
                    beatenCellNum = idCell - 4;
                }
            }
        }

        if ($(checker.currentTarget).hasClass('white')) {

            isMoveBack = checkerPosition < cellPosition;

            isNextRow = (selectedCheckerRowID - selectedCellRowID) === 1;
            isAfterNextRow = (selectedCheckerRowID - selectedCellRowID) === 2;

            if (selectedCellRowID % 2 === 0) {

                if (isBackSlashDiagonal) {       // если номер строки нажатой клетки четный и действия происходят на
                    beatenCellNum = +idCell + 5;  // бэк-слэш диагонали
                } else {
                    beatenCellNum = +idCell + 4;
                }

            } else {

                if (isSlashDiagonal) {
                    beatenCellNum = +idCell + 3;
                } else {
                    beatenCellNum = +idCell + 4;
                }
            }
        }

        let isSelected = $(checker.currentTarget).hasClass('selected');
                                                                               // Нужно для того, чтобы шашка не
        let cellHasChecker = $(cell.currentTarget).hasClass('hasChecker');     // смогла сходить на занятую клетку

        // ход с взятием шашки соперника
        if (isCorrectDiagonal && isSelected && !cellHasChecker && !isMoveBack && isAfterNextRow && canMove) {

            let ownCheckerBeaten = false;

            if ($('#cell-' + beatenCellNum).hasClass('hasChecker')) {
                for (let i in checkers) {
                    if ((checkers[i].cellNumber === beatenCellNum)) {

                        if (((checkers[i].id > 12) && (idChecker < 13)) || ((checkers[i].id < 13) && (idChecker > 12))) {
                            beatenCheckerID = checkers[i].id;
                        } else {
                            ownCheckerBeaten = true;
                        }

                        break;
                    }
                }

                $('#' + beatenCheckerID).css('display', 'none');
                $('#cell-' + beatenCellNum).removeClass('hasChecker');
            }

            if (!ownCheckerBeaten) {
                makeMove();
            }
        }

        // обычный ход
        if (isCorrectDiagonal && isSelected && !cellHasChecker && !isMoveBack && isNextRow && canMove) {
            makeMove();
        }

        function makeMove() {
            $(checker.currentTarget).css({           // При соблюдении всех условий шашка смещается на позицию
                left: cells[idCell].position.left,   // выбранной клетки. Позиционирование происходит путем выбора
                top: cells[idCell].position.top,     // позиции нужной клетки из объекта positions
            });

            $(cell.currentTarget).addClass('hasChecker');

            $('#cell-' + checkerPosition).removeClass('hasChecker');

            checkers[idChecker] = {                     // обновляем значения свойств объекта
                id: idChecker,
                cellNumber: cellPosition,
                slashDiagonal: cellSlashDiagonal,
                backSlashDiagonal: cellBackSlashDiagonal,
                "position": {
                    number: cellPosition
                }
            };

            $('.checkers__firstPlayer').toggleClass('turn');
            $('.checkers__secondPlayer').toggleClass('turn');
        }

        $(checker.currentTarget).removeClass('selected');

        information();

        return;
    });
});

function information() {

    console.log("--------------------------------------------------------------------------------------------------");
    console.log("                              Шашки");

    for (let i in checkers) {                       // вывод информации о шашке в консоль
        console.log(
            " id: " + checkers[i].id +
            " cellNumber: " + checkers[i].cellNumber +
            " position: " + checkers[i].position.number +
            " slashDiagonal: " + checkers[i].slashDiagonal +
            " backSlashDiagonal: " + checkers[i].backSlashDiagonal
        );
    }

    console.log("                       Клетки");

    for (let i in cells) {                          // вывод информации о клетке в консоль
        console.log(
            " id: " + cells[i].id +
            " cellNumber: " + cells[i].cellNumber +
            " position: " + cells[i].position.number +
            " slashDiagonal: " + cells[i].slashDiagonal +
            " backSlashDiagonal: " + cells[i].backSlashDiagonal
        );
    }
}


