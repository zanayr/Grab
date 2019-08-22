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
        color,
        x11Dictionary;
    //  The `x11Dictionary` is an object that is used to translate the 147 browser
    //  standard (x11) colors into an array of RGB values
    x11Dictionary = {
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
    };
    //  FROM FUNCTIONS  //
    //  The `fromHex` function should return a valid array of RGB values from an array
    //  of parsed hexidecimal values
    function fromHex (arr) {
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
    }
    //  The `fromHexa` function should return a valid array of RGBA values from an
    //  array of hexidecimal values
    function fromHexa (arr) {
        switch (arr.length) {
            case 4:
                return [parseInt(arr[0] + arr[0], 16), parseInt(arr[1] + arr[1], 16), parseInt(arr[2] + arr[2], 16), Math.round(parseInt(arr[3] + arr[3], 16) / 2.55) / 100];
            default:
                return [parseInt(arr[0] + arr[1], 16), parseInt(arr[2] + arr[3], 16), parseInt(arr[4] + arr[5], 16), Math.round(parseInt(arr[6] + arr[7], 16) / 2.55) / 100];
        }
    }
    //  The `fromHsl` function should return an array of RGB values from an array of
    //  parsed HSL values
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
    //  The `fromHsla` function should return an array of RGBA values from an array of
    //  parsed HSLA values
    function fromHsla (arr) {
        return fromHsl(arr).concat(Math.round(100 * arr[3]) / 100);
    }
    //  The `fromHsv` function should return an array of RGB values from an array of
    //  parsed HSV values
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
    //  The `fromHsva` function should return an array of RGBA values from an array of
    //  parsed HSVA values
    function fromHsva (arr) {
        return fromHsv(arr).concat(Math.round(100 * arr[3]) / 100);
    }
    //  The `fromRGB` function does nothing more than return a passed array
    function fromRgb (arr) {
        return arr;
    }
    //  The `fromRgba` function should return an array of RGBA values from an array of
    //  parsed RGBA values
    function fromRgba (arr) {
        return [arr[0], arr[1], arr[2], Math.round(100 * arr[3]) / 100];
    }
    //  The `fromX11` function does nothing more than return a passed array
    function fromX11 (arr) {
        return arr;
    }
    //  The `color` object is iterated though to convert parsed color models into
    //  arrays of either RGB or RGBA values
    color = {
        hex: fromHex,
        hexa: fromHexa,
        hsl: fromHsl,
        hsla: fromHsla,
        hsv: fromHsv,
        hsva: fromHsva,
        rgb: fromRgb,
        rgba: fromRgba,
        x11: fromX11
    }







    //  AUXILLARY FUNCTIONS  //
    //  The `validCollection` function should return true if a passed object is a
    //  `GrabCollection` prototype
    function validCollection (coll) {
        if (!coll)
            return false;
        return coll && Object.getPrototypeOf(coll) === GrabCollection.prototype;
    }
    //  The `validElement` function should return true if a passed object is a
    //  `GrabElement` prototype
    function validElement (elem) {
        if (!elem)
            return false;
        return Object.getPrototypeOf(elem) === GrabElement.prototype;
    }
    //  The `validFunction` function should return true if a passed object is a
    //  `Function` prototype
    function validFunction (func) {
        if (!func)
            return false;
        return Object.getPrototypeOf(func) === Function.prototype;
    }
    //  `The `validNumber` function should return true if a passed object is a
    //  valid number
    function validNumber (n) {
        return typeof n === 'number' && Number.isFinite(n);
    }
    //  The `validLiteral` function should return true if a passed object is in fact
    //  an object literal
    function validLiteral (o) {
        var test = o,
            check = true;
        //  Return false if the passed object is not an object or is null
        if (typeof o !== 'object' || o === null) {
            return false;
        } else {
            //  While `check` is true, check if the prototype of `test` is null, if it
            //  is, break out and return true if the prototype of the passed object is
            //  the last `test` prototype
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
    //  The `validString` function should return true if the passed object is a string
    function validString (s) {
        return typeof s === 'string' && s.length;
    }
    //  The `validChannelObject` function should return true is the passed object is an
    //  object literal and contains at least one color channel property (red, green,
    //  blue or alpha)
    function validChannelObject (obj) {
        if (!validLiteral(obj))
            return false;
        return Object.keys(obj).map(function (channel) {
            if (/^alpha|blue|green|red$/ig.test(channel))
                return obj[channel];
        }).length ? true : false;
    }
    //  The `validGrabColor` function should return true if the passed object is a
    //  `GrabColor` prototype
    function validGrabColor (obj) {
        if (!obj)
            return false;
        return Object.getPrototypeOf(obj) === GrabColor.prototype;
    }
    //  The `validHsx` function should return true if a passed array's are within the
    //  range of valid values for the HSL, HSLA, HSX or HSXA color models
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
    //  The `validRgb` function should return true if a passed array's are within the
    //  range of valid values for the RGB, RGBA, color models
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
    //  The `validColor` function should return true is a passed value is a valid color
    //  model
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
                //  The value passed is a string delimited by commas e.g.
                //  `rgb(255, 255, 255)`
                match = parse(value.match(/(-?\d{1,3}(\.?\d*)?)+/g));
                if (match && match.length === 3) {
                    //  The delimited value is either an HSL, HSV or RGB model
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
                    //  The delimited value is either an HSLA, HSVA or RGBA model
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
                //  THe value passed is a hexidecimal string
                match = value.replace(/^#|0x/ig, '').match(/([\da-f])/g);
                if (match && (match.length === 4 || match.length === 8)) {
                    //  The passed value is a hexidecimal color model containing an
                    //  alpha channel
                    return true;
                } else if (match && (match.length !== 5 && match.length !== 7)) {
                    //  The passed value is a hexidecimal color model
                    return true;
                }
            } else if (/^[a-z]{2,}$/g.test(value)) {
                //  Check if the passed value is an x11 string
                match = x11Dictionary[value];
                if (match && match.length === 3)
                    return true;
            }
        } else if (Array.isArray(value) && 2 < value.length && value.length < 5) {
            //  The passed value is an array of values
            match = parse(value);
            if (match && percents(value) === 2) {
                //  the passed array contains percents and is likely an HSX/A model
                if (match.length === 3) {
                    return validHsx(match) ? true : false;
                } else if (match.length === 4) {
                    return validHsx(match) ? true : false;
                }
            } else if (match && !percents(value)) {
                //  The passed array contains no percents and is likely an RGB/A model
                if (match.length === 3) {
                    return validRgb(match) ? true : false;
                } else if (match.length === 4) {
                    return validRgb(match) ? true : false;
                }
            }
        } else if (validGrabColor(value)) {
            //  The passed value is a `GrabColor` object
            return true;
        } else if (validChannelObject(value)) {
            //  The passed value is an object literal of color channels
            return true;
        }
        return false;
    };
    //  The `parseColor` function should parse a passed value into an array of parsed
    //  values and works much like the `validColor` function
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
    //  The `colorFrom` function parses a pased value and converts it into an array of
    //  RGB/A values using the From Functions above
    function colorFrom (value) {
        var c = parseColor(value);
        return color[c[0]](c.slice(1));
    }
    //  The `uniqueId` function returns a 32 character hexidecimal unique
    //  identification string
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
    //  The `GrabColor` function returns a new `GrabColor` prototype and is used for
    //  all color properties and animations
    function GrabColor (value) {
        var arr = colorFrom(value);
        Object.defineProperties(this, {
            alpha: {
                //  The `alpha` property gets and sets the alpha value of the object
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
                //  The `blue` property gets and sets the blue value of the object
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
                //  The `green` property gets and sets the green value of the object
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
                //  The `red` property gets and sets the red value of the object
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
                //  The `toRgba` method returns an rgba model string of the color
                //  channel values
                enumerable: false,
                value: function () {
                    return 'rgba(' + this.red + ', ' + this.green + ', ' + this.blue + ', ' + this.alpha + ')';
                }
            },
            values: {
                //  The `values` object stores the color channel values
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

    //  GRAB ANIMATION OBJECT  //
    //  The `GrabAnimation` function returns a `GrabAnimation` object that is used in
    //  loop's `update` and `render` functions; the function should be passed origin,
    //  target, duration and easing (a string) values
    function GrabAnimation (origin, target, duration, easing) {
        Object.defineProperties(this, {
            complete: {
                //  The `complete` property is a flag to alert the loop that its
                //  animation has finished and is time to be garbage collected
                get: function () {
                    return this.values.complete;
                }
            },
            current: {
                //  The `current` property gets and sets the current value of the
                //  animation's property and is used in the loop's `render` function
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
                //  The `distance` property gets the absolute value of the `vector`
                //  property
                get: function () {
                    return Math.abs(this.values.vector);
                }
            },
            duration: {
                //  The `duration` property gets the duration value of the animation
                get: function () {
                    return this.values.duration;
                }
            },
            easing: {
                //  The `easing` property gets the easing string of the animation
                get: function () {
                    return this.values.easing;
                }
            },
            last: {
                //  The `last` property gets and sets the last value of the animation
                //  and is used in the loop's `render` function
                get: function () {
                    return this.values.last;
                },
                set: function (value) {
                    if (validNumber(value))
                        this.values.last = value;
                }
            },
            origin: {
                //  The `origin` property returns the origin value of the animation
                get: function () {
                    return this.values.origin;
                }
            },
            target: {
                //  The `target` property returns the target value of the animation
                get: function () {
                    return this.values.target;
                }
            },
            time: {
                //  The `time` property returns the total time elapsed during the
                //  animation and is used to get the animation's progress in the loop's
                //  `update` function
                get: function () {
                    return this.values.time;
                },
                set: function (value) {
                    if (validNumber(value))
                        this.values.time = value;
                }
            },
            //  The `values` property is used to store the values of the animation
            //  object
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
                }
            },
            //  The `vector` property returns the difference between the target value
            //  and origin value and is used to calculate distance
            vector: {
                get: function () {
                    return this.target - this.origin;
                }
            }
        });
    }

    //  GRAB UPDATE OBJECT  //
    //  The `GrabUpdate` function returns an `GrabUpdate` prototypical object that is
    //  used during animations to update a `GrabElement`; it should be passed a
    //  `GrabElement`, property (string), origin, target, duration, easing (string),
    //  event id (string) and unique id (string) values
    function GrabUpdate (object, property, origin, target, duration, easing, e, u) {
        Object.defineProperties(this, {
            animation: {
                //  The `animation` property returns the `GrabAnimation` object
                get: function () {
                    return this.values.animation;
                }
            },
            eventId: {
                //  The `eventId` property returns the 32 character hexidecimal event id
                //  string
                get: function () {
                    return this.values.eventId
                }
            },
            object: {
                //  The `object` property returns the `GrabElement` object
                get: function () {
                    return this.values.object;
                }
            },
            property: {
                //  The `property` property returns the property string being updated
                get: function () {
                    return this.values.property;
                }
            },
            uniqueId: {
                //  The `uniqueId` property returns the unique id of the `GrabUpdate`
                //  object
                get: function () {
                    return this.values.uniqueId;
                }
            },
            update: {
                //  The `update` method passes the `property` string and value to the
                //  `GrabElement` update method
                value: function (value) {
                    this.object.update(this.property, value);
                }
            },
            values: {
                //  The `values` object stores the values for the `GrabUpdate` object
                value: {
                    animation: new GrabAnimation(origin, target, duration, easing),
                    eventId: e,
                    object: object,
                    property: property,
                    uniqueId: uniqueId(u)
                }
            }
        });
    }
    //  `GrabUpdate`'s `next` method is passed an interpolation value and depending on
    //  animation state, should return either the current position or an interpolated
    //  current position
    GrabUpdate.prototype.next = function (interpolation) {
        return this.animation.complete ? this.animation.current : this.animation.last + (this.animation.current - this.animation.last) * interpolation;
    };

    //  GRAB CHANNEL UPDATE OBJECT  //
    //  The `GrabChannelUpdate` object "inherits" from the `GrabUpdate` prototype and
    //  returns a prototypical `GrabChannelUpdate` object
    function GrabChannelUpdate (object, property, channel, origin, target, duration, easing, id) {
        //  Inherit from `GrabUpdate` prototype
        GrabUpdate.call(this, object, property, origin, target, duration, easing, id);
        //  Set a new `channel` value in the values store
        this.values.channel = channel;
        Object.defineProperties(this, {
            channel: {
                //  The `channel` property returns the channel string of the
                //  `GrabChannelUpdate` object
                get: function () {
                    return this.values.channel;
                }
            }
        });
    }
    //  Set the `prototype` property of the `GrabChannelUpdate` object
    GrabChannelUpdate.prototype = Object.create(GrabUpdate.prototype);
    //  The `GrabChannelUpdate`'s `next` method is passed an interpolation value and
    //  depending on the animation's state, should return either the current position
    //  or an interpolated current position
    GrabChannelUpdate.prototype.next = function (interpolation) {
        var color = {};
        color[this.channel] = this.animation.complete ? this.animation.current : this.animation.last + (this.animation.current - this.animation.last) * interpolation;
        return color;
    };
    //  Define the `GrabChannelUpdate` function's prototype's `constructor` property
    Object.defineProperty(GrabChannelUpdate.prototype, 'constructor', {
        value: GrabChannelUpdate,
        enumerable: false,
        writable: true
    });

    
    //  GRAB LOOP OBJECT //
    //  The `GrabLoop` function should return a prototypical `GrabLoop` object; there
    //  should only be one `GrabLoop` object created and held in the `loop` variable
    function GrabLoop () {
        var _loop = this; // Create a reference to itself, for private function use
        //  The  private `getArgs` function should return an array of parsed argument
        //  values that are used in the creation of all `GrabUpdate` objects; this way
        //  when a `GrabElement` is animated, any combination of parameters can be used
        function getArgs (args) {
            var i,
                j,
                arr = [],
                defaults = {0: 1000, 1: 'linear', 2: null},
                validation = [validNumber, validString, validFunction];
            //  Iterate though the length of arguments, sans the first two values (the
            //  `GrabElement` and values object being the first two) and set deafult
            //  values for all missing parameters
            for (i = 2; i < args.length; i = i + 1)
                for (j = 0; j < validation.length; j = j + 1)
                    arr.push(validation[j](args[i]) ? args[i] : defaults[j]);
            return arr;
        }
        //  The private `getWaiting` function should check if there are any updates
        //  waiting to be added to the loop, concatinating them if there are
        function getWaiting () {
            if (_loop.waiting.length) {
                _loop.updates = _loop.updates.concat(_loop.waiting);
                _loop.waiting.length = 0;
            }
            return null;
        }
        //  The private `update` function iterates though all loop updates, updating
        //  their values depending on the progress of the animation
        function update () {
            var i,
                len,
                progress = 0,
                animation;
            for (i = 0, len = _loop.updates.length; i < len; i = i + 1) {
                animation = _loop.updates[i].animation;
                animation.time = animation.time + _loop.timestep;
                animation.last = animation.current;
                //  Calculate progress of the animation, if the result is greater than
                //  or eaqual to 1, it has reached its target
                progress = animation.time / animation.duration;
                animation.current = progress >= 1 ? animation.target : animation.vector * _loop.easingFunctions[animation.easing](progress) + animation.origin;
            }
            return null;
        }
        //  The private `panic` function should set the loop's `delta` property to 0
        function panic () {
            _loop.delta = 0;
            return null;
        }
        //  The private `render` function should iterate though all updates and render
        //  their current values to the dom using the `GrabUpdate`'s update method
        function render (interpolation) {
            var i,
                len;
            for (i = 0, len = _loop.updates.length; i < len; i = i + 1)
                _loop.updates[i].update(_loop.updates[i].next(interpolation));
            return null;
        }
        //  The private `collect` function should iterate though all updates and remove
        //  all complete updates
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
        //  The private `stop` function should stop the loop and set it's state to zero
        function stop () {
            _loop.state = 0;
            window.cancelAnimationFrame(_loop.frameId);
            return null;
        }

        //  The private `loop` function is the Grab Library's animation loop and should
        //  loop though all updates, updating, render udpates and garbage collecting
        //  complete updates
        function loop (timestamp) {
            var cycles = 0; // Cycles are counted for each udpate, at 240 the loop will panic and set its evelt to zero
            if (_loop.state) {
                //  If the loop is active, first add waiting updates
                getWaiting();
                if (timestamp < _loop.lastFrameTime + _loop.timestep) {
                    //  If the passed timestamp is smaller than the last frame time and
                    //  the loop's timestep, imediately return and call try again
                    _loop.frameId = window.requestAnimationFrame(loop);
                    return;
                }
                //  Set `delta` to the diference of the current timestamp, less the
                //  last time frame time, then add the last delta value
                _loop.delta = _loop.delta + (timestamp - _loop.lastFrameTime);
                //  Set the new timestamp value to the last frame time
                _loop.lastFrameTime = timestamp;
                //  If the current timestamp is greater than the last frame time and
                //  a second, then reduce the frame fate of the loop
                if (timestamp > _loop.lastFrameTime + 1000) {
                    _loop.framesPerSecond = 0.25 * _loop.framesThisSecond + 0.75 * _loop.framesPerSecond;
                    _loop.lastFramesPerSecond = timestamp;
                    _loop.framesThisSecond = 0;
                }
                //  Add frames this second to itself and one
                _loop.framesThisSecond = _loop.framesThisSecond + 1;
                while (_loop.delta >= _loop.timestep) {
                    //  While delta is larger than or equal to the loop's timestep,
                    //  update all animations, reduce the delta value by the timestep,
                    //  and check the cycles count before running again
                    update();
                    _loop.delta = _loop.delta - _loop.timestep;
                    cycles = cycles + 1;
                    if (cycles >= 240) {
                        panic();
                        break;
                    }
                }
                //  Render all animations with the interpolated value
                render(_loop.delta / _loop.timestep);
                //  Check for complete animations, removing them from the updates
                collect();
                //  If there remains animations or waiting animations, run the loop
                //  again, storing the loop id
                if (_loop.updates.length || _loop.waiting.length) {
                    _loop.frameId = window.requestAnimationFrame(loop);
                } else {
                    //  Else stop the loop
                    stop();
                }
            }
        }

        //  The private `start` function should check if the loop is not active, if not
        //  it will set up the initial frame of the loop before calling another loop
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
        //  The private `removeDulicates` function should be passed a reference to a
        //  `GrabElement` and the update's property; it iterates though all udpates
        //  removing any updates that have the same unique id and are updating the
        //  same property
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
        //  The private `add` function should be passed a `GrabElement` and an object
        //  of property value pairs; it will iterate over the object's properties,
        //  creating an individual `GrabUpdate` (`GrabChannelUpdate` for all color
        //  properties) and adds them to the loop's updates array
        function add (object, values) {
            var args = getArgs(arguments),
                eventId = uniqueId().replace(/-/g, '_').toUpperCase();
            if (validLiteral(values)) {
                Object.keys(values).forEach(function (property, i) {
                    removeDuplicates(object, property);
                    if (/[A-Z]*color$/ig.test(property)) {
                        Object.keys(object[property]).forEach(function (channel, j) {
                            if (object[property][channel] !== values[property][channel])
                                _loop.waiting.push(new GrabChannelUpdate(object, property, channel, object[property][channel], values[property][channel], args[0], args[1], eventId, j));
                        });
                    } else {
                        _loop.waiting.push(new GrabUpdate(object, property, object[property], values[property], args[0], args[1], eventId, i));
                    }
                });
                //  Check if there is a valid function passed and set it to the callback event
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
    loop = new GrabLoop();
}());