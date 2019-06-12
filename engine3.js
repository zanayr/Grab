/*eslint-env browser*/

(function () {
    "use-strict";
    var animation;
    function _getID (i) {
        return ('xxxxxxxx-xxxx-' + i % 10 + 'xxx-yxxx-xxxxxxxxxxxx').replace(/[xy]/g, function(c) {
            var r = Math.random() * 16 | 0,
                v = c === 'x' ? r : (r & 0x3 | 0x8);
            return v.toString(16);
        });
    }
    //  _getStyle private function should return a property value from a passed DOM
    //  object
    function _getStyle (element, property) {
        return window.getComputedStyle(element, '')[property];
    }
    
    //  ANIMATION ENGINE  =========================================================  //
    animation = (function () {
        var state = false,
            lastFT = 0, // Last frame time in ms
            maxFPS = 60, // Maximum frames per second
            delta = 0,
            timestemp = 1000 / maxFPS,
            frame = 0, // Frame id from request animation frame,
            FPS = 0,
            FTS = 0, // Frames this second
            lastFPS = 0, // Last frames per second update,
            waiting = [],
            updates = [],
            garbage = [],
            easing = {
                linear: function (d) {
                    return d;
                },
                easeInQuad: function (d) {
                    return Math.pow(d, 2);
                },
                easeInCubic: function (d) {
                    return Math.pow(d, 3);
                },
                easeInQuart: function (d) {
                    return Math.pow(d, 4);
                },
                easeInQuint: function (d) {
                    return Math.pow(d, 5);
                },
                easeOutQuad: function (d) {
                    return 1 - Math.pow(1 - d, 2);
                },
                easeOutCubic: function (d) {
                    return 1 - Math.pow(1 - d, 3);
                },
                easeOutQuart: function (d) {
                    return 1 - Math.pow(1 - d, 4);
                },
                easeOutQuint: function (d) {
                    return 1 - Math.pow(1 - d, 5);
                }
            };
            
        function _animation(a, b) {
            var c = {
                values: {
                    current: a,
                    last: undefined,
                    original: a,
                    target: b,
                    time: 0,
                    vector: b - a
                }
            };
            
            Object.defineProperties(c, {
                
            });
        }
    }()); 
    
    //  ===========================================================================  //
    //  GRAB
    window.grab2 = function (selector) {
        //  _create should create and return a grab object
        function _create(dom) {
            //  Define grab object
            var grab = {
                element: dom,
                id: _getID(0),
                values: {
                    left: undefined
                }
            }
            
            //  Define grab property getters and setters
            Object.defineProperties(grab, {
                left: {
                    get: function () {
                        return this.values.left;
                    },
                    set: function (value) {
                        if (typeof value === 'string') {
                            if (value.match(/^-?\d+.?\d*?px$/)) {
                                value = parseFloat(value, 10);
                            }
                        }
                        if (typeof value === 'number' && !Number.isNaN(value)) {
                            this.element.style.left = value + 'px';
                            this.values.left = value;
                        }
                    }
                }
            });
            //  Animate method
            grab.animate = function() {
                //  Do stuff
            }
            
            //  Get default values of DOM object
            grab.left = _getStyle(grab.element, 'left');
            
            //  Return grab object
            return grab;
        }
        
        //  _grabMany should cycle through an array of DOM objects and call _grab for
        //  each one
        function _grabMany (them) {
            return them.map(function (o) {
                return _create(o);
            });
        }
        
        //  _grab should parse a DOM object and return a grab object
        function _grab (it) {
            if (typeof it === 'string') {
                if (it.match(/^<[a-zA-Z]+>$/)) {
                    return _create(document.createElement(it.slice(1, -1).replace(/\s/g, '')));
                } else if (it.match(/^#[a-zA-Z]/)) {
                    return _create(document.getElementById(it.slice(1).replace(/\s/g, '')));
                } else if (it.match(/^\.[a-zA-Z]/)) {
                    return _grabMany(document.getElementsByClassName(it.slice(1).replace(/\s/g, '')));
                } else if (it.search(',' > -1)) {
                    return it.split(',').map(function (o) {
                        return _grab(o);
                    });
                } else {
                    return _create(document.querySelector(it));
                }
            } else if (Array.isArray(it)) {
                return it.map(function (o) {
                    return _grab(o);
                });
            } else {
                return null;
            }
        }
        
        // return a grab object
        return _grab(selector);
    };
}());