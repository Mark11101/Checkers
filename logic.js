
function makeMove(cell) {

    let rightTurn = $(objChecker).parent().hasClass('turn');

    let idChecker = objChecker.id;
    let idCell    = cell.id.replace(/[^\d]/g, ''); // нужно записать число, т.к. id="cell-1" удаляяем лишние символы

    let checkerSlashDiagonal     = checkers[idChecker].slashDiagonal;         // номер слэш-диагонали шашки
    let checkerBackSlashDiagonal = checkers[idChecker].backSlashDiagonal; // номер бэк-слэш-диагонали шашки
    let cellSlashDiagonal        = cells[idCell].slashDiagonal;                  // номер слэш-диагонали клетки
    let cellBackSlashDiagonal    = cells[idCell].backSlashDiagonal;          // номер бэк-слэш-диагонали клетки

    let isSlashDiagonal     = +checkerSlashDiagonal === +cellSlashDiagonal;             // Проверка на то, что игрок нажал
    let isBackSlashDiagonal = +checkerBackSlashDiagonal === +cellBackSlashDiagonal; // на правильную диагональ

    let isCorrectDiagonal   = isSlashDiagonal || isBackSlashDiagonal;

    let cellPosition        = cells[idCell].cellNumber;          // позиция клетки
    let checkerPosition     = checkers[idChecker].cellNumber; // позиция шашки на клетке

    let checkerIsSelected   = $(objChecker).hasClass('selected');
    let cellHasChecker      = $(cell).hasClass('hasChecker');
    let isQueen             = $(objChecker).hasClass('queen');

    let checkerCanBeat = isCorrectDiagonal && checkerIsSelected && !cellHasChecker && rightTurn;

    let selectedCellRowID    = $(cell).parent().attr("id").replace(/[^\d]/g, ''); // находим номер строки нажатой клетки
    let selectedCheckerRowID = $('#cell-' + checkerPosition).parent().attr("id").replace(/[^\d]/g, ''); // и шашки

    let beatingHappened   = false;

    let checkerShouldBeat = false;
    let queenShouldBeat   = false;
    let queenCanBeat      = false;

    let queenCanMove      = true;
    let checkerCanMove    = true;

    let strikingCheckerID;

    let amountStrikingCheckers = 0;

    function checkIfCheckerShouldBeat() {

        let amountCheckersOnDiagonal = 0; // количество вражеских шашек на одной диагонали с дамкой (нужно, чтобы дамка не перепрыгивала через две и более шашек)

        let beatenOnSameSlashDiagonal;      // битая на одной слэш-диагонали с бьющей
        let beatenOnSameBackSlashDiagonal;  // битая на одной бэк-слэш-диагонали с бьющей
        let beatenHasDiffColor;             // битая отличется по цвету от бьющей
        let beatenIsDisplayed;              // битая отображена
        let strikingIsDisplayed;            // бьющая отображена
        let beatenCheckerPosition;          // номер клетки битой
        let strikingCheckerPosition;        // номер клетки бьющей
        let beatenCheckerRowID;             // строка битой
        let strikingCheckerRowID;           // строка бьющей
        let beatenOnEdgeColumn;             // стоит ли битая шашка на краю доски
        let beatenOnEdgeRow;                // (если шашка на ней находится, то ее нельзя убить)
        let checkersAreClose;               // находится ли шашка на следующей строке
        let strikingHasDiffColor;           // ходимая бьющая шашка отличается по цвету от битой

        for (let i in checkers) {

            function initializeVariables(j) {

                beatenOnSameSlashDiagonal     = (+checkers[i].slashDiagonal === +checkers[j].slashDiagonal);
                beatenOnSameBackSlashDiagonal = (+checkers[i].backSlashDiagonal === +checkers[j].backSlashDiagonal);

                beatenHasDiffColor  = checkers[i].color !== checkers[j].color;
                beatenIsDisplayed   = $('#' + checkers[j].id).css('display') !== 'none';
                strikingIsDisplayed = $('#' + checkers[i].id).css('display') !== 'none';

                beatenCheckerPosition   = checkers[j].cellNumber;
                strikingCheckerPosition = checkers[i].cellNumber;

                if (j === idChecker) {

                    beatenIsDisplayed     = $('#' + checkers[i].id).css('display') !== 'none';
                    beatenCheckerPosition = checkers[i].cellNumber; // номер клетки битой шашки

                }

                strikingCheckerRowID = $('#cell-' + +strikingCheckerPosition).parent().attr("id").replace(/[^\d]/g, '');
                beatenCheckerRowID   = $('#cell-' + +beatenCheckerPosition).parent().attr("id").replace(/[^\d]/g, '');

                beatenOnEdgeColumn   = cells[beatenCheckerPosition].column === "edgeColumn";
                beatenOnEdgeRow      = (+beatenCheckerRowID === 0) || (+beatenCheckerRowID === 7);

                checkersAreClose     = (+strikingCheckerRowID - +beatenCheckerRowID === 1 || +beatenCheckerRowID - +strikingCheckerRowID === 1); // true, если шашки стоят рядом
                strikingHasDiffColor = checkers[j].color !== checkers[idChecker].color; // true, если бьющая отличается по цвету от нажатой
            }

            for (let j in checkers) {

                initializeVariables(j); // 290 строка (инициализация переменных выше)

                if (!$('#' + checkers[i].id).hasClass('queen')) {  // если это обычная шашка

                    if ((beatenHasDiffColor) && (beatenIsDisplayed) && checkersAreClose && strikingHasDiffColor && strikingIsDisplayed) {
                        checkIfOrdinaryCheckerShouldBeat();
                    }

                    function checkIfOrdinaryCheckerShouldBeat() {  // функция проверяет есть ли свободные клетки вокруг битой шашки

                        if (beatenOnSameBackSlashDiagonal && !beatenOnEdgeColumn && !beatenOnEdgeRow) {

                            if (beatenCheckerRowID % 2 === 0) {

                                if (checkIfCanBeat("-", 4) && checkIfCanBeat("+", 5)) {

                                    initialVariablesIfCheckerShouldBeat(); // 140 строка
                                }

                            } else {

                                if (checkIfCanBeat("-", 5) && checkIfCanBeat("+", 4)) {

                                    initialVariablesIfCheckerShouldBeat();
                                }
                            }

                        } else if (beatenOnSameSlashDiagonal && !beatenOnEdgeColumn && !beatenOnEdgeRow) {

                            if (beatenCheckerRowID % 2 === 0) {

                                if (checkIfCanBeat("-", 3) && checkIfCanBeat("+", 4)) {

                                    initialVariablesIfCheckerShouldBeat();
                                }

                            } else {

                                if (checkIfCanBeat("-", 4) && checkIfCanBeat("+", 3)) {

                                    initialVariablesIfCheckerShouldBeat();
                                }
                            }
                        }

                        function checkIfCanBeat(operator, cellNumber) {

                            if (!checkIfCellHasChecker(operator, cellNumber) || checkIfCheckerNextToBeaten(operator, cellNumber)) {
                                return true;
                            }
                        }

                        function checkIfCellHasChecker(operator, cellNumber) { // функция проверяет есть ли рядом с шашкой другие шашки

                            if ((operator === "-") && ($('#cell-' + (+beatenCheckerPosition - cellNumber)).hasClass('hasChecker'))) {
                                return true;
                            }

                            if ((operator === "+") && ($('#cell-' + (+beatenCheckerPosition + cellNumber)).hasClass('hasChecker'))) {
                                return true;
                            }
                        }

                        function checkIfCheckerNextToBeaten(operator, cellNumber) { // функция проверяет находятся ли битая и бьющая рядом

                            if ((operator === "-") && (strikingCheckerPosition === (+beatenCheckerPosition - cellNumber))) {
                                return true;
                            }

                            if ((operator === "+") && (strikingCheckerPosition === (+beatenCheckerPosition + cellNumber))) {
                                return true;
                            }
                        }
                        
                        function initialVariablesIfCheckerShouldBeat() {

                            checkerShouldBeat = true;
                            queenCanMove = false;

                            strikingCheckerID = checkers[i].id;
                            amountStrikingCheckers++;
                        }
                    }

                }

                if ($('#' + checkers[i].id).hasClass('queen')) {

                    let strikingHasSameColor = checkers[i].color === checkers[idChecker].color;

                    if ((beatenHasDiffColor) && (beatenIsDisplayed) && strikingHasSameColor && strikingIsDisplayed) {
                        checkIfQueenShouldBeat();
                    }

                    function checkIfQueenShouldBeat() {

                        if (beatenOnSameBackSlashDiagonal && !beatenOnEdgeColumn && !beatenOnEdgeRow) {

                            if (beatenCheckerRowID % 2 === 0) {

                                if (checkIfCanBeat("-", 4) && checkIfCanBeat("+", 5)) {

                                    initialVariablesIfQueenShouldBeat() // 226 строка
                                }

                            } else {

                                if (checkIfCanBeat("-", 5) && checkIfCanBeat("+", 4)) {

                                    initialVariablesIfQueenShouldBeat()
                                }
                            }

                        } else if (beatenOnSameSlashDiagonal && !beatenOnEdgeColumn && !beatenOnEdgeRow) {

                            if (beatenCheckerRowID % 2 === 0) {

                                if (checkIfCanBeat("-", 3) && checkIfCanBeat("+", 4)) {

                                    initialVariablesIfQueenShouldBeat()
                                }

                            } else {

                                if (checkIfCanBeat("-", 4) && checkIfCanBeat("+", 3)) {

                                    initialVariablesIfQueenShouldBeat();
                                }
                            }
                        }

                        function checkIfCanBeat(operator, cellNumber) {

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

                            if ((operator === "-") && (checkers[i].cellNumber === (+beatenCheckerPosition - cellNumber))) {
                                return true;
                            }

                            if ((operator === "+") && (checkers[i].cellNumber === (+beatenCheckerPosition + cellNumber))) {
                                return true;
                            }
                        }

                        function initialVariablesIfQueenShouldBeat() {

                            queenShouldBeat = true;
                            checkerCanMove = false;

                            strikingCheckerID = checkers[i].id;
                            amountStrikingCheckers++;
                        }
                    }
                }
            }

            if (isQueen) {

                initializeVariables(idChecker);

                if (beatenIsDisplayed) {
                    checkIfQueenCanBeat();
                }

                function checkIfQueenCanBeat() {

                    if ((isSlashDiagonal && beatenOnSameSlashDiagonal) || (isBackSlashDiagonal && beatenOnSameBackSlashDiagonal)) { // если все фигуры соответсвуют своей диагонали

                        if (checkerPosition > cellPosition) { // если дамка находится выше по доске чем клетка

                            if ((beatenCheckerPosition < checkerPosition) && (beatenCheckerPosition > cellPosition)) { // если битая шашка находится между нажатой клеткой и дамкой

                                const arrNumbers = [5, 4, 4, 3];
                                initialVariablesIfQueenCanBeat("+", arrNumbers);
                            }

                        } else if (checkerPosition < cellPosition) {

                            if ((beatenCheckerPosition > checkerPosition) && (beatenCheckerPosition < cellPosition)) {

                                const arrNumbers = [4, 3, 5, 4];
                                initialVariablesIfQueenCanBeat("-", arrNumbers);
                            }
                        }
                    }

                    function initialVariablesIfQueenCanBeat(operator, arrNumbers) {

                        queenCanBeat = true;
                        queenCanMove = true;

                        calculateBeatenCellNum(operator, arrNumbers); // в зависимости от четности строки функция вычислит номер клетки битой шашки

                        amountCheckersOnDiagonal++;

                        if (!beatenHasDiffColor) {
                            queenCanMove = false;
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
    }

    let beatenCellNum; // номер клетки, на которой стоит битая шашка
    let beatenCheckerID;  // ее ID

    let isMoveBack; // был ли ход назад
    let isNextRow;  // является ли строка нажатой клетки следующей относительно ходимой шашки
    let isAfterNextRow; // является ли строка нажатой клетки следующей относительно битой шашки
    let isAfterBackNextRow; // является ли строка нажатой клетки следующей относительно битой шашки, расположенной позади ходимой

    function checkIfCheckerCanBeat() {

        if ($(objChecker).hasClass('black') && !isQueen) { // высчитывается тип хода обычной шашки и номер битой клетки

            isMoveBack = checkerPosition > cellPosition;

            isNextRow = (selectedCellRowID - selectedCheckerRowID)          === 1;
            isAfterNextRow = (selectedCellRowID - selectedCheckerRowID)     === 2;
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

            isNextRow = (selectedCheckerRowID - selectedCellRowID)          === 1;
            isAfterNextRow = (selectedCheckerRowID - selectedCellRowID)     === 2;
            isAfterBackNextRow = (selectedCellRowID - selectedCheckerRowID) === 2;

            if (isAfterNextRow) {

                const arrNumbers = [5, 4, 4, 3];
                calculateBeatenCellNum("+", arrNumbers);

            } else {

                const arrNumbers = [4, 3, 5, 4];
                calculateBeatenCellNum("-", arrNumbers);
            }
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

    checkIfCheckerCanBeat();
    checkIfCheckerShouldBeat();

    // ход дамки с взятием шашки соперника
    if (checkerCanBeat && rightTurn && isQueen && queenCanBeat) {
        makeBeat();
    }

    // обычный ход дамки
    else if (checkerCanBeat && isQueen && queenCanMove && !queenCanBeat && !queenShouldBeat) {
        makeMove();
    }

    // обычный ход
    else if (checkerCanBeat && !isMoveBack && isNextRow && !isQueen && !checkerShouldBeat && checkerCanMove) {
        makeMove();
    }

    // ход назад с взятием шашки соперника
    else if (checkerCanBeat && isAfterBackNextRow && !isQueen) {
        makeBeat();
    }

    // ход с взятием шашки соперника
    else if (checkerCanBeat && !isMoveBack && isAfterNextRow && !isQueen) {
        makeBeat();
    }

    function makeMove() {

        $(objChecker).css({                      // При соблюдении всех условий шашка смещается на позицию
            left: cells[idCell].position.left,   // выбранной клетки. Позиционирование происходит путем выбора
            top:  cells[idCell].position.top,    // позиции нужной клетки из объекта positions
        });

        checkers[idChecker] = {                  // обновляем значения свойств объекта

            id:                idChecker,
            cellNumber:        cellPosition,
            slashDiagonal:     cellSlashDiagonal,
            backSlashDiagonal: cellBackSlashDiagonal,
            color:             checkers[idChecker].color,

            "position": {
                number: cellPosition
            },
        };

        $(cell).addClass('hasChecker');
        $('#cell-' + checkerPosition).removeClass('hasChecker');

        if (beatingHappened) {
            checkIfTurnShouldToggle();

        } else {
            $(objChecker).removeClass('selected');

            $('.checkers__firstPlayer').toggleClass('turn');
            $('.checkers__secondPlayer').toggleClass('turn');
        }

        checkIfCheckerShouldBeQueen();
        checkIfThereIsWinner();
    }

    function makeBeat() {

        if ($('#cell-' + beatenCellNum).hasClass('hasChecker')) {

            for (let i in checkers) {

                let objectCheckersHasNeededCellNum = checkers[i].cellNumber === beatenCellNum;
                let checkerBreaksBeating = $(objChecker).hasClass('cantMove');
                let checkerIsDisplayed = $('#' + checkers[i].id).css('display') !== 'none';

                let beatenCheckerIsNotFriendly = ((checkers[i].id > 12) && (idChecker < 13)) ||  // данная проверка необходима, чтобы шашка не могла перескакивать
                                                 ((checkers[i].id < 13) && (idChecker > 12));    // через дружественные

                if (objectCheckersHasNeededCellNum && checkerIsDisplayed && beatenCheckerIsNotFriendly && !checkerBreaksBeating) {

                    beatenCheckerID = checkers[i].id;

                    $('#' + beatenCheckerID).css('display', 'none');
                    $('#cell-' + beatenCellNum).removeClass('hasChecker');

                    beatingHappened = true;

                    makeMove();

                    break;
                }
            }
        }
    }

    function checkIfTurnShouldToggle() {

        checkerShouldBeat = false;
        queenShouldBeat = false;
        amountStrikingCheckers = 0;

        checkIfCheckerShouldBeat();

        if (!checkerShouldBeat && !queenShouldBeat) {

            $('.checkers__firstPlayer').toggleClass('turn');
            $('.checkers__secondPlayer').toggleClass('turn');

            $(objChecker).removeClass('selected');

            for (let i in checkers) {

                if (checkers[i].id !== objChecker.id) {
                    $('#' + checkers[i].id).removeClass('cantMove');
                }
            }

        } else if ((checkerShouldBeat || queenShouldBeat) && strikingCheckerID !== objChecker.id && amountStrikingCheckers < 2) {

            $('.checkers__firstPlayer').toggleClass('turn');
            $('.checkers__secondPlayer').toggleClass('turn');

            $(objChecker).removeClass('selected');

            for (let i in checkers) {

                if (checkers[i].id !== objChecker.id) {
                    $('#' + checkers[i].id).removeClass('cantMove');
                }
            }
        } else if ((checkerShouldBeat || queenShouldBeat) && strikingCheckerID !== objChecker.id && amountStrikingCheckers > 1) {

            for (let i in checkers) {

                if (checkers[i].id !== objChecker.id) {
                    $('#' + checkers[i].id).addClass('cantMove');
                }
            }
        }
    }

    function checkIfCheckerShouldBeQueen() {

        if (((idChecker < 13) && (idCell > 28)) ||
            ((idChecker > 12) && (idCell < 5))) {

            $(objChecker).addClass('queen');
        }
    }
    
    function checkIfThereIsWinner() {

        (function checkIfOpponentHasZeroCheckers() {

            let cntBlack = 0;
            let cntWhite = 0;

            for (let i in checkers) {

                if ($('#' + checkers[i].id).css('display') === 'none') {

                    if ($('#' + checkers[i].id).hasClass('black')) {
                        cntBlack++;
                    }

                    if ($('#' + checkers[i].id).hasClass('white')) {
                        cntWhite++;
                    }
                }
            }

            if (cntBlack === 12) {
                alert('White won!');
            }

            else if (cntWhite === 12) {
                alert('Black won!');
            }

            else {
                checkIfOpponentCheckerIsDeadlocked();
            }

        }());

        function checkIfOpponentCheckerIsDeadlocked() {

            let checkerHasFreeMove;

            for (let i in checkers) {

                for (let j in cells) {

                    let checkerSlashDiagonal     = checkers[i].slashDiagonal;
                    let checkerBackSlashDiagonal = checkers[i].backSlashDiagonal;
                    let cellSlashDiagonal        = cells[j].slashDiagonal;
                    let cellBackSlashDiagonal    = cells[j].backSlashDiagonal;

                    let isSlashDiagonal     = +checkerSlashDiagonal === +cellSlashDiagonal;
                    let isBackSlashDiagonal = +checkerBackSlashDiagonal === +cellBackSlashDiagonal;

                    let isCorrectDiagonal   = isSlashDiagonal || isBackSlashDiagonal;

                    let isOrdinaryChecker   = !$('#' + checkers[i].id).hasClass('queen');
                    let cellHasChecker      = $('#cell-' + cells[j].id).hasClass('hasChecker');
                    let checkerIsDisplayed  = $('#' + checkers[i].id).css('display') !== 'none';

                    let checkerIsOpponent = checkers[idChecker].color !== checkers[i].color;

                    let checkerRowID = $('#cell-' + +checkers[i].position.number).parent().attr("id").replace(/[^\d]/g, '');
                    let cellRowID    = $('#cell-' + +cells[j].position.number).parent().attr("id").replace(/[^\d]/g, '');

                    let cellIsNextToChecker;

                    if (checkers[i].color === 'white') {
                        cellIsNextToChecker = +checkerRowID - +cellRowID === 1;
                    } else {
                        cellIsNextToChecker = +cellRowID - +checkerRowID === 1;
                    }

                    checkerHasFreeMove = isCorrectDiagonal && !cellHasChecker && checkerIsOpponent &&
                                         cellIsNextToChecker && checkerIsDisplayed && isOrdinaryChecker;

                    if (checkerHasFreeMove) {
                        break;
                    }
                }

                if (checkerHasFreeMove) {
                    break;
                }
            }

            if (!checkerHasFreeMove && !checkerShouldBeat) {

                if ($('.checkers__firstPlayer').hasClass('turn')) {
                    alert("White won!");
                }

                else if ($('.checkers__secondPlayer').hasClass('turn')) {
                    alert("Black won!");
                }
            }
        }
    }

    information();
}