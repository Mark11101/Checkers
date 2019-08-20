
let checkers = {};
let cells    = {};

let drawBoard = () => {

    for (let i = 0; i < 8; i++) {

        const row = document.createElement("div");
        row.id = "row-" + i;

        $('.cells').append(row); // добавляем строку, в которой будут ячейки

        let cellCnt = i * 4 + 1; // инициализируем счетчик ячеек

        for (let j = 0; j < 4; j++) {

            cells[cellCnt] = new Cell(cellCnt, cellCnt, slashDiagonal[cellCnt], backslashDiagonal[cellCnt], "usualColumn",
                                      cellCnt, positions[cellCnt].left, positions[cellCnt].top);

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

            $('#cell-' + cellCnt)/*.text(String(cellCnt))*/.css({
                left: 200 * j + "px",    // смещаем ее относительно соседней
                //color: "white"
            });

            cellCnt++;
        }

        if (i % 2 === 0) { // добавляем отступ четным рядам
            $('#row-' + i).css('marginLeft', 100 + 'px');
        }
    }

    for (let i = 1; i < 25; i++) {

        checkers[i] = new Checker(i, i, slashDiagonal[i], backslashDiagonal[i], "black",
                                  i, positions[i].left, positions[i].top);

        if (i < 13) { // в зависимости от условия добавляем белые или черные шашки

            const firstChecker = document.createElement("div");

            firstChecker.id = checkers[i].id;
            firstChecker.className = 'checker black';

            $('.checkers__firstPlayer').append(firstChecker);      // добавляем шашки

            $('#' + i).css({                                       // и позиционируем их
                left: checkers[i].position.left,
                top:  checkers[i].position.top
            });

            $('#cell-' + i).addClass('hasChecker');

        } else {

            checkers[i].position.left = positions[i + 8].left;
            checkers[i].position.top  = positions[i + 8].top;

            checkers[i].cellNumber      = i + 8;
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
                top:  checkers[i].position.top
            });

            $('#cell-' + (i + 8)).addClass('hasChecker');
        }
    }

    information();
};