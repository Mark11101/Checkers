
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

    if (objChecker !== undefined) {
        makeMove(cell.currentTarget); // logic.js
    }

});


$('.restart').on('click', () => {
    location.reload();
});

information();
