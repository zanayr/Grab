/*eslint-env browser*/
(function () {
    'use strict';
    window.Aux = (function () {
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
        //  Return object with public functions
        return {
            getHashID: getHashID,
            isNumber: isNumber,
            isObject: isObject
        }
    }());
}());