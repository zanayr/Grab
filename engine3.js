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
        function _animation(a, b) {
            var c = {
                values: {
                    current: a, // The current value of the animation
                    last: undefined, // The last value of the animation
                    origin: a, // The origin value of the animation
                    target: b, // The target value of the animation
                    time: 0, // The total time passed animating
                    vector: b - a // The distance of the animation, plus direction
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
        
        //  Index should return the index of a passed update, and -1 if the update does
        //  not exist in the updates array
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
        
        //  Remove should remove a passed update from the updates array
        function _remove (u) {
            updates = updates.filter(function (update) {
                return update.id !== u.id;
            });
        }
        
        //  Update should be called every frame and update the animation values
        //  incrementally; and check if the values have reached their targets
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
                        //  Check if the update has spoiled (time is up, but not yet
                        //  reached its target value)
                        q = q > 1 ? 1 : q;
                        d = update.easing(q);
                        //  Check if the update has reached or passed its target
                        if (a.distance * d >= a.distance) {
                            a.current = a.target;
                            update.finished = true;
                        } else {
                            a.current = a.vector * d + a.origin;
                        }
                    });
                    //  Trash all finished updates
                    if (update.finished) {
                        garbage.push(update);
                    }
                }
            });
        }
        
        //  Render should be called every frame and update the DOM for the new updated
        //  values of the updates
        function _render (interpolation) {
            updates.forEach(function (update) {
                Object.keys(update.animations).forEach(function (animation) {
                    var a = update.animations[animation];
                    //  If the update is finished, it should be rendered at the target
                    //  value
                    if (update.finished) {
                        update.object[animation] = a.target;
                    } else {
                        update.object[animation] = a.last + (a.current - a.last) * interpolation;
                    }
                });
            });
        }
        
        //  Dispose should remove updates that have been pushed into the garbage array
        function _dispose () {
            garbage.forEach(function (update) {
                //  If the update has a complete function, fire it now
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
        
        //  Start should start the animation loop with an initial interpolatiion value
        //  of one
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
        
        //  Stop should stop the animation loop and cancel the current animation frame
        function _stop () {
            state = false;
            window.cancelAnimationFrame(frame);
        }
        
        //  Add should add a new animation to the updates array, via the waiting array;
        //  It will also check if there are any duplicate animations in the updates
        //  array, i.e. same object and same property being animated
        function _add (object, values, duration, easing, complete) {
            var animations = {};
            //  Check if the update is alreay in the updates array
            if (_index(object.id) > -1) {
                updates.forEach(function (update) {
                    var a = update.animations;
                    //  Check if the update is animating the same object
                    if (update.object.id === object.id) {
                        Object.keys(update.animations).forEach(function (animation) {
                            Object.keys(values).forEach(function (value) {
                                //  Check if the animation is animating the same
                                //  property
                                if (animation === value) {
                                    //  Delete the property animation if it is true
                                    delete a[animation];
                                }
                            });
                        });
                        update.animations = a;
                    }
                    //  Remove the old complete function from the older update
                    update.complete =  null;
                    //  If there are no more animations in the update, push it to the
                    //  garbage for collection
                    if (!Object.keys(update.animations).length) {
                        garbage.push(update);
                    }
                });
            }
            //  Set the animation properties for the new animation
            Object.keys(values).forEach(function (property) {
                animations[property] = _animation(object[property], values[property]);

            });
            //  Push a new update object to the waiting array for insertion into the
            //  updates array at a convenient time
            waiting.push({
                animations: animations,
                complete: complete,
                duration: duration,
                easing: easings[easing],
                finished: false,
                id: _getID(0),
                object: object
            });
            //  If the loop is not yet looping, start the loop
            if (!state) {
                _start();
            }
        }
        
        //  Loop should loop through all updates, updating values, rendering each
        //  change in values and finally collection garbage; it will check if any
        //  updates exist, if not it will stop itself
        function _loop (ts) {
            var count = 0;
            if (state) {
                //  If the frame timestamp is less than the last FPS plus the step,
                //  break early and request a new animation frame
                if (ts < lastFPS + timestep) {
                    frame = window.requestAnimationFrame(_loop);
                    return;
                }
                //  Delta is the delta plus the difference between the frame timestamp
                //  and the last frame timestamp
                delta = delta + (ts - lastFT);
                lastFT = ts;
                //  Check if the frame timestamp is greater than the last FPS plus one
                //  second, if it is, lower the frame rate
                if (ts > lastFPS + 1000) {
                    FPS = 0.25 * FTS + 0.75 * FPS;
                    lastFPS = ts;
                    FTS = 0;
                }
                //  Count the frame this second
                FTS = FTS + 1;
                //  Loop though all updates while the delta value is greater than the
                //  timestep value.
                while (delta >= timestep) {
                    //  Insert any waiting updates now!
                    if (waiting.length) {
                        updates = updates.concat(waiting);
                        waiting.length = 0;
                    }
                    //  Update values
                    _update();
                    //  Update delta
                    delta = delta - timestep;
                    //  Count ticks
                    count = count + 1;
                    //  If ticks is more than 240, panic and break out of loop
                    if (count >= 240) {
                        _panic();
                        break;
                    }
                }
                //  Render values with the interpolation
                _render(delta / timestep);
                //  Dispose of the garbage array
                _dispose();
                //  Check if there are any updates or if there are any updates waiting
                //  to be inserted into the engine
                if (updates.length || waiting.length) {
                    frame = window.requestAnimationFrame(_loop);
                } else {
                    //  If there are none, stop the engine
                    _stop();
                }
            }
        }
        
        return {
            add: _add
        }
    }()); 
    
    //  ===========================================================================  //
    
    
    //  GRAB    ===================================================================  //
    window.grab = function (selector) {
        //  _create should create and return a grab object
        function _create(dom) {
            //  Define grab object
            var grab = {
                element: dom,
                id: _getID(0),
                values: {
                    display: undefined,
                    height: undefined,
                    left: undefined,
                    opacity: undefined,
                    top: undefined,
                    width: undefined,
                    visibility: undefined,
                    zIndex: undefined
                }
            }
            
            //  Parse values function should take an object or properties and string
            //  values, returning an object of properties and numberic values.
            function _parseValues (values) {
                var v = {};
                Object.keys(values).forEach(function (property) {
                    v[property] = grab.parse(property, values[property]);
                });
                return v;
            }
            
            //  Define grab property getters and setters
            Object.defineProperties(grab, {
                display: {
                    get: function () {
                        return this.values.display;
                    },
                    set: function (value) {
                        if (typeof value === 'string') {
                            this.values.display = value;
                            this.element.style.display = this.values.display;
                        }
                    }
                },
                height: {
                    get: function () {
                        return this.values.height;
                    },
                    set: function (value) {
                        this.values.height = this.parse('height', value);
                        this.element.style.height = this.values.height + 'px';
                    }
                },
                left: {
                    get: function () {
                        return this.values.left;
                    },
                    set: function (value) {
                        this.values.left = this.parse('left', value);
                        this.element.style.left = this.values.left + 'px';
                    }
                },
                opacity: {
                    get: function () {
                        return this.values.opacity;
                    },
                    set: function (value) {
                        var v = this.parse('opacity', value);
                        v = v > 1 ? 1 : v;
                        v = v < 0 ? 0 : v;
                        this.values.opacity = v;
                        this.element.style.opacity = this.values.opacity;
                    }
                },
                top: {
                    get: function () {
                        return this.values.top;
                    },
                    set: function (value) {
                        this.values.top = this.parse('top', value);
                        this.element.style.top = this.values.top + 'px';
                    }
                },
                width: {
                    get: function () {
                        return this.values.width;
                    },
                    set: function (value) {
                        this.values.width = this.parse('width', value);
                        this.element.style.width = this.values.width + 'px';
                    }
                },
                visibility: {
                    get: function () {
                        return this.values.visibility;
                    },
                    set: function (value) {
                        if (typeof value === 'string') {
                            this.values.visibility = value;
                            this.element.style.visibility = this.values.visibility;
                        }
                    }
                },
                zIndex: {
                    get: function () {
                        return this.values.zIndex;
                    },
                    set: function (value) {
                        if (!Number.isNaN(parseInt(value, 10))) {
                            this.values.zIndex = value;
                            this.element.style.zIndex = this.values.zIndex;
                        }
                    }
                },
            });
            
            //  Animate method
            grab.animate = function (values, duration, easing, complete) {
                var v = {};
                Object.keys(values).forEach(function (property) {
                    if (property.match(/^height|left|opacity|top|width$/)) {
                        grab[property] = _getStyle(grab.element, property);
                        v[property] = values[property];
                    }
                });
                animation.add(this, _parseValues(v), duration || 1000, easing || 'linear', complete);
            }
            
            //  The Parse function should take a passed property and value, both
            //  strings, and return a number value.
            grab.parse = function (property, value) {
                if (typeof value === 'string') {
                    if (property.match(/^height|left|top|width$/)) {
                        if (value.match(/^\d*.?\d*px$/)) {
                            value = parseFloat(value, 10);
                        } else if (value.match(/^\d*.?\d*vw$/)) {
                            value = window.innerWidth * (parseFloat(value, 10) / 100);
                        } else if (value.match(/^\d*.?\d*vh$/)) {
                            value = window.innerHeight * (parseFloat(value, 10) / 100);
                        } else if (property.match(/^height|top$/)) {
                            if (value.match(/^\d*.?\d*%$/)) {
                                value = this.element.parentNode.offsetHeight * (parseFloat(value, 10) / 100);
                            } else if (property.match(/^height/)) {
                                if (value.match(/^auto|initial$/)) {
                                    this.element.style.height = value;
                                    value = this.element.offsetHeight;
                                }
                            } else {
                                if (value.match(/^auto|initial$/)) {
                                    this.element.style.top = value;
                                    value = this.element.offsetTop;
                                }
                            }
                        } else if (property.match(/^left|width$/)) {
                            if (value.match(/^\d*.?\d*%$/)) {
                                value = this.element.parentNode.offsetWidth * (parseFloat(value, 10) / 100);
                            } else if (property.match(/^left/)) {
                                if (value.match(/^auto|initial$/)) {
                                    this.element.style.left = value;
                                    value = this.element.offsetLeft;
                                }
                            } else {
                                if (value.match(/^auto|initial$/)) {
                                    this.element.style.width = value;
                                    value = this.element.offsetWidth;
                                }
                            }
                        }
                    } else if (property.match(/^opacity$/)) {
                        if (value.match(/^auto|full|initial/)) {
                            value = 1.0;
                        } else if (value.match(/^none|transparent/)) {
                            value = 0.0;
                        } else if (value.match(/^\d*.?\d*%$/)) {
                            value = (parseFloat(value, 10) / 100);
                        } else if (value.match(/^\d*.?\d*$/)) {
                            value = parseFloat(value, 10);
                        }
                    }
                }
                if (!Number.isNaN(parseFloat(value, 10))) {
                    return value;
                }
            }

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