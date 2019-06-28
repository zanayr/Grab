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
            checking = true;
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
    function _isNumber (number) {
        var valid = true;
        if (typeof number !== 'number') {
            valid = false;
        }
        if (!Number.isFinite(number) && valid) {
            valid = false;    
        }
        return valid;
    }
    
//    function _handleError (error, uid, origin) {
//        try {
//            switch (error) {
//                case 99:
//                    throw {
//                        code: error,
//                        message:     'Error in uid: ' + uid + ' origin: ' + origin,
//                        name:        'Invalid Node'
//                    };
//                default:
//                    throw {
//                        code: 0,
//                        message:     'error.',
//                        name:        'There was an'
//                    };
//            }
//        } catch (e) {
//            console.error(e.name, e.message);
//        }
//    }
    
    
    
    //  COLORS  -----------------------------------------------------------  COLORS  //
    //  The following section deals with the parsing, checking and converting of most
    //  standard color models in the DOM to the rgba color model that grab uses
    
    //  The _checkRGBA function should take an array of RGBA values and determine if
    //  they are valid or not
    function _checkRGBA (arr) {
        var valid = true,
            i;
        //  1.  All channel values should be positive, integer,
        //  2.  Channel valiues (elements 0, 1 and 2) should be at most 255
        //  3.  Alpha channel (element 3) should be at most 1
        //  4.  there should only be 4 channels
        for (i = 0; i < arr.length; i = i + 1) {
            if (arr[i] < 0 || Number.isNaN(arr[i])) {
                valid = false;
                break;
            }
            if (i < 3 && arr[i] > 255 && valid) {
                valid = false;
                break;
            } else if (i === 3 && arr[3] > 1 && valid) {
                valid = false;
                break;
            } else if (i > 3) {
                valid = false;
                break;
            }
        }
        return valid ? arr : null;
    }
   
    //  The _checkHex function should take a string of a hexidecimal value and
    //  determine if it is a valid hexidecimal value
    function _checkHex (str) {
        var value = str.replace(/^#|0x|0X/, ''),
            i;
        //  1.  All hexidecimal values should be a number 0 to 9, a to f; where a to f
        //      represent the values 10 to 15
        for (i = 0; i < value.length; i = i + 1) {
            if (!value[i].match(/[0-9A-F]/gi)) {
                value = null;
                break;
            }
        }
        return value;
    }
    
    //  The _checkHSXA function should take an array of HSXA values and determine if
    //  they are valid or not
    function _checkHSXA (arr) {
        var i,
            valid = true;
        //  1.  Hues (element 0) must be contained in the set [-360, 360]
        //  2.  Saturation, Lightness and Alpha (elements 1, 2 and 3) must be contained
        //  3.  HSL arrays can only have 4 values
        for (i = 0; i < arr.length; i = i + 1) {
            if (Number.isNaN(arr[i])) {
                valid = false;
                break;
            }
            if (i === 0 && (arr[i] < -360 || arr[i] > 360)) {
                valid = false;
                break;
            } else if (i < 4 && (arr[i] < 0 || arr[i] > 1)) {
                valid = false;
                break;
            } else if (i > 4) {
                valid = false;
                break;
            }
        }
        if (!arr[3]) {
            arr[3] = 1;
        }
        return valid ? arr : null;
    }
    
    //  The _rgba function should take a string of and parse it for valid rgba values
    //  Valid formats are 'rgb(0, 0, 0)', 'rgba(0, 0, 0, 0.0)' or even a string of
    //  values delimited by commas, e.g. '0, 0, 0' and '0, 0, 0, 0.0'
    function _rgba (str) {
        var values = str.match(/(-?\d{1,3}\.?\d*)/g);
        if (!values) {
            return null;
        } else {
            values = values.map(function (value) {
                return parseFloat(value, 10);
            });
            if (typeof values[3] === 'undefined') {
                values[3] = 1;
            }
        }
        return _checkRGBA(values);
    }
    
    //  The _standard function should take a string and apply it to a temporary div in
    //  the DOM; returning its color styling as a parsed rgba array
    //  Valid formats are any color names, e.g. 'blue' or 'lightcoral'
    function _standard (str) {
        var div = document.createElement('div'),
            color;
        div.style.color = str;
        document.body.appendChild(div);
        color = _getStyle(div, 'color');
        document.body.removeChild(div);
        color = _rgba(color);
        if ((str !== 'black' && str !== 'transparent') && !color[0] && !color[1] && !color[2]) {
            return null;
        } else {
            return _checkRGBA(color);
        }
    }
    
    //  The _hexa should take a hexidecimal string and parse it for an array of valid
    //  RGBA values; the function takes many shorthand formats and even the new hexa
    //  standard
    //  Valid formats begin with '#', '0x' or '0X' and a string of length 1 to 8,
    //  except 5 and 7, of hexidecimal values '0' to 'f'
    function _hexa (str) {
        var value = _checkHex(str),
            values;
        if (value) {
            switch (value.length) {
                case 1: // Hexidecimal shorthand a, returns aaaaaa
                    value = value + value;
                    values = [parseInt(value, 16), parseInt(value, 16), parseInt(value, 16), 1];
                    break;
                case 2: // Hexidecima shorthand ab, returns ababab
                    values = [parseInt(value, 16), parseInt(value, 16), parseInt(value, 16), 1];
                    break;
                case 3: // Hexidecimal shorthand abc, returns aabbcc
                    values = [parseInt(value[0] + value[0], 16), parseInt(value[1] + value[1], 16), parseInt(value[2] + value[2], 16), 1];
                    break;
                case 4: // Hexidecimal/alpha shorthand abcd, returns aabbccdd
                    values = [parseInt(value[0] + value[0], 16), parseInt(value[1] + value[1], 16), parseInt(value[2] + value[2], 16), parseInt(value[3] + value[3], 16) / 255];
                    break;
                case 6: // Hexidecimal abcdef
                    values = value.match(/([0-9A-F]{2})([0-9A-F]{2})([0-9A-F]{2})/i).slice(1).map(function (v) {
                        return parseInt(v, 16);
                    }).concat(1); // Set alpha
                    break;
                case 8: // Hexidecimal/alpha abcdef01
                    values = value.match(/([0-9A-F]{2})([0-9A-F]{2})([0-9A-F]{2})([0-9A-F]{2})/i).slice(1).map(function (v, i) {
                        return i < 3 ? parseInt(v, 16) : parseInt(v, 16) / 255;
                    });
                    break;
                default:
                    break;
            }
        }
        return value ? _checkRGBA(values) : null;
    }
    
    //  The _hsx function should take a string and return an array of hsx/a values to
    //  be checked later
    //  Valid string formats are both hsl/a and hsv/a models, e.g. 'hsl/v(0, 0, 0)' and
    //  'hsl/va(0, 0, 0, 0.0)'
    function _hsx (str) {
        var values = str.match(/(-?\d{1,3}\.?\d*)/g);
        if (values) {
            return _checkHSXA(values.map(function (value, z) {
                if (z === 0) {
                    return value.includes('-') ? (360 + (parseFloat(value, 10) % 360)) / 360 : (parseFloat(value, 10) % 360) / 360;
                } else if (z < 3) {
                    return parseFloat(value, 10) / 100;
                } else {
                    return parseFloat(value, 10);
                }
            }));
        }
        return null;
    }
    
    //  Convert hsla values into an array of rgba values; I wish I could tell you how
    //  this works, but this code comes from Garry Tan[3]
    function _hsla (h, s, l, a) {
        var r,
            g,
            b;
        function _hue (T) {
            var Q = l < 0.5 ? l * (1 + s) : l + s - l * s,
                P = 2 * l - Q;
            T = T < 0 ? T + 1 : T;
            T = T > 1 ? T - 1 : T;
            if (T < 1 / 6) {
                return P + (Q - P) * 6 * T;
            } else if (T < 1 / 2) {
                return Q;
            } else if (T < 2 / 3) {
                return P + (Q - P) * (2 / 3 - T) * 6;
            } else {
                return P;
            }
        }
        if (s === 0) {
            r = g = b = l;
        } else {
            r = _hue(h + 1 / 3);
            g = _hue(h);
            b = _hue(h - 1 / 3);
        }
        return _checkRGBA([Math.round(r * 255), Math.round(g * 255), Math.round(b * 255), a]);
    }
    
    //  Convert hsva values into an array of rgba values; I wish I could tell you how
    //  this works, but this code comes from Garry Tan[3]
    function _hsva (h, s, v, a) {
        var r,
            g,
            b,
            I = Math.floor(h * 6),
            F = h * 6 - I,
            P = v * (1 - s),
            Q = v * (1 - F * s),
            T = v * (1 - (1 - F) * s);
        switch (I % 6) {
            case 0:
                r = v;
                g = T;
                b = P;
                break;
            case 1:
                r = Q;
                g = v;
                b = P;
                break;
            case 2:
                r = P;
                g = v;
                b = T;
                break;
            case 3:
                r = P;
                g = Q;
                b = v;
                break;
            case 4:
                r = T;
                g = P;
                b = v;
                break;
            case 5:
                r = v;
                g = P;
                b = Q;
        }
        return _checkRGBA([Math.round(r * 255), Math.round(g * 255), Math.round(b * 255), a]);
    }
    
    function _checkOpacity (value) {
        return value <= 1 && value >= 0 ? value : null;
    }

    //  Color Method  //
    //  The Color method should convert most color models into an array of the rgba
    //  color model; valid models are the rgb/a, hex/a, hsl/a and hsv/a models; as
    //  well as some overloads to pass rgb/a models including strings of rgb/a values
    //  delimited by commas, an array of numbers or as seperate parameters
    function _color (value) {
        var arr = [],
            color,
            i;
        if (value && typeof value === 'string') {
            if (value.match(/^rgb|rgba/)) {
                color = _rgba(value);
            } else if (value.match(/^#|0x|0X/)) {
                color = _hexa(value);
            } else if (value.match(/^hsl|hsla/)) {
                color = _hsla.apply(null, _hsx(value));
            } else if (value.match(/^hsv|hsva/)) {
                color = _hsva.apply(null, _hsx(value));
            } else if (value.split(',').length >= 3) {
                color = _rgba(value);
            } else {
                color = _standard(value);
            }
        } else if (Array.isArray(value)) {
            for (i = 0; i < value.length; i = i + 1) {
                arr.push(parseFloat(value[i], 10));
            }
            if (!arr[3]) {
                arr[3] = 1;
            }
            color = _checkRGBA(arr);
        } else if (arguments.length > 1) {
            for (i = 0; i < arguments.length; i = i + 1) {
                arr.push(parseFloat(arguments[i], 10));
            }
            if (!arr[3]) {
                arr[3] = 1;
            }
            color = _checkRGBA(arr);
        }
        if (color) {
            return {
                alpha: color[3],
                blue: color[2],
                green: color[1],
                red: color[0]
            }
        } else {
            return null;
        }
    }

    //  Parse Method  //
    //  The Parse method should take a passed property and value, both strings, and
    //  return a numeric value that is parsed depending on the property and the unit of
    //  the value, if it has one or is required
    function _parse (element, property, value) {
        if (typeof value === 'string') {
            if (property.match(/^height|left|top|width$/)) {
                if (value.match(/^-?\d*\.?\d*px$/)) {
                    return parseFloat(value, 10);
                } else if (value.match(/^-?\d*\.?\d*vw$/)) {
                    return window.innerWidth * (parseFloat(value, 10) / 100);
                } else if (value.match(/^-?\d*\.?\d*vh$/)) {
                    return window.innerHeight * (parseFloat(value, 10) / 100);
                } else if (property.match(/^height|top$/)) {
                    if (value.match(/^\d*\.?\d*%$/)) {
                        return element.parentNode.offsetHeight * (parseFloat(value, 10) / 100);
                    } else if (property.match(/^height/)) {
                        if (value.match(/^auto|initial$/)) {
                            element.style.height = value;
                            return element.offsetHeight;
                        }
                    } else {
                        if (value.match(/^auto|initial$/)) {
                            element.style.top = value;
                            return element.offsetTop;
                        }
                    }
                } else if (property.match(/^left|width$/)) {
                    if (value.match(/^-?\d*\.?\d*%$/)) {
                        return element.parentNode.offsetWidth * (parseFloat(value, 10) / 100);
                    } else if (property.match(/^left/)) {
                        if (value.match(/^auto|initial$/)) {
                            element.style.left = value;
                            return element.offsetLeft;
                        }
                    } else {
                        if (value.match(/^auto|initial$/)) {
                            element.style.width = value;
                            return element.offsetWidth;
                        }
                    }
                }
            } else if (property === 'opacity') {
                if (value.match(/^auto|initial|none$/)) {
                    return _checkOpacity(1.0);
                } else if (value.match(/^transparent$/)) {
                    return _checkOpacity(0.0);
                } else if (value.match(/^\d{1,3}\.?\d*%$/)) {
                    return _checkOpacity(parseFloat(value, 10) / 100);
                } else if (value.match(/^\d*\.?\d*$/)) {
                    return _checkOpacity(parseFloat(value, 10));
                }
            } else if (property === 'backgroundColor') {
                return _color(value);
            }
        } else if (_isNumber(value)) {
            if (property === 'opacity') {
                return _checkOpacity(value);
            } else {
                return value;
            }
        }
        return null;
    }
    
    
    
    //  ANIMATION  -----------------------------------------------------  ANIMATION  //
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
            //  Organize supplemental arguments
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
                console.log(object[property], values[property]);
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
    
    
    //  GRAB  ---------------------------------------------------------------  GRAB  //
    window.grab = function (selector) {
        //  _create should create and return a grab object
        function _create(dom) {
            //  Define grab object
            var grab = {
                element: dom,
                uid: _getID(0),
                values: {}
            }
            
            
            //  Define grab property getters and setters
            Object.defineProperties(grab, {
                backgroundColor: {
                    get: function () {
                        return this.values.backgroundColor;
                    },
                    set: function (value) {
                        var color = _color(value);
                        if (color) {
                            this.values.backgroundColor = color;
                            this.element.style.backgroundColor = 'rgb(' + this.values.backgroundColor.red + ', ' + this.values.backgroundColor.green + ', ' + this.values.backgroundColor.blue + ')';
                            this.opacity = color.alpha;
                        }
                    }
                },
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
                        this.values.height =_parse(this.element, 'height', value);
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
                        this.values.left =_parse(this.element, 'left', value);
                        this.element.style.left = this.values.left + 'px';
                    }
                },
                opacity: {
                    get: function () {
                        return this.values.opacity;
                    },
                    set: function (value) {
                        var v =_parse(this.element, 'opacity', value);
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
                        this.values.top =_parse(this.element, 'top', value);
                        this.element.style.top = this.values.top + 'px';
                    }
                },
                width: {
                    get: function () {
                        return this.values.width;
                    },
                    set: function (value) {
                        this.values.width =_parse(this.element, 'width', value);
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
                    if (property.match(/^backgroundColor|height|left|opacity|top|width$/)) {
                        grab[property] = _getStyle(grab.element, property);
                        v[property] = _parse(grab.element, property, values[property]);
                    }
                });
                animation.add(this, v, duration, easing, complete);
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
                        return _collect(document.getElementsByTagName(child));
                    } else if (child.match(/^#[a-z0-9-]/)) {
                        return _create(document.getElementById(child.slice(1)));
                    } else if (child.match(/^\.[a-z0-9-]/)) {
                        return _collect(document.getElementsByClassName(child.slice(1)));
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
            //  Return grab object
            return grab;
        }
        
        //  _grabMany should cycle through an array of DOM objects and call _grab for
        //  each one
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
        function _collect (items) {
            var i,
                collection = _createCollection();
            for (i = 0; i < items.length; i = i + 1) {
                collection.add(_create(items[i]));
            }
            return collection;
        }

        //  _grab should parse a DOM object and return a grab object
        function _grab (item) {
            item = item.trim().replace(/\s/g, '').toLowerCase();
            if (typeof item === 'string') {
                if (item.match(/^[a-z]+$/)) {
                    return _create(document.createElement(item));
                } else if (item.match(/^<[a-z]+>$/)) {
                    return _create(document.createElement(item.slice(1, -1)));
                } else if (item.match(/^#[a-z0-9-]/)) {
                    return _create(document.getElementById(item.slice(1)));
                } else if (item.match(/^\.[a-z0-9-]/)) {
                    return _collect(document.getElementsByClassName(item.slice(1)));
                } else if (item.search(',' > -1)) {
                    return item.split(',').map(function (o) {
                        return _grab(o);
                    });
                } else {
                    return _collect(document.getElementsByTagName(item));
                }
            }  else if (item.nodeType > 0) {
                return _create(item);
            } else if (Array.isArray(item)) {
                return item.map(function (o) {
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
 *  [2]     https://davidwalsh.name/convert-html-stings-dom-nodes -- David Walsh
 *  [3]     http://axonflux.com/handy-rgb-to-hsl-and-rgb-to-hsv-color-model-c
 */