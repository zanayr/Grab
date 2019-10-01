var chroma, grab;
//  CHROMA LIBRARY  //
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
    function validChromaChannel (obj) {
        if (typeof obj !== 'object' || obj === null)
            return false;
        return Object.getPrototypeOf(obj) === ChromaChannel.prototype;
    }
    function validChromaColor (obj) {
        if (typeof obj !== 'object' || obj === null)
            return false;
        return Object.getPrototypeOf(obj) === ChromaColor.prototype;
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
        } else if (validChromaColor(value) || validChromaChannel(value)) {
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
        } else if (validChromaColor(model) || validChromaChannel(model)) {
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
    function ChromaChannel (alpha, blue, green, red) {
        this.alpha = typeof alpha === 'number' && Number.isFinite(alpha) ? alpha : 1;
        this.blue = blue;
        this.green = green;
        this.red = red;
    }
    //  ChromaColor Object  //
    function ChromaColor (model, red, green, blue, alpha) {
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
                value: new ChromaChannel(alpha, blue, green, red)
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
            toChannels: {
                value: function () {
                    return new ChromaChannel(this.channels.alpha, this.channels.blue, this.channels.green, this.channels.red);
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
    //  ChromaColor Function  //
    chroma = function (model) {
        var parsed,
            channels;
        if (validModel(model)) {
            parsed = parseModel(model);
            channels = from(parsed);
            return new ChromaColor(parsed[0], channels[0], channels[1], channels[2], channels[3]);
        }
        return null;
    };
    //  ChromaColor Methods  //
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

//  GRAB LIBRARY  //
(function () {
    var DEFAULT = {
            duration: 1000,
            easing: 'linear',
            fps: 60
        },
        EASING = {
            linear: function (d) {
                return d;
            }, 
            quadIn: function (d) {
                return Math.pow(d, 2);
            },
            cubicIn: function (d) {
                return Math.pow(d, 3);
            },
            quartIn: function (d) {
                return Math.pow(d, 4);
            },
            quintIn: function (d) {
                return Math.pow(d, 5);
            },
            quadOut: function (d) {
                return 1 - Math.pow(1 - d, 2);
            },
            cubicOut: function (d) {
                return 1 - Math.pow(1 - d, 3);
            },
            quartOut: function (d) {
                return 1 - Math.pow(1 - d, 4);
            },
            quintOut: function (d) {
                return 1 - Math.pow(1 - d, 5);
            }
        },
        loop;
    
    //  Auxillary Functions  //
    function validLiteral (value) {
        var test = value,
            checking = 1;
        if (typeof value !== 'object' || value === null)
            return false;
        return (function () {
            while (checking) {
                if (Object.getPrototypeOf(test = Object.getPrototypeOf(test)) === null) {
                    checking = 1 - checking;
                    break;
                }
            }
            return Object.getPrototypeOf(value) === test;
        }());
    }
    function uniqueId (z) {
        z = z ? 0 : z;
        return ('xxxxxxxx-xxxx-' + z % 10 + 'xxx-yxxx-xxxxxxxxxxxx').replace(/[xy]/g, function(c) {
            var r = Math.random() * 16 | 0,
                v = c === 'x' ? r : (r & 0x3 | 0x8);
            return v.toString(16);
        });
    }

    //  Internal Event Library  //
    function GrabAnimationEvents () {
        Object.defineProperty(this, 'events', {
            value: {}
        });
    }
    GrabAnimationEvents.prototype.add = function (id, fn) {
        if (!this.events[id])
            this.events[id] = {
                fn: fn
            };
        return this;
    };
    GrabAnimationEvents.prototype.dispatch = function (id, data) {
        if (this.events[id]) {
            this.events[id].fn(data);
            delete this.events[id];
        }
        return this;
    };
    GrabAnimationEvents.prototype.remove = function (id) {
        if (this.events[id]) {
            delete this.events[id];
            return true;
        }
        return false;
    };

    //  Interal Loop Library  //
    function GrabColorAnimation (origin, target) {
        Object.defineProperties(this, {
            current: {
                get: function () {
                    return this.values.current;
                },
                set: function (value) {
                    if (value instanceof ChromaChannel)
                        this.values.current = value;
                    return value;
                }
            },
            last: {
                get: function () {
                    return this.values.last;
                },
                set: function (value) {
                    if (value instanceof ChromaChannel)
                        this.values.last = value;
                    return value;
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
            values: {
                value: {
                    current: origin.toChannels(),
                    last: origin.toChannels(),
                    origin: origin.toChannels(),
                    target: target.toChannels()
                }
            }
        });
    }
    GrabColorAnimation.prototype.render = function (interpolation) {
        var channel;
        if (typeof interpolation === 'number' && isFinite(interpolation)) {
            for (channel in this.current)
                this.current[channel] = this.last[channel] + (this.current[channel] - this.last[channel]) * interpolation;
            return this.current;
        }
        return null;
    };
    GrabColorAnimation.prototype.update = function (easing) {
        var channel;
        if (typeof easing === 'number' && isFinite(easing)) {
            for (channel in this.current) {
                this.last[channel] = this.current[channel];
                this.current[channel] = this.origin[channel] + (this.target[channel] - this.origin[channel]) * easing;
            }
            return true;
        }
        return false;
    };

    function GrabAnimation (origin, target) {
        Object.defineProperties(this, {
            current: {
                get: function () {
                    return this.values.current;
                },
                set: function (value) {
                    if (typeof value === 'number' && isFinite(value))
                        this.values.current = value;
                    return value;
                }
            },
            last: {
                get: function () {
                    return this.values.last;
                },
                set: function (value) {
                    if (typeof value === 'number' && isFinite(value))
                        this.values.last = value;
                    return value;
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
            values: {
                value: {
                    current: origin,
                    last: origin,
                    origin: origin,
                    target: target
                }
            }
        });
    }
    GrabAnimation.prototype.render = function (interpolation) {
        if (typeof interpolation === 'number' && isFinite(interpolation))
            return this.last + (this.current - this.last) * interpolation;
        return null;
    };
    GrabAnimation.prototype.update = function (easing) {
        if (typeof easing === 'number' && isFinite(easing)) {
            this.last = this.current;
            this.current = this.origin + (this.target - this.origin) * easing;
            return true;
        }
        return false;
    };

    function GrabUpdate (object, duration, easing) {
        Object.defineProperties(this, {
            animations: {
                value: {}
            },
            complete: {
                get: function () {
                    return this.time >= this.duration;
                }
            },
            duration: {
                value: duration
            },
            easing: {
                value: easing
            },
            id: {
                value: uniqueId()
            },
            object: {
                value: object
            },
            time: {
                get: function () {
                    return this.values.time;
                },
                set: function (value) {
                    if (typeof value === 'number' && isFinite(value))
                        this.values.time = value;
                    return value;
                }
            },
            values: {
                value: {
                    time: 0
                }
            }
        });
    }
    GrabUpdate.prototype.remove = function (animation) {
        if (typeof animation === 'string' && this.animations.hasOwnProperty(value)) {
            delete this.animations[animation];
            return true;
        }
        return false;
    };
    GrabUpdate.prototype.render = function (interpolation) {
        var property;
        if (typeof interpolation === 'number' && isFinite(interpolation)) {
            for (property in this.animations)
                this.object[property] = this.animations[property].render(interpolation);
            return true;
        }
        return false;
    };
    GrabUpdate.prototype.update = function (step) {
        var property;
        if (typeof step === 'number' && isFinite(step)) {
            this.time += step;
            for (property in this.animations)
                this.animations[property].update(this.time / this.duration >= 1 ? 1 : EASING[this.easing](this.time/ this.duration));
            return true;
        }
        return false;
    };

    //  Grab Loop  //
    function organize (args) {
        var i,
            len,
            arr = [DEFAULT.duration, DEFAULT.easing, null];
        for (i = 2, len = args.length; i < len; i++) {
            if (typeof args[i] === 'number' && isFinite(args[i]) && args[i] >= 0) {
                arr[0] = args[i];
            } else if (typeof args[i] === 'string' && EASING[args[i]]) {
                arr[1] = args[i];
            } else if (typeof args[i] === 'function') {
                arr[2] = args[i];
            }
        }
        return arr;
    }
    function duplicates (id, update) {
        var i,
            len,
            arr = [],
            property;
        for (i = 0, len = loop.updates.length; i < len; i++) 
            if (id === loop.updates[i].object.uid)
                arr.push(loop.updates[i]);
        for (i = 0, len = arr.length; i < len; i++) {
            for (property in arr[i].animations)
                if (Object.keys(update.animations).includes(property))
                    arr[i].remove(property);
            if (loop.events[arr[i].id])
                loop.events.remove(arr[i].id);
        }
        return null;
    }
    function waiting () {
        if (loop.waiting.length) {
            loop.updates = loop.updates.concat(loop.waiting);
            loop.waiting.length = 0;
        }
        return null;
    }
    function update () {
        var i, len;
        for (i = 0, len = loop.updates.length; i < len; i++)
            loop.updates[i].update(loop.timestep);
        return null;
    }
    function render (interpolation) {
        var i, len;
        for (i = 0, len = loop.updates.length; i < len; i++)
            loop.updates[i].render(interpolation);
        return null;
    }
    function collect () {
        var i,
            len,
            remaining = [];
        for (i = 0, len = loop.updates.length; i < len; i++) {
            if (loop.updates[i].complete || !Object.keys(loop.updates[i].animations).length) {
                loop.events.dispatch(loop.updates[i].id);
            } else {
                remaining.push(loop.updates[i]);
            }
        }
        loop.updates = remaining;
        return null;
    }
    function stop () {
        loop.state = 0;
        cancelAnimationFrame(loop.id);
        return;
    }
    function main (timestamp) {
        var cycles = 0;
        if (loop.state) {
            waiting();
            if (timestamp < loop.lastFt + loop.timestep) {
                loop.id = window.requestAnimationFrame(main);
                return;
            }
            loop.delta += (timestamp - loop.lastFt);
            loop.lastFt = timestamp;
            if (timestamp > loop.lastFt + 1000) {
                loop.fps = 0.25 * loop.fts + 0.75 * loop.fps;
                loop.lastFps = timestamp;
                loop.fts = 0;
            }
            loop.fts++;
            while (loop.delta >= loop.timestep) {
                update();
                loop.delta -= loop.timestep;
                cycles++;
                if (cycles >= 240) {
                    loop.delta = 0;
                    break;
                }
            }
            render(loop.delta / loop.timestep);
            collect();
            if (loop.updates.length || loop.waiting.length) {
                loop.id = window.requestAnimationFrame(main);
                return;
            }
            stop();
            return;
        }
    }
    function start () {
        if (!loop.state) {
            loop.id = window.requestAnimationFrame(function (timestamp) {
                loop.state = 1;
                render(1);
                loop.lastFt = timestamp;
                loop.lastFps = timestamp;
                loop.fts = 0;
                loop.id = requestAnimationFrame(main);
            });
        }
        return;
    }
    function GrabInterpolatedLoop (fps) {
        Object.defineProperties(this, {
            delta: {
                get: function () {
                    return this.values.delta;
                },
                set: function (value) {
                    if (typeof value === 'number' && isFinite(value))
                        this.values.delta = value;
                    return value;
                }
            },
            events: {
                value: new GrabAnimationEvents()
            },
            delta: {
                get: function () {
                    return this.values.delta;
                },
                set: function (value) {
                    if (typeof value === 'number' && isFinite(value))
                        this.values.delta = value;
                    return value;
                }
            },
            fps: {
                get: function () {
                    return this.values.fps;
                },
                set: function (value) {
                    if (typeof value === 'number' && isFinite(value))
                        this.values.fps = value;
                    return value;
                }
            },
            fts: {
                get: function () {
                    return this.values.fts;
                },
                set: function (value) {
                    if (typeof value === 'number' && isFinite(value))
                        this.values.fts = value;
                    return value;
                }
            },
            id: {
                get: function () {
                    return this.store.id;
                },
                set: function (value) {
                    if (typeof value === 'number' && isFinite(value))
                        this.store.id = value;
                    return value;
                }
            },
            lastFps: {
                get: function () {
                    return this.values.lastFps;
                },
                set: function (value) {
                    if (typeof value === 'number' && isFinite(value))
                        this.values.lastFps = value;
                    return value;
                }
            },
            lastFt: {
                get: function () {
                    return this.values.lastFt;
                },
                set: function (value) {
                    if (typeof value === 'number' && isFinite(value))
                        this.values.lastFt = value;
                    return value;
                }
            },
            maxFps: {
                get: function () {
                    return this.values.maxFps;
                },
                set: function (value) {
                    if (typeof value === 'number' && isFinite(value))
                        this.values.maxFps = value;
                    return value;
                }
            },
            state: {
                get: function () {
                    return this.store.state;
                },
                set: function (value) {
                    if (typeof value === 'number' && isFinite(value) && (value === 0 || value === 1))
                        this.store.state = value;
                    return value;
                }
            },
            store: {
                value: {
                    id: 0,
                    state: 0,
                }
            },
            timestep: {
                get: function () {
                    return 1000 / this.maxFps;
                }
            },
            updates: {
                value: [],
                writable: true
            },
            values: {
                value: {
                    delta: 0,
                    fps: 0,
                    fts: 0,
                    lastFps: 0,
                    lastFt: 0,
                    maxFps: fps
                }
            },
            waiting: {
                value: []
            }
        });
    }
    GrabInterpolatedLoop.prototype.add = function (object, values) {
        var args = organize(arguments),
            update = new GrabUpdate(object, args[0], args[1], uniqueId());
        if (validLiteral(values)) {
            Object.keys(values).forEach(function (property) {
                update.animations[property] = /^[A-Z]*color$/ig.test(property) ? new GrabColorAnimation(object[property], chroma(values[property])) : new GrabAnimation(object[property], values[property]);
            });
            duplicates(object.uid, update);
            if (typeof args[2] === 'function')
                this.events.add(update.id, args[2].bind(object));
            this.waiting.push(update);
            if (!this.state)
                start();
            return true;
        }
        return false;
    }

    //  Grab Collection  //
    function GrabCollection (arr) {
        var i, len, element;
        for (i = 0, len = arr.length; i < len; i++) {
            if (arr[i] instanceof GrabElement) {
                 Object.defineProperty(this, i, {value: arr[i]});
            } else {
                element = new GrabElement(arr[i]);
                if (element)
                    Object.defineProperty(this, i, {value: element});
            }
        }
        Object.defineProperty(this, 'length', {value: i});
    }
    GrabCollection.prototype.concat = function (collection) {
        var i,
            len,
            arr = [];
        if (collection instanceof GrabCollection || Array.isArray(collection)) {
            for (i = 0, len = this.length + collection.length; i < len; i++)
                arr.push(i < this.length ? this[i] : collection[i - collection.length]);
            console.log(arr);
            return new GrabCollection(arr);
        }
        return null;
    };
    GrabCollection.prototype.each = function (fn) {
        var i, len;
        if (typeof fn === 'function')
            for (i = 0, len = this.length; i < len; i++)
                fn.apply(null, [this[i], i]);
        return this;
    };
    GrabCollection.prototype.filter = function (fn) {
        var i,
            len,
            arr = [];
        if (typeof fn === 'function') {
            for (i = 0, len = this.length; i < len; i++)
                if (fn.apply(null, [this[i], i]))
                    arr.push(this[i]);
            return new GrabCollection(arr);
        }
        return null;
    };

    //  Grab Element  //
    function translate (property, value) {
        if (typeof property === 'string' && property.length) {
            if (/^height|left|top|width$/ig.test(property)) {
                if (typeof value === 'number' && isFinite(value)) {
                    return value + 'px';
                } else if (typeof value === 'string') {
                    return value;
                }
                return 'auto';
            }
        }
        return value;
    }
    function GrabElement (element, u) {
        Object.defineProperties(this, {
            alpha: {
                get: function () {
                    return chroma(window.getComputedStyle(this.element, '').backgroundColor).alpha;
                },
                set: function (value) {
                    var color;
                    console.log(value);
                    if (typeof value === 'number' && isFinite(value) && value >= 0 && value <= 1) {
                        color = this.backgroundColor;
                        this.element.style.backgroundColor = 'rgba(' + color.red + ',' + color.green + ',' + color.blue + ',' + value +')';
                    }
                }
            },
            backgroundColor: {
                get: function () {
                    return chroma(window.getComputedStyle(this.element, '').backgroundColor);
                },
                set: function (value) {
                    if (chroma.validate(value))
                        this.element.style.backgroundColor = chroma(value).toModel();
                    return value;
                }
            },
            children: {
                get: function () {
                    return new GrabCollection(this.element.children);
                }
            },
            classes: {
                get: function () {
                    return this.element.className.split(' ');
                }
            },
            color: {
                get: function () {
                    return chroma(window.getComputedStyle(this.element, '').color);
                },
                set: function (value) {
                    if (chroma.validate(value))
                        this.element.style.color = chroma(value).toModel();
                    return value;
                }
            },
            display: {
                get: function () {
                    return window.getComputedStyle(this.element, '').display;
                },
                set: function (value) {
                    if (typeof value === 'string' && value.length)
                        this.element.style.display = value;
                    return value;
                }
            },
            element: {
                value: element
            },
            height: {
                get: function () {
                    return this.parse('height', window.getComputedStyle(this.element, '').height);
                },
                set: function (value) {
                    var height = this.parse('height', value);
                    if (typeof height === 'number' && isFinite(height))
                        this.element.style.height = height + 'px';
                    return value;
                }
            },
            html: {
                get: function () {
                    return this.element.innerHTML.replace(/\s/g, '');
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
                    if (typeof value === 'string' && /^[a-z][\da-zA-Z-_]+$/g.test(value))
                        this.element.id = value;
                    return value;
                }
            },
            left: {
                get: function () {
                    return this.parse('left', window.getComputedStyle(this.element, '').left);
                },
                set: function (value) {
                    console.log(value);
                    var left = this.parse('left', value);
                    if (typeof left === 'number' && isFinite(left))
                        this.element.style.left = left + 'px';
                    return value;
                }
            },
            opacity: {
                get: function () {
                    return this.parse('opacity', window.getComputedStyle(this.element, '').opacity);
                },
                set: function (value) {
                    var opacity = this.parse('opacity', value);
                    if (typeof opacity === 'number' && isFinite(opacity) && opacity >= 0 && opacity <= 1)
                        this.element.style.opacity = opacity;
                    return value;
                }
            },
            rotation: {
                get: function () {
                    var values;
                    if (window.getComputedStyle(this.element, '').transform) {
                        values = window.getComputedStyle(this.element, '').transform.match(/(-?\d+\.?\d*)/g);
                        return Math.atan2(values[1], values[0]) * (180/Math.PI);
                    }
                    return null;
                },
                set: function (value) {
                    var rotation = this.parse('rotation', value);
                    if (typeof rotation === 'number' && isFinite(rotation))
                        this.element.style.transform = 'rotate(' + (rotation % 360) + 'deg)';
                    return value;
                }
            },
            selector: {
                get: function () {
                    var id = this.id ? '#' + this.id : '',
                        classes = this.classes.length ? '.' + this.classes.join('.') : '';
                    return this.element.tagName.toLowerCase() + id + classes;
                }
            },
            top: {
                get: function () {
                    return this.parse('top', window.getComputedStyle(this.element, '').top);
                },
                set: function (value) {
                    var top = this.parse('top', value);
                    if (typeof top === 'number' && isFinite(top))
                        this.element.style.top = top + 'px';
                    return value;
                }
            },
            uid: {
                value: uniqueId(u)
            },
            visibility: {
                get: function () {
                    return window.getComputedStyle(this.element, '').visibility;
                },
                set: function (value) {
                    if (typeof value === 'string' && value.length)
                        this.element.style.visibility = value;
                    return value;
                }
            },
            width: {
                get: function () {
                    return this.parse('width', window.getComputedStyle(this.element, '').width);
                },
                set: function (value) {
                    var width = this.parse('width', value);
                    if (typeof width === 'number' && isFinite(width))
                        this.element.style.width = width + 'px';
                    return value;
                }
            },
            zIndex: {
                get: function () {
                    return this.parse('zIndex', window.getComputedStyle(this.element, '').zIndex);
                },
                set: function (value) {
                    var zIndex = parseInt(value, 10);
                    if (typeof zIndex === 'number' && isFinite(zIndex))
                        this.element.style.zIndex = zIndex;
                    return value;
                }
            }
        });
    }
    GrabElement.prototype.addClass = function (name) {
        var i, len;
        if (typeof name === 'string' && name.length) {
            name = name.split(',');
            for (i = 0, len = name.length; i < len; i++)
                this.element.classList.add(name[i].replace(/\s/g, ''));
        } else if (Array.isArray(name)) {
            for (i = 0, len = name.length; i < len; i++)
                this.addClass(name[i]);
        }
        return this;
    };
    GrabElement.prototype.after = function (sibling) {
        if (sibling instanceof GrabElement) {
            this.exit();
            sibling.element.parentNode.insertBefore(this.element, sibling.element.nextSibling);
        } else {
            if (sibling !== null)
                this.after(grab(sibling));
        }
        return this;
    };
    GrabElement.prototype.animate = function (values, duration, easing, complete) {
        var translated = {},
            property;
        if (validLiteral(values)) {
            for (property in values)
                if (/^[A-Z]*color|alpha|height|left|opacity|rotate|top|width$/ig.test(property))
                    translated[property] = /^[A-Z]*color$/ig.test(property) ? chroma(values[property]) : this.parse(property, values[property]);
            loop.add(this, translated, duration, easing, complete);
        }
        return this;
    };
    GrabElement.prototype.append = function (child) {
        var i, len;
        if (child instanceof GrabElement) {
            child.exit();
            this.element.appendChild(child.element);
        } else if (child instanceof GrabCollection || Array.isArray(child)) {
            for (i = 0, len = child.length; i < len; i++)
                this.append(child[i]);
        } else {
            if (child !== null)
                this.append(grab(child));
        }
        return this;
    };
    GrabElement.prototype.attr = function (attribute, value) {
        var attributes,
            attr,
            all = {};
        if (typeof attribute === 'string' && attribute.length) {
            this.element.setAttribute(attribute.replace(/([A-Z])/g, '-1$').trim().toLowerCase(), value.toString());
        } else if (validLiteral(attribute)) {
            for (attr in attribute)
                this.attr(attr, attribute[attr]);
        } else if (!attribute) {
            attributes = this.element.attributes;
            Object.keys(attributes).forEach(function (a) {
                attr = attributes[a].name.split('-').map(function (s, i) {
                    return i ? s[0].toUpperCase() + s.slice(1).toLowerCase() : s
                }).join('');
                all[attr] = attributes[a].value;
            });
            return all;
        }
        return this;
    };
    GrabElement.prototype.before = function (sibling) {
        if (sibling instanceof GrabElement) {
            this.exit();
            sibling.element.parentNode.insertBefore(this.element, sibling.element);
        } else {
            if (sibling !== null)
                this.before(grab(sibling));
        }
        return this;
    };
    GrabElement.prototype.child = function (selector) {
        var children = [];
        if (typeof selector === 'string' && selector.length)
            selector = selector.split(',');
        if (Array.isArray(selector)) {
            this.children.each(function (child) {
                selector.forEach(function (s) {
                    child.selector.match(/(#?\.?[a-z][\da-z]*)/ig).forEach(function (match) {
                        if (match === s)
                            children.push(child.element);
                    });
                });
            });
            if (children.length)
                return children.length > 1 ? new GrabCollection(children) : new GrabElement(children[0]);
        }
        return new GrabCollection([]);
    };
    GrabElement.prototype.css = function (property, value) {
        var prop;
        if (typeof property === 'string' && this.element.style.hasOwnProperty(property)) {
            this.element.style[property] = translate(property, value);
        } else if (validLiteral(property)) {
            for (prop in property)
                this.css(prop, property[prop]);
        }
        return this;
    };
    GrabElement.prototype.data = function (data, value) {
        var datum,
            dt,
            all = {};
        if (typeof data === 'string' && data.length) {
            this.element.setAttribute('data-' + data.replace(/\s/g, '-').trim().toLowerCase(), value.toString());
        } else if (validLiteral(data)) {
            for (datum in data)
                this.data(datum, data[datum]);
        } else if (!data) {
            data = this.element.attributes;
            Object.keys(data).forEach(function (attr) {
                dt = data[attr].name;
                var key = dt.replace(/^data-/g, '').split('-').map(function (s, i) {
                    return i ? s[0].toUpperCase() + s.slice(1).toLowerCase() : s;
                }).join('');
                if (/^data-[A-Z-]+$/ig.test(dt))
                    all[key] = data[attr].value;
            });
            return all;
        }
        return this;
    };
    GrabElement.prototype.exit = function () {
        if (this.element.parentNode)
            this.element.parentNode.removeChild(this.element);
    };
    GrabElement.prototype.fadeIn = function (duration, easing, complete) {
        this.opacity = 0.0;
        this.animate({opacity: 1.0}, duration, easing, complete);
        return this;
    };
    GrabElement.prototype.fadeOut = function (duration, easing, complete) {
        this.opacity = 1.0;
        this.animate({opacity: 0.0}, duration, easing, complete);
        return this;
    };
    GrabElement.prototype.find = function (selector) {
        var children = [];
        if (typeof selector === 'string' && selector.length) {
            children = this.element.querySelectorAll(selector);
            if (children)
                return children.length > 1 ? new GrabCollection(children) : new GrabElement(children[0]);
        }
        return new GrabCollection([]);
    };
    GrabElement.prototype.hide = function () {
        this.display = 'none';
        return this;
    };
    GrabElement.prototype.innerHtml = function (html) {
        this.html = html;
        return this;
    };
    GrabElement.prototype.off = function (event, fn) {
        this.element.removeEventListener(event, fn);
    };
    GrabElement.prototype.on = function (event, fn) {
        this.element.addEventListener(event, fn.bind(this));
    };
    GrabElement.prototype.parse = function (property, value) {
        if (typeof property === 'string' && property.length) {
            if (/^height|left|top|width$/ig.test(property)) {
                if (/^-?\d+\.?\d*px$/g.test(value)) {
                    return parseFloat(value, 10);
                } else if (/^-?\d+\.?\d*vw$/g.test(value)) {
                    return window.innerWidth * (parseFloat(value, 10) / 100);
                } else if (/^-?\d+\.?\d*vh$/g.test(value)) {
                    return window.innerHeight * (parseFloat(value, 10) / 100);
                } else if (/^\d+\.?\d*%$/g.test(value)) {
                    if (!this.element.parentNode)
                        return 0;
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
            } else if (property === 'rotation') {
                if (/^\d+\.?\d*deg$/ig.test(value)) {
                    return parseFloat(value, 10) % 360;
                } else if (/^\d+\.?\d*rad$/ig.test(value)) {
                    return (parseFloat(value, 10) * (Math.PI / 180)) % 360;
                }
            }
        }
        if (typeof value === 'number' && isFinite(value))
            return value;
        return null;
    };
    GrabElement.prototype.prepend = function (child) {
        var i, len;
        if (child instanceof GrabElement) {
            child.exit();
            this.element.prepend(child.element);
        } else if (child instanceof GrabCollection || Array.isArray(child)) {
            for (i = 0, len = child.length; i < len; i++)
                this.prepend(child[i]);
        } else {
            if (child !== null)
                this.prepend(grab(child));
        }
        return this;
    };
    GrabElement.prototype.remove = function (child) {
        var i, len;
        if (!child || child.element.parentNode !== this.element)
            return this;
        if (child instanceof GrabElement) {
            this.element.removeChild(child.element);
        } else if (child instanceof GrabCollection || Array.isArray(child)) {
            for (i = 0, len = child.length; i < len; i++)
                this.remove(child[i]);
        } else {
            if (child !== null)
                this.prepend(grab(child));
        }
        return this;
    };
    GrabElement.prototype.removeClass = function (name) {
        var i, len;
        if (typeof name === 'string' && name.length) {
            name = name.split(',');
            for (i = 0, len = name.length; i < len; i++)
                this.element.classList.remove(name[i].replace(/\s/g, ''));
        } else if (Array.isArray(name)) {
            for (i = 0, len = name.length; i < len; i++)
                this.removeClass(name[i]);
        }
        return this;
    };
    GrabElement.prototype.set = function (property, value) {
        var prop;
        if (typeof property === 'string' && this.hasOwnProperty(property)) {
            this[property] = value;
        } else if (validLiteral(property)) {
            for (prop in property)
                this.set(prop, property[prop]);
        }
        return this;
    };
    GrabElement.prototype.show = function () {
        this.display = 'block';
        return this;
    };
    GrabElement.prototype.toggle = function () {
        this.display = this.display === 'none' ? 'block' : 'none';
        return this;
    };
    GrabElement.prototype.toggleClass = function (name) {
        var i, len;
        if (typeof name === 'string' && name.length) {
            name = name.split(',');
            for (i = 0, len = name.length; i < len; i++)
                this.element.classList.toggle(name[i].replace(/\s/g, ''));
        } else if (Array.isArray(name)) {
            for (i = 0, len = name.length; i < len; i++)
                this.toggleClass(name[i]);
        }
        return this;
    };

    loop = new GrabInterpolatedLoop(DEFAULT.fps);
    grab = function (selector) {
        var selected;
        if (typeof selector === 'string' && selector.length) {
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
                return selected.length > 1 ? new GrabCollection(selected) : new GrabElement(selected[0]);
            } else if (selected.nodeType) {
                // A DOM object has been created by `grab`
                return new GrabElement(selected);
            }
        } else if (selector instanceof GrabElement) {
            return selector;
        } else if (selector.nodeType) {
            //  A DOM object
            return new GrabElement(selector);
        } else if (selector instanceof GrabCollection || Array.isArray(selector)) {
            //  Array like object of "selectors"
            return new GrabCollection(selector);
        }
        return null;
    };
    grab.setDefault = function (property, value) {
        var prop;
        if (typeof property === 'string' && DEFAULT.hasOwnProperty(property)) {
            DEFAULT[property] = value;
        } else if (validLiteral(property)) {
            for (prop in property)
                this.setDefault(prop, property[prop]);
        }
    };
}());