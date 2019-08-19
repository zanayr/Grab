/*eslint-env browser*/
/*global aux: false*/
/*global chroma:false*/


/* GRAB-1.2.0.js
Grab is a DOM manipulation library that I developed as a project to learn more about
how the DOM worked and can by changed. This library includes it's own animation engine
and abstraction layer to hide all the complicated features of the DOM.
For now I've kept the library to basic features and will slowly add new features.

By Ryan Fickenscher 7/6/19
https://github.com/zanayr
*/


(function () {
    'use strict';
    //  Color Parser  //
    //  Taken from https://github.com/zanayr/chroma  //
    var chroma;
    (function () {
        var x11Dictionary = {
            snow: [255, 250, 250], ghostwhite: [248, 248, 255], whitesmoke: [245, 245, 245],
            gainsboro: [220, 220, 220], floralwhite: [255, 250, 240], oldlace: [253, 245, 230],
            linen: [250, 240, 230], antiquewhite: [250, 235, 215], papayawhip: [255, 239, 213],
            blanchedalmond: [255, 235, 205], bisque: [255, 228, 196], peachpuff: [255, 218, 185],
            navajowhite: [255, 222, 173], moccasin: [255, 228, 181], cornsilk: [255, 248, 220],
            ivory: [255, 255, 240], lemonchiffon: [255, 250, 205], seashell: [255, 245, 238],
            honeydew: [240, 255, 240], mintcream: [245, 255, 250], azure: [240, 255, 255],
            aliceblue: [240, 248, 255], lavender: [230, 230, 250], lavenderblush: [255, 240, 245],
            mistyrose: [255, 228, 225], white: [255, 255, 255], black: [0, 0, 0],
            darkslategray: [47, 79, 79], darkslategrey: [47, 79, 79], dimgray: [105, 105, 105],
            dimgrey: [105, 105, 105], slategray: [112, 128, 144], slategrey: [112, 128, 144],
            lightslategray: [119, 136, 153], lightslategrey: [119, 136, 153], gray: [128, 128, 128],
            grey: [128, 128, 128], lightgrey: [211, 211, 211], lightgray: [211, 211, 211],
            midnightblue: [25, 25, 112], navy: [0, 0, 128], cornflowerblue: [100, 149, 237],
            darkslateblue: [72, 61, 139], slateblue: [106, 90, 205], mediumslateblue: [123, 104, 238],
            mediumblue: [0, 0, 205], royalblue: [65, 105, 225], blue: [0, 0, 255],
            dodgerblue: [30, 144, 255], deepskyblue: [0, 191, 255], skyblue: [135, 206, 235],
            lightskyblue: [135, 206, 250], steelblue: [70, 130, 180], lightsteelblue: [176, 196, 222],
            lightblue: [173, 216, 230], powderblue: [176, 224, 230], paleturquoise: [175, 238, 238],
            darkturquoise: [0, 206, 209], mediumturquoise: [72, 209, 204], turquoise: [64, 224, 208],
            cyan: [0, 255, 255], lightcyan: [224, 255, 255], cadetblue: [95, 158, 160],
            mediumaquamarine: [102, 205, 170], aquamarine: [127, 255, 212], darkgreen: [0, 100, 0],
            darkolivegreen: [85, 107, 47], darkseagreen: [143, 188, 143], seagreen: [46, 139, 87],
            mediumseagreen: [60, 179, 113], lightseagreen: [32, 178, 170], palegreen: [152, 251, 152],
            springgreen: [0, 255, 127], lawngreen: [124, 252, 0], green: [0, 128, 0],
            chartreuse: [127, 255, 0], mediumspringgreen: [0, 250, 154], greenyellow: [173, 255, 47],
            limegreen: [50, 205, 50], yellowgreen: [154, 205, 50], forestgreen: [34, 139, 34],
            olivedrab: [107, 142, 35], darkkhaki: [189, 183, 107], khaki: [240, 230, 140],
            palegoldenrod: [238, 232, 170], lightgoldenrodyellow: [250, 250, 210], lightyellow: [255, 255, 224],
            yellow: [255, 255, 0], gold: [255, 215, 0], goldenrod: [218, 165, 32], darkgoldenrod: [184, 134, 11],
            rosybrown: [188, 143, 143], indianred: [205, 92, 92], saddlebrown: [139, 69, 19],
            sienna: [160, 82, 45], peru: [205, 133, 63], burlywood: [222, 184, 135],
            beige: [245, 245, 220], wheat: [245, 222, 179], sandybrown: [244, 164, 96],
            tan: [210, 180, 140], chocolate: [210, 105, 30], firebrick: [178, 34, 34],
            brown: [165, 42, 42], darksalmon: [233, 150, 122], salmon: [250, 128, 114],
            lightsalmon: [255, 160, 122], orange: [255, 165, 0], darkorange: [255, 140, 0],
            coral: [255, 127, 80], lightcoral: [240, 128, 128], tomato: [255, 99, 71],
            orangered: [255, 69, 0], red: [255, 0, 0], hotpink: [255, 105, 180],
            deeppink: [255, 20, 147], pink: [255, 192, 203], lightpink: [255, 182, 193],
            palevioletred: [219, 112, 147], maroon: [128, 0, 0], mediumvioletred: [199, 21, 133],
            magenta: [255, 0, 255], violet: [238, 130, 238], plum: [221, 160, 221],
            orchid: [218, 112, 214], mediumorchid: [186, 85, 211], darkorchid: [153, 50, 204],
            darkviolet: [148, 0, 211], blueviolet: [138, 43, 226], purple: [128, 0, 128],
            mediumpurple: [147, 112, 219], thistle: [216, 191, 216], darkgrey: [169, 169, 169],
            darkgray: [169, 169, 169], darkblue: [0, 0, 139], darkcyan: [0, 139, 139],
            darkmagenta: [139, 0, 139], darkred: [139, 0, 0], lightgreen: [144, 238, 144],
            aqua: [0, 255, 255], fuchsia: [255, 0, 255], indigo: [75, 0, 130],
            lime: [0, 255, 0], olive: [128, 128, 0], rebeccapurple: [102, 51, 153],
            silver: [192, 192, 192], teal: [0, 128, 128]
        },
        from = {
            hex: function (arr) {
                switch (arr.length) {
                    case 1:
                        return [parseInt(arr[0] + arr[0], 16), parseInt(arr[0] + arr[0], 16), parseInt(arr[0] + arr[0], 16)];
                    case 2:
                        return [parseInt(arr[0] + arr[1], 16), parseInt(arr[0] + arr[1], 16), parseInt(arr[0] + arr[1], 16)];
                    case 3:
                        return [parseInt(arr[0] + arr[0], 16), parseInt(arr[1] + arr[1], 16), parseInt(arr[2] + arr[2], 16)];
                    default:
                        return [parseInt(arr[0] + arr[1], 16), parseInt(arr[2] + arr[3], 16), parseInt(arr[4] + arr[5], 16)];
                }
            },
            hexa: function (arr) {
                switch (arr.length) {
                    case 4:
                        return [parseInt(arr[0] + arr[0], 16), parseInt(arr[1] + arr[1], 16), parseInt(arr[2] + arr[2], 16), Math.round(parseInt(arr[3] + arr[3], 16) / 2.55) / 100];
                    default:
                        return [parseInt(arr[0] + arr[1], 16), parseInt(arr[2] + arr[3], 16), parseInt(arr[4] + arr[5], 16), Math.round(parseInt(arr[6] + arr[7], 16) / 2.55) / 100];
                }
            },
            hsl: function (arr) {
                return fromHsl(arr);
            },
            hsla: function (arr) {
                return fromHsl(arr).concat(Math.round(100 * arr[3]) / 100);
            },
            hsv: function (arr) {
                return fromHsv(arr);
            },
            hsva: function (arr) {
                return fromHsv(arr).concat(Math.round(100 * arr[3]) / 100);
            },
            rgb: function (arr) {
                return arr;
            },
            rgba: function (arr) {
                return [arr[0], arr[1], arr[2], Math.round(100 * arr[3]) / 100];
            },
            x11: function (arr) {
                return arr;
            }
        }
        //  Chroma Object Function  //
        function chromaObject (arr) {
            var obj = {};
            //  Getter and Setters  //
            Object.defineProperties(obj, {
                alpha: {
                    get: function () {
                        return this.values.alpha;
                    },
                    set: function (value) {
                        if (0 <= value && value <= 1)
                            this.values.alpha = value;
                        return value;
                    }
                },
                blue: {
                    get: function () {
                        return this.values.blue;
                    },
                    set: function (value) {
                        if (0 <= value && value <= 255)
                            this.values.blue = value;
                        return value;
                    }
                },
                green: {
                    get: function () {
                        return this.values.green;
                    },
                    set: function (value) {
                        if (0 <= value && value <= 255)
                            this.values.green = value;
                        return value;
                    }
                },
                red: {
                    get: function () {
                        return this.values.red;
                    },
                    set: function (value) {
                        if (0 <= value && value <= 255)
                            this.values.red = value;
                        return value;
                    }
                },
                values: {
                    value: {
                        alpha: typeof arr[3] === 'number' && Number.isFinite(arr[3]) ? arr[3] : 1,
                        blue: arr[2],
                        green: arr[1],
                        red: arr[0]
                    }
                }
            });
            if (arr === null)
                return null;
            return obj;
        }
        //  Auxillary Functions  //
        function fromHsl (values) {
            var r, g, b;
            function hue (t, s, l) {
                var q = l < 0.5 ? l * (1 + s) : l + s - l * s,
                    p = 2 * l - q;
                t = t < 0 ? t + 1 : t;
                t = t > 1 ? t - 1 : t;
                if (t < 1 / 6) {
                    return p + (q - p) * 6 * t;
                } else if (t < 1 / 2) {
                    return q;
                } else if (t < 2 / 3) {
                    return p + (q - p) * (2 / 3 - t) * 6;
                } else {
                    return p;
                }
            }
            if (values[1] === 0) {
                r = g = b = values[2] / 100;
            } else {
                r = hue((values[0] % 360) / 360 + 1 / 3, values[1] / 100, values[2] / 100);
                g = hue((values[0] % 360) / 360, values[1] / 100, values[2] / 100);
                b = hue((values[0] % 360) / 360 - 1 / 3, values[1] / 100, values[2] / 100);
            }
            return [Math.round(r * 255), Math.round(g * 255), Math.round(b * 255)];
        }
        function fromHsv (values) {
            var r,
                g,
                b,
                i = Math.floor(((values[0] % 360) / 360) * 6),
                f = ((values[0] % 360) / 360) * 6 - i,
                p = (values[2] / 100) * (1 - (values[1] / 100)),
                q = (values[2] / 100) * (1 - f * (values[1] / 100)),
                t = (values[2] / 100) * (1 - (1 - f) * (values[1] / 100));
            switch (i % 6) {
                case 0:
                    r = values[2] / 100;
                    g = t;
                    b = p;
                    break;
                case 1:
                    r = q;
                    g = values[2] / 100;
                    b = p;
                    break;
                case 2:
                    r = p;
                    g = values[2] / 100;
                    b = t;
                    break;
                case 3:
                    r = p;
                    g = q;
                    b = values[2] / 100;
                    break;
                case 4:
                    r = t;
                    g = p;
                    b = values[2] / 100;
                    break;
                case 5:
                    r = values[2] / 100;
                    g = p;
                    b = q;
            }
            return [Math.round(r * 255), Math.round(g * 255), Math.round(b * 255)];
        }
        //  Validation Functions  //
        function validHsx (arr) {
            var i;
            for (i = 0; i < arr.length; i = i + 1) {
                if (i && 0 > arr[i])
                    return false;
                if (i === 3 && arr[i] > 1) {
                    return false;
                } else if (i && arr[i] > 100) {
                    return false;
                }
            }
            return true;
        }
        function validRgb (arr) {
            var i;
            for (i = 0; i < arr.length; i = i + 1) {
                if (0 > arr[i])
                    return false;
                if (i === 3 && arr[i] > 1) {
                    return false;
                } else if (arr[i] > 255) {
                    return false;
                }
            }
            return true;
        }
        function validChroma (obj) {
            var k;
            for (k in obj)
                if (!/^alpha|blue|green|red$/i.test(k))
                    return false;
            return validRgb([obj.red, obj.green, obj.blue, obj.alpha]);
        }

        //  CHROMA  FUNCTION  //
        chroma = function (model) {
            var parsed = chroma.parse(model);
            if (parsed && parsed.length > 1)
                return chromaObject(from[parsed[0]](parsed.slice(1)));
            return null;
        };
        //  Parse Method  //
        chroma.parse = function (value) {
            var match;
            function percents (arr) {
                var i, c = 0;
                for (i = 0; i < arr.length; i = i + 1)
                    if (typeof arr[i] === 'string' && arr[i].includes('%'))
                        c = c + 1
                return c;
            }
            function parse (arr) {
                var i, n, a = [];
                if (!arr)
                    return [];
                for (i = 0; i < arr.length; i = i + 1) {
                    n = parseFloat(arr[i]);
                    if (typeof n !== 'number' || !Number.isFinite(n))
                        return [];
                    a.push(n);
                }
                return a;
            }
            if (typeof value === 'string' && value.length) {
                if (value.includes(',')) {
                    match = parse(value.match(/(-?\d{1,3}(\.?\d*)?)+/g));
                    if (match && match.length === 3) {
                        if (/^hsl\(/g.test(value) && percents(value) === 2) {
                            return validHsx(match) ? ['hsl'].concat(match) : null;
                        } else if (/^hsv\(/g.test(value) && percents(value) === 2) {
                            return validHsx(match) ? ['hsv'].concat(match) : null;
                        } else if (/^rgb\(/g.test(value) && !value.includes('%')) {
                            return validRgb(match) ? ['rgb'].concat(match) : null;
                        } else if (!/[a-z]+/g.test(value) && percents(value) === 2) {
                            return validHsx(match) ? ['hsv'].concat(match) : null;
                        } else if (!/[a-z]+/g.test(value) && !value.includes('%')) {
                            return validRgb(match) ? ['rgb'].concat(match) : null;
                        }
                    } else if (match && match.length === 4) {
                        if (/^hsla\(/g.test(value) && percents(value) === 2) {
                            return validHsx(match) ? ['hsla'].concat(match) : null;
                        } else if (/^hsva\(/g.test(value) && percents(value) === 2) {
                            return validHsx(match) ? ['hsva'].concat(match) : null;
                        } else if (/^rgba\(/g.test(value) && !value.includes('%')) {
                            return validRgb(match) ? ['rgba'].concat(match) : null;
                        } else if (!/[a-z]+/g.test(value) && percents(value) === 2) {
                            return validHsx(match) ? ['hsva'].concat(match) : null;
                        } else if (!/[a-z]+/g.test(value) && !value.includes('%')) {
                            return validRgb(match) ? ['rgba'].concat(match) : null;
                        }
                    }
                } else if (/^(?:#|0x|0X)?([\da-f]{1,8}){1}$/g.test(value)) {
                    match = value.replace(/^#|0x/ig, '').match(/([\da-f])/g);
                    if (match && (match.length === 4 || match.length === 8)) {
                        return ['hexa'].concat(match);
                    } else if (match && (match.length !== 5 && match.length !== 7)) {
                        return ['hex'].concat(match);
                    }
                } else if (/^[a-z]{2,}$/g.test(value)) {
                    match = x11Dictionary[value];
                    if (match && match.length === 3)
                        return ['x11'].concat(match);
                }
            } else if (Array.isArray(value) && 2 < value.length && value.length < 5) {
                match = parse(value);
                if (match && percents(value) === 2) {
                    if (match.length === 3) {
                        return validHsx(match) ? ['hsv'].concat(match) : null;
                    } else if (match.length === 4) {
                        return validHsx(match) ? ['hsva'].concat(match) : null;
                    }
                } else if (match && !percents(value)) {
                    if (match.length === 3) {
                        return validRgb(match) ? ['rgb'].concat(match) : null;
                    } else if (match.length === 4) {
                        return validRgb(match) ? ['rgba'].concat(match) : null;
                    }
                }
            } else if (validChroma(value)) {
                return ['rgba'].concat(parse([value.red, value.green, value.blue, value.alpha]));
            }
            return null;
        };
        //  Validate Method  //
        chroma.validate = function (value) {
            var parsed = chroma.parse(value);
            if (parsed && parsed.length > 1)
                return true;
            return false;
        };
    }());
    
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
                        update.object[update.property] = color;
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
                        if (this.complete && !callbacks[this.complete].members[this.uid]) {
                            callbacks[this.complete].members[this.uid] = 1; // Set the member value to 1, indicating that his complete is done
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
                    Object.keys(object[property]).forEach(function (channel, l) {
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
                    });
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
        }
        //  Return the public functions
        return {
            add: add
        }
    }());
    
    //  GRAB  ---------------------------------------------------------------  GRAB  //
    window.grab = function (selector) {
        function _selector (element, string) {
            var tag = string.match(/^[A-Z]+/ig),
                id = string.match(/#([A-Za-z/d_-]+)/g),
                classes = string.match(/(\.[\dA-Za-z_-]+)/g),
                valid = true;
            if (tag) {
                tag = tag[0].toLowerCase();
            }
            if (id) {
                id = id[0].slice(1);
            }
            if (classes) {
                classes = classes.map(function (cls) {
                    return cls.slice(1);
                });
            }
            if  (tag && element.tagName.toLowerCase() !== tag) {
                valid = false;
            }
            if (id && element.id !== id) {
                valid = false;
            }
            if (classes) {
                classes.forEach(function (cls) {
                    if (!element.classList.contains(cls)) {
                        valid = false;
                    }
                });
            }
            return valid;
        }
        // The internal create function returns an grab object with special properties,
        //  getters and setters
        function _create (dom) {
            var grab = {
                element: dom,
                events: aux.createStore(),
                uid: aux.getHashID(0),
                values: {}
            }
            //  INTERNAL FUNCTIONS
            //  The internal getStyle function returns a computed style from the dom
            function _getStyle (property) {
                return window.getComputedStyle(grab.element, '')[property];
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
                    if (property.match(/^border[A-Z]*|height|left|top|width$/ig)) { // All border, height, left top and width properties
                        if (value.match(/^-?\d+\.?\d*px$/g)) {
                            return parseFloat(value, 10);
                        } else if (value.match(/^-?\d+\.?\d*vw$/g)) {
                            return window.innerWidth * (parseFloat(value, 10) / 100);
                        } else if (value.match(/^-?\d+\.?\d*vh$/g)) {
                            return window.innerHeight * (parseFloat(value, 10) / 100);
                        } else if (value.match(/^\d+\.?\d*%$/g)) {
                            if (property.match(/^height|top/ig)) {
                                return grab.element.parentNode.offsetHeight * (parseFloat(value, 10) / 100);
                            } else if (property.match(/^left|width$/ig)) {
                                return grab.element.parentNode.offsetWidth * (parseFloat(value, 10) / 100);
                            }
                        }
                    } else if (property === 'opacity') {
                        if (value.match(/^\d{1,3}\.?\d*%$/g)) {
                            return parseFloat(value, 10) / 100;
                        } else if (value.match(/^\d+\.?\d*$/g)) {
                            return parseFloat(value, 10);
                        }
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
                            this.values.backgroundColor = color;
                            this.element.style.backgroundColor = _colorString(color);
                        }
                    }
                },
                classList: {
                    get: function () {
                        return this.element.classList;
                    }
                },
                color: {
                    get: function () {
                        return this.values.color ? this.values.color : chroma(_getStyle('color'));
                    },
                    set: function (value) {
                        var color;
                        if (aux.isObject(value)) { // For anumation purposes
                            color = Object.assign(this.color, value);
                        } else {
                            color = chroma(value);
                        }
                        if (aux.isObject(color)) {
                            this.values.color = color;
                            this.element.style.color = _colorString(color);
                        }
                    }
                },
                children: {
                    get: function () {
                        var children = _collect([]),
                            i;
                        for (i = 0; i < this.element.children.length; i = i + 1) {
                            children.add(_grab(this.element.children[i]));
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
                id: {
                    get: function () {
                        return this.element.id;
                    },
                    set: function (value) {
                        if (aux.validateString(value)) {
                            this.element.id = value;
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
                name: {
                    get: function () {
                        var id = this.id ? '#' + this.id : '',
                            classes = this.element.className.length > 0 ? '.' + this.element.className.replace(' ', '.') : '';
                        return this.element.tagName.toLowerCase() + id + classes;
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
                        return this.values.top
                    },
                    set: function (value) {
                        var top = _parseValue(value, 'top');
                        if (aux.isNumber(top)) {
                            this.values.top = top;
                            this.element.style.top = top + 'px';
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
                zIndex: {
                    get: function () {
                        return this.values.zIndex;
                    },
                    set: function (value) {
                        var z = parseInt(value, 10);
                        if (aux.isNumber(z)) {
                            this.element.style.zIndex = this.values.zIndex = z;
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
                    if (property.match(/^border[A-Z]*|[A-Z]*color|height|left|opacity|top|width$/ig)) { // Check if the property can be animated
                        grab[property] = _getStyle(property); // get origin value
                        if (property.match(/^[A-Z]*color$/ig)) {
                            v[property] = chroma(values[property]);
                        } else {
                            v[property] = _parseValue(values[property], property); // get target value
                        }
                    }
                    engine.add(this, v, duration, easing, complete); // Add animation to engine
                }.bind(this));
                return this;
            }
            //  The fadeIn method animates the element's opacity, before setting its
            //  display property to block
            grab.fadeIn = function (duration, easing, complete) {
                this.display = 'block';
                this.animate({opacity: 1.0}, duration, easing, function () {
                    if (typeof complete === 'function') {
                        complete();
                    }
                }.bind(this));
                return this;
            }
            //  The fadeOut method animates the element's opacity, before setting its
            //  display property to none
            grab.fadeOut = function (duration, easing, complete) {
                this.animate({opacity: 0.0}, duration, easing, function () {
                    this.display = 'none';
                    if (typeof complete === 'function') {
                        complete();
                    }
                }.bind(this));
                return this;
            }
            
            //  The hide method sets the element's visibility to 'hidden'
            grab.hide = function () {
                this.visibility = 'hidden';
                return this;
            }
            //  The show method sets the element's visibility to 'visible'
            grab.show = function () {
                this.visibility = 'visible';
                return this;
            }
            //  The before method will remove itself from its current DOM location, and
            //  insert itself after the passed sibling
            grab.after = function (sibling) {
                var i;
                if (this.element.parentNode) {
                    if (aux.validateString(sibling)) {
                        sibling = this.after(_grab(sibling));
                    } else if (sibling && sibling.uid) {
                        //  Remove the sibling from the DOM if it has a parent node
                        if (sibling.element.parentNode) {
                            sibling.exit();
                        }
                        this.element.parentNode.insertBefore(sibling.element, this.element.nextSibling);
                    } else if (sibling.length) {
                        for (i = 0; i < sibling.length; i = i + 1) {
                            this.after(sibling[i]);
                        }
                    }
                } else { // If there is no parent node, return null
                    return null;
                }
                return sibling;
            }
            //  The before method will remove itself from its current DOM location, and
            //  insert itself before the passed sibling
            grab.before = function (sibling) {
                var i;
                if (this.element.parentNode) {
                    if (aux.validateString(sibling)) {
                        sibling = this.before(_grab(sibling));
                    } else if (sibling && sibling.uid) {
                        //  Remove the sibling from the DOM if it has a parent node
                        if (sibling.element.parentNode) {
                            sibling.exit();
                        }
                        this.element.parentNode.insertBefore(sibling.element, this.element);
                    } else if (sibling.length) {
                        for (i = 0; i < sibling.length; i = i + 1) {
                            this.before(sibling[i]);
                        }
                    }
                } else { // If there is no parent node, return null
                    return null;
                }
                return sibling;
            }
            //  The append method will remove the child from its current DOM location
            //  and append it inside of itself, returning itself
            grab.append = function (child) {
                var i;
                if (aux.validateString(child)) {
                    child = this.append(_grab(child));
                } else if (child && child.uid) {
                    if (child.element.parentNode) {
                        child.exit();
                    }
                    this.element.appendChild(child.element);
                    return child;
                } else if (child.length) {
                    for (i = 0; i < child.length; i = i + 1) {
                        this.append(child[i]);
                    }
                } else {
                    return null;
                }
                return child;
            }
            //  The prepend method will remove the child from its current DOM location
            //  and prepend it inside of itself, returning itself
            grab.prepend = function (child) {
                var i;
                if (aux.validateString(child)) {
                    child = this.prepend(_grab(child));
                } else if (child && child.uid) {
                    if (child.element.parentNode) {
                        child.exit();
                    }
                    this.element.prepend(child.element);
                    return child;
                } else if (child.length) {
                    for (i = 0; i < child.length; i = i + 1) {
                        this.append(child[i]);
                    }
                } else {
                    return null;
                }
                return child;
            }
            //  The exit method removes the owner from the DOM, returning itself
            grab.exit = function () {
                if (this.element.parentNode) {
                    this.element.parentNode.removeChild(this.element);
                    return this;
                }
                return null;
            }
            //  The remove method removes children from the owner's children nodes,
            //  returning itself
            grab.remove = function (child) {
                var i;
                if (Array.isArray(child)) { // Array of children
                    for (i = 0; i < child.length; i = i + 1) {
                        this.remove(child[i]);
                    }
                    return this;
                } else if (aux.isObject(child) && child.length) {  // Collection of children
                    for (i = 0; i < child.length; i = i + 1) {
                        this.remove(child[i]);
                    }
                    return this;
                } else if (child.nodeType > 0) { // DOM object
                    this.element.removeChild(_grab(child).element);
                    return this;
                } else if (child && child.uid) { // Grab object
                    this.element.removeChild(child.element);
                    return this;
                }
                return null;
            }
            //  The data method returns all 'data-*' attributes from the element, if no
            //  data object is passed; data object keys become the '*' label or the
            //  data attributes 'data-*'; if the method is used to set data, it will
            //  return itself, otherwise it will return an object of attributes and
            //  values
            grab.data = function (data, value) {
                var attributes = this.element.attributes,
                    a = {};
                if (aux.validateString(data) && aux.isString(value)) { // Data and value are string pairs
                    this.element.setAttribute('data-' + data, value);
                 }else if (aux.isObject(data)) { // Data is an object of key/value pairs
                    Object.keys(data).forEach(function (d) {
                        this.element.setAttribute('data-' + d, data[d]);
                    }.bind(this));
                } else if (!data) { // Get all 'data' attributes
                    Object.keys(attributes).forEach(function (d) {
                        var attribute = attributes[d].name;
                        if (attribute.match(/^data-[A-Z-]+$/ig)) {
                            //  If the attribute matches 'data-*', remove the 'data-'
                            //  substring and split the string at the hyphens; iterate
                            //  through each substring, changing any substring after
                            //  the first to capital case; then join it without spaces
                            //  and make it the key for the equivalent a object value
                            //  from the attributes object
                            a[aux.camelCase(attribute.replace(/^data-/g, ''))] = attributes[d].value;
                        }
                    });
                    return a;
                }
                return this;
            }
            //  The attr method can take a string and value pair and create an
            //  attribute on the element, or it can take an object of key/value pairs
            //  and bulk set them as attributes on the element, returning itself
            grab.attr = function (attr, value) {
                var attributes = this.element.attributes,
                    a = {};
                if (aux.validateString(attr) && aux.isString(value)) { // Attr and value are string pairs
                    this.element.setAttribute(attr, value);
                } else if (aux.isObject(attr)) { // Attr is an object of key/value pairs
                    Object.keys(attr).forEach(function (attribute) {
                        attribute = attribute.replace(/([A-Z])/g, '-1$').trim().toLowerCase();
                        this.element.setAttribute (attribute, attr[attribute]);
                    }.bind(this));
                } else if (!attr) {
                    Object.keys(attributes).forEach(function (d) {
                        var attribute = attributes[d].name;
                        a[aux.camelCase(attribute)] = attributes[d].value;
                    });
                    return a;
                }
                return this;
            }
            //  The classes method returns an array of element classes
            grab.getClass = function () {
                return Object.keys(this.element.classList).map(function (i) {
                    return this.element.classList[i];
                }.bind(this));
            }
            //  The addClass method adds a passed string, or array of strings as css
            //  classes on the element, returning itself
            grab.addClass = function (className) {
                if (aux.validateString(className)) {
                    if (className.search(',') > -1) { // Split the string at the commas, and let it casscade to the array block below
                        className = className.split(',');
                    } else { // Set class, removing all extra white space
                        this.element.classList.add(aux.strip(className));
                    }
                }
                if (Array.isArray(className)) {
                    className.forEach(function (name) {
                        if (aux.validateString(name)) {
                            this.element.classList.add(aux.strip(name));
                        }
                    }.bind(this));
                }
                return this;
            }
            //  The removeClass method removes a passed string, or array of strings as
            //  css classes on the element, returning itself
            grab.removeClass = function (className) {
                if (aux.validateString(className)) {
                    if (className.search(',') > -1) { // Split the string at the commas, and let it casscade to the array block below
                        className = className.split(',');
                    } else { // Set class, removing all extra white space
                        this.element.classList.remove(aux.strip(className));
                    }
                }
                if (Array.isArray(className)) {
                    className.forEach(function (name) {
                        if (aux.validateString(name)) {
                            this.element.classList.remove(aux.strip(name));
                        }
                    }.bind(this));
                }
                return this;
            }
            //  The toggleClass method toggles a passed string, or array of strings as
            //  css classes on the element, returning itself
            grab.toggleClass = function (className) {
                if (aux.validateString(className)) {
                    if (className.search(',') > -1) { // Split the string at the commas, and let it casscade to the array block below
                        className = className.split(',');
                    } else { // Set class, removing all extra white space
                        this.element.classList.toggle(aux.strip(className));
                    }
                }
                if (Array.isArray(className)) {
                    className.forEach(function (name) {
                        if (aux.validateString(name)) {
                            this.element.classList.toggle(aux.strip(name));
                        }
                    }.bind(this));
                }
                return this;
            }
            //  The css method takes a string property and value pair, or an object of
            //  key/value pairs; and updates the element's css appropriately, returning
            //  itself
            grab.css = function (property, value) {
                if (aux.validateString(property)) {
                    this.element.style[property] = value;
                } else if (aux.isObject(property)) {
                    Object.keys(property).forEach(function (p) {
                        this.element.style[p] = property[p];
                    }.bind(this));
                }
                return this;
            }
            //  The clear method removes all events of a particular type from an
            //  element, returning itself
            grab.clear = function (event) {
                var matched = [],
                    i;
                if (aux.validateString(event)) {
                    if (event === 'hover') {
                        for (i = 0; i < this.events.length; i = i + 1) {
                            if (this.events[i].event === 'mouseenter' || this.events[i].event === 'mouseleave') {
                                matched.push(this.events[i]);
                            }
                        }
                    } else {
                        for (i = 0; i < this.events.length; i = i + 1) {
                            if (this.events[i].event === event) {
                                matched.push(this.events[i]);
                            }
                        }
                    }
                } else if (!event) {
                    for (i = 0; i < this.events.length; i = i + 1) {
                        matched.push(this.events[i]);
                    }
                }
                matched.forEach(function (match) {
                    this.off(match.event, match);
                }.bind(this));
                return this;
            }
            //  The hover method sets a new hover event handler on the element,
            //  returning itself
            grab.hover = function (enter, leave) {
                if (enter && typeof enter === 'function') {
                    this.on('mouseenter', enter);
                }
                if (leave && typeof leave === 'function') {
                    this.on('mouseleave', leave);
                }
                return this;
            }
            //  The off method removes a new event handler onto the element,
            //  returning itself
            grab.off = function (event, action) {
                var i;
                if (action && action.action) { // Check if action is an event object
                    action = action.action;
                }
                for (i = 0; i < this.events.length; i = i + 1) {
                    if (this.events[i].action === action) {
                        break;
                    }
                }
                this.element.removeEventListener(event, this.events[i].action);
                this.events.remove(i);
                return this;
            }
            //  The on method adds a new event handler onto the element,
            //  returning itself
            grab.on = function (event, action, bool) {
                var i = this.events.add({event: event, action: action});
                this.element.addEventListener(event, this.events[i].action);
                if (bool) {
                    return this.events[i]
                }
                return this;
            }
            //  The child method parses a passed string and returns the direct children
            //  of the grab element that match, returning null if there is no match
            grab.child = function (child) {
                var children = [], // Array of children
                    i;
                if (aux.validateString(child)) {
                    //  Split strings delimited by commas and cycle through each
                    //  substring, pushing nodes that match into the children array
                    if (child.search(',') > -1) {
                        child.split(',').forEach(function (c) {
                            var nodes = this.element.children;
                            for (i = 0; i < nodes.length; i = i + 1) {
                                if (_selector(nodes[i], c)) {
                                    children.push(nodes[i]);
                                }
                            }
                        }.bind(this));
                    } else {
                        //  Cycle though the grab element's children nodes and search
                        //  for matches of the passed child argument
                        var nodes = this.element.children;
                        for (i = 0; i < nodes.length; i = i + 1) {
                            if (_selector(nodes[i], child)) {
                                children.push(nodes[i]);
                            }
                        }
                        //  If the children array is only one item, return a grab
                        //  object and not a collection of grab objects
                        if (children.length === 1) {
                            return _grab(children[0]);
                        }
                    }
                }
                //  If the children array has any length greater than 1, pass the array
                //  to the _collect function
                if (children.length > 1) {
                    return _collect(children);
                }
                return null;
            }
            //  The find method searches the elements children for a matching dom
            //  element, returning a new grab object
            grab.find = function (child) {
                var children = [];
                if (aux.validateString(child)) {
                    //  Select all children nodes that match the child argument
                    //  for matches of the passed child argument
                    children = this.element.querySelectorAll(child);
                    if (children.length === 1) { // Return a single grab object
                        return _grab(children[0]);
                    }
                }
                if (children.length > 1) { // Return a collection of grab objects
                    return _collect(children);
                }
                return null;
            }
            return grab;
        }
        //  The private collect function parses a passed parameter to create a new
        //  collection of grab objects
        //  A collection has all the same properties, getters and setters and methods
        //  as a grab object, where in these effect the collection as a whole
        function _collect (items) {
            var collection = aux.createStore(),
                i;
            //  The internal args function returns an array of passed arguments
            function _args (args) {
                var i,
                    a = [];
                for (i = 0; i < args.length; i = i + 1) {
                    a.push(args[i]);
                }
                return a;
            }
            //  The internal exec function applies an array of arguments to an action
            function _exec(action, args) {
                var i;
                for (i = 0; i < collection.length; i = i + 1) {
                    collection[i][action].apply(collection[i], args);
                }
                return null;
            }
            //  The internal execWithReturnValues applies an array of arguments to an
            //  action and returns an array of returned values
            function _execWithReturnArray(action, args) {
                var i,
                    returns = [];
                for (i = 0; i < collection.length; i = i + 1) {
//                    console.log(i);
                    returns.push(collection[i][action].apply(collection[i], args));
                }
                return returns;
            }
            //  METHODS
            //  Again, these methods cycle through the collection's "elements" to apply
            //  their action to all member grab elements; differences from the methods
            //  above will be noted
            collection.animate = function () {
                _exec('animate', _args(arguments));
                return this;
            }
            collection.fadeIn = function () {
                _exec('fadeIn', _args(arguments));
                return this;
            }
            collection.fadeOut = function () {
                _exec('fadeOut', _args(arguments));
                return this;
            }
            collection.hide = function () {
                _exec('hide', _args(arguments));
                return this;
            }
            collection.show = function () {
                _exec('show', _args(arguments));
                return this;
            }
            collection.after = function () {
                return this;
            }
            collection.before = function () {
                return this;
            }
            collection.append = function () {
                return this;
            }
            collection.prepend = function () {
                return this;
            }
            collection.exit = function () {
                _exec('exit', _args(arguments));
                return this;
            }
            collection.remove = function () {
                _exec('remove', _args(arguments));
                return this;
            }
            //  The data method on a collection will return an array of data attributes
            //  on each element, if not passed an object of data values
            collection.data = function (data, value) {
                var d = {},
                    r;
                if (aux.validateString(data) && aux.isString(value)) { // Data and value are string pairs
                    for (r = 0; r < this.length; r = r + 1) {
                        this[r].data(data, value);
                    }
                } else if (aux.isObject(data)) { // Data is an object or key/value pairs
                    for (r = 0; r < this.length; r = r + 1) {
                        this[r].data(data);
                    }
                } else if (!data) { // No data present, return a object of data objects, by member id
                    for (r = 0; r < this.length; r = r + 1) {
                        d[this[r].uid] = this[r].data();
                    }
                    return d;
                }
                return this;
            }
            //  The attr method on a collection will return an array of all attributes
            //  on each element, if not passed attr arguments
            collection.attr = function (attr, value) {
                var a = {},
                    r;
                if (aux.validateString(attr) && aux.isString(value)) { // Attr and value are string pairs
                    for (r = 0; r < this.length; r = r + 1) {
                        this[r].attr(attr, value);
                    }
                } else if (aux.isObject(attr)) { // Attr is an object or key/value pairs
                    for (r = 0; r < this.length; r = r + 1) {
                        this[r].attr(attr);
                    }
                } else if (!attr) { // No attr present, return a object of data objects, by member id
                    for (r = 0; r < this.length; r = r + 1) {
                        a[this[r].uid] = this[r].attr();
                    }
                    return a;
                }
                return this;
            }
            collection.addClass = function () {
                _exec('addClass', _args(arguments));
                return this;
            }
            collection.removeClass = function () {
                _exec('removeClass', _args(arguments));
                return this;
            }
            collection.toggleClass = function () {
                _exec('toggleClass', _args(arguments));
                return this;
            }
            collection.css = function () {
                _exec('css', _args(arguments));
                return this;
            }
            collection.clear = function () {
                _exec('clear', _args(arguments));
                return this;
            }
            collection.hover = function () {
                _exec('hover', _args(arguments));
                return this;
            }
            collection.off = function () {
                _exec('off', _args(arguments));
                return this;
            }
            collection.on = function () {
                _exec('on', _args(arguments));
                return this;
            }
            collection.child = function () {
                var children = [];
                _execWithReturnArray('child', _args(arguments)).forEach(function (col) {
                    var r;
                    for (r = 0; r < col.length; r = r + 1) {
                        children.push(col[r]);
                    }
                });
                return _collect(children);
            }
            collection.find = function () {
                var children = [];
                _execWithReturnArray('find', _args(arguments)).forEach(function (col) {
                    var r;
                    for (r = 0; r < col.length; r = r + 1) {
                        children.push(col[r]);
                    }
                });
                return _collect(children);
            }
            //  Add passed items
            for (i = 0; i < items.length; i = i + 1) {
                if (items[i].uid) {
                    collection.add(items[i]);
                } else if (items[i].nodeType) {
                    collection.add(_create(items[i]));
                } else if (aux.validateString(items[i])) {
                    collection.add(_create(document.querySelectorAll(items[i])[0]));
                }
            }
            //  Return final collection
            return collection;
        }
        //  The private grab function parses a passed parameter to create a new
        //  grab object
        function _grab (item) {
            var selected;
            if (aux.validateString(item)) { // remove extra white space
                if (item.match(/^<[a-z]+>$/ig)) { // A <tag> selector creates a new element
                    return _create(document.createElement(item.slice(1, -1)));
                } else { // An id selector
                    selected = document.querySelectorAll(item);
                }
            } else if (item.nodeType) { // Already a DOM object
                return _create(item);
            } else if (Array.isArray(item)) { // Array of selectos
                return _collect(item);
            }
            if (selected.length === 1) {
                return _create(selected[0]);
            } else if (selected.length > 1) {
                return _collect(selected);
            }
            return null;
        }
        //  Return a grab object
        return _grab(selector);
    }
}());