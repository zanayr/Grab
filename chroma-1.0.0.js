/*eslint-env browser*/
/*global aux:false*/


/* CHROMA-1.0.0.js
Chroma is a simple javascript library that converts most color models to an rgba object.
Valid color models include rgb, rgba, hexadecimal, hsl, hsla, hsv, hsva and the
standard broswer color strings.
*/


(function () {
    'use strict';
    window.chroma = function (model) {
        //  The private validateRGBA function validates an arrya of rgba values,
        //  returning null if any of the values are invalid
        function _validateRGBA (arr) {
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

        //  The private validateHex function validates a string of hexadecimal
        //  characters, returning null if any of the values are invalid
        function _validateHex (str) {
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

        //  The private validateHSXA function validates an array of hsl/va values,
        //  returning null if any of the values are invalid
        function _validateHSXA (arr) {
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

        //  The private rgba function takes a valid string and returns an array of
        //  rgba values
        function _rgba (str) {
            var values;
            if (aux.validateString(str)) {
                str.match(/(-?\d{1,3}\.?\d*)/g);
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
                return _validateRGBA(values);
            }
            return null;
        }

        //  The private standard function taks a valid string and returns an array of
        //  rgba vlaues
        function _standard (str) {
            var div = document.createElement('div'),
                color;
            if (aux.validateString(str)) {
                div.style.color = str;
                document.body.appendChild(div);
                color = window.getComputedStyle(div, '')['color'];
                document.body.removeChild(div);
                color = _rgba(color);
                if ((str !== 'black' && str !== 'transparent') && !color[0] && !color[1] && !color[2]) {
                    return null;
                } else {
                    return _validateRGBA(color);
                }
            }
            return null;
        }
        //  The private hexa function takes a valid string and returns an array of rgba
        //  values
        function _hexa (str) {
            var value,
                values;
            if (aux.validateString(str)) {
                value = _validateHex(str);
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
            }
            return value ? _validateRGBA(values) : null;
        }
        //  The private hsx function takes a valid string and returns an array of hsx/a
        function _hsx (str) {
            var values;
            if (aux.validateString(str)) {
                values = str.match(/(-?\d{1,3}\.?\d*)/g);
                if (values) {
                    return _validateHSXA(values.map(function (value, z) {
                        if (z === 0) {
                            return value.includes('-') ? (360 + (parseFloat(value, 10) % 360)) / 360 : (parseFloat(value, 10) % 360) / 360;
                        } else if (z < 3) {
                            return parseFloat(value, 10) / 100;
                        } else {
                            return parseFloat(value, 10);
                        }
                    }));
                }
            }
            return null;
        }
        //  The private hsla function converts hsva values into an array of rgba values
        //  This code comes from Garry Tan [1]
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
            return _validateRGBA([Math.round(r * 255), Math.round(g * 255), Math.round(b * 255), a]);
        }
        //  The private hsva function converts hsva values into an array of rgba values
        //  This code comes from Garry Tan [1]
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
            return _validateRGBA([Math.round(r * 255), Math.round(g * 255), Math.round(b * 255), a]);
        }
        
        //  COLOR  ---------------------------------------------------------  COLOR  //
        //  The private color function should convert most color models into an object
        //  of the rgba color model, as well as some overloads to pass rgb/a models
        //  including strings of rgb/a values delimited by commas, arrays of numbers or
        //  as seperate parameters or standard browser color strings
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
                color = _validateRGBA(arr);
            } else if (arguments.length > 1) {
                for (i = 0; i < arguments.length; i = i + 1) {
                    arr.push(parseFloat(arguments[i], 10));
                }
                if (!arr[3]) {
                    arr[3] = 1;
                }
                color = _validateRGBA(arr);
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
        return _color(model);
    }
}());


//  SOURCES  -------------------------------------------------------------  SOURCES  //
//  [1]     http://axonflux.com/handy-rgb-to-hsl-and-rgb-to-hsv-color-model-c