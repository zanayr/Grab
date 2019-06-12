/*eslint-env browser*/

(function () {
    "use-strict";
    function getStyle (element, property) {
        return window.getComputedStyle(element, '')[property];
    }
    
    //  ANIMATION
    var animation = (function () {
        var state = false,
            lastFT = 0, // Last frame time in milliseconds
            maxFPS = 30, // Max frames per second
            delta = 0,
            timestep = 1000 / 30, // Timestep
            frame = 0, // Frame id from request animation frame
            FPS = 0, // Frames per second
            FTS = 0, // Frames this second
            lastFPS = 0, // Last frames per second update
            waiting = [], // Array of animations waiting to be added into updates
            updates = [], // Array of animations that are updated every loop
            garbage = [], // Array of animations that need to be removed from updates
//            completes = {},
            easingFunctions = {
                    linear: function (d) {
                        return d;
                    },
                    easeInQuad: function (d) {
                        return Math.pow(d, 2);
                    },
                    easeInCubic: function (d) {
                        return Math.pow(d, 3);
                    },
                    easeInQuart: function (d) {
                        return Math.pow(d, 4);
                    },
                    easeInQuint: function (d) {
                        return Math.pow(d, 5);
                    },
                    easeOutQuad: function (d) {
                        return 1 - Math.pow(1 - d, 2);
                    },
                    easeOutCubic: function (d) {
                        return 1 - Math.pow(1 - d, 3);
                    },
                    easeOutQuart: function (d) {
                        return 1 - Math.pow(1 - d, 4);
                    },
                    easeOutQuint: function (d) {
                        return 1 - Math.pow(1 - d, 5);
                    }};
        function animationObject(a, b) {
            var c = {values: {
                current: a,
                last: undefined,
                original: a,
                target: b,
                time: 0,
                vector: b - a}};
                
            Object.defineProperties(c, {
                current: {
                    get: function () {
                        return this.values.current;
                    },
                    set: function (value) {
                        if (!Number.isNaN(value) && typeof value === "number") {
                            this.values.current = value;
                        }
                    }
                },
                distance: {
                    get: function () {
                        return Math.abs(this.values.vector);
                    }
                },
                last: {
                    get: function () {
                        return this.values.last;
                    },
                    set: function (value) {
                        if (!Number.isNaN(value) && typeof value === "number") {
                            this.values.last = value;
                        }
                    }
                },
                original: {
                    get: function () {
                        return this.values.original;
                    }
                },
                target: {
                    get: function () {
                        return this.values.target;
                    }
                },
                time: {
                    get: function () {
                        return this.values.time;
                    },
                    set: function (value) {
                        if (!Number.isNaN(value) && typeof value === "number") {
                            this.values.time = value;
                        }
                    }
                },
                vector: {
                    get: function () {
                        return this.values.vector;
                    }
                }
            });
            
            return c;
        }
        function add(object, values, easing, duration, complete) {
            var i = index(object.id),
                v = {};
            if (i > -1) {
                remove2(object);
            }
            Object.keys(values).forEach(function (key) {
                v[key] = animationObject(object[key], values[key]);
            });
            waiting.push({
                object: object,
                animations: v,
                easing: easingFunctions[easing],
                duration: duration,
                complete: complete,
                flag: false
            });
//            completes[object.id] = complete;
            if (!state) {
                start();
            }
        }
        function index(reference) {
            var index = -1;
            if (typeof reference === "string") {
                updates.forEach(function(update, i) {
                    if (update.object.id === reference) {
                        index = i;
                    }
                });
            }
            return index;
        }
        function remove2 (u) {
            updates = updates.filter(function (update) {
                return update.object.id !== u.id;
            });
        }
//        function remove(i) {
//            var array = [];
//            updates.forEach(function (update, j) {
//                if (i !== j) {
//                    array.push(update);
//                }
//            })
//            updates = array;
//        }
        function update() {
            updates.forEach(function (update) {
                if (!update.flag) {
                    Object.keys(update.animations).forEach(function (key) {
                        var d = 0,
                            a = update.animations[key];
                        a.time = a.time + timestep;
                        a.last = a.current;
                        d = update.easing(a.time / update.duration);
                        if (a.distance * d >= a.distance) {
                            a.current = a.target;
                            update.flag = true;
                        } else {
                            a.current = a.vector * d + a.original;
                        }
                    });
                    if (update.flag) {
                        if (update.complete) {
                            update.complete();
                        }
                        garbage.push(update);
                    }
                }
            });
        }
        function render(interpolation) {
            updates.forEach(function (update) {
                if (update.flag) {
                    Object.keys(update.animations).forEach(function (key) {
                        var a = update.animations[key];
                        update.object[key] = a.target;
                    });
                } else {
                    Object.keys(update.animations).forEach(function (key) {
                        var a = update.animations[key];
                        update.object[key] = a.last + (a.current - a.last) * interpolation;
                    });
                }
            });
        }
        function collect() {
            garbage.forEach(function (update) {
//                if (typeof item.complete === "function") {
//                    item.complete();
//                }
//                remove2(updates.findIndex(function (update) {
//                    return id === update.object.id;
//                }));
                console.log('collecting garbage...');
                updates = updates.filter(function (u) {
                    return update.object.id !== u.object.id;
                });
                
            });
            garbage.length = 0;
        }
        function panic() {
            delta = 0;
        }
        function loop(ts) {
            var updateStepCount = 0;
            if (state) {
                if (ts < lastFPS + (1000 / maxFPS)) {
                    frame = window.requestAnimationFrame(loop);
                    return;
                }
                delta = delta + (ts - lastFT);
                lastFT = ts;
                if (ts > lastFPS + 1000) {
                    FPS = 0.25 * FTS + 0.75 * FPS;
                    lastFPS = ts;
                    FTS = 0;
                }
                FTS = FTS + 1;
                while (delta >= timestep) {
                    if (waiting.length) {
                        updates = updates.concat(waiting);
                        waiting.length = 0;
                    }
                    update();
                    delta = delta - timestep;
                    updateStepCount = updateStepCount + 1;
                    if (updateStepCount >= 240) {
                        panic();
                        break;
                    }
                }
                render(delta / timestep);
                collect();
//                frame = window.requestAnimationFrame(loop);
                if (updates.length) {
                    frame = window.requestAnimationFrame(loop);
                } else {
                    stop();
                }
            }
        }
        function stop() {
            state = false;
            window.cancelAnimationFrame(frame);
        }
        function start() {
            if (!state) {
                frame = window.requestAnimationFrame(function (timestamp) {
                    state = true;
                    render(1);
                    lastFT = timestamp;
                    lastFPS = timestamp;
                    FTS = 0;
                    frame = window.requestAnimationFrame(loop);
                });
            }
        }
        return {
            add: add
        }
    }());
    
    //  GRAB
    window.grab = function (selector) {
        function create(dom) {
            var g = {
                element: dom,
                id: Math.floor(((Date.now() + Math.random()) * 10)).toString(36).substr(2, 9),
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
                        if (typeof value === "string") {
                            if (value.match(/^-?\d+.?\d*?px$/)) {
                                value = parseFloat(value, 10);
                            }
                        }
                        if (typeof value === "number" && !Number.isNaN(value)) {
                            console.log(value);
                            this.element.style.left = value + "px";
                            this.values.left = value;
                        }
                        
                    }
                }
            });
            
            g.animate = function (values, easing, duration, complete) {
                animation.add(this, values, easing || "linear", duration || 1000, complete);
            }
            
            g.left = getStyle(g.element, "left");
            
            return g;
        }
        
        function grabMany(them) {
            var grabArray = [],
                i;
            for (i = 0; i < them.length; i = i + 1) {
                grabArray.push(create(them.item(i)));
            }
            return grabArray;
        }
        function grab(it) {
            var elementArray = [];
            if (typeof it === "string") {
                if (it.match(/^<[a-zA-Z]+>$/)) {
                    return create(document.createElement(it.slice(1, -1).replace(/\s/g, '')));
                } else if (it.match(/^#[a-zA-Z]/)) {
                    return create(document.getElementById(it.slice(1).replace(/\s/g, '')));
                } else if (it.match(/^\.[a-zA-Z]/)) {
                    return grabMany(document.getElementsByClassName(it.slice(1).replace(/\s/g, '')));
                } else {
                    return create(document.querySelector(it));
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
        
        return grab(selector)
    };
}());