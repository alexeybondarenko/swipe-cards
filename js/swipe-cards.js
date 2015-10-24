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
        offset: null,
        clear: function () {
            this.startPoint = null;
            this.activeEl = null;
            this.offset = null;
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

            var isTouchDevice = !!('ontouchstart' in window);

            this.isTouch = isTouchDevice;

            var events = {
                start: isTouchDevice ? 'touchstart' : 'mousedown',
                move: isTouchDevice ? 'touchmove' : 'mousemove',
                end: isTouchDevice ? 'touchend' : 'mouseup'
            };

            function addEventsForItem (item) {
                item.addEventListener(events.start, this.onMoveStart.bind(this));
                item.addEventListener(events.move, this.onMoveUpdate.bind(this));
            }
            itemsArr.forEach(addEventsForItem.bind(this));
            document.addEventListener(events.end, this.onMoveEnd.bind(this));
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
        getTransformByOffset: function (offset) {
            return 'translate3d(' + [offset.x + 'px', offset.y + 'px', 0].join(',') + ')';
        },
        getEventPoint: function (e) {
            return (e.touches ? e.touches[0] : e);
        },
        onMoveStart: function (e) {
            console.log('onMoveStart', e);
            var point = this.getEventPoint(e);
            if (!this.isActiveElement(point.target)) return;
            this.startPoint = {
                x: point.clientX,
                y: point.clientY
            };
            this.activeEl = point.target;
            this.activeEl.classList.add('is-active');
        },
        onMoveEnd: function (e) {
            console.log('onMoveEnd', e);
            if (!this.startPoint) return;
            var offset = this.offset;
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
            this.offset = this.getOffset(this.getEventPoint(e));
            this.activeEl.style.transform = this.activeEl.style.webkitTransform = this.getTransformByOffset(this.offset);
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