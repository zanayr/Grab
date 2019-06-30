/*eslint-env browser*/
/*global _color:false*/

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

function _checkOpacity (value) {
    return value <= 1 && value >= 0 ? value : null;
}

//  Parse Method  //
//  The Parse method should take a passed property and value, both strings, and
//  return a numeric value that is parsed depending on the property and the unit of
//  the value, if it has one or is required
function _parse (element, property, value) {
    if (typeof value === 'string') {
        if (property.match(/^border[a-zA-Z]*|height|left|top|width$/g)) {
            if (value.match(/^-?\d*\.?\d*px$/)) {
                return parseFloat(value, 10);
            } else if (value.match(/^-?\d*\.?\d*vw$/)) {
                return window.innerWidth * (parseFloat(value, 10) / 100);
            } else if (value.match(/^-?\d*\.?\d*vh$/)) {
                return window.innerHeight * (parseFloat(value, 10) / 100);
            } else if (property.match(/^height|top$/)) {
                if (value.match(/^\d*\.?\d*%$/)) {
                    return element.parentNode.offsetHeight * (parseFloat(value, 10) / 100);
                } else if (property.match(/^height$/)) {
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
            } else if (property.match(/^border[a-zA-Z]*|left|width$/)) {
                if (value.match(/^-?\d*\.?\d*%$/)) {
                    return element.parentNode.offsetWidth * (parseFloat(value, 10) / 100);
                } else if (value.match(/^auto|initial$/)) {
                    if (property.match(/^borderLeftWidth$/)) {
                        element.style.borderLeftWidth = value;
                        return element.borderLeftWidth;
                    } else if (property.match(/^borderWidth$/)) {
                        element.style.borderWidth = value;
                        return element.borderWidth;
                    } else if (property.match(/^left$/)) {
                        element.style.left = value;
                        return element.offsetLeft;
                    } else {
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
        } else if (property.match(/[a-zA-Z]*color$/ig)) {
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