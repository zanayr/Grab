/*eslint-env browser*/
/*global console:false*/

/*

*/

(function () {
    "use strict";
    /*
    var requestFrame = window.requestAnimationFrame,
        cancelFrame = window.cancelAnimationFrame,
        loop;
    loop = window.loop = (function () {
        var delta = 0,
            FPS = 0,
            frameID = 0,
            framesThisSecond = 0,
            garbageArray = [],
            lastFPSUpdate = 0,
            maxFPS = 60,
            nextUpdateID = 0,
            previousFrameTime = 0,
            state = false,
            timestep = 1000 / 60,
            updatesArray = [];
        function addUpdate(object, easing, duration, complete, element, i) {
            //  Add a grab object to the updates array, passing important values
            var updateObject = {
                complete: complete,
                duration: duration,
                easing: loop.easing[easing],
                element: element,
                object: object
            };
            if (i && i < updatesArray.length) {
                updatesArray.splice(i, 0, updateObject);
            } else if (i < 0) {
                updatesArray.shift(updateObject);
            } else {
                updatesArray.push(updateObject);
            }
        }
        function getUpdateIndex(object) {
            //  Get the current index of a grab object in the updates array
            //  If it exists, return the index, if not, return -1
            var index;
            updatesArray.length.times(function (i) {
                if (object.id === updatesArray[i].object.id) {
                    index = i;
                } else {
                    index = -1;
                }
            });
            return index;
        }
        function removeUpdate(update) {
            if (Number.isNumber(update) && update < updatesArray.length) {
                updatesArray.remove(update);
            } else {
                if (updatesArray.indexOf(update) > -1) {
                    updatesArray.remove(updatesArray.indexOf(update));
                }
            }
        }*/
    
    //  HELPER FUNCTIONS --------------------------------------------------------------
    /*
    //  Normally I would add these to their respective object prototypes,
    //  but to keep this rather vanilla, I have created helper functions
    */
    //  Numbers
    function parse10(n) {
        return Number.parseFloat(n, 10);
    }
    function isNumber(n) {
        if (!Number.isNaN(n) && typeof n === "number") {
            return true;
        } else {
            return false;
        }
    }
    //  Strings
    function isString(s) {
        if (typeof s === "string") {
            return true;
        } else {
            return false;
        }
    }
    function isDOMTag (string) {
        if (string.match(/^<[a-zA-Z]+>$/)) {
            return true;
        } else {
            return false;
        }
    }
    function isPercent(s) {
        if (isString(s) && s.match(/^-?\d+.\d+%$/)) {
            return true;
        } else {
            return false;
        }
    }
    function isPixel(s) {
        if (isString(s) && s.match(/^-?\d+.\d+px$/)) {
            return true;
        } else {
            return false;
        }
    }
    function isEm(s) {
        if (isString(s) && s.match(/^-?\d+.\d+em$/)) {
            return true;
        } else {
            return false;
        }
    }
    function isVW(s) {
        if (isString(s) && s.match(/^-?\d+.\d+vw$/)) {
            return true;
        } else {
            return false;
        }
    }
    function isVH(s) {
        if (isString(s) && s.match(/^-?\d+.\d+vh$/)) {
            return true;
        } else {
            return false;
        }
    }
    function isTruthy(b) {
        //  Do stuff here
    }
    //  CSS
    function getStyle(e, p) {
        //  Do stuff here
    }
    //  Colors
    function convertColor(c) {
        //  Do stuff here
    }
    function toRGB(value) {
        //  Do stuff here
    }
    function toBoolean(value) {
        //  Do stuff here
    }
    function getKeys(object) {
        //  Do stuff here
    }
    
    window.Grab = function (selector) {
        var grabElement;
        function getID() {
            //  Return a unique ID that is 7 base36 (0-9,a-z) characters in length
            return ((Date.now() + Math.random()) * 10).floor().toString(36).substr(2, 9);
        }
        function grab(element) {
            var $element = element,
                grabObject = {
                    animation: {},
                    children: {},
                    element: $element,
                    id: getID(),
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
            Object.defineProperties(grabObject, {
                backgroundColor: {
                    get: function() {
                        //  Retrieve the backgroundColor value
                        return this.values.backgroundColor;
                    },
                    set: function(value) {
                        var colors = convertColor(value),
                            colorString = "";
                        //  Set the backgroundColor object
                        this.values.backgroundColor = {
                            b: colors[2],
                            g: colors[1],
                            r: colors[0]
                        }
                        //  Build the numeric color value string
                        colorString = "rgb(" + this.values.backgroundColor.r + ",";
                        colorString = colorString + this.values.backgroundColor.g + ",";
                        colorString = colorString + this.values.backgroundColor.b + ")";
                        //  Set the element's backgroundColor style
                        this.element.style.backgroundColor = colorString;
                        //  Set the opacity property
                        this.opcity = colors[3];
                    }
                },
                color: {
                    get: function() {
                        //  Retrieve the color value
                        return this.values.color;
                    },
                    set: function(value) {
                        var color = convertColor(value),
                            colorString = "";
                        //  Set the color object
                        this.values.color = {
                            b: color[2],
                            g: color[1],
                            r: color[0]
                        }
                        //  Build the numeric color value string
                        colorString = "rgb(" + this.values.color.r + ",";
                        colorString = colorString + this.values.color.g + ",";
                        colorString = colorString + this.values.color.b + ")";
                        //  Set the element's color style
                        this.element.style.color = colorString;
                        //  Set the opacity property
                        this.opacity = colors[3];
                    }
                },
                display: {
                    get: function () {
                        return this.values.display;
                    },
                    set: function (value) {
                        if (isTruthy(value)) {
                            value = toBoolean(value);
                            if (value) {
                                this.element.style.display = "initial";
                            } else {
                                this.element.style.display = "none";
                            }
                            this.values.visibilty = value;
                        } else {
                            console.log("error -- not a valid display value!");
                        }
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
                            } else if (isEm(value)) {
                                value = this.element.offsetHeight * (parse10(value) * 100);
                            } else {
                                console.log("error -- not a valid height value!");
                            }
                        }
                        if (isNumber(value)) {
                            this.element.style.height = value + "px";
                            this.values.height = value;
                        } else {
                            console.log("error -- not a valid height value!");
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
                            } else if (isEm(value)) {
                                value = this.element.offsetWidth * (parse10(value) * 100);
                            } else {
                                console.log("error -- not a valid left value!");
                            }
                        }
                        if (isNumber(value)) {
                            this.element.style.left = value + "px";
                            this.values.left = value;
                        } else {
                            console.log("error -- not a valid left value!");
                        }
                    }
                },
                lineHeight: {
                    get: function () {
                        return this.values.lineHeight;
                    },
                    set: function(value) {
                        if (isString(value)) {
                            if (value.match(/^auto|initial$/) || isEm(value) || isPixel(value)) {
                                this.element.style.lineHeight = value;
                                this.values.lineHeight = value;
                            } else {
                                console.log("error -- not a valid line height value!");
                            }
                        } else if (isNumber(value)) {
                            this.element.style.lineHeight = value + "px";
                            this.values.lineHeight = value;
                        } else {
                            console.log("error -- not a valid line height value!");
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
                                console.log("error -- not a valid opacity value!");
                            }
                        }
                        if (isNumber(value)) {
                            this.values.opacity = value;
                            this.element.style.opacity = value;
                        } else {
                            console.log("error -- not a valid opacity value!");
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
                            } else if (isEm(value)) {
                                value = this.element.offsetHeight * (parse10(value) * 100);
                            } else {
                                console.log("error -- not a valid top value!");
                            }
                        }
                        if (isNumber(value)) {
                            this.element.style.top = value + "px";
                            this.values.top = value;
                        } else {
                            console.log("error -- not a valid top value!");
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
                            } else if (isEm(value)) {
                                value = this.element.offsetWidth * (parse10(value) * 100);
                            } else {
                                console.log("error -- not a valid width value!");
                            }
                        }
                        if (isNumber(value)) {
                            this.element.style.width = value + "px";
                            this.values.width = value;
                        } else {
                            console.log("error -- not a valid width value!");
                        }
                    }
                },
                visibility: {
                    get: function () {
                        return this.values.visibilty;
                    },
                    set: function (value) {
                        if (isTruthy(value)) {
                            value = toBoolean(value);
                            this.element.style.visibility = value;
                            this.values.visibilty = value;
                        } else {
                            console.log("error -- not a valid visibility value!");
                        }
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
                            console.log("error -- not a valid z index value!");
                        }
                    }
                }
            });
            grabObject.show = function () {
                grabObject.display = true;
                grabObject.visibility = true;
            }
            grabObject.hide = function () {
                grabObject.display = false;
                grabObject.visibility = false;
            }
            grabObject.destroy = function () {
                grabObject.element.parentNode.removeChild(grabObject.element);
            }
            grabObject.append = function (child) {
                if (isString(child) && isDOMTag(child)) {
                    child = grab(document.createElement(child.slice(1, -1).replace(/\s/g, '')));
                }
                if (child.element && child.element.tagName) {
                    grabObject.element.appendChild(child);
                    grabObject.children[child.id] = child;
                }
                return child;
            }
            grabObject.prepend = function (child) {
                if (isString(child) && isDOMTag(child)) {
                    child = grab(document.createElement(child.slice(1, -1).replace(/\s/g, '')));
                }
                if (child.element && child.element.tagName) {
                    grabObject.element.insertBefore(child, grabObject.element.firstChild);
                    grabObject.children[child.id] = child;
                }
                return child;
            }
            grabObject.insert = function (child, index) {
                if (isString(child) && isDOMTag(child)) {
                    child = grab(document.createElement(child.slice(1, -1).replace(/\s/g, '')));
                }
                if (child.element && child.element.tagName) {
                    grabObject.element.insertBefore(child, grabObject.element.childNodes[index]);
                    grabObject.children[child.id] = child;
                }
                return child;
            }
            grabObject.remove = function (child) {
                if (child) {
                    if (grabObject.children && child.element) {
                        for (c in grabObject.children) {
                            if (c.id === child.id) {
                                child = c;
                                delete grabObject.children[id];
                            }
                        }
                    } else if (child.tagName || isString(child)) {
                        //  Is not a grab object, create one
                        child = grab(child);
                    }
                    if (child.element) {
                        grabObject.element.removeChild(child.element);
                    } else {
                        console.log("error -- no child element!")
                    }
                } else {
                    if (grabObject.element.parentNode) {
                        child = grabObject.element.parentNode.removeChild(grabObject.element);
                    } else {
                        console.log("error -- no parent element!");
                    }
                }
                return child;
            }
            grabObject.grab = function (child) {
                if (grabObject.children && child.element) {
                    for (c in grabObject.children) {
                        if (c.id === child.id) {
                            child = c;
                        }
                    }
                } else if (child.tagName || isString(child)) {
                    //  Is not a grab object, create one
                    child = grab(child);
                }
                if (child.element) {
                    return child;
                } else {
                    console.log("error -- no child element!")
                }
            }
            grabObject.addClass = function (name) {
                if (isString(name)) {
                    grabObject.element.classList.add(name.replace(/\s/g, '_'));
                    if (name.length > 0) {
                        name.split(' ')
                        .forEach(function (n) {
                            if (!grabObject.element.classList.contains(n)) {
                                grabObject.element.classList.add(n);
                            } else {
                                console.log("error -- class already attached!")
                            }
                        });
                    } else {
                        console.log("error -- not a valid class name!");
                    }
                } else {
                    console.log("error -- not a valid class name!");
                }
            }
            grabObject.removeClass = function (name) {
                if (isString(name)) {
                    if (name.length > 0) {
                        name.split(' ')
                        .forEach(function (n) {
                            if (grabObject.element.classList.contains(n)) {
                                grabObject.element.classList.remove(n);
                            } else {
                                console.log("error -- no such class name!")
                            }
                        });
                    } else {
                        console.log("error -- not a valid class name!");
                    }
                } else if (name === null || name === undefined) {
                    grabObject.element.classList.split(' ')
                        .forEach(function (className) {
                        grabObject.element.classList.remove(className);
                    });
                } else {
                    console.log("error -- not a valid class name!");
                }
            }
            grabObject.setID = function (id) {
                if (isString(id) && id.length > 0) {
                    grabObject.element.id = id;
                }
            }
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
            grabObject.set = function (css) {
                getKeys(css).forEach(function (key) {
                    grabObject[key] = css[key];
                });
            }
            // Animate
            
            //  Make grab object
            
        }
        if (isDOMTag(selector)) {
            grabElement = grab(document.createElement(selector));
        } else if (isString(selector)) {
            grabElement = grab(document.querySelector(selector));
            getKeys(grabElement.values).forEach(function (key) {
                var value = getStyle(grabElement.element, key);
                if (value) {
                    grabElement[key] = value;
                }
            });
        }
    }
}());