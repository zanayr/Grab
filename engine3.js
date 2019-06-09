/*esling-env browser*/

(function () {
    "use-strict";
    
    //  GRAB
    window.grab = function (selector) {
        function create(dom) {
            var g = {
                element: dom,
                id: _getID(),
                values: {
                    left: undefined
                }
            }
            
            Object.defineProperties(g, {
                left: {
                    get: function () {
                        return this.values.left;
                    },
                    set: function (value) {
                        if (typeof value === 'string') {
                            
                        }
                    }
                }
            })
        }
    }
}());