var chroma, grab;
//  Chroma Library
(function () {
    var dictionary = {
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
    //  Validation Functions  //
    function validChroma (obj) {
        if (typeof obj !== 'object' || obj === null)
            return false;
        return Object.getPrototypeOf(obj) === Chroma.prototype;
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
            if (i && 0 > arr[i])
                return false;
            if (i === 3 && arr[i] > 1) {
                return false;
            } else if (i && arr[i] > 255) {
                return false;
            }
        }
        return true;
    }
    function validModel (value) {
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
                match = dictionary[value];
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
        } else if (validChroma(value)) {
            return true;
        }
        return false;
    }
    //  Auxilary Functions  //
    function parseModel (model) {
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
        if (typeof model === 'string' && model.length) {
            if (model.includes(',')) {
                match = parse(model.match(/(-?\d{1,3}(\.?\d*)?)+/g));
                if (match && match.length === 3) {
                    if (/^hsl\(/g.test(model) && percents(model) === 2) {
                        return validHsx(match) ? ['hsl'].concat(match) : null;
                    } else if (/^hsv\(/g.test(model) && percents(model) === 2) {
                        return validHsx(match) ? ['hsv'].concat(match) : null;
                    } else if (/^rgb\(/g.test(model) && !model.includes('%')) {
                        return validRgb(match) ? ['rgb'].concat(match) : null;
                    } else if (!/[a-z]+/g.test(model) && percents(model) === 2) {
                        return validHsx(match) ? ['hsv'].concat(match) : null;
                    } else if (!/[a-z]+/g.test(model) && !model.includes('%')) {
                        return validRgb(match) ? ['rgb'].concat(match) : null;
                    }
                } else if (match && match.length === 4) {
                    if (/^hsla\(/g.test(model) && percents(model) === 2) {
                        return validHsx(match) ? ['hsla'].concat(match) : null;
                    } else if (/^hsva\(/g.test(model) && percents(model) === 2) {
                        return validHsx(match) ? ['hsva'].concat(match) : null;
                    } else if (/^rgba\(/g.test(model) && !model.includes('%')) {
                        return validRgb(match) ? ['rgba'].concat(match) : null;
                    } else if (!/[a-z]+/g.test(model) && percents(model) === 2) {
                        return validHsx(match) ? ['hsva'].concat(match) : null;
                    } else if (!/[a-z]+/g.test(model) && !model.includes('%')) {
                        return validRgb(match) ? ['rgba'].concat(match) : null;
                    }
                }
            } else if (/^(?:#|0x|0X)?([\da-f]{1,8}){1}$/g.test(model)) {
                match = model.replace(/^#|0x/ig, '').match(/([\da-f])/g);
                if (match && (match.length === 4 || match.length === 8)) {
                    return ['hexa'].concat(match);
                } else if (match && (match.length !== 5 && match.length !== 7)) {
                    return ['hex'].concat(match);
                }
            } else if (/^[a-z]{2,}$/g.test(model)) {
                match = dictionary[model];
                if (match && match.length === 3)
                    return ['x11'].concat(match);
            }
        } else if (Array.isArray(model) && 2 < model.length && model.length < 5) {
            match = parse(model);
            if (match && percents(model) === 2) {
                if (match.length === 3) {
                    return validHsx(match) ? ['hsv'].concat(match) : null;
                } else if (match.length === 4) {
                    return validHsx(match) ? ['hsva'].concat(match) : null;
                }
            } else if (match && !percents(model)) {
                if (match.length === 3) {
                    return validRgb(match) ? ['rgb'].concat(match) : null;
                } else if (match.length === 4) {
                    return validRgb(match) ? ['rgba'].concat(match) : null;
                }
            }
        } else if (validChroma(model)) {
            return ['rgba'].concat(parse([model.red, model.green, model.blue, model.alpha]));
        }
        return null;
    }
    //  From Functions  //
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
    function fromHexa (arr) {
        switch (arr.length) {
            case 4:
                return [parseInt(arr[0] + arr[0], 16), parseInt(arr[1] + arr[1], 16), parseInt(arr[2] + arr[2], 16), Math.round(parseInt(arr[3] + arr[3], 16) / 2.55) / 100];
            default:
                return [parseInt(arr[0] + arr[1], 16), parseInt(arr[2] + arr[3], 16), parseInt(arr[4] + arr[5], 16), Math.round(parseInt(arr[6] + arr[7], 16) / 2.55) / 100];
        }
    }
    function fromHsl (arr) {
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
        if (arr[1] === 0) {
            r = g = b = arr[2] / 100;
        } else {
            r = hue((arr[0] % 360) / 360 + 1 / 3, arr[1] / 100, arr[2] / 100);
            g = hue((arr[0] % 360) / 360, arr[1] / 100, arr[2] / 100);
            b = hue((arr[0] % 360) / 360 - 1 / 3, arr[1] / 100, arr[2] / 100);
        }
        return [Math.round(r * 255), Math.round(g * 255), Math.round(b * 255)];
    }
    function fromHsla (arr) {
        return fromHsl(arr).concat(Math.round(100 * arr[3]) / 100);
    }
    function fromHsv (arr) {
        var r,
            g,
            b,
            i = Math.floor(((arr[0] % 360) / 360) * 6),
            f = ((arr[0] % 360) / 360) * 6 - i,
            p = (arr[2] / 100) * (1 - (arr[1] / 100)),
            q = (arr[2] / 100) * (1 - f * (arr[1] / 100)),
            t = (arr[2] / 100) * (1 - (1 - f) * (arr[1] / 100));
        switch (i % 6) {
            case 0:
                r = arr[2] / 100;
                g = t;
                b = p;
                break;
            case 1:
                r = q;
                g = arr[2] / 100;
                b = p;
                break;
            case 2:
                r = p;
                g = arr[2] / 100;
                b = t;
                break;
            case 3:
                r = p;
                g = q;
                b = arr[2] / 100;
                break;
            case 4:
                r = t;
                g = p;
                b = arr[2] / 100;
                break;
            case 5:
                r = arr[2] / 100;
                g = p;
                b = q;
                break;
            default:
                break;
        }
        return [Math.round(r * 255), Math.round(g * 255), Math.round(b * 255)];
    }
    function fromHsva (arr) {
        return fromHsv(arr).concat(Math.round(100 * arr[3]) / 100);
    }
    function fromRgba (arr) {
        return [arr[0], arr[1], arr[2], Math.round(100 * arr[3]) / 100];
    }
    function from (arr) {
        var dict = {hex: 0, hexa: 1, hsl: 2, hsla: 3, hsv: 4, hsva: 5, rgba: 6};
        switch (dict[arr[0]]) {
            case 0:
                return fromHex(arr.slice(1));
            case 1:
                return fromHexa(arr.slice(1));
            case 2:
                return fromHsl(arr.slice(1));
            case 3:
                return fromHsla(arr.slice(1));
            case 4:
                return fromHsv(arr.slice(1));
            case 5:
                return fromHsva(arr.slice(1));
            case 6:
                return fromRgba(arr.slice(1));
            default:
                return arr.slice(1);
        }
    }
    //  To Functions  //
    function toHex (model, channels) {
        var alpha = (Math.round(channels.alpha * 255));
        if (model === 'hexa')
            return '#' + (channels.red < 16 ? '0' + channels.red.toString(16) : channels.red.toString(16)) + (channels.green < 16 ? '0' + channels.green.toString(16) : channels.green.toString(16)) + (channels.blue < 16 ? '0' + channels.blue.toString(16) : channels.blue.toString(16)) + (alpha < 16 ? '0' + alpha.toString(16) : alpha.toString(16));
        return '#' + (channels.red < 16 ? '0' + channels.red.toString(16) : channels.red.toString(16)) + (channels.green < 16 ? '0' + channels.green.toString(16) : channels.green.toString(16)) + (channels.blue < 16 ? '0' + channels.blue.toString(16) : channels.blue.toString(16));

    }
    function toHsl (channels) {
        var r = channels.red / 255,
            g = channels.green / 255,
            b = channels.blue / 255,
            max = Math.max(r, g, b),
            min = Math.min(r, g, b),
            d = max - min,
            h,
            s,
            l = (max + min) / 2;
        if (max === min) {
            h = s = 0;
        } else {
            s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
            switch (max) {
                case r:
                    h = (g - b) / d + (g < b ? 6 : 0);
                    break;
                case g:
                    h = (b - r) / d + 2;
                    break;
                case b:
                    h = (r - g) / d + 4;
                    break;
                default:
                    break;
            }
            h = h / 6;
        }
        return [Math.round(h * 36000) / 100,Math.round(s * 10000) / 100, Math.round(l * 10000) / 100];
    }
    function toHsv (channels) {
        var r = channels.red / 255,
            g = channels.green / 255,
            b = channels.blue / 255,
            max = Math.max(r, g, b),
            min = Math.min(r, g, b),
            d = max - min,
            h,
            s = max === 0 ? 0 : d / max,
            v = max;
        if (max === min) {
            h = 0;
        } else {
            switch (max) {
                case r:
                    h = (g - b) / d + (g < b ? 6 : 0);
                    break;
                case g:
                    h = (b - r) / d + 2;
                    break;
                case b:
                    h = (r - g) / d + 4;
                    break;
                default:
                    break;
            }
            h = h / 6;
        }
        return [Math.round(h * 36000) / 100, Math.round(s * 10000) / 100, Math.round(v * 10000) / 100];
    }
    function toHsx (model, channels) {
        var arr = /^hsla?$/g.test(model) ? toHsl(channels) : toHsv(channels);
        if (/^hsla|hsva$/g.test(model))
            return model + '(' + arr[0] + ', ' + arr[1] + '%, ' + arr[2] + '%, ' + Math.round(channels.alpha * 100) / 100 + ')';
        return  model + '(' + arr[0] + ', ' + arr[1] + '%, ' + arr[2] + '%)';
    }
    function toRgb (model, channels) {
        if (model === 'rgba')
            return 'rgba(' + channels.red + ', ' + channels.green + ', ' + channels.blue + ', ' + Math.round(channels.alpha * 100) / 100 + ')';
        return  'rgb(' + channels.red + ', ' + channels.green + ', ' + channels.blue + ')';
    }
    function toX11 (channels) {
        var scores = {},
            nearest = 'snow';
        Object.keys(dictionary).forEach(function (color) {
            var x11 = dictionary[color];
            scores[color] = (Math.abs(channels.red - x11[0]) + Math.abs(channels.green - x11[1]) + Math.abs(channels.blue - x11[2])) / 3;
        });
        Object.keys(scores).forEach(function(score) {
            if (scores[nearest] > scores[score])
                nearest = score;
        });
        return nearest;
    }
    function to (model, channels) {
        var dict = {hex: 0, hexa: 0, hsl: 1, hsla: 1, hsv: 1, hsva: 1, rgb: 2, rgba: 2};
        switch (dict[model]) {
            case 0:
                return toHex(model, channels);
            case 1:
                return toHsx(model, channels);
            case 2:
                return toRgb(model, channels);
            default:
                return toX11(channels);
        }
    }
    //  Chroma Object  //
    function Chroma (model, red, green, blue, alpha) {
        Object.defineProperties(this, {
            alpha: {
                get: function () {
                    return this.channels.alpha;
                },
                set: function (value) {
                    if (value >= 0 && value <= 1)
                        this.channels.alpha = value;
                    return value;
                }
            },
            blue: {
                get: function () {
                    return this.channels.blue;
                },
                set: function (value) {
                    if (value >= 0 && value <= 255)
                        this.channels.blue = value;
                    return value;
                }
            },
            channels: {
                value: {
                    alpha: typeof alpha === 'number' && Number.isFinite(alpha) ? alpha : 1,
                    blue: blue,
                    green: green,
                    red: red
                }
            },
            green: {
                get: function () {
                    return this.channels.green;
                },
                set: function (value) {
                    if (value >= 0 && value <= 255)
                        this.channels.green = value;
                    return value;
                }
            },
            luminance: {
                get: function () {
                    var sR = this.red / 255,
                        sG = this.green / 255,
                        sB = this.blue / 255,
                        R = sR <= 0.03928 ? sR / 12.92 : Math.pow((sR + 0.055) / 1.055, 2.4),
                        G = sG <= 0.03928 ? sG / 12.92 : Math.pow((sG + 0.055) / 1.055, 2.4),
                        B = sB <= 0.03928 ? sB / 12.92 : Math.pow((sB + 0.055) / 1.055, 2.4);
                    return 0.2126 * R + 0.7152 * G + 0.0722 * B + 0.05;
                }
            },
            model: {
                value: model
            },
            red: {
                get: function () {
                    return this.channels.red;
                },
                set: function (value) {
                    if (value >= 0 && value <= 255)
                        this.channels.red = value;
                    return value;
                }
            },
            to: {
                value: function (model) {
                    if (typeof model === 'string' && /^hexa?|hsla?|hsva?|rgba?|x11$/ig.test(model))
                        return to(model, this.channels);
                    return null;
                }
            },
            toHex: {
                value: function () {
                    return to('hex', this.channels);
                }
            },
            toHexa: {
                value: function () {
                    return to('hexa', this.channels);
                }
            },
            toHsl: {
                value: function () {
                    return to('hsl', this.channels);
                }
            },
            toHsla: {
                value: function () {
                    return to('hsla', this.channels);
                }
            },
            toHsv: {
                value: function () {
                    return to('hsv', this.channels);
                }
            },
            toHsva: {
                value: function () {
                    return to('hsva', this.channels);
                }
            },
            toModel: {
                value: function () {
                    return to(this.model, this.channels);
                }
            },
            toRgb: {
                value: function () {
                    return to('rgb', this.channels);
                }
            },
            toRgba: {
                value: function () {
                    return to('rgba', this.channels);
                }
            },
            toX11: {
                value: function () {
                    return to('x11', this.channels);
                }
            }
        });
    }
    //  Chroma Function  //
    chroma = function (model) {
        var parsed,
            channels;
        if (validModel(model)) {
            parsed = parseModel(model);
            channels = from(parsed);
            return new Chroma(parsed[0], channels[0], channels[1], channels[2], channels[3]);
        }
        return null;
    };
    //  Chroma Methods  //
    chroma.contrast = function (color1, color2) {
        var c1 = chroma(color1),
            c2 = chroma(color2);
        if (c1 && c2) 
            return (c1.luminance > c2.luminance ? c1.luminance : c2.luminance) / (c1.luminance > c2.luminance ? c2.luminance : c1.luminance);
        return null;
    };
    chroma.parse = function (value) {
        return parseModel(value)
    };
    chroma.validate = function (value) {
        return validModel(value);
    };
}());
//  Grab Library
(function () {
    var rhythym;
    //  VALIDATION FUNCTIONS  //
    function validGrabCollection (value) {
        if (typeof value !== 'object' || value === null)
            return false;
        return Object.getPrototypeOf(value) === GrabCollection.prototype;
    }
    function validGrabElement (value) {
        if (typeof value !== 'object' || value === null)
            return false;
        return Object.getPrototypeOf(value) === GrabElement.prototype;
    }
    function validFunction (value) {
        return typeof value === 'function' && Object.getPrototypeOf(value) === Function.prototype;
    }
    function validNumberValue (value) {
        return typeof value === 'number' && Number.isFinite(value);
    }
    //  The `validLiteral` function should return true if a passed object is in fact
    //  an object literal
    function validLiteral (value) {
        var test = value,
            check = true;
        //  Return false if the passed object is not an object or is null
        if (typeof value !== 'object' || value === null) {
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
                return Object.getPrototypeOf(value) === test;
            }());
        }
    }
    function validString (value) {
        return typeof value === 'string';
    }
    function validStringValue (value) {
        return typeof value === 'string' && value.length;
    }
    //  Rhythm Library
    (function () {

    }());
    //  GRAB ELEMENT OBJECT  //
    //  The `GrabElement` function returns a single `GrabElement` object and several
    //  methods and properties
    function GrabElement (element, u) {
        //  First get the passed element's DOM style declaration object;
        var styles = window.getComputedStyle(element, '');
        Object.defineProperties(this, {
            addClass: {
                //  The `addClass` method adds a passed string, of a single class name
                //  or a string of class names delimited by commas, or array of strings
                //  to the element's CSS class name, returning itself
                value: function (className) {
                    var i;
                    if (validStringValue(className)) {
                        if (className.includes(',')) {
                            className = className.split(',');
                        } else {
                            this.element.classList.add(className.replace(/\s/g, ''));
                        }
                    }
                    if (Array.isArray(className))
                        for (i = 0, len = className.length; i < len; i = i + 1)
                            this.addClass(className[i]);
                    return this;
                }
            },
            after: {
                //  The `after` method removes itself from its current DOM location,
                //  inserting itself after the passed sibling's DOM location, returning
                //  itself
                value: function (sibling) {
                    if (validGrabElement(sibling)) {
                        //  Remove self from the DOM if it has a parent node
                        if (this.element.parentNode)
                            this.element.parentNode.removeChild(this.element);
                        sibling.element.parentNode.insertBefore(this.element, sibling.element.nextSibling);
                    } else {
                        //  If the passed sibling is not a valid `GrabElement` object,
                        //  pass it to `grab` and retry the `after` method, ignoring
                        //  null values
                        if (sibling !== null)
                            this.after(grab(sibling));
                    }
                    return this;
                }
            },
            animate: {
                //  The `animate` method pass a list of values and parameters to the
                //  `rhythm` library to be updated and rendered, returning itself
                value: function (values, duration, easing, complete) {

                }
            },
            append: {
                //  The `append` method will append a child or an array-like object of
                //  `GrabElement` objects into this element's DOM tree, returning
                //  itself
                value: function (child) {
                    var i,
                        len;
                    if (validGrabElement(child)) {
                        //  Remove the child from the DOM if it has a parent node
                        if (child.element.parentNode)
                            child.element.parentNode.removeChild(child.element);
                        this.element.appendChild(child.element);
                    } else if (child && child.length) {
                        //  If the passed child is an array-like object, iterate over
                        //  the elements passing each to the `append` method
                        for (i =0, len = child.length; i < len; i = i + 1)
                            this.append(child[i]);
                    } else {
                        //  If the passed sibling is not a valid `GrabElement` object,
                        //  or an array-like object of `GrabElement` objects, pass it
                        //  to `grab` and retry the `after` method, ignoring null
                        //  values
                        if (child !== null)
                            this.append(grab(child));
                    }
                    return this;
                }
            },
            attr: {
                //  The `attr` method, when passed a valid attribute and value value,
                //  will add a new attribute and value to its DOM object; when no
                //  values are passed, the `attr` method will return all attributes on
                //  the DOM object, returning itself if values are passed and an object
                //  of all attributes and values if not
                value: function (attribute, value) {
                    var attributes,
                        attr,
                        all = {};
                    if (validStringValue(attribute) && validStringValue(value)) {
                        this.element.setAttribute(attribute.replace(/([A-Z])/g, '-1$').trim().toLowerCase(), value);
                    } else if (validLiteral(attribute)) {
                        for (attr in attribute)
                            this.attr(attr, attribute[attr]);
                    } else if (!attribute) {
                        attributes = this.element.attributes;
                        Object.keys(attributes).forEach(function (a) {
                            attr = attributes[a].name.split('-').map(function (s, i) {
                                return i ? s[0].toUpperCase() + s.slice(1).toLowerCase() : s;
                            }).join('');
                            //  Get all the element's attributes and iterate over each
                            //  one; split each attribute name at its hyphens and then
                            //  iterate though each string, skipping the first passed,
                            //  and Capital case the string, before joining the array
                            //  of strings together, returning a camelCase string to be
                            //  used as a property name in the returned all object
                            all[attr] = attributes[a].value;
                        });
                        return all;
                    }
                    return this;
                }
            },
            backgroundColor: {
                //  The `backgroundColor` property gets and sets the DOM object's
                //  background-color style; the `backgroundColor` property uses the
                //  chroma library to parse colors
                get: function () {
                    return this.properties.backgroundColor;
                },
                set: function (value) {
                    var color;
                    //  Check if a valid color model has been passed
                    if (chroma.validate(value)) {
                        //  If the valid color model is an object literal, it will be
                        //  merged into a copy of the current `backgroundColor`
                        //  property's `channels` property; this is for animations
                        color = validLiteral(value) ? chroma(Object.assign(Object.assign({}, this.properties.backgroundColor.channels), value)) : chroma(value);
                        this.properties.backgroundColor = color;
                        this.element.style.backgroundColor = color.toModel();
                    }
                    return value;
                }
            },
            before: {
                //  The `before` method removes itself from its current DOM location,
                //  inserting itself before the passed sibling's DOM location,
                //  returning itself
                value: function (sibling) {
                    if (validGrabElement(sibling)) {
                        //  Remove self from the DOM if it has a parent node
                        if (this.element.parentNode)
                            this.element.parentNode.removeChild(this.element);
                        sibling.element.parentNode.insertBefore(this.element, sibling.element);
                    } else {
                        //  If the passed sibling is not a valid `GrabElement` object,
                        //  pass it to `grab` and retry the `before` method, ignoring
                        //  null values
                        if (sibling !== null)
                            this.before(grab(sibling));
                    }
                    return this;
                }
            },
            child: {
                //  The `child` method uses a string "selector" to search a
                //  `GrabElement` object's children for a matching child element,
                //  returning a new `GrabCollection` or single `GrabElement` object,
                //  and returning an empty `GrabCollection` if no matches are found
                value: function (selector) {
                    var children = [];
                    if (validStringValue(selector)) {
                        if (selector.includes(',')) {
                            this.children.each(function (child) {
                                selector.split(',').forEach(function (c) {
                                    child.selector.match(/(#?\.?[a-z][\da-z]*)/ig).forEach(function (m) {
                                        if (m === c)
                                            children.push(child);
                                    });
                                });
                            });
                        } else {
                            this.children.each(function (child) {
                                child.selector.match(/(#?\.?[a-z][\da-z]*)/ig).forEach(function (m) {
                                    if (m === selector)
                                        children.push(child);
                                });
                            });
                        }
                        if (children.length)
                            return children.length > 1 ? new GrabCollection(children) : new GrabElement(children[0]);
                    }
                    return new GrabCollection([]);
                }
            },
            children: {
                //  The `children` property returns a new `GrabCollection` of all child
                //  elements
                get: function () {
                    return new GrabCollection(this.element.children);
                }
            },
            element: {
                value: element
            },
            properties: {
                value: {
                    backgroundColor: chroma(styles['backgroundColor']) || {channels: {}}
                }
            },
            selector: {
                //  The `selector` property returns a string of the element's css
                //  selectors
                get: function () {
                    var id = this.id ? '#' + this.id : '',
                        classes = this.element.className.length > 0 ? '.' + this.element.className.replace(/\s/g, '.') : '';
                    return this.element.tagName.toLowerCase() + id + classes;
                }
            }
        });
    }
    //  GRAB COLLECTION OBJECT  //
    //  `GrabCollection` function returns a collection of `GrabElement` objects and a
    //  few auxillary methods
    function GrabCollection (arr) {
        var i,
            len;
        //  Collect or create `GrabElement` objects from the array or array-like object
        for (i = 0, len = arr.length; i < len; i = i + 1)
            Object.defineProperty(this, i, {value: validGrabElement(arr[i]) ? arr[i] : new GrabElement(arr[i])});
        //  Define the collection's properties and methods
        Object.defineProperties(this, {
            concat: {
                //  The `concat` method joins a `GrabCollection` object to itself,
                //  returning a new `GrabCollection` object
                value: function (collection) {
                    var j,
                        len,
                        a;
                    //  Check if a valid `GrabCollection` object has been passed, else
                    //  return a new `GrabCollection` of itself
                    if (validGrabCollection(collection)) {
                        for (j = 0, len = this.length + collection.length; j < len; j = j + 1)
                            a.push(j < this.length ? this[j] : collection[j]);
                        return new GrabCollection(a);
                    }
                    return new GrabCollection(this);
                }
            },
            each: {
                //  The `each` method iterates over each `GrabElement` object in the
                //  collection, calling the passed function
                value: function (fn) {
                    var j,
                        len;
                    //  Check if a valid function has been passed
                    if (validFunction(fn))
                        for (j = 0, len = this.length; j < len; j = j + 1)
                            fn.apply(null, [this[j], j]);
                    return this;
                }
            },
            filter: {
                //  The `filter` method iterates over each `GrabElement` object in the
                //  collection, filtering with the passed function, returning a new
                //  `GrabCollection` with the matching values
                value: function (fn) {
                    var j,
                        len,
                        a;
                    //  Check if a valid function has been passed, else return itself
                    if (validFunction(fn)) {
                        for (j = 0, len = this.length; j < len; j = j + 1)
                            if (fn.apply(null, [this[j], j]))
                                a.push(this[j]);
                        return new GrabCollection;
                    }
                    return this;
                }
            },
            length: {
                //  The `length` property hold the count of `GrabElement` objects in
                //  the collection
                value: i
            },
            slice: {
                //  The `slice` method returns a new `GrabCollection` object from a
                //  section of the collection of `GrabElement` objects
                value: function (start, count) {
                    var j,
                        len,
                        a = [],
                        s,
                        c;
                    //  Check if the start and count parameters are valid values and
                    //  calculate the length of the iteration
                    s = (!validNumberValue(start) || start < 0) ? 0 : start;
                    c = (!validNumberValue(count) || count > this.length) ? this.length : count;
                    len = s + c > this.length ? this.length : s + c;
                    for (j = s; j < len; j = j + 1)
                        a.push(this[j]);
                    return new GrabCollection(a);
                }
            },
            splice: {
                //  The `splice` method merges a passed `GrabCollection` with a section
                //  of this collection, returning a new `GrabCollection` wit the result
                value: function (start, count, collection) {
                    var j,
                        len,
                        l,
                        a = [],
                        s,
                        c;
                    //  Check if a valid `GrabCollection` object has been passed, else
                    //  return a new `GrabCollection` of itself
                    if (validGrabCollection(collection)) {
                        //  Check if the start and count parameters are valid values and
                        //  calculate the length of the iteration
                        s = (!validNumberValue(start) || start < 0) ? 0 : start;
                        c = (!validNumberValue(count) || count > this.length) ? this.length : count;
                        len = s + c > this.length ? this.length : s + c;
                        for (j = s; j < len; j = j + 1)
                            a.push(this[j]);
                        if (len < this.length) // Check if there are any remaining elements
                            for (j = len, l = this.length; j < l; j = j + 1)
                                a.push(this[j]);
                        return new GrabCollection(a);
                    }
                    return new GrabCollection(this);
                }
            }
        });
    }
    //  GRAB FUNCTION  //
    //  The `grab` function takes a  selector or an array-like object of string
    //  selectors and returns either a `GrabElement` or `GrabCollection` where
    //  appropriate; if no valid selector is passed, `grab` will return a null value
    grab = function (selector) {
        var selected;
        if (validStringValue(selector)) {
            //  String "selector"
            if (/^<[a-z][\da-z]*>$/g.test(selector)) {
                //  Create new DOM object and pass it to `GrabElement`
                return new GrabElement(document.createElement(selector.slice(1, -1)));
            } else if (/^#/g.test(selector)) {
                //  DOM id string passed
                selected = document.getElementById(selector.slice(1));
            } else if (/^\./g.test(selector)) {
                //  DOM class string passed
                selected = document.getElementsByClassName(selector.slice(1));
            } else if (/^[a-z][\da-z]*$/g.test(selector)) {
                //  DOM tag string passed
                selected = document.getElementsByTagName(selector);
            } else if (/(#?\.?[a-z][\da-z]*)/g.test(selector)) {
                //  DOM selector string passed
                selected = document.querySelectorAll(selector);
            } else if (selector.includes(',')) {
                //  A string of selectors delimited by commas has been passed; iterate
                //  over its values and recursively pass the them to `grab`
                selected = selector.split(',').map(function (s) {
                    return grab(s);
                });
            }
            if (selected && selected.length) {
                //  An array-like object has been created by `grab`, if the object has
                //  a single value, return a single `GrabElement`, else return a new
                //  `GrabCollection` object
                return selected.length === 1 ? new GrabElement(selected[0]) : new GrabCollection(selected);
            } else if (selected.nodeType) {
                // A DOM object has been created by `grab`
                return new GrabElement(selected);
            }
        } else if (selector.nodeType) {
            //  A DOM object
            return new GrabElement(selector);
        } else if (selected && selected.length) {
            //  Array like object of "selectors"
            return new GrabCollection(selector);
        }
        return null;
    };
}());