/*eslint-env browser*/
(function () {
    'use strict';
    window.aux = (function () {
        //  The public getHashID function returns a hash id made of a hexidecimal string
        function getHashID (z) {
            return ('xxxxxxxx-xxxx-' + z % 10 + 'xxx-yxxx-xxxxxxxxxxxx').replace(/[xy]/g, function(c) {
                var r = Math.random() * 16 | 0,
                    v = c === 'x' ? r : (r & 0x3 | 0x8);
                return v.toString(16);
            });
        }
        //  The public isNumber function checks if a passed parameter is a number
        //  returning the corrisponding boolean value
        function isNumber (number) {
            if (typeof number !== 'number') {
                return false;
            }
            if (Number.isNaN(number)) {
                return false;
            }
            if (!Number.isFinite(number)) {
                return false;
            }
            return true;
        }
        //  The public isObject function checks if a passed parameter is an object
        //  literal, returning the corrisponding boolean value
        //  Thanks to Rick [1]
        function isObject (object) {
            var test = object,
                check = true; // flag to change once the super most prototype has been found
            //  First check if the parameter is not a type of object or null, return
            //  false if true; else loop through the objects proptotypes recursively;
            //  checking each if they are the base prototype, when that is found break
            //  out of the loop and check if the prototype of the passed object is
            //  indeed this basal object type, return the result
            if (typeof object !== 'object' || object === null) {
                return false;
            } else {
                return (function () {
                    while (check) {
                        if (Object.getPrototypeOf(test = Object.getPrototypeOf(test)) === null) {
                            check = false;
                            break;
                        }
                    }
                    return Object.getPrototypeOf(object) === test;
                }());
            }
        }
        //  The public isString function checks if a passed parameter is a string,
        //  returning the coffisponding boolean value
        function isString (string) {
            if (typeof string !== 'string') { // Invalid if no string is passed
                return false;
            }
            return true;
        }
        //  The public isValidString function checks if a passed parameter is a string,
        //  and if that string is not empty, returning the coffisponding boolean value
        function isValidString (string) {
            if (typeof string !== 'string') { // Invalid if no string is passed
                return false;
            }
            if (!string) { // Invalid if an empty string is passed
                return false;
            }
            return true;
        }
        //  The public arrayLikeObject function creates an array like object with
        //  some basic helper methods including, add, remove, removeAll and removeByKey
        //  If passed an object it can spread new methods or properties into it
        function arrayLikeObject (sup) {
            var object = {
                length: 0
            }
            //  The private reset function resets the "array" position values, removing
            //  skipped "elements"
            function _reset() {
                var count = 0,
                    temp = {}; // Temporary object
                Object.keys(Object.assign({}, object)).forEach(function (key) {
                    if (isNumber(parseInt(key, 10))) {
                        temp[count] = object[key]; // Copy the element
                        delete object[key]; // Delete the element from the previous object
                        count = count + 1;
                    }
                });
                object.length = count;
                return Object.assign(object, temp); // Rejoin the temp into the object
            }
            //  Add an "element", return position
            object.add = function (element) {
                object[object.length] = element;
                object.length = object.length + 1;
                return object.length - 1;
            }
            //  Remove an "element" by passed position value and reset the "order",
            //  returning the reset object
            object.remove = function (element) {
                if (isNumber(parseInt(element))) {
                    delete object[element]; // Delete element by element
                }
                return _reset();
            }
            //  Remove all "elements" and reset the "order", returning the "empty"
            //  object
            object.removeAll = function () {
                Object.keys(Object.assign({}, object)).forEach(function (key) {
                    if (isNumber(parseInt(key, 10))) {
                        delete object[key]; // Delete the element from the object
                    }
                });
                object.length = 0;
                return object;
            }
            //  Remove all "elements" that match a give key and value pair, returning
            //  the reset object
            object.removeByKeyValue = function (key, value) {
                Object.keys(Object.assign({}, object)).forEach(function (k) {
                    if (isNumber(parseInt(k, 10))) {
                        Object.keys(Object.assign({}, object[k])).forEach(function (l) {
                            if (l === key && object[k][l] === value) {
                                delete object[k]; // delete matched "element"
                            }
                        });
                    }
                });
                return _reset();
            }
            //  Return the "index" of an "element" by searching a key/value pair
            object.findIndexByKeyValue = function (key, value) {
                var index = -1;
                Object.keys(object).forEach(function (element) {
                    Object.keys(object[element]).forEach(function (k) {
                        if (k === key && object[element][k] === value) {
                            index = element;
                        }
                    });
                });
                return index;
            }
            //  Check for any supplemental properties or methods
            if (isObject(sup)) {
                return Object.assign(object, sup);
            } else {
                return object;
            }
        }
        //  Return object with public functions
        return {
            arrayLikeObject: arrayLikeObject,
            getHashID: getHashID,
            isNumber: isNumber,
            isObject: isObject,
            isString: isString,
            isValidString: isValidString
        }
    }());
}());