/*eslint-env browser*/
(function () {
    'use strict';
    window.aux = (function () {
        //  VALIDATION AUXILIARY FUNCTIONS  ----------------------------  VALIDATION  //
        //  The isNumber function tests a passed parameter, checking if it is a number,
        //  returning an appropriate boolean value
        function isNumber (n) {
            return typeof n === 'number' && !Number.isNaN(n) && Number.isFinite(n);
        }
        //  The isObject function tests a passed parameter, checking if it is an object
        //  literal, returning the appropriate boolean value [1]
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
        //  The isString function tests a passed parameter, checking if it is a string,
        //  returning an appropriate boolean value
        function isString (str) {
            return typeof str === 'string';
        }
        //  The public isValidString function checks if a passed parameter is a string,
        //  and if that string is not empty, returning the coffisponding boolean value
        function validateString (str) {
            return isString(str) && str.length > 0;
        }
        //  STRING AUXILIARY FUNCTIONS  ------------------------------------  STRING  //
        //  The camelCase function takes a string and splits it by a delimiter,
        //  returning a string in camel case
        function camelCase (str, del) {
            if (!validateString(del)) {
                //  Replace all white space and "_" with hyphens
                str = str.replace(/\s|_/g, '-');
                del = '-';
            }
            //  Split the string at the delimiter and iterate though the array of
            //  strings, replacing the first character with an uppercase character
            return str.split(del).map(function (s, i) {
                return i ? s[0].toUpperCase() + s.slice(1).toLowerCase() : s;
            }).join('');
        }
        
        //  The strip function removes all white space from a string
        function strip (string) {
            return string.replace(/\s/g, '');
        }
        //  MISC. AUXILIARY FUNCTIONS  --------------------------------------  MISC.  //
        //  The getHashID function returns a 32 character alpha-numeric string, with the
        //  ability to pass an iterator as a unique value
        function getHashID (i) {
            if (typeof i === 'undefined' || !isNumber(i)) { // Validate the iterator value
                i = 0;
            }
            return ('xxxxxxxx-xxxx-' + i % 10 + 'xxx-yxxx-xxxxxxxxxxxx').replace(/[xy]/g, function(c) {
                var r = Math.random() * 16 | 0,
                    v = c === 'x' ? r : (r & 0x3 | 0x8);
                return v.toString(16);
            });
        }
        
        //  The store function returns an object that is array like, storing values at
        //  numerical keys and comes with serveral helper functions; a supplemental
        //  object can be passed to include custom methods or properties
        function createStore (sup) {
            var store = {
                values: {
                    length: 0
                }
            }
            Object.defineProperty(store, 'length', {
                get: function () {
                    return this.values.length;
                },
                set: function (value) {
                    if (isNumber(value)) {
                        this.values.length = value;
                    }
                }
            });
            //  PRIVATE FUNCTIONS
            //  The private reset function resets the "array" position values, removing
            //  skipped "elements"
            function _reset() {
                var j = 0,
                    t = {}; // Temporary object
                Object.keys(Object.assign({}, this)).forEach(function (key) {
                    if (isNumber(parseInt(key, 10))) {
                        t[j] = this[key]; // Copy the data
                        delete this[key]; // Delete the data from the original
                        j = j + 1;
                    }
                }.bind(this));
                this.length = j;
                return Object.assign(this, t); // Remerge the temp into the object
            }
            //  METHODS
            //  The add method adds a passed "element" into the "array" at the next
            //  numerical position
            store.add = function (element) {
                var pos = this.length;
                this.length = this.length + 1;
                this[pos] = element;
                return pos; // Return the added "element" position
            }
            //  The remove method removes an "element" at an "index" before reseting
            //  the "array"
            store.remove = function (index) {
                if (isNumber(parseInt(index))) {
                    delete this[index];
                }
                return _reset.apply(this);
            }
            //  This empty method removes all added "elements" from the "array"
            store.empty = function () {
                var len = this.length,
                    i;
                for (i = 0; i < len; i = i + 1) {
                    delete this[i];
                }
                return _reset.apply(this);
            }
            if (isObject(sup)) { //  Check for any supplemental properties or methods
                return Object.assign(store, sup);
            }
            return store;
        }
        //  Return object with public functions
        return {
            camelCase: camelCase,
            getHashID: getHashID,
            isNumber: isNumber,
            isObject: isObject,
            isString: isString,
            validateString: validateString,
            createStore: createStore,
            strip: strip
        }
    }());
}());