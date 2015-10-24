(function () { 'use strict';

    var SwipeCards = function (el) {
        if (!el) return;
        this.container = el.querySelector('.swipe-cards__wrap');
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

            this.isTouch = !!('ontouchstart' in window);

            var events = {
                start: this.isTouch ? 'touchstart' : 'mousedown',
                move: this.isTouch ? 'touchmove' : 'mousemove',
                end: this.isTouch ? 'touchend' : 'mouseup'
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
            e.stopPropagation();
            e.preventDefault();
            this.startPoint = {
                x: point.clientX,
                y: point.clientY
            };
            this.offset = this.getOffset(point);
            this.activeEl = point.target;
            this.activeEl.classList.add('is-active');
        },
        onMoveEnd: function (e) {
            console.log('onMoveEnd', e);
            if (!this.startPoint) return;
            e.stopPropagation();
            e.preventDefault();
            var containerWidth = this.container.clientWidth,
                containerHeight = this.container.clientHeight;

            var activeEl = this.activeEl;
            this.activeEl.classList.remove('is-active'); // to enable transitions animations
            if (Math.abs(this.offset.x) > .4 * containerWidth) {
                // delete
                this.activeEl.classList.add('is-deleted');
                this.activeEl.style.transform = this.activeEl.style.webkitTransform = 'rotate('+(this.offset.x > 1 ? -1 : 1) * 25+'deg) translate3d(' + [(this.offset.x > 1 ? 1 : -1)  * 2 * containerWidth + 'px', -1 * containerHeight + 'px', 0].join(',') +')';
                setTimeout(function (activeEl) {
                    activeEl.parentNode.removeChild(activeEl);
                }, 300, activeEl);

            } else {
                // revert back
                this.activeEl.style.transform = this.activeEl.style.webkitTransform = null;
            }
            this.container.style.transform = null;
            this.clear();
        },
        onMoveUpdate: function (e) {
            if (!this.startPoint) return;
            this.offset = this.getOffset(this.getEventPoint(e));
            //var k = 2 * Math.abs(this.offset.x) / (this.container.clientWidth);
            //k = k > 1 ? 1 : k;
            //var scale  = (1.05 - 1) * k + 1;
            //this.container.style.transform = this.container.style.webkitTransform = 'scale3d('+[scale, scale, 1].join(',')+')';
            this.activeEl.style.transform = this.activeEl.style.webkitTransform = this.getTransformByOffset(this.offset);
            console.log('update');
        }
    };

    window.SwipeCards = SwipeCards;
})();