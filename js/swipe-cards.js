(function () { 'use strict';

    var SwipeCards = function (el, options) {
        this.el = el;
        this.container = el.querySelector('.swipe-cards__wrap');

        this.options = options;
        console.log(this, parent);
        this.init ();
    };
    SwipeCards.prototype = {
        startPoint: null,
        activeEl: null,
        clear: function () {
            this.startPoint = null;
            this.activeEl = null;
        },
        isActiveElement: function (el) {
            return this.container.firstElementChild.isEqualNode(el);
        },
        init:  function () {
            console.log('init swipe-cards');
            // listen events
            var $items = this.container.querySelectorAll('.swipe-cards__item');
            var itemsArr = Array.prototype.slice.call($items, 0);
            var onMoveStart = this.onMoveStart,
                onMoveUpdate = this.onMoveUpdate;

            function addEventsForItem (item) {
                item.addEventListener('mousedown', this.onMoveStart.bind(this));
                item.addEventListener('mousemove', this.onMoveUpdate.bind(this));
            }
            itemsArr.forEach(addEventsForItem.bind(this));
            document.addEventListener('mouseup', this.onMoveEnd.bind(this));
            this.container.addEventListener('DOMNodeInserted', function (e) {
                addEventsForItem.bind(this)(e.target);
            }.bind(this));
        },
        getOffset: function (e) {
            return {
                x: e.clientX - this.startPoint.x,
                y: e.clientY - this.startPoint.y
            };
        },
        getTransform: function (e) {
            var offset = this.getOffset(e);
            return 'translate3d(' + [offset.x + 'px', offset.y + 'px', 0].join(',') + ')';
        },
        onMoveStart: function (e) {
            console.log('onMoveStart', e);
            if (!this.isActiveElement(e.target)) return;
            console.log('found active el', e.target);
            this.startPoint = {
                x: e.clientX,
                y: e.clientY
            };
            this.activeEl = e.target;
            this.activeEl.classList.add('is-active');
        },
        onMoveEnd: function (e) {
            console.log('onMoveEnd', e);
            if (!this.startPoint) return;

            var offset = this.getOffset(e);
            var containerWidth = this.container.clientWidth;

            this.activeEl.classList.remove('is-active'); // to enable transitions animations
            if (Math.abs(offset.x) > .5 * containerWidth) {
                // delete
                this.activeEl.parentNode.removeChild(this.activeEl);
            } else {
                // revert back
                this.activeEl.style.transform = null;
            }
            this.clear();
        },
        onMoveUpdate: function (e) {
            if (!this.startPoint) return;
            this.activeEl.style.transform = this.activeEl.style.webkitTransform = this.getTransform(e);
            console.log('update');
        }
    };

    var cards = document.querySelector('.swipe-cards');
    var swipeCards = new SwipeCards(cards, null);

    document.querySelector('.btn-add').onclick = function () {
        var newCard = document.createElement('div');
        newCard.classList.add('swipe-cards__item');
        var container = cards.firstElementChild;
        container.insertBefore(newCard, container.firstElementChild);
    };
    document.querySelector('.btn-delete').onclick = function () {
        cards.firstElementChild.removeChild(cards.firstElementChild.firstElementChild);
    }
})();