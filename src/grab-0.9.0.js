/*eslint-env browser*/


/* GRAB-1.2.0.js
Grab is a DOM manipulation library that I developed as a project to learn more about
how the DOM worked and can by changed. This library includes it's own animation engine
and abstraction layer to hide all the complicated features of the DOM.
For now I've kept the library to basic features and will slowly add new features.

By Ryan Fickenscher 7/6/19
https://github.com/zanayr
*/

var grab;
(function () {
    'use strict';
    var loop,
        color = {
            dictionary: {
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
            from: {
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
        };

    //  VALIDATION FUNCTIONS  //
    function validCollection (coll) {
        if (!coll)
            return false;
        return coll && Object.getPrototypeOf(coll) === GrabCollection.prototype;
    }
    function validElement (elem) {
        if (!elem)
            return false;
        return Object.getPrototypeOf(elem) === GrabElement.prototype;
    }
    function validFunction (func) {
        if (!func)
            return false;
        return Object.getPrototypeOf(func) === Function.prototype;
    }
    function validNumber (n) {
        return typeof n === 'number' && Number.isFinite(n);
    }
    function validLiteral (o) {
        var test = o,
            check = true;
        if (typeof o !== 'object' || o === null) {
            return false;
        } else {
            return (function () {
                while (check) {
                    if (Object.getPrototypeOf(test = Object.getPrototypeOf(test)) === null) {
                        check = false;
                        break;
                    }
                }
                return Object.getPrototypeOf(o) === test;
            }());
        }
    }
    function validString (s) {
        return typeof s === 'string' && s.length;
    }
    function validChannelObject (obj) {
        if (!validLiteral(obj))
            return false;
        return Object.keys(obj).map(function (channel) {
            if (/^alpha|blue|green|red$/ig.test(channel))
                return obj[channel];
        }).length ? true : false;
    }
    function validGrabColor (obj) {
        if (!obj)
            return false;
        return Object.getPrototypeOf(obj) === GrabColor.prototype;
    }
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
    function validColor (value) {
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
        if (validString(value)) {
            if (value.includes(',')) {
                match = parse(value.match(/(-?\d{1,3}(\.?\d*)?)+/g));
                if (match && match.length === 3) {
                    if (/^hsl\(/g.test(value) && percents(value) === 2) {
                        return validHsx(match) ? true : false;
                    } else if (/^hsv\(/g.test(value) && percents(value) === 2) {
                        return validHsx(match) ? true : false;
                    } else if (/^rgb\(/g.test(value) && !value.includes('%')) {
                        return validRgb(match) ? true : false;
                    } else if (!/[a-z]+/g.test(value) && percents(value) === 2) {
                        return validHsx(match) ? true : false;
                    } else if (!/[a-z]+/g.test(value) && !value.includes('%')) {
                        return validRgb(match) ? true : false;
                    }
                } else if (match && match.length === 4) {
                    if (/^hsla\(/g.test(value) && percents(value) === 2) {
                        return validHsx(match) ? true : false;
                    } else if (/^hsva\(/g.test(value) && percents(value) === 2) {
                        return validHsx(match) ? true : false;
                    } else if (/^rgba\(/g.test(value) && !value.includes('%')) {
                        return validRgb(match) ? true : false;
                    } else if (!/[a-z]+/g.test(value) && percents(value) === 2) {
                        return validHsx(match) ? true : false;
                    } else if (!/[a-z]+/g.test(value) && !value.includes('%')) {
                        return validRgb(match) ? true : false;
                    }
                }
            } else if (/^(?:#|0x|0X)?([\da-f]{1,8}){1}$/g.test(value)) {
                match = value.replace(/^#|0x/ig, '').match(/([\da-f])/g);
                if (match && (match.length === 4 || match.length === 8)) {
                    return true;
                } else if (match && (match.length !== 5 && match.length !== 7)) {
                    return true;
                }
            } else if (/^[a-z]{2,}$/g.test(value)) {
                match = color.dictionary[value];
                if (match && match.length === 3)
                    return true;
            }
        } else if (Array.isArray(value) && 2 < value.length && value.length < 5) {
            match = parse(value);
            if (match && percents(value) === 2) {
                if (match.length === 3) {
                    return validHsx(match) ? true : false;
                } else if (match.length === 4) {
                    return validHsx(match) ? true : false;
                }
            } else if (match && !percents(value)) {
                if (match.length === 3) {
                    return validRgb(match) ? true : false;
                } else if (match.length === 4) {
                    return validRgb(match) ? true : false;
                }
            }
        } else if (validGrabColor(value)) {
            return true;
        } else if (validChannelObject(value)) {
            return true;
        }
        return false;
    };
    
    //  AUXILLARY FUNCTIONS  //
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
    function parseColor (value) {
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
                match = color.dictionary[value];
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
        } else if (validGrabColor(value)) {
            return ['rgba'].concat(parse([value.red, value.green, value.blue, value.alpha]));
        } else if (validLiteral(value)) {
            return ['rgba'].concat(Object.keys(value).sort().reverse().map(function (channel) {
                if (/^alpha|blue|green|red$/ig.test(channel))
                    return value[channel] || 0;
            }));
        }
        return null;
    }
    function colorFrom (value) {
        var c = parseColor(value);
        return color.from[c[0]](c.slice(1));
    }
    function uniqueId (z) {
        if (!validNumber(z));
            z = 0;
        return ('xxxxxxxx-xxxx-' + z % 10 + 'xxx-yxxx-xxxxxxxxxxxx').replace(/[xy]/g, function(c) {
            var r = Math.random() * 16 | 0,
                v = c === 'x' ? r : (r & 0x3 | 0x8);
            return v.toString(16);
        });
    }

    //  GRAB COLOR OBJECT  //
    function GrabColor (value) {
        var arr = colorFrom(value);
        Object.defineProperties(this, {
            alpha: {
                enumerable: true,
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
                enumerable: true,
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
                enumerable: true,
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
                enumerable: true,
                get: function () {
                    return this.values.red;
                },
                set: function (value) {
                    if (0 <= value && value <= 255)
                        this.values.red = value;
                    return value;
                }
            },
            toRgba: {
                enumerable: false,
                value: function () {
                    return 'rgba(' + this.red + ', ' + this.green + ', ' + this.blue + ', ' + this.alpha + ')';
                }
            },
            values: {
                enumerable: false,
                value: {
                    alpha: typeof arr[3] === 'number' && Number.isFinite(arr[3]) ? arr[3] : 1,
                    blue: arr[2],
                    green: arr[1],
                    red: arr[0]
                }
            }
        });
    }

    //  ANIMATION OBJECT  //
    function Animation (origin, target, duration, easing) {
        Object.defineProperties(this, {
            complete: {
                get: function () {
                    return this.values.complete;
                }
            },
            current: {
                get: function () {
                    return this.values.current;
                },
                set: function (value) {
                    if (validNumber(value)) {
                        this.values.current = value;
                        if (value === this.target)
                            this.values.complete = 1;
                    } 
                }
            },
            distance: {
                get: function () {
                    return Math.abs(this.values.vector);
                }
            },
            duration: {
                get: function () {
                    return this.values.duration;
                }
            },
            easing: {
                get: function () {
                    return this.values.easing;
                }
            },
            last: {
                get: function () {
                    return this.values.last;
                },
                set: function (value) {
                    if (validNumber(value))
                        this.values.last = value;
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
                    if (validNumber(value))
                        this.values.time = value;
                }
            },
            values: {
                value: {
                    complete: 0,
                    current: origin,
                    duration: duration,
                    easing: easing,
                    last: undefined,
                    origin: origin,
                    target: target,
                    time: 0,
                    vector: target - origin
                }
            },
            vector: {
                get: function () {
                    return this.values.vector;
                }
            }
        });
    }

    //  UPDATE OBJECT  //
    function Update (object, property, origin, target, duration, easing, e, u) {
        Object.defineProperties(this, {
            animation: {
                get: function () {
                    return this.values.animation;
                }
            },
            eventId: {
                get: function () {
                    return this.values.eventId
                }
            },
            object: {
                get: function () {
                    return this.values.object;
                }
            },
            property: {
                get: function () {
                    return this.values.property;
                }
            },
            uniqueId: {
                get: function () {
                    return this.values.uniqueId;
                }
            },
            update: {
                value: function (property, value) {
                    this.object.update(property, value);
                }
            },
            values: {
                value: {
                    animation: new Animation(origin, target, duration, easing),
                    eventId: e,
                    object: object,
                    property: property,
                    uniqueId: uniqueId(u)
                }
            }
        });
    }
    Update.prototype.next = function (interpolation) {
        return this.animation.complete ? this.animation.current : this.animation.last + (this.animation.current - this.animation.last) * interpolation;
    };

    //  CHANNEL UPDATE OBJECT  //
    function ChannelUpdate (object, property, channel, origin, target, duration, easing, id) {
        Update.call(this, object, property, origin, target, duration, easing, id);
        this.values.channel = channel;
        Object.defineProperties(this, {
            channel: {
                get: function () {
                    return this.values.channel;
                }
            }
        });
    }
    ChannelUpdate.prototype = Object.create(Update.prototype);
    ChannelUpdate.prototype.next = function (interpolation) {
        var color = {};
        color[this.channel] = this.animation.complete ? this.animation.current : this.animation.last + (this.animation.current - this.animation.last) * interpolation;
        return color;
    };
    Object.defineProperty(ChannelUpdate.prototype, 'constructor', {
        value: ChannelUpdate,
        enumerable: false,
        writable: true
    });

    
    //  ANIMATION LOOP  //
    function Loop () {
        var _loop = this;
        //  Auxillary Functions  //
        function getArgs (args) {
            var i,
                j,
                arr = [],
                defaults = {0: 1000, 1: 'linear', 2: null},
                validation = [validNumber, validString, validFunction];
            for (i = 2; i < args.length; i = i + 1)
                for (j = 0; j < validation.length; j = j + 1)
                    arr.push(validation[j](args[i]) ? args[i] : defaults[j]);
            return arr;
        }
        function getWaiting () {
            if (_loop.waiting.length) {
                _loop.updates = _loop.updates.concat(_loop.waiting);
                _loop.waiting.length = 0;
            }
            return null;
        }
        
        //  Loop functions  //
        function update () {
            var i,
                len,
                progress = 0,
                animation;
            for (i = 0, len = _loop.updates.length; i < len; i = i + 1) {
                animation = _loop.updates[i].animation;
                //  Update animation's time and last position
                animation.time = animation.time + _loop.timestep;
                animation.last = animation.current;
                //  Calculate progress of the animation, if the result is
                //  greater than or eaqual to 1, it has reached its target
                progress = animation.time / animation.duration;
                animation.current = progress >= 1 ? animation.target : animation.vector * _loop.easingFunctions[animation.easing](progress) + animation.origin;
            }
            return null;
        }
        function panic () {
            _loop.delta = 0;
            return null;
        }
        function render (interpolation) {
            var i,
                len;
            for (i = 0, len = _loop.updates.length; i < len; i = i + 1)
                _loop.updates[i].update(_loop.updates[i].property, _loop.updates[i].next(interpolation));
            return null;
        }
        function collect () {
            var i,
                len,
                updates = [];
            for (i = 0, len = _loop.updates.length; i < len; i = i + 1) {
                if (_loop.updates[i].animation.complete) {
                    _loop.events.dispatch(_loop.updates[i].eventId);
                } else {
                    updates.push(_loop.updates[i]);
                }
            }
            _loop.updates = updates;
            return null;
        }
        function stop () {
            _loop.state = 0;
            window.cancelAnimationFrame(_loop.frameId);
            return null;
        }

        //  Loop Function  //
        function loop (timestamp) {
            var cycles = 0;
            if (_loop.state) {
                getWaiting();
                if (timestamp < _loop.lastFrameTime + _loop.timestep) {
                    _loop.frameId = window.requestAnimationFrame(loop);
                    return;
                }
                _loop.delta = _loop.delta + (timestamp - _loop.lastFrameTime);
                _loop.lastFrameTime = timestamp;
                if (timestamp > _loop.lastFrameTime + 1000) {
                    _loop.framesPerSecond = 0.25 * _loop.framesThisSecond + 0.75 * _loop.framesPerSecond;
                    _loop.lastFramesPerSecond = timestamp;
                    _loop.framesThisSecond = 0;
                }
                _loop.framesThisSecond = _loop.framesThisSecond + 1;
                while (_loop.delta >= _loop.timestep) {
                    update();
                    _loop.delta = _loop.delta - _loop.timestep;
                    cycles = cycles + 1;
                    if (cycles >= 240) {
                        panic();
                        break;
                    }
                }
                render(_loop.delta / _loop.timestep);
                collect();
                if (_loop.updates.length || _loop.waiting.length) {
                    _loop.frameId = window.requestAnimationFrame(loop);
                } else {
                    stop();
                }
            }
        }

        //  Start Function  //
        function start () {
            if (!_loop.state) {
                _loop.frameId = window.requestAnimationFrame(function (timestamp) {
                    _loop.state = 1;
                    render(1);
                    _loop.lastFrameTime = timestamp;
                    _loop.lastFramesPerSecond = timestamp;
                    _loop.framesThisSecond = 0;
                    _loop.frameId = window.requestAnimationFrame(loop);
                });
            }
            return null;
        }
        function removeDuplicates (object, property) {
            var i,
                len,
                updates = [];
                for (i = 0, len = _loop.updates.length; i < len; i = i + 1) {
                    if (object.uniqueId === _loop.updates[i].object.uniqueId && property === _loop.updates[i].property)
                        continue;
                    updates.push(_loop.updates[i]);
                }
                _loop.updates = updates;
                return null;

        }
        function add (object, values) {
            var args = getArgs(arguments),
                eventId = uniqueId().replace(/-/g, '_').toUpperCase();
            if (validLiteral(values)) {
                Object.keys(values).forEach(function (property, i) {
                    removeDuplicates(object, property);
                    if (/[A-Z]*color$/ig.test(property)) {
                        Object.keys(object[property]).forEach(function (channel, j) {
                            if (object[property][channel] !== values[property][channel])
                                _loop.waiting.push(new ChannelUpdate(object, property, channel, object[property][channel], values[property][channel], args[0], args[1], eventId, j));
                        });
                    } else {
                        _loop.waiting.push(new Update(object, property, object[property], values[property], args[0], args[1], eventId, i));
                    }
                });
                if (validFunction(args[2]))
                    _loop.events.register(eventId, args[2]);
            }
            if (!this.state)
                start();
            return null;
        }
        Object.defineProperties(this, {
            add: {
                value: add
            },
            delta: {
                get: function () {
                    return this.values.delta;
                },
                set: function (value) {
                    if (validNumber(value))
                        this.values.delta = value;
                }
            },
            easingFunctions: {
                value: {}
            },
            events: {
                value: {}
            },
            frameId: {
                get: function () {
                    return this.values.frameId;
                },
                set: function (value) {
                    if (validNumber(value))
                        this.values.frameId = value;
                }
            },
            framesPerSecond: {
                get: function () {
                    return this.values.framesPerSecond;
                },
                set: function (value) {
                    if (validNumber(value))
                        this.values.framesPerSecond = value;
                }
            },
            framesThisSecond: {
                get: function () {
                    return this.values.framesThisSecond;
                },
                set: function (value) {
                    if (validNumber(value))
                        this.values.framesThisSecond = value;
                }
            },
            lastFramesPerSecond: {
                get: function () {
                    return this.values.lastFramesPerSecond;
                },
                set: function (value) {
                    if (validNumber(value))
                        this.values.lastFramesPerSecond = value;
                }
            },
            lastFrameTime: {
                get: function () {
                    return this.values.lastFrameTime;
                },
                set: function (value) {
                    this.values.lastFrameTime = value;
                }
            },
            maxFramesPerSecond: {
                get: function () {
                    return this.values.maxFramesPerSecond;
                },
                set: function (value) {
                    if (validNumber(value))
                        this.values.maxFramesPerSecond;
                }
            },
            timestep: {
                get: function () {
                    return 1000 / this.maxFramesPerSecond;
                }
            },
            updates: {
                value: [],
                writable: true
            },
            values: {
                value: {
                    delta: 0,
                    frameId: 0,
                    framesPerSecond: 0,
                    framesThisSecond: 0,
                    lastFrameTime: 0,
                    maxFramesPerSecond: 60,
                    state: 0
                }
            },
            waiting: {
                value: []
            }
        });
        Object.defineProperties(this.easingFunctions, {
            linear: {
                value: function (d) {
                    return d;
                }
            }, 
            easeInQuad: {
                value: function (d) {
                    return Math.pow(d, 2);
                }
            },
            easeInCubic: {
                value: function (d) {
                    return Math.pow(d, 3);
                }
            },
            easeInQuart: {
                value: function (d) {
                    return Math.pow(d, 4);
                }
            },
            easeInQuint: {
                value: function (d) {
                    return Math.pow(d, 5);
                }
            },
            easeOutQuad: {
                value: function (d) {
                    return 1 - Math.pow(1 - d, 2);
                }
            },
            easeOutCubic: {
                value: function (d) {
                    return 1 - Math.pow(1 - d, 3);
                }
            },
            easeOutQuart: {
                value: function (d) {
                    return 1 - Math.pow(1 - d, 4);
                }
            },
            easeOutQuint: {
                value: function (d) {
                    return 1 - Math.pow(1 - d, 5);
                }
            }
        });
        Object.defineProperties(this.events, {
            events: {
                value: {}
            },
            dispatch: {
                value: function (id) {
                    if (!this.events[id])
                        return false;
                    setTimeout(function () {
                        if (!this.events[id])
                            return;
                        this.events[id].f();
                        delete this.events[id];
                    }.bind(this), 0);
                    return true;
                }
            },
            register: {
                value: function (id, fn) {
                    this.events[id] = {f: fn};
                    return id;
                }
            }
        })
    }

    //  GRAB ELEMENT  //
    function GrabElement (element, u) {
        var styles = window.getComputedStyle(element, '');
        Object.defineProperties(this, {
            addClass: {
                value: function (className) {
                    //  The addClass method adds a passed string, or array of
                    //  strings as css classes on the element, returning itself
                    var i;
                    if (typeof className === 'string' && className.length) {
                        if (className.includes(',')) {
                            className = className.split(',');
                        } else {
                            this.element.classList.add(className.replace(/\s/g, ''));
                        }
                    }
                    if (Array.isArray(className))
                        for (i = 0; i < className.length; i = i + 1)
                            this.addClass(className[i]);
                    return this;
                }
            },
            after: {
                value: function (sibling) {
                    //  The after method will remove itself from its current DOM
                    //  location, and insert itself after the passed sibling,
                    //  returning itself
                    var i;
                    if (validString(sibling)) {
                        this.after(grab(sibling));
                    } else if (sibling && sibling.uniqueId) {
                        //  Remove the sibling from the DOM if it has a parent node
                        if (sibling.element.parentNode)
                            sibling.exit();
                        this.element.parentNode.insertBefore(sibling.element, this.element.nextSibling);
                    } else if (sibling.length) {
                        for (i = 0; i < sibling.length; i = i + 1)
                            this.after(sibling[i]);
                    }
                    return this;
                }
            },
            animate: {
                value: function (values, duration, easing, complete) {
                    var translated = {},
                        property;
                    for (property in values) {
                        if (values.hasOwnProperty(property) && /^[A-Z]*color|height|left|opacity|top|width$/ig.test(property)) {
                            // this[property] = getStyle(this.element, property); // <-- do i still need this?
                            translated[property] = /^[A-Z]*color$/ig.test(property) ? new GrabColor(values[property]) : this.parse(property, values[property]);
                        }
                        loop.add(this, translated, duration, easing, complete);
                    }
                    return this;
                }
            },
            append: {
                value: function (child) {
                    //  The append method will remove the child from its current DOM location
                    //  and append it inside of itself, returning itself
                    var i;
                    if (validString(child)) {
                        child = this.append(grab(child));
                    } else if (child && child.uniqueId) {
                        if (child.element.parentNode)
                            child.exit();
                        this.element.appendChild(child.element);
                    } else if (child.length) {
                        for (i = 0; i < child.length; i = i + 1)
                            this.append(child[i]);
                    }
                    return this;
                }
            },
            attr: {
                value: function (attr, value) {
                    //  The attr method can take a string and value pair and create
                    //  an attribute on the element, or it can take an object of
                    //  key/value pairs and bulk set them as attributes on the
                    //  element, returning itself
                    var attrs = this.element.attributes,
                        a,
                        o = {};
                    if (validString(attr) && validString(value)) {
                        this.element.setAttribute(attr.replace(/([A-Z])/g, '-1$').trim().toLowerCase(), value);
                    } else if (validLiteral(attr)) {
                        for (a in attr)
                            this.element.setAttribute(a.replace(/([A-Z])/g, '-1$').trim().toLowerCase(), attr[a]);
                    } else if (!attr) {
                        Object.keys(attrs).forEach(function (a) {
                            var key = attrs[a].name.split('-').map(function (s, i) {
                                return i ? s[0].toUpperCase() + s.slice(1).toLowerCase() : s;
                            }).join('');
                            //  Split the string at the hyphens; iterate
                            //  through each substring, changing any substring
                            //  after the first to capital case; then join it
                            //  without spaces and make it the key for the
                            //  equivalent object value from the attributes object
                            o[key] = attrs[a].value;
                        });
                        return o;
                    }
                    return this;
                }
            },
            backgroundColor: {
                get: function () {
                    return this.values.backgroundColor;
                },
                set: function (value) {
                    var c;
                    if (validColor(value)) {
                        c = validLiteral(value) ? new GrabColor(Object.assign(Object.assign({}, this.values.backgroundColor.values), value)) : new GrabColor(value);
                        this.values.backgroundColor = c;
                        this.element.style.backgroundColor = c.toRgba();
                    }
                    return value;
                }
            },
            before: {
                value: function (sibling) {
                    //  The before method will remove itself from its current DOM
                    //  location, and insert itself before the passed sibling,
                    //  returning itself
                    var i;
                    if (validString(sibling)) {
                        this.before(grab(sibling));
                    } else if (sibling && sibling.uniqueId) {
                        //  Remove the sibling from the DOM if it has a parent node
                        if (sibling.element.parentNode)
                            sibling.exit();
                        this.element.parentNode.insertBefore(sibling.element, this.element);
                    } else if (sibling.length) {
                        for (i = 0; i < sibling.length; i = i + 1)
                            this.before(sibling[i]);
                    }
                    return this;
                }
            },
            child: {
                value: function (child) {
                    var children = [];
                    if (validString(child)) {
                        if (child.includes(',')) {
                            this.children.each(function (ch) {
                                child.split(',').forEach(function (c) {
                                    ch.selector.match(/(#?\.?[a-z][\da-z]*)/ig).forEach(function (s) {
                                        if (s === c)
                                            children.push(ch);
                                    });
                                });
                            });
                        } else {
                            this.children.each(function (ch) {
                                ch.selector.match(/(#?\.?[a-z][\da-z]*)/ig).forEach(function (s) {
                                    if (s === child)
                                        children.push(ch);
                                });
                            });
                        }
                    }
                    if (children.length)
                        return children.length === 1 ? new GrabElement(children[0]) : new GrabCollection(children);
                    return null;
                }
            },
            children: {
                get: function () {
                    return new GrabCollection(this.element.children);
                }
            },
            clear: {
                value: function (event) {
                    var e;
                    if (validString(event)) {
                        for (e in Object.assign({}, this.events)) {
                            if (this.events[e].event === event) {
                                if (event === 'hover') {
                                    this.element.removeEventListener('mouseenter', this.events[e].fn.enter);
                                    this.element.removeEventListener('mouseleave', this.events[e].fn.exit);
                                } else {
                                    this.element.removeEventListener(this.events[e].event, this.events[e].fn);
                                }
                                delete this.events[e];
                            }
                        }
                    } else if (!event) {
                        for (e in Object.assign({}, this.events)) {
                            this.element.removeEventListener(this.events[e].event, this.events[e].fn);
                            delete this.events[e];
                        }
                    }
                    return null;
                }
            },
            color: {
                get: function () {
                    return this.values.color;
                },
                set: function (value) {
                    var c;
                    if (validColor(value)) {
                        c = validLiteral(value) ? new GrabColor(Object.assign(Object.assign({}, this.values.color.values), value)) : new GrabColor(value);
                        this.values.color = c;
                        this.element.style.color = c.toRgba();
                    }
                }
            },
            css: {
                value: function (property, value) {
                    //  The css method takes a string property and value pair, or
                    //  an object of key/value pairs; and updates the element's css
                    //  appropriately, returning itself
                    var p;
                    if (validString(property)) {
                        this.element.style[property] = value;
                    } else if (validLiteral(property)) {
                        for (p in property)
                            this.element.style[p] = property[p];
                    }
                    return this;
                }
            },
            data: {
                value: function (data, value) {
                    //  The data method returns all 'data-*' attributes from the
                    //  element, if no data object is passed; data object keys
                    //  become the '*' label or the data attributes 'data-*'; if
                    //  the method is used to set data, it will return itself,
                    //  otherwise it will return an object of attributes and values
                    var attrs = this.element.attributes,
                        d,
                        o = {};
                    if (validString(data) && validString(value)) {
                        this.element.setAttribute('data-' + data, value);
                    } else if (validLiteral(data)) {
                        for (d in data)
                            this.element.setAttribute('data-' + d, data[d]);
                    } else if (!data) {
                        Object.keys(attrs).forEach(function (a) {
                            var attr = attrs[a].name,
                                key = attr.replace(/^data-/g, '').split('-').map(function (s, i) {
                                    return i ? s[0].toUpperCase() + s.slice(1).toLowerCase() : s;
                                }).join('');
                            if (/^data-[A-Z-]+$/ig.test(attr))
                                //  If the attribute matches 'data-*', remove the
                                //  'data-' substring and split the string at the
                                //  hyphens; iterate through each substring,
                                //  changing any substring after the first to
                                //  capital case; then join it without spaces and
                                //  make it the key for the equivalent object value
                                //  from the attributes object
                                o[key] = attrs[a].value;
                        });
                        return o;
                    }
                    return this;
                }
            },
            display: {
                get: function () {
                    return this.values.display;
                },
                set: function (value) {
                    if (validString(value)) {
                        this.element.style.display = value;
                        this.values.display = this.element.style.display; // Return last valid display setting
                    }
                    return value;
                }
            },
            events: {
                value: {}
            },
            fadeIn: {
                value: function () {

                }
            },
            fadeOut: {
                value: function () {

                }
            },
            find: {
                value: function (child) {
                    //  The find method searches the elements children for a matching dom
                    //  element, returning a new grab object
                    var children = [];
                    if (validString(child)) {
                        //  Select all children nodes that match the child argument
                        //  for matches of the passed child argument
                        children = this.element.querySelectorAll(child);
                        if (children)
                            return children.length === 1 ? new GrabElement(children[0]) : new GrabCollection(children);
                    }
                    return null;
                }
            },
            element: {
                value: element
            },
            exit: {
                value: function () {
                    //  The exit method removes itself from the DOM, returning itself
                    if (this.element.parentNode)
                        this.element.parentNode.removeChild(this.element);
                    return this;
                }
            },
            getClass: {
                value: function () {
                    //  The getClass method returns an array of element classes
                    return this.element.className.split(' ');
                }
            },
            height: {
                get: function () {
                    return this.values.height
                },
                set: function (value) {
                    var h = this.parse('height', value);
                    if (validNumber(h)) {
                        this.values.height = h;
                        this.element.style.height = h + 'px';
                    }
                    return value;
                }
            },
            hide: {
                value: function () {
                    //  The hide method sets the element's visibility to `hidden`,
                    //  returning itself
                    this.visibility = 'hidden';
                    return this;
                }
            },
            hover: {
                value: function (enter, exit) {
                    var id = uniqueId();
                    if (validFunction(enter) || validFunction(exit)) {
                        this.events[id] = {event: 'hover', fn: {}};
                        if (validFunction(enter)) {
                            this.events[id].fn = {enter: enter.bind(this)};
                            this.element.addEventListener('mouseenter', this.events[id].fn.enter);
                        }
                        if (validFunction(exit)) {
                            Object.assign(this.events[id].fn, {exit: exit.bind(this)});
                            this.element.addEventListener('mouseleave', this.events[id].fn.exit);
                        }
                    }
                    return this;
                }
            },
            html: {
                get: function () {
                    return this.element.innerHTML;
                },
                set: function (value) {
                    if (typeof value === 'string')
                        this.element.innerHTML = value;
                    return value;
                }
            },
            id: {
                get: function () {
                    return this.element.id;
                },
                set: function (value) {
                    if (validString(value) && /^[a-z][\da-zA-Z-_]+$/g.test(value))
                        this.element.id = value;
                    return value;
                }
            },
            left: {
                get: function () {
                    return this.values.left;
                },
                set: function (value) {
                    var l = this.parse('left', value);
                    if (validNumber(l)) {
                        this.values.left = l;
                        this.element.style.left = l + 'px';
                    }
                    return l;
                }
            },
            off: {
                value: function (id) {
                    var e;
                    if (validString(id)) {
                        this.element.removeEventListener(this.events[id].event, this.events[id].fn);
                        delete this.events[id];
                    } else if (!id) {
                        for (e in Object.assign({}, this.events))
                            this.off(e);
                    }
                    return null;
                }
            },
            on: {
                value: function (event, fn) {
                    var id = uniqueId();
                    if (validString(event) && validFunction(fn)) {
                        this.events[id] = {event: event, fn: fn.bind(this)};
                        this.element.addEventListener(event, this.events[id].fn);
                        return id;
                    }
                    return null;
                }
            },
            parse: {
                value: function (property, value) {
                    if (typeof value === 'string' && value.length) {
                        if (/^border[A-Z]*|height|left|top|width$/ig.test(property)) {
                            if (/^-?\d+\.?\d*px$/g.test(value)) {
                                return parseFloat(value, 10);
                            } else if (/^-?\d+\.?\d*vw$/g.test(value)) {
                                return window.innerWidth * (parseFloat(value, 10) / 100);
                            } else if (/^-?\d+\.?\d*vh$/g.test(value)) {
                                return window.innerHeight * (parseFloat(value, 10) / 100);
                            } else if (/^\d+\.?\d*%$/g.test(value)) {
                                if (/^height|top/ig.test(property)) {
                                    return this.element.parentNode.offsetHeight * (parseFloat(value, 10) / 100);
                                } else if (/^left|width$/ig.test(property)) {
                                    return this.element.parentNode.offsetWidth * (parseFloat(value, 10) / 100);
                                }
                            }
                        } else if (property === 'opacity') {
                            if (/^\d{1,3}\.?\d*%$/g.test(value)) {
                                return parseFloat(value, 10) / 100;
                            } else if (/^\d+\.?\d*$/g.test(value)) {
                                return parseFloat(value, 10);
                            }
                        }
                    } else if (validNumber(value)) {
                        return value;
                    }
                    return null;
                }
            },
            prepend: {
                value: function (child) {
                    //  The prepend method will remove the child from its current DOM location
                    //  and prepend it inside of itself, returning itself
                    var i;
                    if (validString(child)) {
                        this.prepend(grab(child));
                    } else if (validElement(child)) {
                        if (child.element.parentNode)
                            child.exit();
                        this.element.prepend(child.element);
                    } else if (child.length) {
                        for (i = 0; i < child.length; i = i + 1)
                            this.prepend(child[i]);
                    }
                    return this;
                }
            },
            remove: {
                value: function (child) {
                    //  The remove method removes children from the owner's children nodes,
                    //  returning itself
                    var i;
                    if (!child || child.element.parentNode !== this.element)
                        return this;
                    if (validString(child)) {
                        this.remove(grab(child));
                    } else if (validElement(child)) {
                        this.element.removeChild(child.element);
                    } else if (child.nodeType) {
                        this.element.removeChild(child);
                    } else if (child.length) {
                        for (i = 0; i < child.length; i = i + 1)
                            this.remove(child[i]);
                    }
                    return this;
                }
            },
            removeClass: {
                value: function (className) {
                    //  The removeClass method removes a passed string, or array of
                    //  strings as css classes on the element, returning itself
                    var i;
                    if (validString(className)) {
                        if (className.includes(',')) {
                            className = className.split(',');
                        } else {
                            this.element.classList.remove(className.replace(/\s/g, ''));
                        }
                    }
                    if (Array.isArray(className))
                        for (i = 0; i < className.length; i = i + 1)
                            this.removeClass(className[i]);
                    return this;
                }
            },
            selector: {
                get: function () {
                    var id = this.id ? '#' + this.id : '',
                        classes = this.element.className.length > 0 ? '.' + this.element.className.replace(' ', '.') : '';
                    return this.element.tagName.toLowerCase() + id + classes;
                }
            },
            show: {
                value: function () {
                    //  The show method sets the element's visibility to `visible`,
                    //  returning itself
                    this.visibility = 'visible';
                    return this;
                }
            },
            opacity: {
                get: function () {
                    return this.values.opacity;
                },
                set: function (value) {
                    var o = this.parse('opacity', value);
                    if (validNumber(o) && 0 <= o && o <= 1) {
                        this.values.opacity = o;
                        this.element.style.opacity = o;
                    }
                    return value;
                }
            },
            toggle: {
                value: function () {
                    //  The toggle method sets the element's display to either
                    //  `none` or `block`, returning itself
                    this.display = this.display === 'none' ? 'block' : 'none';
                    return this;
                }
            },
            toggleClass: {
                value: function (className) {
                    //  The toggleClass method toggles a passed string, or array of
                    //  strings as css classes on the element, returning itself
                    var i;
                    if (validString(className)) {
                        if (className.includes(',')) {
                            className = className.split(',');
                        } else {
                            this.element.classList.toggle(className.replace(/\s/g, ''));
                        }
                    }
                    if (Array.isArray(className))
                        for (i = 0; i < className.length; i = i + 1)
                            this.toggleClass(className[i]);
                    return this;
                }
            },
            top: {
                get: function () {
                    return this.values.top
                },
                set: function (value) {
                    var t = this.parse('top', value);
                    if (validNumber(t)) {
                        this.values.top = t;
                        this.element.style.top = t + 'px';
                    }
                    return value;
                }
            },
            uniqueId: {
                value: uniqueId(u)
            },
            update: {
                value: function (property, value) {
                    this[property] = value;
                }
            },
            values: {
                value: {
                    backgroundColor: new GrabColor(styles['backgroundColor']),
                    color: new GrabColor(styles['color']),
                    display: styles['display'],
                    height: parseFloat(styles['height'], 10),
                    left: parseFloat(styles['left'], 10),
                    opacity: parseFloat(styles['opacity'], 10),
                    top: parseFloat(styles['top'], 10),
                    visibility: styles['visibility'],
                    width: parseFloat(styles['width'], 10),
                    zIndex: styles['zIndex']
                }
            },
            visibility: {
                get: function () {
                    return this.values.visibility;
                },
                set: function (value) {
                    if (validString(value)) {
                        this.element.style.visibility = value;
                        this.values.visibility = this.element.style.visibility; // get last valid visibility
                    }
                    return value;
                }
            },
            width: {
                get: function () {
                    return this.values.width;
                },
                set: function (value) {
                    var w = this.parse('width', value);
                    if (validNumber(w)) {
                        this.values.width = w;
                        this.element.style.width = w + 'px';
                    }
                    return value;
                }
            },
            zIndex: {
                get: function () {
                    return this.values.zIndex;
                },
                set: function (value) {
                    var z = parseInt(value, 10);
                    if (validNumber(z)) {
                        this.values.zIndex = z;
                        this.element.style.zIndex = z;
                    }
                    return value;
                }
            }
        });
    }

    //  GRAB COLLECTION  //
    function GrabCollection (items) {
        var i;
        for (i = 0; i < items.length; i = i + 1)
            Object.defineProperty(this, i, {value: validElement(items[i]) ? items[i] : new GrabElement(items[i], i)});
        Object.defineProperties(this, {
            concat: {
                value: function (collection) {
                    var j,
                        a = [];
                    if (validCollection(collection)) {
                        for (j = 0; j < this.length + collection.length; j = j + 1)
                            a.push(j < this.length ? this[j] : collection[j]);
                        return new GrabCollection(a);
                    }
                    return null;
                }
            },
            each: {
                value: function (fn) {
                    var j;
                    for (j = 0; j < this.length; j = j + 1)
                        fn.apply(null, [this[j], j]);
                    return this;
                }
            },
            filter: {
                value: function (fn) {
                    var j,
                        a = [];
                    for (j = 0; j < this.length; j = j + 1)
                        if (fn.apply(null, [this[j], j]))
                            a.push(this[j]);
                    return new GrabCollection(a);
                }
            },
            length: {
                value: i
            },
            slice: {
                value: function (start, count) {
                    var j,
                        a = [],
                        m = start + count > this.length ? this.length : start + count;
                    for (j = start; j < m; j = j + 1)
                        a.push(this[j]);
                    return new GrabCollection(a);
                }
            },
            splice: {
                value: function (start, count, value) {
                    var j,
                        a = [],
                        m = start + count > this.length ? this.length : start + count;
                    for (j = start; j < m + value.length; j = j + 1)
                        a.push(j < m ? this[j] : value[j - m]);
                    if (m < this.length);
                        for (j = m; j < this.length; j = j + 1)
                            a.push(this[j]);
                    return new GrabCollection(a);
                }
            }
        });
    }
    
    grab = function (selector) {
        var selected;
        if (typeof selector === 'string') {
            if (/^<[a-z][\da-z]*>$/g.test(selector)) {
                return new GrabElement(document.createElement(selector.slice(1, -1)));
            } else if (/^#/g.test(selector)) {
                selected = document.getElementById(selector.slice(1));
            } else if (/^\./g.test(selector)) {
                selected = document.getElementsByClassName(selector.slice(1));
            } else if (/^[a-z][\da-z]*$/g.test(selector)) {
                selected = document.getElementsByTagName(selector);
            } else if (/(#?\.?[a-z][\da-z]*)/g.test(selector)) {
                selected = document.querySelectorAll(selector);
            } else if (selector.includes(',')) {
                selected = selector.split(',').map(function (s) {
                    return grab(s);
                });
            }
            if (selected && selected.length) {
                return selected.length === 1 ? new GrabElement(selected[0]) : new GrabCollection(selected);
            } else if (selected.nodeType) {
                return new GrabElement(selected);
            }
        } else if (selector.nodeType) {
            return new GrabElement(selector);
        } else if (Array.isArray(selector)) {
            return new GrabCollection(selector);
        } else if (selected && selected.length) {
            return new GrabCollection(selector);
        }
        return null;
    }
    loop = new Loop();
}());