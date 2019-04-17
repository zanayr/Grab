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
    /*
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
    }*/

    //  For CSS
    function getStyle (element, property) {
        if (element.style[property]) {
            if (element.currentStyle) {
                return element.currentStyle[property];
            } else if (document.defaultView && document.defaultView.getComputedStyle) {
                return document.defaultView.getComputedStyle(element, '')[property];
            } else {
                return element.style[property];
            }
        }
    }
    
    //  For Colors
    function convertColor (value) {
        //  Helper Functions
        function rgb (color) {
            var colors = [];
            if (color.match(/a\(/)) {
                color.match(/^rgba\(\s*(\d{1,3})\s*,\s*(\d{1,3})\s*,\s*(\d{1,3})\s*,\s*(\d*\.?\d*)\s*\)$/).slice(1).forEach(function (c) {
                    colors.push(parseFloat(c, 10));
                });
            } else {
                color.match(/^rgb\(\s*(\d{1,3})\s*,\s*(\d{1,3})\s*,\s*(\d{1,3})\s*\)$/).slice(1).forEach(function (c) {
                    colors.push(parseFloat(c, 10));
                });
            }
            return colors;
        }
        function hex (color) {
            var colors = [];
            color = color.match(/\s*([0-9a-f]{2,8})/)[1];
            if (color.length === 2) {
                //  Hex shorthand (i.g. #ab)
                colors = [parseInt(color, 10), parseInt(color, 10), parseInt(color, 10)];
            } else if (color.length === 3) {
                //  Hex shorthand (i.g. #abc)
                colors = [parseInt(color[0] + color[0], 16), parseInt(color[1] + color[1], 16), parseInt(color[2] + color[2], 16)];
            } else if (color.length === 4) {
                //  Hexa shorthand (e.g. #abcd)
                colors = [parseInt(color[0] + color[0], 16), parseInt(color[1] + color[1], 16), parseInt(color[2] + color[2], 16), parseInt(color[3] + color[3], 16) / 255];
            } else if (color.length === 6) {
                //  Hex (i.g. #abcdef)
                color.match(/([0-9a-f]{2})([0-9a-f]{2})([0-9a-f]{2})/).slice(1).forEach(function (c) {
                    colors.push(parseInt(c, 16));
                });
            } else if (color.length === 8) {
                //  Hexa (i.g. #abcdefff)
                color.match(/([0-9a-f]{2})([0-9a-f]{2})([0-9a-f]{2})([0-9a-f]{2})/).slice(1).forEach(function (c, i) {
                    if (i === 3) {
                        colors.push(parseInt(c, 16) / 255);
                    } else {
                        colors.push(parseInt(c, 16));
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
                n = parseFloat(v, 10);
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
        if (typeof value === "string") {
            if (!value.match(/^rgba|rgb|#|0x|0X|hsla|hsl/)) {
                //  Browser standard color passed (i.g. "pink")
                (function () {
                    var temp = document.createElement("div");
                    temp.style.color = value;
                    document.body.appendChild(temp);
                    value = window.getComputedStyle(temp).getPropertyValue("color");
                    document.body.removeChild(temp);
                }());
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
    
    //  GRAB --------------------------------------------------------------------------
    window.Grab2 = function (selectorString) {
        function createGrab(object) {
            var grabObject = {
                animation: {},
                children: [],
                element: object,
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
            }
            Object.defineProperties(grabObject, {
                backgroundColor: {
                    get: function() {
                        //  Retrieve the backgroundColor value
                        return this.values.backgroundColor;
                    },
                    set: function(value) {
                        var colorArray = convertColor(value.replace(/\s/g, '')),
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
                        var colorArray = convertColor(value.replace(/\s/g, '')),
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
                        if (value && value !== "false") {
                            this.element.style.display = "initial";
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
                        if (typeof value === "string") {
                            if (value.match(/^auto|initial$/)) {
                                this.element.style.height = value;
                                value = this.element.offsetHeight;
                            } else if (value.match(/^-?\d*.?\d+?%$/)) {
                                value = this.element.parentNode.offsetHeight * (parseFloat(value, 10) / 100);
                            } else if (value.match(/^-?\d*.?\d+?px$/)) {
                                value = parseFloat(value, 10);
                            }
                        }
                        if (!Number.isNaN(value) && typeof value === "number") {
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
                        if (typeof value === "string") {
                            if (value.match(/^auto|initial$/)) {
                                this.element.style.left = value;
                                value = this.element.offsetLeft;
                            } else if (value.match(/^-?\d*.?\d+?%$/)) {
                                value = this.element.parentNode.offsetWidth * (parseFloat(value, 10) / 100);
                            } else if (value.match(/^-?\d*.?\d+?px$/)) {
                                value = parseFloat(value, 10);
                            }
                        }
                        if (!Number.isNaN(value) && typeof value === "number") {
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
                        if (typeof value === "string") {
                            if (value.match(/^auto|initial$/) || value.match(/^-?\d*.?\d+?px$/)) {
                                this.element.style.lineHeight = value;
                                this.values.lineHeight = value;
                            }
                        } else if (!Number.isNaN(value) && typeof value === "number") {
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
                        if (typeof value === "string") {
                            if (value.match(/^-?\d*.?\d+?%$/)) {
                                value = parseFloat(value, 10);
                                if (value > 100) {
                                    value = 100;
                                } else if (value < 0) {
                                    value = 0;
                                }
                                value = value / 100;
                            } else if (!Number.isNaN(parseFloat(value, 10)) && typeof parseFloat(value, 10) === "number") {
                                value = parseFloat(value, 10);
                            }
                        }
                        if (!Number.isNaN(value) && typeof value === "number") {
                            this.values.opacity = value;
                            this.element.style.opacity = value;
                        }
                    }
                },
                top: {
                    get: function () {
                        return this.values.top;
                    },
                    set: function (value) {
                        if (typeof value === "string") {
                            if (value.match(/^auto|initial$/)) {
                                this.element.style.top = value;
                                value = this.element.offsetTop;
                            } else if (value.match(/^-?\d*.?\d+?%$/)) {
                                value = this.element.parentNode.offsetHeight * (parseFloat(value, 10) / 100);
                            } else if (value.match(/^-?\d*.?\d+?px$/)) {
                                value = parseFloat(value, 10);
                            }
                        }
                        if (!Number.isNaN(value) && typeof value === "number") {
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
                        if (typeof value === "string") {
                            if (value.match(/^auto|initial$/)) {
                                this.element.style.width = value;
                                value = this.element.offsetWidth;
                            } else if (value.match(/^-?\d*.?\d+?%$/)) {
                                value = this.element.parentNode.offsetWidth * (parseFloat(value, 10) / 100);
                            } else if (value.match(/^-?\d*.?\d+?px$/)) {
                                value = parseFloat(value, 10);
                            } else {
                                //  Throw error
                            }
                        }
                        if (!Number.isNaN(value) && typeof value === "number") {
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
                        if (value && value !== "false") {
                            this.element.style.visibility = "visible";
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
                        if (typeof value === "string") {
                            value = parseInt(value, 10);
                        }
                        if (!Number.isNaN(value) && typeof value === "number") {
                            this.element.style.zIndex = value;
                            this.values.zIndex = value;
                        } else {
                            //  Throw error
                        }
                    }
                }
            });
            
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
                if ((typeof child === "string" && child.match(/^<[a-zA-Z]+>$/)) || child.tagName) {
                    child = grab(child);
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
                if ((typeof child === "string" && child.match(/^<[a-zA-Z]+>$/)) || child.tagName) {
                    child = grab(child);
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
                if ((typeof child === "string" && child.match(/^<[a-zA-Z]+>$/)) || child.tagName) {
                    child = grab(child);
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
                        if (!Number.isNaN(index) && typeof index === "number") {
                            grabObject.children.slice(index, 1);
                            grabObject.element.removeChild(child.element);
                        }
                    } else if (typeof child === "string") {
                        child = grab(child);
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
                if (typeof child === "string") {
                    return grab(grabObject.element.querySelector(child));
                }
            }
            
            //  Add and remove css classes
            grabObject.addClass = function (name) {
                if (typeof name === "string") {
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
                if (typeof name === "string") {
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
                if (typeof id === "string") {
                    grabObject.element.id = id.replace(/\s/g, '');
                }
            }
            
            //  Add and remove user events
            grabObject.on = function (event, callback) {
                if (typeof event === "string") {
                    grabObject.element.addEventListener(event, callback, false);
                }
            }
            grabObject.off = function (event, callback) {
                if (typeof event === "string") {
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
            
            Object.keys(grabObject.values).forEach(function (key) {
                var value = getStyle(grabObject.element, key);
                if (value) {
                    grabObject[key] = value;
                }
            });
            
            //  Return finialized object
            return grabObject;
        }
        
        function grab(it) {
            var element,
                elementArray = [],
                i;
            if (typeof it === "string") {
                if (it.match(/^<[a-zA-Z]+>$/)) {
                    return createGrab(document.createElement(it.slice(1, -1).replace(/\s/g, '')));
                } else if (it.match(/^#[a-zA-Z]/)) {
                    return createGrab(document.getElementById(it.slice(1).replace(/\s/g, '')));
                } else if (it.match(/^\.[a-zA-Z]/)) {
                    element = document.getElementsByClassName(it.slice(1).replace(/\s/g, ''));
                    for (i = 0; i < element.length; i = i + 1) {
                        elementArray.push(createGrab(element.item(i)));
                    }
                    return elementArray;
                } else {
                    return createGrab(document.querySelector(it));
                }
            } else if (Array.isArray(it)) {
                it.forEach(function (item) {
                    elementArray.push(grab(item));
                });
                return elementArray.slice();
            } else {
                return null;
            }
        }
        
        //  Return a new grab object or grab object array
        return grab(selectorString);
    }
}());