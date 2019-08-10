
drawBoard(); //drawerBoard.js

let objChecker; // нажатая шашка (переменная нужна, чтобы устранить появляющуюся рекурсию)

$('.checker').on('click', (checker) => {

    $('.checker').each(() => {                // Для правильной работы нужно добавить класс selected для выбранной
        $('.checker').removeClass('selected'); // клетки, но перед этим необходимо удалить этот класс у других клеток
    });

    if ($(checker.currentTarget).parent().hasClass('turn') && !$(checker.currentTarget).hasClass('cantMove')) {
        $(checker.currentTarget).addClass('selected');
    }

    objChecker = checker.currentTarget;
});


$('.cell').on('click', (cell) => {
    makeMove(cell); // logic.js
});


$('.restart').on('click', () => {
    location.reload();
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