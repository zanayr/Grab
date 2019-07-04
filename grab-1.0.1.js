/*eslint-env browser*/
/*global aux: false*/
/*global chroma:false*/
(function () {
    'use strict';
    //  ANIMATION ENGINE  ----------------------------------------------  ANIMATION  //
    var engine = (function () {
        var state = false,
            lastFT = 0, // Last frame time in ms
            maxFPS = 60, // Maximum frames per second
            delta = 0,
            timestep = 1000 / maxFPS,
            frame = 0, // Frame id from requestAnimationFrame
            FPS = 0,
            FTS = 0, // Frames this second
            lastFPS = 0, // Last frame's FPS
            waiting = [], // Update objects waiting to be added to the aupdate array
            updates = [], // Updates that are cycled through during update
            garbage = [], // Complete or discarded updates
            callbacks = {}, // Store of update complete functions
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
        //  The internal animation method returns an object that contains properties
        //  used by the update and render methods
        function _animation(origin, target) {
            var animation = {
                values: {
                    current: origin,
                    last: undefined,
                    origin: origin,
                    target: target,
                    time: 0,
                    vector: target - origin
                }
            };
            Object.defineProperties(animation, {
                current: {
                    get: function () {
                        return this.values.current;
                    },
                    set: function (value) {
                        if (aux.isNumber(value)) {
                            this.values.current = value;
                        }
                    }
                },
                distance: {
                    get: function () {
                        //  Return the absolute value of the vector
                        return Math.abs(this.values.vector);
                    }
                },
                last: {
                    get: function () {
                        return this.values.last;
                    },
                    set: function (value) {
                        if (aux.isNumber(value)) {
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
                        if (aux.isNumber(value)) {
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
            return animation;
        }
        //  The internal remove function removes an update from the updates array
        function _remove (update) {
            updates = updates.filter(function (u) {
                return update.uid !== u.uid;
            });
            return null;
        }
        //  The internal update function cycles through updates, using the update's
        //  properties to calculate the appropriate value; checking if the update has
        //  reached its target, marking it for garbage collection if it has
        function _update () {
            updates.forEach(function (update) {
                var d = 0, // calculated delta
                    animation = update.animation,
                    progress = 0; // decimal representation of time elapsed
                animation.time = animation.time + timestep;
                animation.last = animation.current;
                progress = animation.time / update.duration;
                //  Check if the update has expired, but has yet to reach the target
                progress = progress > 1 ? 1 : progress;
                d = update.easing(progress);
                //  Check if the update has reached or surpassed its target
                if (animation.distance * d >= animation.distance) {
                    animation.current = animation.target;
                    update.collect = true; // Mark the update for garbage collection
                } else {
                    animation.current = animation.vector * d + animation.origin;
                }
                //  Check if the update has been marked for garbage collection
                if (update.collect) {
                    garbage.push(update);
                }
            });
            return null;
        }
        //  The internal render function renders the appropriate updated property to
        //  the grab object using an interpolation value; the grab objects update and
        //  render to the DOM
        function _render (interpolation) {
            updates.forEach(function (update) {
                var animation = update.animation,
                    color = {}; // For color renders
                //  Check if the udpate is a color animation
                if (update.property.match(/[A-Z]*color$/ig)) {
                    if (update.collect) {
                        color[update.channel] = animation.current; // All color updates have a channel property
                        update.object[update.property] = color;
                    } else {
                        color[update.channel] = animation.last + (animation.current - animation.last) * interpolation;
                        update.object[update.channel] = color;
                    }
                } else {
                    if (update.collect) {
                        update.object[update.property] = animation.current;
                        return;
                    } else {
                        update.object[update.property] = animation.last + (animation.current - animation.last) * interpolation;
                    }
                }
            });
            return null;
        }
        //  The internal collect function cycles thought the garbage array, removing
        //  updates from the updates array
        function _collect () {
            garbage.forEach(function (update) {
                var complete = callbacks[update.complete];
                //  Check if the complete exists and if all associated updates have
                //  completed
                if (complete && complete.ready) {
                    complete.callback(); // If the complete is ready, fire the callback
                    delete callbacks[update.complete]; // Then delete the associated callback
                }
                _remove(update); // Remove update from the updates array
            });
            garbage.length = 0; // Remove all updates from the garbage array
            return null;
        }
        //  The internal panic function resets the delta to 0 if the loop cannot break
        //  out of the update loop
        function _panic () {
            delta = 0;
            return null;
        }
        //  The internal start function begins the animation engine loop
        function _start () {
            if (!state) {
                frame = window.requestAnimationFrame(function (timestamp) {
                    state = true;
                    _render(1); // Set the initial render
                    lastFT = timestamp;
                    lastFPS = timestamp; // this doesn't seem right...
                    FTS = 0;
                    frame = window.requestAnimationFrame(_loop);
                });
            }
            return null;
        }
        //  The internal stop function sets the engine state to false and cancels the
        //  current animation frame
        function _stop () {
            state = false;
            window.cancelAnimationFrame(frame);
            return null;
        }
        //  The internal create function builds the update objects that are cycled
        //  through during the update and render functions
        function _create (animation, complete, duration, easing, object, property, id) {
            var update = {
                animation: animation,
                easing: easing,
                object: object,
                values: {
                    complete: complete ? complete : null,
                    duration: duration,
                    collect: false,
                    property: property,
                    uid: id
                }
            };
            Object.defineProperties(update, {
                collect: {
                    get: function () {
                        return this.values.collect;
                    },
                    set: function (value) {
                        //  Check if the update has an associated complete object
                        if (this.complete && !callbacks[this.complete].member[this.uid]) {
                            callbacks[this.complete].member[this.uid] = 1; // Set the member value to 1, indicating that his complete is done
                        }
                        this.values.collect = Boolean(value);
                    }
                },
                complete: {
                    get: function () {
                        return this.values.complete;
                    }
                },
                duration: {
                    get: function () {
                        return this.values.duration;
                    }
                },
                property: {
                    get: function () {
                        return this.values.property;
                    }
                },
                uid: {
                    get: function () {
                        return this.values.uid;
                    }
                }
            });
            
            return update;
        }
        //  The internal duplicates function checks the update array for updates that are
        //  referencing the same object at the time they are added to the waiting array;
        //  these are canceled and removed
        function _duplicates (object, property) {
            var duplicates = [];
            updates.forEach(function (update) {
                //  If the update is attached to the same object and is effecting the same
                //  property, add it to the duplicates array
                if (object.uid === update.object.uid && property === update.property) {
                    duplicates.push(update);
                }
            });
            duplicates.forEach(function (d) {
                _remove(d);
            });
            return null;
        }
        //  The internal complete function creates a complete object and addes it to the
        //  callbacks store, returning its associated uid
        function _complete (callback) {
            var uid = aux.getHashID(0),
                complete = {
                    callback: callback,
                    members: {
                        length: 0
                    },
                    values: {
                        ready: false
                    }
                }
            Object.defineProperties(complete, {
                ready: {
                    get: function () {
                        var m;
                        for (m = 0; m < this.members.length; m = m + 1) {
                            if (!this.members[m]) {
                                return false;
                            }
                        }
                        return true;
                    }
                }
            });
            callbacks[uid] = complete;
            return uid;
        }
        //  The public add function adds a new update to the updates array that is
        //  cycled in every update and render function call
        function add (object, values) {
            var i,
                duration,
                easing,
                complete;
            //  Arguments can be in any order after the values object parameter
            for (i = 2; i < arguments.length; i = i + 1) {
                if (typeof arguments[i] === 'number' && aux.isNumber(arguments[i])) {
                    duration = arguments[i];
                } else if (typeof arguments[i] === 'string') {
                    easing = arguments[i];
                } else if (typeof arguments[i] === 'function') {
                    complete = _complete(arguments[i]);
                }
            }
            // Set default values for duration or easing if they are not passed
            if (typeof duration === 'undefined') {
                duration = 1000;
            }
            if (typeof easing === 'undefined') {
                easing = 'linear';
            }
            //  Check for duplicate updates in the update array
            Object.keys(values).forEach(function (property, j) {
                var update;
                _duplicates(object, property);
                if (property.match(/[A-Z]*color$/ig)) {
                    Object.keys(object[property].forEach(function (channel, l) {
                        update = _create(
                            _animation(object[property][channel], values[property][channel]),
                            complete,
                            duration,
                            easings[easing],
                            object,
                            property,
                            aux.getHashID(l)
                        );
                        update.channel = channel;
                        if (complete) {
                            callbacks[complete].members[update.uid] = 0; // Set initial complete member state
                        }
                        waiting.push(update); // Add each update (channel) to the waiting array
                    }));
                } else {
                    update = _create(
                        _animation(object[property], values[property]),
                        complete,
                        duration,
                        easings[easing],
                        object,
                        property,
                        aux.getHashID(j)
                    );
                    if (complete) {
                        callbacks[complete].members[update.uid] = 0; // Set initial complete member state
                    }
                    waiting.push(update);
                }
            });
            //  If the loop is not yet looping, start the loop
            if (!state) {
                _start();
            }
            return null;
        }
        //  The internal loop fuction loops every frame (sometimes more every frame) to
        //  cycle all updates through the update, render and dispose functions
        function _loop (ts) {
            var ticks = 0; // Number of updates each frame
            if (state) {
                //  If the frame timestamp is less than the last FPS plus the step,
                //  break early and request a new animation frame
                if (ts < lastFPS + timestep) {
                    frame = window.requestAnimationFrame(_loop);
                    return;
                }
                //  Delta is the delta plus the difference between the frame timestamp
                //  and the last frame
                delta = delta + (ts - lastFT);
                lastFT = ts;
                //  Check if the frame timestamp is greater than the lastFPS plus on
                //  second, if it is, lower the frame rate
                if (ts > lastFPS + 1000) {
                    FPS = 0.25 * FTS + 0.75 * FPS;
                    lastFPS = ts;
                    FTS = 0;
                }
                //  Count the frames this second
                FTS = FTS + 1;
                //  Loo though all updates while the delta value is greater than the
                //  timestep value
                while (delta >= timestep) {
                    //  Insert waiting updates now
                    if (waiting.length) {
                        updates = updates.concat(waiting);
                        waiting.length = 0; // Reset waiting array
                    }
                    _update();
                    delta = delta - timestep;
                    ticks = ticks + 1;
                    //  Check if the number of updates this frame has exceeded 240
                    if (ticks >= 240) {
                        _panic(); // Reset delta to 0
                        break; // Break from the loop
                    }
                    _render(delta / timestep);
                    _collect();
                    //  Check if there are any existing or waiting udpates
                    if (updates.length || waiting.length) {
                        frame = window.requestAnimationFrame(_loop);
                    } else {
                        _stop(); // Stop the loop
                    }
                }
            }
//            return null;
        }
        //  Return the public functions
        return {
            add: add
        }
    }());
    //  GRAB  ---------------------------------------------------------------  GRAB  //
    window.grab = function (selector) {
        // The internal create function returns an grab object with special properties,
        //  getters and setters
        function _create (dom) {
            var grab = {
                element: dom,
                uid: aux.getHashID(0),
                values: {}
            }
            //  INTERNAL FUNCTIONS
            //  The internal getStyle function returns a computed style from the dom
            function _getStyle (property) {
                return widnow.getComputedStyle(grab.element, '')[property];
            }
            //  The internal colorString function returns a CSS rgba color string from
            //  a passed color object
            function _colorString (color) {
                return 'rgba(' + color.red + ',' + color.green + ',' + color.blue + ',' + color.alpha + ')';
            }
            
            //  The internal parseValue function returns a valid parsed value depending
            //  on the passed property
            function _parseValue (value, property) {
                if (typeof value === 'string') {
                    if (property.match(/^border[A-Z]*|height|left|top|width$/ig).length) { // All border, height, left top and width properties
                        if (value.match(/^-?\d*\.?\d*px$/g).length) {
                            return parseFloat(value, 10);
                        } else if (value.match(/^-?\d*\.?\d*vw$/g).length) {
                            return window.innerWidth * (parseFloat(value, 10) / 100);
                        } else if (value.match(/^-?\d*\.?\d*vh$/g).length) {
                            return window.innerHeight * (parseFloat(value, 10) / 100);
                        } else if (property.match(/^height|top$/g).length) {
                            if (value.match(/^\d*\.?\d*%$/g)) {
                                return grab.element.parentNode.offsetHeight * (parseFloat(value, 10) / 100);
                            } else if (property.match(/^height$/g).length) {
                                if (value.match(/^auto|initial$/ig).length) {
                                    grab.element.style.height = value;
                                    return grab.element.offsetHeight;
                                }
                            } else { // Top property
                                if (value.match(/^auto|initial$/ig).length) {
                                    grab.element.style.top = value;
                                    return grab.element.offsetTop;
                                }
                            }
                        } else if (property.match(/^border[A-Z]*|left|width$/ig).length) {
                            if (value.match(/^-?\d*\.?\d*%$/g).length) {
                                return grab.element.parentNode.offsetWidth * (parseFloat(value, 10) / 100);
                            } else if (value.match(/^auto|initial$/ig).length) {
                                if (property.match(/^border[A-Z]+$/ig).length) { // Notice the '+' in place of the '*'
                                    grab.element.style.borderWidth = value;
                                    return grab.element.borderWidth;
                                } else if (property.match(/^border$/g).length) {
                                    grab.element.style.border = value;
                                    return {color: grab.element.borderColor, width: grab.element.borderWidth};
                                } else if (property.match(/^left$/g).length) {
                                    grab.element.style.left = value;
                                    return grab.element.offsetLeft;
                                } else { // Width property
                                    grab.element.style.width = value;
                                    return grab.element.offsetWidth;
                                }
                            }
                        }
                    } else if (property === 'opacity') { // Opacity property
                        if (value.match(/^auto|initial|none$/g).length) {
                            return 1;
                        } else if (value.match(/^transparent$/g).length) {
                            return 0;
                        } else if (value.match(/^\d{1,3}\.?\d*%$/g).length) {
                            return parseFloat(value, 10) / 100;
                        } else if (value.match(/^\d*\.?\d*$/g).length) {
                            return parseFloat(value, 10);
                        }
                    } else if (property.match(/[A-Z]*color$/ig).length) { // All color properties
                        return chroma(value);
                    } 
                } else if (aux.isNumber(value)) {
                    return value;
                }
                return null;
            }
            //  GETTERS AND SETTERS
            Object.defineProperties(grab, {
                backgroundColor: {
                    get: function () {
                        return this.values.backgroundColor ? this.values.backgroundColor : chroma(_getStyle('backgroundColor'));
                    },
                    set: function (value) {
                        var color;
                        if (aux.isObject(value)) { // For animation purposes
                            color = Object.assign(this.backgroundColor, value);
                        } else {
                            color = chroma(value);
                        }
                        if (aux.isObject(color)) {
                            Object.assign(this.backgroundColor, color);
                            this.element.style.backgroundColor = _colorString(color);
                        }
                    }
                },
                border: {
                    get: function () {
                        return {
                            color: this.borderColor,
                            width: this.borderWidth
                        }
                    },
                    set: function (value) {
                        var border;
                        if (aux.isObject(value)) { // For animation purposes
                            border = Object.assign(this.border, value);
                        } else {
                            border = _parseValue(value, 'border');
                        }
                        if (aux.isObject(border)) {
                            Object.assign(this.border, border);
                            this.element.style.border = border.width + 'px ' + 'solid ' + border.color;
                        }
                    }
                },
                borderColor: {
                    get: function () {
                        return this.values.borderColor ? this.values.borderColor : chroma(_getStyle('borderColor'));
                    },
                    set: function (value) {
                        var color;
                        if (aux.isObject(value)) { // For animation purposes
                            color = Object.assign(this.borderColor, value);
                        } else {
                            color = chroma(value);
                        }
                        if (aux.isObject(color)) {
                            Object.assign(this.borderColor, color);
                            this.element.style.borderColor = _colorString(color);
                        }
                    }
                },
                borderBottomWidth: {
                    get: function () {
                        return this.values.borderBottomWidth;
                    },
                    set: function (value) {
                        var width = _parseValue(value, 'borderBottomWidth');
                        if (aux.isNumber(width)) {
                            this.values.borderBottomWidth = width;
                            this.element.style.borderBottomWidth = width + 'px';
                        }
                        
                    }
                },
                borderLeftWidth: {
                    get: function () {
                        return this.values.borderLeftWidth;
                    },
                    set: function (value) {
                        var width = _parseValue(value, 'borderLeftWidth');
                        if (aux.isNumber(width)) {
                            this.values.borderLeftWidth = width;
                            this.element.style.borderLeftWidth = width + 'px';
                        }
                        
                    }
                },
                borderRightWidth: {
                    get: function () {
                        return this.values.borderRightWidth;
                    },
                    set: function (value) {
                        var width = _parseValue(value, 'borderRightWidth');
                        if (aux.isNumber(width)) {
                            this.values.borderRightWidth = width;
                            this.element.style.borderRightWidth = width + 'px';
                        }
                        
                    }
                },
                borderTopWidth: {
                    get: function () {
                        return this.values.borderTopWidth;
                    },
                    set: function (value) {
                        var width = _parseValue(value, 'borderTopWidth');
                        if (aux.isNumber(width)) {
                            this.values.borderTopWidth = width;
                            this.element.style.borderTopWidth = width + 'px';
                        }
                    }
                },
                borderWidth: {
                    get: function () {
                        return this.values.borderWidth;
                    },
                    set: function (value) {
                        var width = _parseValue(value, 'borderWidth');
                        if (aux.isNumber(width)) {
                            this.values.borderWidth = width;
                            this.element.style.borderWidth = width + 'px';
                        }
                    }
                },
                color: {
                    get: function () {
                        return this.values.color ? this.values.color : chroma(_getStyle('color'));
                    },
                    set: function (value) {
                        var color;
                        if (aux.isObject(value)) {
                            color = Object.assign(this.color, value);
                        } else {
                            color = chroma(value);
                        }
                        if (aux.isObject(color)) {
                            Object.assign(this.color, color);
                            this.values.color = _colorString(color);
                        }
                    }
                },
                children: {
                    get: function () {
                        var children = _createCollection(),
                            i;
                        for (i = 0; i < this.element.children.length; i = i + 1) {
                            children.add(this.element.children[i]);
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
                            this.element.style.display = this.values.display = value;
                        }
                    }
                },
                height: {
                    get: function () {
                        return this.values.height
                    },
                    set: function (value) {
                        var height = _parseValue(value, 'height');
                        if (aux.isNumber(height)) {
                            this.values.height = height;
                            this.element.style.height = height + 'px';
                        }
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
                        var left = _parseValue(value, 'left');
                        if (aux.isNumber(left)) {
                            this.values.left = left;
                            this.element.style.left = left + 'px';
                        }
                    }
                },
                opacity: {
                    get: function () {
                        return this.values.opacity;
                    },
                    set: function (value) {
                        var opacity = _parseValue(value, 'opacity');
                        if (aux.isNumber(opacity)) {
                            opacity = opacity > 1 ? 1 : opacity; // No values above 1
                            opacity = opacity < 0 ? 0 : opacity; // No values below 0
                            this.values.opacity = opacity;
                            this.element.style.opacity = this.values.opacity;
                        }
                    }
                },
                top: {
                    get: function () {
                        return this.values
                    },
                    set: function (value) {
                        var top = _parseValue(value, 'top');
                        if (aux.isNumber(top)) {
                            this.values.top = top;
                            this.element.style.top = top + 'px';
                        }
                    }
                },
                width: {
                    get: function () {
                        return this.values.width;
                    },
                    set: function (value) {
                        var width = _parseValue(value, 'width');
                        if (aux.isNumber(width)) {
                            this.values.width = width;
                            this.element.style.width = width + 'px';
                        }
                    }
                },
                visibility: {
                    get: function () {
                        return this.values.visibility;
                    },
                    set: function (value) {
                        if (typeof value === 'string') {
                            this.element.style.visibility = this.values.visibility = value;
                        }
                    }
                },
                zIndex: {
                    get: function () {
                        return this.values.zIndex;
                    },
                    set: function (value) {
                        var z = parseInt(value, 10);
                        if (aux.isNumber(z)) {
                            this.element.style.zIndex = this.values.zIndex = z
                        }
                    }
                }
            });
            //  METHODS
            //  The animation method adds the object into the update array of the
            //  animation engine
            grab.animate = function (values, duration, easing, complete) {
                var v = {};
                Object.keys(values).forEach(function (property) {
                    if (property.match(/^border[A-Z]*|[A-Z]*color|height|left|opacity|top|width$/ig).length) { // Check if the property can be animated
                        grab[property] = _getStyle(property); // get origin value
                        v[property] = _parseValue(values[property], property); // get target value
                    }
                    engine.add(this, v, duration, easing, complete); // Add animation to engine
                });
            }
        }
    }
}());