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
    function _parseValue (value, property) {
        if (typeof value === 'string') {
            if (property === 'height') {
                if (value.match(/^auto&/)) {
                    this.element.style.height = 'auto';
                    value = this.element.offsetHeight;
                } else if (value.match(/^initial$/)) {
                    this.element.style.height = 'initial';
                    value = this.element.offsetHeight;
                } else if (value.match(/^\d+.?\d+%$/)) {
                    value = this.element.parentNode.offsetHeight * (parseFloat(value, 10) / 100);
                } else if (value.match(/^\d+.?\d+vw$/)) {
                    value = window.innerWidth * (parseFloat(value, 10) / 100);
                } else if (value.match(/^\d+.?\d+vh$/)) {
                    value = window.innerHeight * (parseFloat(value, 10) / 100);
                } else {
                    value = parseFloat(value, 10);
                }
            } else if (property === 'left') {
                if (typeof value === 'string') {
                    if (value.match(/^auto&/)) {
                        this.element.style.left = 'auto';
                        value = this.element.offsetLeft;
                    } else if (value.match(/^initial$/)) {
                        this.element.style.left = 'initial';
                        value = this.element.offsetLeft;
                    } else if (value.match(/^\d+.?\d+%$/)) {
                        value = this.element.parentNode.offsetWidth * (parseFloat(value, 10) / 100);
                    } else if (value.match(/^\d+.?\d+vw$/)) {
                        value = window.innerWidth * (parseFloat(value, 10) / 100);
                    } else if (value.match(/^\d+.?\d+vh$/)) {
                        value = window.innerHeight * (parseFloat(value, 10) / 100);
                    } else {
                        value = parseFloat(value, 10);
                    }
                }
            } else if (property === 'width') {
                if (value.match(/^auto&/)) {
                    this.element.style.width = 'auto';
                    value = this.element.offsetWidth;
                } else if (value.match(/^initial$/)) {
                    this.element.style.width = 'initial';
                    value = this.element.offsetWidth;
                } else if (value.match(/^\d+.?\d+%$/)) {
                    value = this.element.parentNode.offsetWidth * (parseFloat(value, 10) / 100);
                } else if (value.match(/^\d+.?\d+vw$/)) {
                    value = window.innerWidth * (parseFloat(value, 10) / 100);
                } else if (value.match(/^\d+.?\d+vh$/)) {
                    value = window.innerHeight * (parseFloat(value, 10) / 100);
                } else {
                    value = parseFloat(value, 10);
                }
            }
        }
        if (!Number.isNaN(parseFloat(value, 10))) {
            return value;
        }
    }
    
    //  ANIMATION ENGINE  =========================================================  //
    animation = (function () {
        var state = false,
            lastFT = 0, // Last frame time in ms
            maxFPS = 60, // Maximum frames per second
            delta = 0,
            timestep = 1000 / maxFPS,
            frame = 0, // Frame id from request animation frame,
            FPS = 0,
            FTS = 0, // Frames this second
            lastFPS = 0, // Last frames per second update,
            waiting = [],
            updates = [],
            garbage = [],
            easings = {
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
            
        function _animation(a, b, property) {
            var B = _parseValue(b, property),
                c = {
                values: {
                    current: a,
                    last: undefined,
                    origin: a,
                    target: B,
                    time: 0,
                    vector: B - a
                }
            };
            Object.defineProperties(c, {
                current: {
                    get: function () {
                        return this.values.current;
                    },
                    set: function (value) {
                        if (!Number.isNaN(parseFloat(value, 10))) {
                            this.values.current = value;
                        }
                    }
                },
                distance: {
                    get: function () {
                        return Math.abs(this.values.vector);
                    }
                },
                last: {
                    get: function () {
                        return this.values.last;
                    },
                    set: function (value) {
                        if (!Number.isNaN(parseFloat(value, 10))) {
                            this.values.last = value;
                        }
                    }
                },
                origin: {
                    get: function () {
                        return this.values.origin;
                    }
                },
                target: {
                    get: function () {
                        return this.values.target;
                    }
                },
                time: {
                    get: function () {
                        return this.values.time;
                    },
                    set: function (value) {
                        if (!Number.isNaN(parseFloat(value, 10))) {
                            this.values.time = value;
                        }
                    }
                },
                vector: {
                    get: function () {
                        return this.values.vector;
                    }
                }
            });
            return c;
        }
        function _index (r) {
            var index = -1;
            if (typeof r === 'string') {
                updates.forEach(function (update, i) {
                    if (update.object.id === r) {
                        index = i;
                    }
                });
            }
            return index;
        }
        function _remove (u) {
            updates = updates.filter(function (update) {
                return update.id !== u.id;
            });
        }
        function _update () {
            updates.forEach(function (update) {
                if (!update.finished) {
                    Object.keys(update.animations).forEach(function (animation) {
                        var d = 0,
                            a = update.animations[animation],
                            q = 0;
                        a.time = a.time + timestep;
                        a.last = a.current;
                        q = a.time / update.duration;
                        if (q > 1) {
                            q = 1;
                        }
                        d = update.easing(q);
                        if (a.distance * d >= a.distance) {
                            a.current = a.target;
                            update.finished = true;
                        } else {
                            a.current = a.vector * d + a.origin;
                        }
                    });
                    if (update.finished) {
                        garbage.push(update);
                    }
                }
            });
        }
        function _render (interpolation) {
            updates.forEach(function (update) {
                Object.keys(update.animations).forEach(function (animation) {
                    var a = update.animations[animation];
                    if (update.finished) {
                        update.object[animation] = a.target;
                    } else {
                        update.object[animation] = a.last + (a.current - a.last) * interpolation;
                    }
                });
            });
        }
        function _dispose () {
            garbage.forEach(function (update) {
                if (typeof update.complete === 'function') {
                    update.complete();
                }
                _remove(update);
            });
            garbage.length = 0;
        }
        function _panic () {
            delta = 0;
        }
        function _start () {
            if (!state) {
                frame = window.requestAnimationFrame(function (timestamp) {
                    state = true;
                    _render(1);
                    lastFT = timestamp;
                    lastFPS = timestamp;
                    FTS = 0;
                    frame = window.requestAnimationFrame(_loop);
                });
            }
        }
        function _stop () {
            state = false;
            window.cancelAnimationFrame(frame);
        }
        function _add (object, values, duration, easing, complete) {
            var animations = {};
            if (_index(object.id) > -1) {
                updates.forEach(function (update) {
                    var a = update.animations;
                    if (update.object.id === object.id) {
                        Object.keys(update.animations).forEach(function (animation) {
                            Object.keys(values).forEach(function (value) {
                                if (animation === value) {
                                    delete a[animation];
                                }
                            });
                        });
                        update.animations = a;
                    }
                });
            }
            Object.keys(values).forEach(function (property) {
                animations[property] = _animation(object[property], values[property], property);
            });
            waiting.push({
                animations: animations,
                complete: complete,
                duration: duration,
                easing: easings[easing],
                finished: false,
                id: _getID(0),
                object: object
            });
            if (!state) {
                _start();
            }
        }
        function _loop (ts) {
            var count = 0;
            if (state) {
                if (ts < lastFPS + timestep) {
                    frame = window.requestAnimationFrame(_loop);
                    return;
                }
            }
            delta = delta + (ts - lastFT);
            lastFT = ts;
            if (ts > lastFPS + 1000) {
                FPS = 0.25 * FTS + 0.75 * FPS;
                lastFPS = ts;
                FTS = 0;
            }
            FTS = FTS + 1;
            while (delta >= timestep) {
                if (waiting.length) {
                    updates = updates.concat(waiting);
                    waiting.length = 0;
                }
                _update();
                delta = delta - timestep;
                count = count + 1;
                if (count >= 240) {
                    _panic();
                    break;
                }
            }
            _render(delta / timestep);
            _dispose();
            if (updates.length || waiting.length) {
                frame = window.requestAnimationFrame(_loop);
            } else {
                _stop();
            }
        }
        return {
            add: _add
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
                    height: undefined,
                    left: undefined,
                    width: undefined
                }
            }
            
            //  Define grab property getters and setters
            Object.defineProperties(grab, {
                height: {
                    get: function () {
                        return this.values.height;
                    },
                    set: function (value) {
                        if (typeof value === 'string') {
                            if (value.match(/^auto$/)) {
                                this.element.style.height = 'auto';
                                value = this.element.offsetHeight;
                            } else if (value.match(/^initial$/)) {
                                this.element.style.height = 'initial';
                                value = this.element.offsetHeight;
                            } else if (value.match(/^\d+.?\d+%$/)) {
                                value = this.element.parentNode.offsetHeight * (parseFloat(value, 10) / 100);
                            } else if (value.match(/^\d+.?\d+vw$/)) {
                                value = window.innerWidth * (parseFloat(value, 10) / 100);
                            } else if (value.match(/^\d+.?\d+vh$/)) {
                                value = window.innerHeight * (parseFloat(value, 10) / 100);
                            } else {
                                value = parseFloat(value, 10);
                            }
                        }
                        if (!Number.isNaN(parseFloat(value, 10))) {
                            this.values.height = value;
                            this.element.style.height = value + 'px';
                        }
                    }
                },
                left: {
                    get: function () {
                        return this.values.left;
                    },
                    set: function (value) {
                        if (typeof value === 'string') {
                            if (value.match(/^auto$/)) {
                                this.element.style.left = 'auto';
                                value = this.element.offsetLeft;
                            } else if (value.match(/^initial$/)) {
                                this.element.style.left = 'initial';
                                value = this.element.offsetLeft;
                            } else if (value.match(/^\d+.?\d+%$/)) {
                                value = this.element.parentNode.offsetWidth * (parseFloat(value, 10) / 100);
                            } else if (value.match(/^\d+.?\d+vw$/)) {
                                value = window.innerWidth * (parseFloat(value, 10) / 100);
                            } else if (value.match(/^\d+.?\d+vh$/)) {
                                value = window.innerHeight * (parseFloat(value, 10) / 100);
                            } else {
                                value = parseFloat(value, 10);
                            }
                        }
                        if (!Number.isNaN(parseFloat(value, 10))) {
                            this.values.left = value;
                            this.element.style.left = value + 'px';
                        }
                    }
                },
                width: {
                    get: function () {
                        return this.values.width;
                    },
                    set: function (value) {
                        if (typeof value === 'string') {
                            if (value.match(/^auto$/)) {
                                this.element.style.width = 'auto';
                                value = this.element.offsetWidth;
                            } else if (value.match(/^initial$/)) {
                                this.element.style.width = 'initial';
                                value = this.element.offsetWidth;
                            } else if (value.match(/^\d+.?\d+%$/)) {
                                value = this.element.parentNode.offsetWidth * (parseFloat(value, 10) / 100);
                            } else if (value.match(/^\d+.?\d+vw$/)) {
                                value = window.innerWidth * (parseFloat(value, 10) / 100);
                            } else if (value.match(/^\d+.?\d+vh$/)) {
                                value = window.innerHeight * (parseFloat(value, 10) / 100);
                            } else {
                                value = parseFloat(value, 10);
                            }
                        }
                        if (!Number.isNaN(parseFloat(value, 10))) {
                            this.values.width = value;
                            this.element.style.width = value + 'px';
                        }
                    }
                },
            });
            //  Animate method
            grab.animate = function(values, duration, easing, complete) {
                animation.add(this, values, duration || 1000, easing || 'linear', complete);
            }
            
            //  Get default values of DOM object
            grab.height = _getStyle(grab.element, 'height');
            grab.left = _getStyle(grab.element, 'left');
            grab.width = _getStyle(grab.element, 'width');
            
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