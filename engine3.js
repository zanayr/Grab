/*eslint-env browser*/
/*eslint no-console: ["error", { allow: ["log", "warn", "error"] }] */

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
    
    //  _isObject should check whether a passed parameter is an object literal or not
    //  Thanks to Rick[1]
    function _isObject(o) {
        var test  = o,
            checking = true,
            response;
        //  First check if the parameter is not a type of object or null, return false
        //  if true; else loop through the objects proptotypes recursively; checking
        //  each if they are the base prototype, when that is found break out of the
        //  loop and check if the prototype of the passed object is indeed this basal
        //  object type, return the result
        if (typeof o !== 'object' || o === null) {
            return false;
        } else {
            return (function () {
                while (checking) {
                    if (Object.getPrototypeOf(test = Object.getPrototypeOf(test)) === null) {
                        checking = false; // This is for jslint only, there wont be a need to toggle the condition if we break out adventually on every case...
                        break;
                    }
                }
                return Object.getPrototypeOf(o) === test;
            }());
        }
    }
    
    function _handleError (error, uid, origin) {
        try {
            switch (error) {
                case 99:
                    throw {
                        code: error,
                        message:     'Error in uid: ' + uid + ' origin: ' + origin,
                        name:        'Invalid Node'
                    };
                default:
                    throw {
                        code: 0,
                        message:     'error.',
                        name:        'There was an'
                    };
            }
        } catch (e) {
            console.error(e.name, e.message);
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
                    if (update.object.uid === r) {
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
        function _add (object, values) {
            var animations = {},
                i,
                duration,
                easing,
                complete;
            for (i = 2; i < arguments.length; i = i + 1) {
                if (typeof arguments[i] === 'number') {
                duration = arguments[i];
                } else if (typeof arguments[i] === 'string') {
                    easing = arguments[i];
                } else if (typeof arguments[i] === 'function') {
                    complete = arguments[i];
                }
            }
            if (typeof duration === 'undefined') {
                duration = 1000;
            }
            if (typeof easing === 'undefined') {
                easing = 'linear';
            }
            //  Check if the update is alreay in the updates array
            if (_index(object.uid) > -1) {
                updates.forEach(function (update) {
                    var a = update.animations;
                    //  Check if the update is animating the same object
                    if (update.object.uid === object.uid) {
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
                uid: _getID(0),
                values: {}
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
                children: {
                    get: function () {
                        var children = _createCollection(),
                            i;
                        for (i = 0; i < this.element.children.length; i = i + 1) {
                            children.add(this.element.children[i])
                        }
                        return children;
                    }
                },
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
                html: {
                    get: function () {
                        return this.element.innerHTML;
                    },
                    set: function (value) {
                        if (typeof value === 'string') {
                            this.element.innerHTML = value;
                        }
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
            
            //  Misc.  //
            grab.clone = function () {
                var clone = {};
                Object.assign(clone, this);
                clone.uid = _getID(0);
                return clone;
            }
            
            //  Animation Methods  //
            grab.animate = function (values, duration, easing, complete) {
                var v = {};
                Object.keys(values).forEach(function (property) {
                    if (property.match(/^height|left|opacity|top|width$/)) {
                        grab[property] = _getStyle(grab.element, property);
                        v[property] = values[property];
                    }
                });
                animation.add(this, _parseValues(v), duration, easing, complete);
            }
            grab.fadeIn = function (duration, easing, complete) {
                this.animate({opacity: 1.0}, duration, easing, function () {
                    this.display = 'block';
                    if (typeof complete === 'function') {
                        complete();
                    }
                }.bind(this));
            }
            grab.fadeOut = function (duration, easing, complete) {
                this.animate({opacity: 0.0}, duration, easing, function () {
                    this.display = 'none';
                    if (typeof complete === 'function') {
                        complete();
                    }
                }.bind(this));
            }
            grab.hide = function () {
                this.visibility = 'hidden';
                return this;
            }
            grab.show = function () {
                this.visibility = 'visible';
                return this;
            }
            
            //  DOM Methods  //
            grab.after = function (sibling) {
                var fragment;
                if (this.element.parentNode) {
                    if (sibling && typeof sibling === 'string') {
                        fragment = document.createRange().createContextualFragment(sibling).firstChild;
                        this.element.parentNode.insertBefore(fragment, this.element.nextSibling);
                        return _grab(fragment.tagName);
                    } else if (sibling && sibling.uid) {
                        this.element.parentNode.insertBefore(sibling.element, this.element.nextSibling);
                        return sibling;
                    } else {
                        return null;
                    }
                }
            }
            grab.append = function (child) {
                var fragment;
                if (child && typeof child === 'string') {
                    fragment = document.createRange().createContextualFragment(child).firstChild;
                    this.element.appendChild(fragment);
                    return _grab(fragment.tagName)
                } else if (child && child.uid) {
                    this.element.appendChild(child.element);
                    return child;
                } else {
                    return null;
                }
            }
            grab.attr = function (attr, value) {
                if (typeof attr === 'string') {
                    this.element.setAttribute(attr, value);
                } else if (_isObject(attr)) {
                    Object.keys(attr).forEach(function (attribute) {
                        attribute = attribute.replace(/([A-Z])/g, '-$1').trim().toLowerCase();
                        this.element.setAttribute(attribute, attr[attribute]);
                    }.bind(this));
                }
            }
            grab.before = function (sibling) {
                var fragment = document.createRange().createContextualFragment(sibling).firstChild;
                if (this.element.parentNode) {
                    if (sibling && typeof sibling === 'string') {
                        this.element.parentNode.insertBefore(fragment, this.element);
                        return _grab(fragment.tagName);
                    } else if (sibling && sibling.uid) {
                        this.element.parentNode.insertBefore(sibling.element, this.element);
                        return sibling;
                    } else {
                        return null;
                    }
                }
            }
            grab.data = function (data) {
                var attributes = this.element.attributes,
                    a = {};
                if (data) {
                    Object.keys(data).forEach(function (i) {
                        this.element.setAttribute('data-' + i.replace('_', '-'), data[i]);
                    }.bind(this));
                } else {
                    Object.keys(attributes).forEach(function (i) {
                        var attribute = attributes[i].name,
                            arr,
                            j;
                        if (attribute.match(/^data-[a-z-]+$/)) {
                            arr = attribute.replace('data-', '').split('-');
                            for (j = 0; j < arr.length; j = j + 1) {
                                if (j) {
                                    arr[j] = arr[j][0].toUpperCase() + arr[j].slice(1).toLowerCase();
                                }
                            }
                            a[arr.join('')] = attributes[i].value;
                        }
                    });
                    return a;
                }
            }
            grab.exit = function () {
                if (this.element.parentNode) {
                    this.element.parentNode.removeChild(this.element);
                    return this;
                }
            }
            grab.prepend = function (child) {
                var fragment;
                if (child && typeof child === 'string') {
                    fragment = document.createRange().createContextualFragment(child).firstChild;
                    this.element.prepend(fragment);
                    return _grab(fragment.tagName);
                } else if (child && child.uid) {
                    this.element.prepend(child.element);
                    return child;
                } else {
                    return null;
                }
            }
            grab.remove = function (child) {
                if (child.nodeType > 0) {
                    child = _grab(child);
                }
                if (child.hasOwnProperty('uid')) {
                    this.element.removeChild(child.element);
                    return child;
                }
            }
            
            //  CSS Methods  //
            grab.addClass = function (className) {
                this.element.classList.add(className);
            }
            grab.css = function (property, value) {
                if (property && typeof property === 'string') {
                    this.element.style[property] = value;
                } else if (property && _isObject(property)) {
                    Object.keys(property).forEach(function (prop) {
                        this.element.style[prop] = property[prop];
                    }.bind(this));
                }
            }
            grab.id = function (id) {
                this.element.id = id;
            } 
            grab.removeClass = function (className) {
                this.element.classList.remove(className);
            }
            grab.toggleClass = function (className) {
                this.element.classList.toggle(className);
            }
            
            //  Event Handlers  //
            grab.hover = function (enter, leave) {
                if (enter && typeof enter === 'function') {
                    this.element.addEventListener('mouseenter', enter);
                }
                if (leave && typeof leave === 'function') {
                    this.element.addEventListener('mouseleave', leave)
                }
                return this;
            }
            grab.off = function (event, action) {
                this.element.removeEventListener(event, action);
            }
            grab.on = function (event, action) {
                this.element.addEventListener(event, action);
            }
            
            //  Search Methods  //
            grab.find = function (child) {
                if (typeof child === 'string') {
                    child = child.trim().replace(/\s/g, '').toLowerCase();
                    if (child.match(/^[a-z]+$/)) {
                        return _grabMany(document.getElementsByTagName(child));
                    } else if (child.match(/^#[a-z0-9-]/)) {
                        console.log(child);
                        return _create(document.getElementById(child.slice(1)));
                    } else if (child.match(/^\.[a-z0-9-]/)) {
                        return _grabMany(document.getElementsByClassName(child.slice(1)));
                    } else if (child.search(',' > -1)) {
                        return child.split(',').map(function (o) {
                            return _grab(o);
                        });
                    } else {
                        return null;
                    }
                } else if (Array.isArray(child)) {
                    return child.map(function (o) {
                        return _grab(o);
                    });
                } else {
                    return null;
                }
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
        
        function _createCollection () {
            //  Define collection object
            var collection = {
                length: 0
            }
            
            function _args(args) {
                var i,
                    a = [];
                for (i = 0; i < args.length; i = i + 1) {
                    a.push(args[i]);
                }
                return a;
            }
            function _exec(action, args) {
                var i;
                for (i = 0; i < collection.length; i = i + 1) {
                    collection[i][action].apply(collection[i], args);
                }
            }
            
            collection.add = function (item) {
                this[this.length] = item;
                this.length = this.length + 1;
            }
            
            //  Insert before and after
            collection.after = function () {
                _exec('after', _args(arguments));
            }
            collection.before = function (sibling) {
                var i;
                for (i = 0; i < this.length; i = i + 1) {
                    if (sibling.hasOwnProperty('uid')) {
                        collection[i].before(sibling.element.cloneNode(true));
                    } else {
                        collection[i].before(sibling);
                    }
                }
            }
            
            //  Append and prepend
            collection.append = function () {
                 _exec('append', _args(arguments));
            }
            collection.prepend = function () {
                 _exec('prepend', _args(arguments));
            }
            
            //  Fade in and out
            collection.fadeIn = function () {
                 _exec('fadeIn', _args(arguments));
            }
            collection.fadeOut = function () {
                 _exec('fadeOut', _args(arguments));
            }
            
            return collection;
        }
        
        //  _grabMany should cycle through an array of DOM objects and call _grab for
        //  each one
        function _grabMany (them) {
            var i,
                collection = _createCollection();
            for (i = 0; i < them.length; i = i + 1) {
                collection.add(_create(them[i]));
            }
            return collection;
        }
        
        //  _grab should parse a DOM object and return a grab object
        function _grab (it) {
            it = it.trim().replace(/\s/g, '').toLowerCase();
            if (typeof it === 'string') {
                if (it.match(/^[a-z]+$/)) {
                    return _create(document.createElement(it));
                } else if (it.match(/^<[a-z]+>$/)) {
                    return _create(document.createElement(it.slice(1, -1)));
                } else if (it.match(/^#[a-z0-9-]/)) {
                    return _create(document.getElementById(it.slice(1)));
                } else if (it.match(/^\.[a-z0-9-]/)) {
                    return _grabMany(document.getElementsByClassName(it.slice(1)));
                } else if (it.search(',' > -1)) {
                    return it.split(',').map(function (o) {
                        return _grab(o);
                    });
                } else {
                    return _grabMany(document.getElementsByTagName(it));
                }
            }  else if (it.nodeType > 0) {
                return _create(it);
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

/*
 *  SOURCES  ----------------------------------------------------------------------  //
 *  [1]     https://stackoverflow.com/questions/1173549/how-to-determine-if-an-object-is-an-object-literal-in-javascript
 *  [2]     https://davidwalsh.name/convert-html-stings-dom-nodes // David Walsh
 */