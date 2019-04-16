/*eslint-env browser*/
/*global console:false*/

/*

*/

(function () {
    "use strict";
    //  HELPER FUNCTIONS --------------------------------------------------------------
    /*
    //  Normally I would add these to their respective object prototypes,
    //  but to keep this rather vanilla, I have created helper functions
    */
    //  For Numbers
    function parse10(number) {
        return parseFloat(number, 10);
    }
    function parse16(number) {
        return parseInt(number, 16);
    }
    function isNumber(number) {
        if (!Number.isNaN(number) && typeof number === "number") {
            return true;
        } else {
            return false;
        }
    }
    //  For Strings
    function isString(string) {
        if (typeof string === "string") {
            return true;
        } else {
            return false;
        }
    }
    function isDOMTag (string) {
        if (isString(string) && string.match(/^<[a-zA-Z]+>$/)) {
            return true;
        } else {
            return false;
        }
    }
    function isPercent(string) {
        if (isString(string) && string.match(/^-?\d*.?\d+?%$/)) {
            return true;
        } else {
            return false;
        }
    }
    function isPixel(string) {
        if (isString(string) && string.match(/^-?\d*.?\d+?px$/)) {
            return true;
        } else {
            return false;
        }
    }

    //  For CSS
    function getStyleValue (element, property) {/*
        if (element.currentStyle) {
            return element.currentStyle[property];
        } else if (document.defaultView && document.defaultView.getComputedStyle) {
            return document.defaultView.getComputedStyle(element, '')[property];
        } else {
            return element.style[property];
        }*/
        return element.style[property];
    }
    
    //  For Colors
    function convert2RGB (value) {
        var temp;
            
        //  Helper Functions
        function rgb (color) {
            var colors = [];
            if (color.match(/a\(/)) {
                color.match(/^rgba\(\s*(\d{1,3})\s*,\s*(\d{1,3})\s*,\s*(\d{1,3})\s*,\s*(\d*\.?\d*)\s*\)$/).slice(1).forEach(function (c) {
                    colors.push(parse10(c));
                });
            } else {
                color.match(/^rgb\(\s*(\d{1,3})\s*,\s*(\d{1,3})\s*,\s*(\d{1,3})\s*\)$/).slice(1).forEach(function (c) {
                    colors.push(parse10(c));
                });
            }
            return colors;
        }
        function hex (color) {
            var colors = [];
            color = color.match(/\s*([0-9a-f]{2,8})/)[1];
            if (color.length === 2) {
                //  Hex shorthand (i.g. #ab)
                colors = [parse16(color), parse16(color), parse16(color)];
            } else if (color.length === 3) {
                //  Hex shorthand (i.g. #abc)
                colors = [parse16(color[0] + color[0]), parse16(color[1] + color[1]), parse16(color[2] + color[2])];
            } else if (color.length === 4) {
                //  Hexa shorthand (e.g. #abcd)
                colors = [parse16(color[0] + color[0]), parse16(color[1] + color[1]), parse16(color[2] + color[2]), parse16(color[3] + color[3]) / 255];
            } else if (color.length === 6) {
                //  Hex (i.g. #abcdef)
                color.match(/([0-9a-f]{2})([0-9a-f]{2})([0-9a-f]{2})/).slice(1).forEach(function (c) {
                    colors.push(parse16(c));
                });
            } else if (color.length === 8) {
                //  Hexa (i.g. #abcdefff)
                color.match(/([0-9a-f]{2})([0-9a-f]{2})([0-9a-f]{2})([0-9a-f]{2})/).slice(1).forEach(function (c, i) {
                    if (i === 3) {
                        colors.push(parse16(c) / 255);
                    } else {
                        colors.push(parse16(c));
                    }
                });
            }
            return colors;
        }
        function hsl (color) {
            var C,
                hh,
                X,
                r,
                g,
                b,
                m,
                colors = [];
            if (color.match(/a\(/)) {
                //  HSLA (i.g. hsla(0,0%,0%,0))
                colors = color.match(/^hsla\((\d+),\s*([\d.]+)%,\s*([\d.]+)%,\s*(\d*\.?\d*)\)$/).slice(1);
            } else {
                //  HSL  (i.g. hsl(0,0%,0%))
                colors = color.match(/^hsl\((\d+),\s*([\d.]+)%,\s*([\d.]+)%\)$/).slice(1);
            }
            colors.forEach(function (v, i) {
                var n;
                //  Check for empty strings
                if (v === '') {
                    n = 0;
                }
                //  Get numbers from passed string values
                n = parse10(v);
                //  Check all values for the minimum of 0
                if (v < 0) {
                    n = 0;
                }
                //  Check to make sure numbers are within max limits,
                //  the first value, should be between 0 and 359,
                //  the remaining, between 0 and 100
                if (i === 0 && v > 359) {
                    n = 359;
                } else if (i && v > 100) {
                    n = 100;
                }
                colors[i] = n;
            });
            colors[1] = colors[1] / 100;
            colors[2] = colors[2] / 100;
            C = (1 - Math.abs(2 * colors[2] - 1)) * colors[1];
            hh = colors[0] / 60;
            X = C * (1 - Math.abs(hh % 2 - 1));
            r = g = b = 0;
            if (hh >= 0 && hh < 1) {
                r = C;
                g = X;
            } else if (hh >= 1 && hh < 2) {
                r = X;
                g = C;
            } else if (hh >= 2 && hh < 3) {
                g = C;
                b = X;
            } else if (hh >= 3 && hh < 4) {
                r = X;
                b = C;
            } else {
                r = C;
                b = X;
            }
            m = colors[2] - C / 2;
            if (colors.length < 4) {
                return [Math.round((r + m) * 255), Math.round((g + m) * 255), Math.round((b + m) * 255)];
            } else {
                return [Math.round((r + m) * 255), Math.round((g + m) * 255), Math.round((b + m) * 255), colors[3]];
            }
        }
        //  Convert Colors
        if (isString(value)) {
            if (!value.match(/^rgba|rgb|#|0x|0X|hsla|hsl/)) {
                //  Browser standard color passed (i.g. "pink")
                temp = document.createElement('div');
                temp.style.color = value;
                document.body.appendChild(temp);
                value = window.getComputedStyle(temp).getPropertyValue("color");
                document.body.removeChild(temp);
                return rgb(value);
            }
            if (value.match(/^rgb/)) {
                return rgb(value);
            } else if (value.match(/^#|0x|0X/)) {
                return hex(value);
            } else if (value.match(/^hsl/)) {
                return hsl(value);
            }
        }
    }
    function toBoolean(boolean) {
        if (typeof boolean === "boolean") {
            return boolean;
        } else if (isString(boolean) && boolean.length > 0 && boolean !== "false") {
            return true;
        } else if (isNumber(boolean) && boolean > 0) {
            return true;
        }
        return false;
    }
    
    window.Grab = function (selector) {
        var grabElement;
        function grab(element) {
            var $element = element,
                grabObject = {
                    animation: {},
                    children: [],
                    element: $element,
                    id: Math.floor(((Date.now() + Math.random()) * 10)).toString(36).substr(2, 9),
                    parent: {},
                    values: {
                        backgroundColor: {},
                        color: {},
                        display: false,
                        height: NaN,
                        left: NaN,
                        lineHeight: NaN,
                        opacity: NaN,
                        top: NaN,
                        width: NaN,
                        visibility: false,
                        zIndex: NaN
                    }
                };
            
            //  GETTERS & SETTERS -----------------------------------------------------
            Object.defineProperties(grabObject, {
                backgroundColor: {
                    get: function() {
                        //  Retrieve the backgroundColor value
                        return this.values.backgroundColor;
                    },
                    set: function(value) {
                        var colorArray = convert2RGB(value),
                            colorString = "";
                        //  Set the backgroundColor object
                        this.values.backgroundColor = {
                            b: colorArray[2],
                            g: colorArray[1],
                            r: colorArray[0]
                        }
                        //  Build the numeric color value string
                        colorString = "rgb(" + this.values.backgroundColor.r + ",";
                        colorString = colorString + this.values.backgroundColor.g + ",";
                        colorString = colorString + this.values.backgroundColor.b + ")";
                        //  Set the element's backgroundColor style
                        this.element.style.backgroundColor = colorString;
                        //  Set the opacity property
                        if (colorArray[3]) {
                            this.opacity = colorArray[3];
                        }
                    }
                },
                color: {
                    get: function() {
                        //  Retrieve the color value
                        return this.values.color;
                    },
                    set: function(value) {
                        var colorArray = convert2RGB(value),
                            colorString = "";
                        //  Set the color object
                        this.values.color = {
                            b: colorArray[2],
                            g: colorArray[1],
                            r: colorArray[0]
                        }
                        //  Build the numeric color value string
                        colorString = "rgb(" + this.values.color.r + ",";
                        colorString = colorString + this.values.color.g + ",";
                        colorString = colorString + this.values.color.b + ")";
                        //  Set the element's color style
                        this.element.style.color = colorString;
                        //  Set the opacity property
                        if (colorArray[3]) {
                            this.opacity = colorArray[3];
                        }
                    }
                },
                display: {
                    get: function () {
                        return this.values.display;
                    },
                    set: function (value) {
                        if (value) {
                            value = toBoolean(value);
                            if (value) {
                                this.element.style.display = "initial";
                            } else {
                                this.element.style.display = "none";
                            }
                        } else {
                            this.element.style.display = "none";
                        }
                        this.values.display = value;
                    }
                },
                height: {
                    get: function() {
                        //  Retrieve the height value
                        return this.values.height;
                    },
                    set: function(value) {
                        if (isString(value)) {
                            if (value.match(/^auto|initial$/)) {
                                this.element.style.height = value;
                                value = this.element.offsetHeight;
                            } else if (isPercent(value)) {
                                value = this.element.parentNode.offsetHeight * (parse10(value) / 100);
                            } else if (isPixel(value)) {
                                value = parse10(value);
                            } else {
                                //  Throw error
                            }
                        }
                        if (isNumber(value)) {
                            this.element.style.height = value + "px";
                            this.values.height = value;
                        } else {
                            //  Throw error
                        }
                    }
                },
                left: {
                    get: function() {
                        //  Retrieve left value
                        return this.values.left;
                    },
                    set: function(value) {
                        if (isString(value)) {
                            if (value.match(/^auto|initial$/)) {
                                this.element.style.left = value;
                                value = this.element.offsetLeft;
                            } else if (isPercent(value)) {
                                value = this.element.parentNode.offsetWidth * (parse10(value) / 100);
                            } else if (isPixel(value)) {
                                value = parse10(value);
                            }
                        }
                        if (isNumber(value)) {
                            this.element.style.left = value + "px";
                            this.values.left = value;
                        }
                    }
                },
                lineHeight: {
                    get: function () {
                        return this.values.lineHeight;
                    },
                    set: function(value) {
                        if (isString(value)) {
                            if (value.match(/^auto|initial$/) || isPixel(value)) {
                                this.element.style.lineHeight = value;
                                this.values.lineHeight = value;
                            }
                        } else if (isNumber(value)) {
                            this.element.style.lineHeight = value + "px";
                            this.values.lineHeight = value;
                        }
                    }
                },
                opacity: {
                    get: function () {
                        return this.values.opacity;
                    },
                    set: function(value) {
                        if (isString(value)) {
                            if (isPercent(value)) {
                                value = parse10(value);
                                if (value > 100) {
                                    value = 100;
                                } else if (value < 0) {
                                    value = 0;
                                }
                                value = value / 100;
                            } else if (isNumber(parse10(value))) {
                                value = parse10(value);
                            } else {
                                //  Throw error
                            }
                        }
                        if (isNumber(value)) {
                            this.values.opacity = value;
                            this.element.style.opacity = value;
                        } else {
                            //  Throw error
                        }
                    }
                },
                top: {
                    get: function () {
                        return this.values.top;
                    },
                    set: function (value) {
                        if (isString(value)) {
                            if (value.match(/^auto|initial$/)) {
                                this.element.style.top = value;
                                value = this.element.offsetTop;
                            } else if (isPercent(value)) {
                                value = this.element.parentNode.offsetHeight * (parse10(value) / 100);
                            } else if (isPixel(value)) {
                                value = parse10(value);
                            }
                        }
                        if (isNumber(value)) {
                            this.element.style.top = value + "px";
                            this.values.top = value;
                        }
                    }
                },
                width: {
                    get: function () {
                        return this.values.width;
                    },
                    set: function (value) {
                        if (isString(value)) {
                            if (value.match(/^auto|initial$/)) {
                                this.element.style.width = value;
                                value = this.element.offsetWidth;
                            } else if (isPercent(value)) {
                                value = this.element.parentNode.offsetWidth * (parse10(value) / 100);
                            } else if (isPixel(value)) {
                                value = parse10(value);
                            } else {
                                //  Throw error
                            }
                        }
                        if (isNumber(value)) {
                            this.element.style.width = value + "px";
                            this.values.width = value;
                        } else {
                            //  Throw error
                        }
                    }
                },
                visibility: {
                    get: function () {
                        return this.values.visibilty;
                    },
                    set: function (value) {
                        if (value) {
                            value = toBoolean(value);
                            if (value) {
                                this.element.style.visibility = "visible";
                            } else {
                                this.element.style.visiblity = "hidden";
                            }
                        } else {
                            this.element.style.visibility = "hidden";
                        }
                        this.values.visibilty = value;
                    }
                },
                zIndex: {
                    get: function() {
                        return this.values.zIndex;
                    },
                    set: function(value) {
                        if (isString(value)) {
                            value = parse10(value);
                        }
                        if (isNumber(value)) {
                            this.element.style.zIndex = value;
                            this.values.zIndex = value;
                        } else {
                            //  Throw error
                        }
                    }
                }
            });
            
            //  METHODS ---------------------------------------------------------------
            //  Show & Hide self
            grabObject.show = function () {
                grabObject.display = true;
                grabObject.visibility = true;
            }
            grabObject.hide = function () {
                grabObject.display = false;
                grabObject.visibility = false;
            }
            
            //  Add children
            grabObject.append = function (child) {
                if (isDOMTag(child)) {
                    child = grab(document.createElement(child.slice(1, -1).replace(/\s/g, '')));
                    grabObject.element.appendChild(child.element);
                    grabObject.children.push(child);
                } else if (child.id) {
                    grabObject.element.appendChild(child.element);
                    grabObject.children.push(child);
                }
                child.parent = grabObject;
                return child;
            }
            grabObject.appendMany = function (array) {
                var children = [];
                array.forEach(function (child) {
                    children.push(grabObject.append(child));
                });
                return children;
            }
            grabObject.prepend = function (child) {
                if (isDOMTag(child)) {
                    child = grab(document.createElement(child.slice(1, -1).replace(/\s/g, '')));
                    grabObject.element.appendChild(child.element);
                    grabObject.children.shift(child);
                } else if (child.id) {
                    grabObject.element.appendChild(child.element);
                    grabObject.children.shift(child);
                }
                child.parent = grabObject;
                return child;
            }
            grabObject.prependMany = function (array) {
                var children = [];
                array.forEach(function (child) {
                   children.shift(grabObject.prepend(child));
                });
                return children;
            }
            grabObject.insert = function (child, index) {
                if (isDOMTag(child)) {
                    child = grab(document.createElement(child.slice(1, -1).replace(/\s/g, '')));
                    grabObject.element.insertBefore(child, grabObject.element.childNodes[index]);
                    grabObject.children.splice(index, 0, child);
                }
                if (child.id) {
                    grabObject.element.insertBefore(child, grabObject.element.childNodes[index]);
                    grabObject.children.splice(index, 0, child);
                }
                child.parent = grabObject;
                return child;
            }
            grabObject.insertMany = function (array, index) {
                var children = [];
                array.forEach(function (child) {
                   children.push(grabObject.insert(child, index));
                });
                return children;
            }
            
            //  Remove self and children
            grabObject.remove = function (child) {
                var index;
                if (child) {
                    if (grabObject.children.length && child.id) {
                        grabObject.children.forEach(function (ch, i) {
                            if (ch.id === child.id) {
                                index = i;
                            }
                        });
                        if (isNumber(index)) {
                            grabObject.children.slice(index, 1);
                            grabObject.element.removeChild(child.element);
                        }
                    } else if (isString(child)) {
                        child = grab(grabObject.element.querySelector(child));
                        grabObject.element.removeChild(child.element);
                    }
                    child.parent = {};
                    return child;
                } else if (!child) {
                    if (grabObject.parent) {
                        grabObject.parent.remove(grabObject);
                    } else if (grabObject.element.parentNode) {
                        grabObject.element.parentNode.removeChild(grabObject.element);
                    }
                    grabObject.parent = {};
                    return grabObject;
                }
            }
            grabObject.removeMany = function (array) {
                var children = [];
                array.forEach(function (child) {
                   children.push(grabObject.remove(child));
                });
                return children;
            }
            grabObject.removeAll = function () {
                //  Do stuff
                grabObject.children.forEach(function (child) {
                    grabObject.remove(child);
                });
                return grabObject.children.slice();
            }
            
            //  Insert HTML
            grabObject.html = function (markup) {
                //  Do stuff
                grabObject.element.innerHTML = markup;
                if (grabObject.children.length) {
                    grabObject.removeAll();
                }
            }
            
            //  Search for children
            grabObject.grab = function (child) {
                if (isString(child)) {
                    return grab(grabObject.element.querySelector(child));
                }
            }
            
            //  Add and remove css classes
            grabObject.addClass = function (name) {
                if (isString(name)) {
                    if (name.length > 0) {
                        name.split(' ').forEach(function (n) {
                            if (!grabObject.element.classList.contains(n)) {
                                grabObject.element.classList.add(n);
                            }
                        });
                    }
                }
            }
            grabObject.removeClass = function (name) {
                if (isString(name)) {
                    if (name.length > 0) {
                        name.split(' ').forEach(function (n) {
                            if (grabObject.element.classList.contains(n)) {
                                grabObject.element.classList.remove(n);
                            }
                        });
                    }
                } else if (!name) {
                    grabObject.element.classList.value.split(' ').forEach(function (className) {
                        grabObject.element.classList.remove(className);
                    });
                }
            }
            
            //  Set css ID
            grabObject.setID = function (id) {
                if (isString(id)) {
                    grabObject.element.id = id.replace(/\s/g, '');
                }
            }
            
            //  Add and remove user events
            grabObject.on = function (event, callback) {
                if (isString(event)) {
                    grabObject.element.addEventListener(event, callback, false);
                }
            }
            grabObject.off = function (event, callback) {
                if (isString(event)) {
                    grabObject.element.removeEventListener(event, callback, false);
                }
            }
            
            //  Set grab object styles
            grabObject.set = function (object) {
                Object.keys(object).forEach(function (key) {
                    if (grabObject.values.hasOwnProperty(key)) {
                        grabObject[key] = object[key];
                    }
                });
            }
            
            //  Set css styles
            grabObject.style = function (property, value) {
                if (grabObject.element.style.hasOwnProperty(property)) {
                    grabObject.element.style[property] = value;
                }
                if (grabObject.values.hasOwnProperty(property)) {
                    grabObject[property] = value;
                }
            }
            grabObject.css = function (css) {
                Object.keys(css).forEach(function (key) {
                    grabObject.style(key, css[key]);
                });
            }
            
            // Animations
            grabObject.animate = function () {
                //  Do stuff
            }
            grabObject.fadeIn = function () {
                //  Do stuff
            }
            grabObject.fadeOut = function () {
                //  Do stuff
            }
            
            //  Return finialized object
            return grabObject;
        }
        if (isDOMTag(selector)) {
            grabElement = grab(document.createElement(selector.slice(1, -1).replace(/\s/g, '')));
        } else if (isString(selector)) {
            grabElement = grab(document.querySelector(selector));
            Object.keys(grabElement.values).forEach(function (key) {
                var value = getStyleValue(grabElement.element, key);
                if (value) {
                    grabElement[key] = value;
                }
            });
        }
        return grabElement;
    }
}());