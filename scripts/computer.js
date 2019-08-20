let computerMakeMove = () => {

    let calcRandomCheckers = (min, max, num) => {

        let i, arr = [], res = [];

        for (i = min; i <= max; i++ ) {
            arr.push(i);
        }

        for (i = 0; i < num; i++) {
            res.push(arr.splice(Math.floor(Math.random() * (arr.length)), 1)[0]);
        }

        return res;
    };

    let arr = calcRandomCheckers(1, 12, 12);

    for (let j = 0; j < 12; j++) {

        objChecker = document.getElementById('' + arr[j]);

        if ($(objChecker).hasClass('queen') && $(objChecker).css('display') !== 'none') {

            queenMakesMove(arr[j]);

        } else if (!$(objChecker).hasClass('queen') && $(objChecker).css('display') !== 'none') {

            ordinaryCheckerMakesMove(arr[j]);
        }
    }

    // можно было просто перебирать все клетки и вызывать фукцию makeMove(от этой клетки), но тогда, даже с оптимизацией, программа работает очень медленно
    function ordinaryCheckerMakesMove(j) {

        let checkerPosition = checkers[j].cellNumber;
        let checkerRowID    = $('#cell-' + checkerPosition).parent().attr("id").replace(/[^\d]/g, '');

        let opponentCheckerOnLeftCellBottom  = false;
        let opponentCheckerOnRightCellBottom = false;

        let opponentCheckerOnLeftCellTop  = false;
        let opponentCheckerOnRightCellTop = false;

        let leftCellBottom  = 0;
        let rightCellBottom = 0;

        let idLeftCellBottom  = 0;
        let idRightCellBottom = 0;

        let beatenCheckerOnLeftEdgeColumn;
        let beatenCheckerOnRightEdgeColumn;

        let leftCellTop  = 0;
        let rightCellTop = 0;

        let idLeftCellTop  = 0;
        let idRightCellTop = 0;

        let leftBeatingCellBottom  = 0;
        let rightBeatingCellBottom = 0;

        let leftBeatingCellTop  = 0;
        let rightBeatingCellTop = 0;

        let checkerOnEdgeColumn;

        let initializeVariables = (addingNumberForLeftCellBottom, addingNumberForRightCellBottom,
                                   subtractingNumberForLeftCellTop, subtractingNumberForRightCellTop) => {

            if (checkerRowID < 7) {

                leftCellBottom = document.getElementById(`cell-${checkerPosition + addingNumberForLeftCellBottom}`);

                if (checkerPosition !== 28) {
                    rightCellBottom = document.getElementById(`cell-${checkerPosition + addingNumberForRightCellBottom}`);
                } else {
                    rightCellBottom = document.getElementById('cell-28');
                }

                idLeftCellBottom  = leftCellBottom.id.replace(/[^\d]/g, '');
                idRightCellBottom = rightCellBottom.id.replace(/[^\d]/g, '');

                beatenCheckerOnLeftEdgeColumn  = cells[idLeftCellBottom].column   === "edgeColumn";
                beatenCheckerOnRightEdgeColumn = cells[idRightCellBottom].column === "edgeColumn";
            }

            if (checkerRowID >= 2) {

                leftCellTop  = document.getElementById(`cell-${checkerPosition - subtractingNumberForLeftCellTop}`);
                rightCellTop = document.getElementById(`cell-${checkerPosition - subtractingNumberForRightCellTop}`);

                idLeftCellTop  = leftCellTop.id.replace(/[^\d]/g, '');
                idRightCellTop = rightCellTop.id.replace(/[^\d]/g, '');
            }

            leftBeatingCellBottom  = document.getElementById(`cell-${checkerPosition + 7}`);
            rightBeatingCellBottom = document.getElementById(`cell-${checkerPosition + 9}`);

            leftBeatingCellTop  = document.getElementById(`cell-${checkerPosition - 9}`);
            rightBeatingCellTop = document.getElementById(`cell-${checkerPosition - 7}`);

            checkerOnEdgeColumn = cells[checkerPosition].column === "edgeColumn";
        };

        if (checkerRowID % 2 === 0) {

            let arrOfCellNumbers = [4, 5, 4, 3];
            initializeVariables(...arrOfCellNumbers);

            for (let i in checkers) {

                if ($('#' + checkers[i].id).css('display') !== 'none' && checkers[i].color !== 'black') {

                    if (checkers[i].cellNumber === +idLeftCellBottom) {
                        opponentCheckerOnLeftCellBottom = true;
                    }

                    else if (checkers[i].cellNumber === +idLeftCellTop) {
                        opponentCheckerOnLeftCellTop = true;
                    }

                    if (!checkerOnEdgeColumn) {

                        if (checkers[i].cellNumber === +idRightCellBottom) {
                            opponentCheckerOnRightCellBottom = true;
                        }

                        else if (checkers[i].cellNumber === +idRightCellTop) {
                            opponentCheckerOnRightCellTop = true;
                        }
                    }
                }
            }

            if ((opponentCheckerOnLeftCellBottom || opponentCheckerOnLeftCellTop) && !beatenCheckerOnLeftEdgeColumn) {

                if (!$(leftBeatingCellBottom).hasClass('hasChecker') && opponentCheckerOnLeftCellBottom && idLeftCellBottom < 29) {
                    makeMove(leftBeatingCellBottom);
                }

                else if (!$(leftBeatingCellTop).hasClass('hasChecker') && opponentCheckerOnLeftCellTop) {
                    makeMove(leftBeatingCellTop);
                }
            }

            if ((opponentCheckerOnRightCellBottom || opponentCheckerOnRightCellTop) && !beatenCheckerOnRightEdgeColumn) {

                if (!$(rightBeatingCellBottom).hasClass('hasChecker') && opponentCheckerOnRightCellBottom && idRightCellBottom < 29) {
                    makeMove(rightBeatingCellBottom);
                }

                else if (!$(rightBeatingCellTop).hasClass('hasChecker') && opponentCheckerOnRightCellTop) {
                    makeMove(rightBeatingCellTop);
                }

            } else if (!$(leftCellBottom).hasClass('hasChecker')) {
                makeMove(leftCellBottom);

            } else if (!$(rightCellBottom).hasClass('hasChecker') && !checkerOnEdgeColumn) {
                makeMove(rightCellBottom);
            }

        } else if (checkerRowID % 2 !== 0) {

            let arrOfCellNumbers = [3, 4, 5, 4];
            initializeVariables(...arrOfCellNumbers);

            for (let i in checkers) {

                if ($('#' + checkers[i].id).css('display') !== 'none' && checkers[i].color !== 'black') {

                    if (!checkerOnEdgeColumn) {

                        if (checkers[i].cellNumber === +idLeftCellBottom) {
                            opponentCheckerOnLeftCellBottom = true;
                        }

                        else if (checkers[i].cellNumber === +idLeftCellTop) {
                            opponentCheckerOnLeftCellTop = true;
                        }
                    }

                    if (checkers[i].cellNumber === +idRightCellBottom) {
                        opponentCheckerOnRightCellBottom = true;
                    }

                    else if (checkers[i].cellNumber === +idRightCellTop) {
                        opponentCheckerOnRightCellTop = true;
                    }
                }
            }

            if ((opponentCheckerOnLeftCellBottom || opponentCheckerOnLeftCellTop) && !checkerOnEdgeColumn && !beatenCheckerOnLeftEdgeColumn) {

                if (!$(leftBeatingCellBottom).hasClass('hasChecker') && opponentCheckerOnLeftCellBottom) {
                    makeMove(leftBeatingCellBottom);
                }

                else if (!$(leftBeatingCellTop).hasClass('hasChecker') && opponentCheckerOnLeftCellTop) {
                    makeMove(leftBeatingCellTop);
                }
            }

            if ((opponentCheckerOnRightCellBottom || opponentCheckerOnRightCellTop) && !beatenCheckerOnRightEdgeColumn) {

                if (!$(rightBeatingCellBottom).hasClass('hasChecker') && opponentCheckerOnRightCellBottom) {
                    makeMove(rightBeatingCellBottom);
                }

                else if (!$(rightBeatingCellTop).hasClass('hasChecker') && opponentCheckerOnRightCellTop) {
                    makeMove(rightBeatingCellTop);
                }

            } else if (!$(leftCellBottom).hasClass('hasChecker') && !checkerOnEdgeColumn) {
                makeMove(leftCellBottom);

            } else if (!$(rightCellBottom).hasClass('hasChecker')) {
                makeMove(rightCellBottom);
            }
        }
    }

    function queenMakesMove(j) {

        for (let i in cells) {

            let cell = document.getElementById('cell-' + cells[i].id);

            let queenSlashDiagonal       = checkers[j].slashDiagonal;
            let queenBackSlashDiagonal   = checkers[j].backSlashDiagonal;
            let cellSlashDiagonal        = cells[i].slashDiagonal;
            let cellBackSlashDiagonal    = cells[i].backSlashDiagonal;

            let isSlashDiagonal     = +queenSlashDiagonal === +cellSlashDiagonal;
            let isBackSlashDiagonal = +queenBackSlashDiagonal === +cellBackSlashDiagonal;

            let isCorrectDiagonal   = isSlashDiagonal || isBackSlashDiagonal;

            if (!$(cell).hasClass('hasChecker') && isCorrectDiagonal) {

                makeMove(document.getElementById('cell-' + i));
            }
        }
    }
};