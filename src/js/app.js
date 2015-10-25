(function () {'use strict';
    // initialize
    var cards = document.querySelector('.swipe-cards');
    new SwipeCards(cards);

    var isTouch = !!('ontouchstart' in window);

    document.querySelector('.btn-add').addEventListener(isTouch ? 'touchend' : 'click', function () {
        var newCard = document.createElement('div');
        newCard.classList.add('swipe-cards__item');
        var container = cards.firstElementChild;
        container.insertBefore(newCard, container.firstElementChild);
    });
    document.querySelector('.btn-delete').addEventListener(isTouch ? 'touchend' : 'click', function () {
        cards.firstElementChild.removeChild(cards.firstElementChild.firstElementChild);
    });
}());