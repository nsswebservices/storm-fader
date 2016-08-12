(function(root, factory) {
  if (typeof exports === 'object') {
    module.exports = factory();
  } else {
    root.StormFader = factory();
  }
}(this, function() {
	'use strict';
    
    var instances = [],
        defaults = {
            nav: false, //shows controls or not
            auto: true, //autoplay or not
            speed: 5000, //time between slide changes
            blend: true //overlap className changes
        },
        StormFader = {
            init: function() {
                this.throttledNext = function(i) {
                    STORM.UTILS.throttle(this.next.call(this), 260);
                }.bind(this);
                
                this.throttledPrevious = function(i) {
                    STORM.UTILS.throttle(this.previous.call(this), 260);
                }.bind(this);
                
                this.throttledSetHeight = function(i) {
                    STORM.UTILS.throttle(this.setHeight.call(this), 260);
                }.bind(this);
                
                this.fadeOutTimer = !!this.options.blend ? 300 : 0;
                
                this.timer = '';
                this.timeout = '';

                
                this.children = [].slice.call(this.DOMElement.querySelectorAll('.fader-item'));
                this.numChildren = this.children.length;
                this.currentIndex = 0;
                
                this.children[0].classList.add('current');
                
                this.DOMElement.classList.add('fader-loaded');
                
                if(!!this.options.nav) {
                    this.initUI();
                }
                if(!!this.options.auto) {
                    this.timeout = window.setTimeout(this.next.bind(this), this.options.speed);
                }
                window.setTimeout(this.setHeight.bind(this), 120);
                window.addEventListener('resize', this.throttledSetHeight.bind(this), false);

                return this;
            },
            setHeight: function(reset) {
                var max = this.children.reduce(function(prv, next){
                    return +next.offsetHeight > prv ? +next.clientHeight : prv;
                }, 0);
                
                this.DOMElement.style.height = max + 'px';
            },
            initUI: function() {
                var frag = document.createDocumentFragment(),
                    btnNext = document.createElement('button'),
                    btnPrevious = document.createElement('button'),
                    dotHolder = document.createElement('ol'),
                    dotItem = document.createElement('li'),
                    dotHandler = function(i) {
                        return function() {
                            this.change(i);
                        }.bind(this);
                    };
                
                dotItem.classList.add('fader-dot');
                
                btnNext.classList.add('fader-btn fader-btn--next');
                btnPrevious.classlist.add('fader-btn fader-btn--previous');
                
                btnNext.addEventListener('click', this.throttledNext.bind(this), false);
                btnPrevious.addEventListener('click', this.throttledPrevious.bind(this), false);
                
                this.nextButton = frag.appendChild(btnPrevious);
                this.previousButton = frag.appendChild(btnNext);
                
                this.previousButton.innerHTML = ['<svg fill="#000000" height="24" viewBox="0 0 24 24" width="24" xmlns="http://www.w3.org/2000/svg">',
                                    '<path d="M10 6L8.59 7.41 13.17 12l-4.58 4.59L10 18l6-6z"/>',
                                    '<path d="M0 0h24v24H0z" fill="none"/>',
                                    '</svg>'].join('');
                this.nextButton.innerHTML = ['<svg fill="#000000" height="24" viewBox="0 0 24 24" width="24" xmlns="http://www.w3.org/2000/svg">',
                                    '<path d="M15.41 7.41L14 6l-6 6 6 6 1.41-1.41L10.83 12z"/>',
                                    '<path d="M0 0h24v24H0z" fill="none"/>',
                                    '</svg>'].join('');
                
                for (var i = 0; i < this.numChildren; i++) {
                    dotHolder.appendChild(dotItem.cloneNode()).addEventListener('click', dotHandler.call(this, i), false);
                }
                dotHolder.classList.add('fader-dots');
                
                this.dotMenu = [].slice.call(frag.appendChild(dotHolder).children);
                dotHolder.firstElementChild.classList.add('current');
                this.DOMElement.appendChild(frag);
                
                return this;
            },
            next: function() {
                this.change(this.currentIndex + 1 < this.children.length ? this.currentIndex + 1 : 0);
                return this;
            },
            previous: function() {
                this.change(this.currentIndex - 1 < 0  ? this.children.length - 1 : this.currentIndex - 1);
                return this;
            },
            change = function(i) {
                if(!!this.options.auto) {
                    window.clearTimeout(this.timeout);
                }
                var animatingIndex = this.currentIndex;
                this.children[i].classList.add('active');
                this.children[this.currentIndex].classList.remove('active');
                if(!!this.options.nav) {
                    this.dotMenu[this.currentIndex].classList.remove('active');
                    this.dotMenu[this.currentIndex].classList.add('active');
                }
                
                this.children[this.currentIndex].classList.add('animating');
                this.timer = setTimeout(function(){
                    this.children[animatingIndex].classList.remove('animating');
                    this.timer = '';
                }.bind(this), this.fadeOutTimer);
                
                //this.setHeight();
                this.currentIndex = i;
                
                if(!!this.options.auto) {
                    this.timeout = window.setTimeout(this.next.bind(this), this.options.speed);
                }
                
                return this;
            }
        };
    
    function init(sel, opts) {
        var els = [].slice.call(document.querySelectorAll(sel));
        
        if(els.length === 0) {
            console.warn('Fader cannot be initialised, no augmentable elements found');
        }
        
        els.forEach(function(el, i){
            instances[i] = Object.assign(Object.create(StormFader), {
                DOMElement: el,
                settings: Object.assign({}, defaults, opts)
            });
            //add further objects as assign arguments for object composition
            instances[i].init();
        });
        return instances;
    }
    
    function reload(els, opts) {
        destroy();
        init(els, opts);
    }
    
    function destroy() {
        instances = [];  
    }
    
	return {
		init: init,
        reload: reload,
        destroy: destroy
	};
	
 }));