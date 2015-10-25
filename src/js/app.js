(function () {'use strict';
    // initialize
    var cards = document.querySelector('.swipe-cards');
    new SwipeCards(cards);

    var isTouch = !!('ontouchstart' in window);

    var clickEventName = isTouch ? 'touchend' : 'click';

    function addNewCard () {
        var newCard = document.getElementById('swipe-card-origin').cloneNode(true);
        newCard.id = null;
        var container = cards.firstElementChild;
        container.insertBefore(newCard, container.firstElementChild);
        addListnersForFlip (newCard);
    }

    document.querySelector('.btn-add').addEventListener(clickEventName, function () {
        addNewCard();
    });
    document.querySelector('.btn-delete').addEventListener(clickEventName, function () {
        cards.firstElementChild.removeChild(cards.firstElementChild.firstElementChild);
    });
    function addListnersForFlip (item) {
        item.addEventListener(clickEventName, function () {
            if (!this.classList.contains('is-active')) {
                this.classList.toggle('is-flipped');
            }
        });
    }
    Array.prototype.slice.call(document.querySelectorAll('.flip')).forEach(function(el) {
        addListnersForFlip(el)
    });
    addNewCard()

}());