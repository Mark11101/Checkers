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
            cells[cellCnt].column = "usualColumn";

            if (i % 2 === 0) {
                if (j === 3) {
                    cells[cellCnt].column = "edgeColumn";
                }
            } else {
                if (j === 0) {
                    cells[cellCnt].column = "edgeColumn";
                }
            }

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
        checkers[i].color = "black";

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

            checkers[i].color = "white";

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

let objChecker; // нажатая шашка (переменная устраняет необходимость использования вложенной функции и появляющуюся рекурсию)

let queenCanMove = true;
let checkerCanMove = true;

$('.checker').on('click', (checker) => {

    $('.checker').each(() => {                // Для правильной работы нужно добавить класс selected для выбранной
       $('.checker').removeClass('selected'); // клетки, но перед этим необходимо удалить этот класс у других клеток
    });

    if ($(checker.currentTarget).parent().hasClass('turn')) {
        $(checker.currentTarget).addClass('selected');
    }

    objChecker = checker.currentTarget;
});

$('.cell').on('click', (cell) => {

    let rightTurn = $(objChecker).parent().hasClass('turn');

    let idChecker = objChecker.id;
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

    let checkerIsSelected = $(objChecker).hasClass('selected');
    let cellHasChecker = $(cell.currentTarget).hasClass('hasChecker');
    let isQueen = $(objChecker).hasClass('queen');

    let checkerCanBeat = isCorrectDiagonal && checkerIsSelected && !cellHasChecker && rightTurn;

    let selectedCellRowID = $(cell.currentTarget).parent().attr("id").replace(/[^\d]/g, ''); // находим номер строки нажатой клетки
    let selectedCheckerRowID = $('#cell-' + checkerPosition).parent().attr("id").replace(/[^\d]/g, ''); // и шашки

    let isMoveBack; // был ли ход назад
    let isNextRow;  // является ли строка нажатой клетки следующей относительно ходимой шашки
    let isAfterNextRow; // является ли строка нажатой клетки следующей относительно битой шашки
    let isAfterBackNextRow; // является ли строка нажатой клетки следующей относительно битой шашки, расположенной позади ходимой

    let beatenCellNum; // номер клетки, на которой стоит битая шашка
    let beatenCheckerID;  // ее ID

    let checkerShouldBeat = false;

    let queenCanBeat = false;
    let queenShouldBeat = false;
    let amountCheckersOnDiagonal = 0;

    for (let i in checkers) {

        let beatenOnSameSlashDiagonal;
        let beatenOnSameBackSlashDiagonal;
        let beatenCheckerPosition;
        let beatenCheckerRowID;
        let beatenOnEdgeColumn;
        let beatenOnEdgeRow;

        if (!isQueen) {

            for (let j in checkers) {

                beatenOnSameSlashDiagonal = (+checkers[i].slashDiagonal === +checkers[j].slashDiagonal); // совпадает ли слэш-диагональ битой и ходимой шашек
                beatenOnSameBackSlashDiagonal = (+checkers[i].backSlashDiagonal === +checkers[j].backSlashDiagonal); // совпадает ли бэк-слэш-диагональ битой и ходимой шашек

                let beatenHasDiffColor = checkers[i].color !== checkers[j].color; // различаются ли цвета битой и ходимой шашек
                let beatenIsDisplayed = $('#' + checkers[i].id).css('display') !== 'none';
                let strikingIsDisplayed = $('#' + checkers[j].id).css('display') !== 'none';

                beatenCheckerPosition = checkers[i].cellNumber; // номер клетки битой шашки
                let strikingCheckerPosition = checkers[j].cellNumber; // номер клетки ходимой шашки

                let strikingCheckerRowID = $('#cell-' + +strikingCheckerPosition).parent().attr("id").replace(/[^\d]/g, ''); // номер строки, ходимой шашки
                beatenCheckerRowID = $('#cell-' + +beatenCheckerPosition).parent().attr("id").replace(/[^\d]/g, ''); // номер строки, битой шашки

                beatenOnEdgeColumn = cells[beatenCheckerPosition].column === "edgeColumn"; // edgeColumn - крайняя колонка доски (если шашка на ней находится, то ее нельзя убить)
                beatenOnEdgeRow = (+beatenCheckerRowID === 0) || (+beatenCheckerRowID === 7); // edgeColumn - крайняя строка доски

                let checkersAreClose = (+strikingCheckerRowID - +beatenCheckerRowID === 1 || +beatenCheckerRowID - +strikingCheckerRowID === 1);
                let checkerHasDiffColor = checkers[i].color !== checkers[idChecker].color;

                if ((beatenHasDiffColor) && (beatenIsDisplayed) && checkersAreClose && checkerHasDiffColor && strikingIsDisplayed) { // если цвет битой шашки и дамки разный и битая отображена
                    checkIfCheckerShouldBeat();
                }

                function checkIfCheckerShouldBeat() {  // функция проверяет есть ли свободные клетки вокруг битой шашки

                    if (beatenOnSameBackSlashDiagonal && !beatenOnEdgeColumn && !beatenOnEdgeRow) {

                        if (beatenCheckerRowID % 2 === 0) {

                            if (checkIfNextCellFreeOfChecker("-", 4) && checkIfNextCellFreeOfChecker("+", 5)) {
                                checkerShouldBeat = true;
                                queenCanMove = false;
                            }

                        } else {

                            if (checkIfNextCellFreeOfChecker("-", 5) && checkIfNextCellFreeOfChecker("+", 4)) {
                                checkerShouldBeat = true;
                                queenCanMove = false;
                            }
                        }

                    } else if (beatenOnSameSlashDiagonal && !beatenOnEdgeColumn && !beatenOnEdgeRow) {

                        if (beatenCheckerRowID % 2 === 0) {

                            if (checkIfNextCellFreeOfChecker("-", 3) && checkIfNextCellFreeOfChecker("+", 4)) {
                                checkerShouldBeat = true;
                                queenCanMove = false;
                            }

                        } else {

                            if (checkIfNextCellFreeOfChecker("-", 4) && checkIfNextCellFreeOfChecker("+", 3)) {
                                checkerShouldBeat = true;
                                queenCanMove = false;
                            }
                        }
                    }

                    function checkIfNextCellFreeOfChecker(operator, cellNumber) {

                        if (!checkIfCellHasChecker(operator, cellNumber) || checkIfQueenNextToBeaten(operator, cellNumber)) {
                            return true;
                        }
                    }

                    function checkIfCellHasChecker(operator, cellNumber) {

                        if ((operator === "-") && ($('#cell-' + (+beatenCheckerPosition - cellNumber)).hasClass('hasChecker'))) {
                            return true;
                        }

                        if ((operator === "+") && ($('#cell-' + (+beatenCheckerPosition + cellNumber)).hasClass('hasChecker'))) {
                            return true;
                        }
                    }

                    function checkIfQueenNextToBeaten(operator, cellNumber) {

                        if ((operator === "-") && (checkers[j].cellNumber === (+beatenCheckerPosition - cellNumber))) {
                            return true;
                        }

                        if ((operator === "+") && (checkers[j].cellNumber === (+beatenCheckerPosition + cellNumber))) {
                            return true;
                        }
                    }
                }
            }
        }

        if (isQueen) {

            beatenOnSameSlashDiagonal = (+checkers[i].slashDiagonal === +checkerSlashDiagonal); // совпадает ли слэш-диагональ битой и ходимой шашек
            beatenOnSameBackSlashDiagonal = (+checkers[i].backSlashDiagonal === +checkerBackSlashDiagonal); // совпадает ли бэк-слэш-диагональ битой и ходимой шашек

            let beatenHasDiffColor = checkers[i].color !== checkers[idChecker].color; // различаются ли цвета битой и ходимой шашек
            let beatenIsDisplayed = $('#' + checkers[i].id).css('display') !== 'none';

            beatenCheckerPosition = checkers[i].cellNumber; // номер клетки битой шашки

            beatenCheckerRowID = $('#cell-' + +beatenCheckerPosition).parent().attr("id").replace(/[^\d]/g, ''); // номер строки, битой шашки

            beatenOnEdgeColumn = cells[beatenCheckerPosition].column === "edgeColumn"; // edgeColumn - крайняя колонка доски (если шашка на ней находится, то ее нельзя убить)
            beatenOnEdgeRow = (+beatenCheckerRowID === 0) || (+beatenCheckerRowID === 7); // edgeColumn - крайняя строка доски

            if ((beatenHasDiffColor) && (beatenIsDisplayed)) { // если цвет битой шашки и дамки разный и битая отображена
                checkIfQueenShouldBeat();
                checkIfQueenCanBeat();
            }

            function checkIfQueenShouldBeat() {  // функция проверяет есть ли свободные клетки вокруг битой шашки

                if (beatenOnSameBackSlashDiagonal && !beatenOnEdgeColumn && !beatenOnEdgeRow) {

                    if (beatenCheckerRowID % 2 === 0) {

                        if (checkIfNextCellFreeOfChecker("-", 4) && checkIfNextCellFreeOfChecker("+", 5)) {
                            queenShouldBeat = true;
                            checkerCanMove = false;
                        }

                    } else {

                        if (checkIfNextCellFreeOfChecker("-", 5) && checkIfNextCellFreeOfChecker("+", 4)) {
                            queenShouldBeat = true;
                            checkerCanMove = false;
                        }
                    }

                } else if (beatenOnSameSlashDiagonal && !beatenOnEdgeColumn && !beatenOnEdgeRow) {

                    if (beatenCheckerRowID % 2 === 0) {

                        if (checkIfNextCellFreeOfChecker("-", 3) && checkIfNextCellFreeOfChecker("+", 4)) {
                            queenShouldBeat = true;
                            checkerCanMove = false;
                        }

                    } else {

                        if (checkIfNextCellFreeOfChecker("-", 4) && checkIfNextCellFreeOfChecker("+", 3)) {
                            queenShouldBeat = true;
                            checkerCanMove = false;
                        }
                    }
                }

                function checkIfNextCellFreeOfChecker(operator, cellNumber) {

                    if (!checkIfCellHasChecker(operator, cellNumber) || checkIfQueenNextToBeaten(operator, cellNumber)) {
                        return true;
                    }
                }

                function checkIfCellHasChecker(operator, cellNumber) {

                    if ((operator === "-") && ($('#cell-' + (+beatenCheckerPosition - cellNumber)).hasClass('hasChecker'))) {
                        return true;
                    }

                    if ((operator === "+") && ($('#cell-' + (+beatenCheckerPosition + cellNumber)).hasClass('hasChecker'))) {
                        return true;
                    }
                }

                function checkIfQueenNextToBeaten(operator, cellNumber) {

                    if ((operator === "-") && (checkers[idChecker].cellNumber === (+beatenCheckerPosition - cellNumber))) {
                        return true;
                    }

                    if ((operator === "+") && (checkers[idChecker].cellNumber === (+beatenCheckerPosition + cellNumber))) {
                        return true;
                    }
                }
            }

            function checkIfQueenCanBeat() {

                if ((isSlashDiagonal && beatenOnSameSlashDiagonal) || (isBackSlashDiagonal && beatenOnSameBackSlashDiagonal)) { // если все фигуры соответсвуют своей диагонали

                    if (checkerPosition > cellPosition) { // если дамка находится выше по доске чем клетка

                        if ((beatenCheckerPosition < checkerPosition) && (beatenCheckerPosition > cellPosition)) { // если битая шашка находится между нажатой клеткой и дамкой

                            queenCanBeat = true;

                            const arrNumbers = [5, 4, 4, 3];
                            calculateBeatenCellNum("+", arrNumbers);

                            amountCheckersOnDiagonal++;
                        }

                    } else if (checkerPosition < cellPosition) {

                        if ((beatenCheckerPosition > checkerPosition) && (beatenCheckerPosition < cellPosition)) {

                            queenCanBeat = true;

                            const arrNumbers = [4, 3, 5, 4];
                            calculateBeatenCellNum("-", arrNumbers);

                            amountCheckersOnDiagonal++;
                        }
                    }
                }
            }

            if (amountCheckersOnDiagonal > 1) {
                queenCanBeat = false;
                queenCanMove = false;
                break;
            }
        }
    }

    if ($(objChecker).hasClass('black') && !isQueen) {

        isMoveBack = checkerPosition > cellPosition;

        isNextRow = (selectedCellRowID - selectedCheckerRowID) === 1;
        isAfterNextRow = (selectedCellRowID - selectedCheckerRowID) === 2;
        isAfterBackNextRow = (selectedCheckerRowID - selectedCellRowID) === 2;

        if (isAfterNextRow) {

            const arrNumbers = [4, 3, 5, 4];
            calculateBeatenCellNum("-", arrNumbers);

        } else {

            const arrNumbers = [5, 4, 4, 3];
            calculateBeatenCellNum("+", arrNumbers);
        }
    }



    else if ($(objChecker).hasClass('white') && !isQueen) {

        isMoveBack = checkerPosition < cellPosition;

        isNextRow = (selectedCheckerRowID - selectedCellRowID) === 1;
        isAfterNextRow = (selectedCheckerRowID - selectedCellRowID) === 2;
        isAfterBackNextRow = (selectedCellRowID - selectedCheckerRowID) === 2;

        if (isAfterNextRow) {

            const arrNumbers = [5, 4, 4, 3];
            calculateBeatenCellNum("+", arrNumbers);

        } else {

            const arrNumbers = [4, 3, 5, 4];
            calculateBeatenCellNum("-", arrNumbers);
        }
    }

    function calculateBeatenCellNum(operator, arrNumbers) {

        if (operator === "+") {
            if (selectedCellRowID % 2 === 0) {

                if (isBackSlashDiagonal) {
                    beatenCellNum = +idCell + arrNumbers[0];
                } else {
                    beatenCellNum = +idCell + arrNumbers[1];
                }

            } else {

                if (isBackSlashDiagonal) {
                    beatenCellNum = +idCell + arrNumbers[2];
                } else {
                    beatenCellNum = +idCell + arrNumbers[3];
                }
            }
        }

        if (operator === "-") {
            if (selectedCellRowID % 2 === 0) {

                if (isBackSlashDiagonal) {
                    beatenCellNum = +idCell - arrNumbers[0];
                } else {
                    beatenCellNum = +idCell - arrNumbers[1];
                }

            } else {

                if (isBackSlashDiagonal) {
                    beatenCellNum = +idCell - arrNumbers[2];
                } else {
                    beatenCellNum = +idCell - arrNumbers[3];
                }
            }
        }
    }

    // ход дамки с взятием шашки соперника
    if (checkerCanBeat && rightTurn && isQueen && queenCanBeat) {
        //alert("1");
        makeBeat();
    }

    // обычный ход дамки
    else if (checkerCanBeat && isQueen && queenCanMove && !queenCanBeat && !queenShouldBeat) {
        //alert("2");
        makeMove();
    }

    // обычный ход
    else if (checkerCanBeat && !isMoveBack && isNextRow && !isQueen && !checkerShouldBeat/* && checkerCanMove*/) {
        //alert("5");
        makeMove();
    }

    // ход назад с взятием шашки соперника
    else if (checkerCanBeat && isAfterBackNextRow && !isQueen) {
        //alert("3");
        makeBeat();
    }

    // ход с взятием шашки соперника
    else if (checkerCanBeat && !isMoveBack && isAfterNextRow && !isQueen) {
        //alert("4");
        makeBeat();
    }


    function makeMove() {

        $(objChecker).css({                      // При соблюдении всех условий шашка смещается на позицию
            left: cells[idCell].position.left,   // выбранной клетки. Позиционирование происходит путем выбора
            top: cells[idCell].position.top,     // позиции нужной клетки из объекта positions
        });

        checkers[idChecker] = {                  // обновляем значения свойств объекта
            id: idChecker,
            cellNumber: cellPosition,
            slashDiagonal: cellSlashDiagonal,
            backSlashDiagonal: cellBackSlashDiagonal,
            "position": {
                number: cellPosition
            },
            color: checkers[idChecker].color
        };

        $(cell.currentTarget).addClass('hasChecker');
        $('#cell-' + checkerPosition).removeClass('hasChecker');

        $('.checkers__firstPlayer').toggleClass('turn');
        $('.checkers__secondPlayer').toggleClass('turn');

        makeQueen();
    }

    function makeBeat() {

        if ($('#cell-' + beatenCellNum).hasClass('hasChecker')) {

            for (let i in checkers) {

                let objectCheckersHasNeededCellNum = checkers[i].cellNumber === beatenCellNum;
                let checkerIsDisplayed = $('#' + checkers[i].id).css('display') !== 'none';
                let beatenCheckerIsNotFriendly = ((checkers[i].id > 12) && (idChecker < 13)) ||  // данная проверка необходима, чтобы шашка не могла перескакивать
                                                 ((checkers[i].id < 13) && (idChecker > 12));                                 // через дружественные

                if (objectCheckersHasNeededCellNum && checkerIsDisplayed && beatenCheckerIsNotFriendly) {

                    beatenCheckerID = checkers[i].id;

                    $('#' + beatenCheckerID).css('display', 'none');
                    $('#cell-' + beatenCellNum).removeClass('hasChecker');

                    makeMove();
                    makeQueen();

                    break;
                }
            }
        }
    }

    function makeQueen() {
        if (((idChecker < 13) && (idCell > 28)) ||
            ((idChecker > 12) && (idCell < 5))) {

            $(objChecker).addClass('queen');

        }
    }

    $(objChecker).removeClass('selected');

    information();
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
            " backSlashDiagonal: " + checkers[i].backSlashDiagonal +
            " color: " + checkers[i].color
        );
    }

    console.log("                       Клетки");

    for (let i in cells) {                          // вывод информации о клетке в консоль
        console.log(
            " id: " + cells[i].id +
            " cellNumber: " + cells[i].cellNumber +
            " position: " + cells[i].position.number +
            " slashDiagonal: " + cells[i].slashDiagonal +
            " backSlashDiagonal: " + cells[i].backSlashDiagonal +
            " column: " + cells[i].column
        );
    }
}