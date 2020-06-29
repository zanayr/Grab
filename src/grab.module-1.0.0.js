class GrabCollection {
    constructor(collection=[]) {
        let count = 0;
        if (collection instanceof GrabCollection || Array.isArray(collection)) {
            for (let i = 0, len = collection.length; i < len; i++) {
                this[i] = collection[i];
                count++;
            }
        }
        this.length = count;
    }
    add(element) {
        this[this.length] = element;
        this.length++;
        return this;
    }
    concat(collection) {
        const result = [];
        if (collection instanceof GrabCollection || Array.isArray(collection)) {
            for (let i = 0, len = this.length + collection.length; i < len; i++)
                result.push(i < this.length ? this[i] : collection[i - collection.length]);
            return new GrabCollection(result);
        }
        return null;
    }
    each(fn) {
        if (typeof fn === 'function')
            for (let i = 0; i < this.length; i++)
                fn.apply(null, [this[i], i]);
        return this;
    }
    filter(fn) {
        const result = [];
        if (typeof fn === 'function') {
            for (let i = 0; i < this.length; i++) {
                if (fn.apply(null, [this[i], i]))
                    result.push(this[i]);
            }
            return new GrabCollection(result);
        }
        return null;
    }
    map(fn) {
        const result = [];
        if (typeof fn === 'function')
            for (let i = 0; i < this.length; i++)
                result.push(fn.apply(null, [this[i], i]));
        return new GrabCollection(result);
    }
    remove(index) {
        delete this[index];
        this.length--;
        return this;
    }
}
function getId (z) {
    z = z ? 0 : z;
    return ('xxxxxxxx-xxxx-' + z % 10 + 'xxx-yxxx-xxxxxxxxxxxx').replace(/[xy]/g, function(c) {
        var r = Math.random() * 16 | 0,
            v = c === 'x' ? r : (r & 0x3 | 0x8);
        return v.toString(16);
    });
}
function isLiteral(value) {
    var test = value,
        checking = 1;
    if (typeof value !== 'object' || value === null)
        return false;
    return (() => {
        while (checking) {
            if (Object.getPrototypeOf(test = Object.getPrototypeOf(test)) === null) {
                checking = 1 - checking;
                break;
            }
        }
        return Object.getPrototypeOf(value) === test;
    })();
}

// Event Delegation
const channels = {events: {}, reducers: {}};
const grab = {};
function release(event) {
    document.removeEventListener(event, channels.reducers[event]);
    delete channels.events[event];
    delete channels.reducers[event];
}
function build() {
    return e => {
        const type = e.type;
        Object.keys(channels.events[type]).forEach(id => {
            const event = channels.events[type][id];
            if (event.gaurd(e.target)) return event.callback.apply(event.element, [e]);
        });
    };
}
function delegate(event) {
    const reducer = build();
    channels.events[event] = {};
    channels.reducers[event] = reducer;
    document.addEventListener(event, reducer);
}
function gaurd(element) {
    if (/^\./g.test(element.selector)) return target => target.classList.contains(element.selector.slice(1));
    if (/^\#/g.test(element.selector)) return target => target.id === element.selector.slice(1);
    return () => false;
}


class GrabElement {
    constructor(selector) {
        this.grabId = getId(0);
        this.selector = selector;
        this.node = document.createElement('p');
        Object.defineProperties(this, {
            attributeList: {
                get: () => {
                    const result = {};
                    for (let attribute of this.node.attributes) {
                        let key = attribute.name.split('-').map((string, i) => {
                            return i ? string[0].toUpperCase() + string.slice(1).toLowerCase() : string.toLowerCase();
                        }).join('');
                        result[key] = attribute.value;
                    }
                    return result;
                }
            },
            classList: {
                get: () => this.node.classList
            },
            dataList: {
                get: () => {
                    const result = {};
                    for (let attribute of this.node.attributes) {
                        if (/^data-[a-z-]+$/ig.test(attribute.name)) {
                            let key = attribute.name.replace(/^data-/g, '').split('-').map((string, i) => {
                                return i ? string[0].toUpperCase() + string.slice(1).toLowerCase() : string.toLowerCase();
                            }).join('');
                            result[key] = attribute.value;
                        }
                    }
                    return result;
                }
            },
            href: {
                get: () => this.node.href,
                set: value => this.node.href = value
            },
            html: {
                get: () => this.node.innerHTML,
                set: value => this.node.innerHTML = value
            },
            id: {
                get: () => this.node.id,
                set: value => this.node.id = value
            }
        })
    }
    // Event Handling
    clear() {
        Object.keys(channels.events).forEach(event => {
            if (Object.keys(channels.events[event]).includes(this.grabId)) this.off(event);
        });
        return this;
    }
    off(event) {
        if (Object.keys(channels.events[event]).includes(this.grabId)) delete channels.events[event][this.grabId];
        if (!Object.keys(channels.events[event]).length) release(event);
        return this;
    }
    on(event, callback) {
        if (!channels.events[event]) delegate(event);
        channels.events[event][this.grabId] = {callback: callback, element: this, gaurd: gaurd(this)};
        return this;
    }
    once(event, callback) {
        this.on(event, e => {
            callback(e);
            this.off(event);
        });
        return this;
    }
    // Attribute Manipulation
    attributes(name, value) {
        if (typeof name === 'string' && name.length && value) {
            if (!/^[a-z]+$/ig.test(data)) return this;
            this.node.setAttribute(`${name.replace(/\s/g, '-').trim().toLowerCase()}`, `${value}`);
        } else if (isLiteral(name)) {
            for (let key in name) {
                if (!/^[a-z]+$/ig.test(key)) continue;
                this.node.setAttribute(`${key.replace(/([A-Z])/g, ' $1').replace(/\s/g, '-').trim().toLowerCase()}`, `${name[key]}`);
            }
        }
        return this;
    }
    data(data, value) {
        if (typeof data === 'string' && data.length && value) {
            if (!/^[a-z]+$/ig.test(data)) return this;
            this.node.setAttribute(`data-${data.replace(/\s/g, '-').trim().toLowerCase()}`, `${value}`);
        } else if (isLiteral(data)) {
            for (let key in data) {
                if (!/^[a-z]+$/ig.test(key)) continue;
                this.node.setAttribute(`data-${key.replace(/([A-Z])/g, ' $1').replace(/\s/g, '-').trim().toLowerCase()}`, `${data[key]}`);
            }
        }
        return this;
    };
    // Class Manipulation
    add(className) {
        if (typeof className === 'string' && className.length)
            this.node.classList.add(className);
        return this;
    }
    remove(className) {
        if (typeof className === 'string' && className.length)
            this.node.classList.remove(className);
        return this;
    }
    toggle(className) {
        if (typeof className === 'string' && className.length)
            this.node.classList.toggle(className);
        return this;
    }
}
/*
var selected;
        if (typeof selector === 'string' && selector.length) {
            //  String "selector"
            if (/^<[a-z][\da-z]*>$/g.test(selector)) {
                //  Create new DOM object and pass it to `GrabElement`
                return new GrabElement(document.createElement(selector.slice(1, -1)));
            } else if (/^#/g.test(selector)) {
                //  DOM id string passed
                selected = document.getElementById(selector.slice(1));
            } else if (/^\./g.test(selector)) {
                //  DOM class string passed
                selected = document.getElementsByClassName(selector.slice(1));
            } else if (/^[a-z][\da-z]*$/g.test(selector)) {
                //  DOM tag string passed
                selected = document.getElementsByTagName(selector);
            } else if (/(#?\.?[a-z][\da-z]*)/g.test(selector)) {
                //  DOM selector string passed
                selected = document.querySelectorAll(selector);
            } else if (selector.includes(',')) {
                //  A string of selectors delimited by commas has been passed; iterate
                //  over its values and recursively pass the them to `grab`
                selected = selector.split(',').map(function (s) {
                    return grab(s);
                });
            }
            if (selected && selected.length) {
                //  An array-like object has been created by `grab`, if the object has
                //  a single value, return a single `GrabElement`, else return a new
                //  `GrabCollection` object
                return selected.length > 1 ? new GrabCollection(selected) : new GrabElement(selected[0]);
            } else if (selected.nodeType) {
                // A DOM object has been created by `grab`
                return new GrabElement(selected);
            }
        } else if (selector instanceof GrabElement) {
            return selector;
        } else if (selector.nodeType) {
            //  A DOM object
            return new GrabElement(selector);
        } else if (selector instanceof GrabCollection || Array.isArray(selector)) {
            //  Array like object of "selectors"
            return new GrabCollection(selector);
        }
        return null;


        if (args.length == 1) {
        let model = args[0];
        if (model instanceof ChromaColor || model instanceof ChromaChannels) {
            return [model.rgb, model.model];
        } else if (typeof model == 'string' && model.length) {
            model = model.replace(/\s|#|0x/gi, '').toLowerCase();
            if (/^[\da-f]{1,8}$/ig.test(model) && (model.length != 5 && model.length != 7)) {
                return [fromHexa(model), model];
            } else if (/^[a-z]+$/ig.test(model) && x11[model]) {
                return [x11[model].map(value => value / 255).concat(1.0), model];
            } else if (/^rgb?\(((\d+),?){3}\)$/ig.test(model)) {
                let values = fromRgba(model.match(/(\d+)/g));
                if (values) return [values, toRgbString(values, true)];
            } else if (/^rgba\(((\d+\.?\d*),?){4}\)$/ig.test(model)) {
                let values = fromRgba(model.match(/(\d+\.?\d*)/g));
                if (values) return [values, toRgbString(values, true)];
            } else if (/^hsl\(((-?\d+\.?\d*)%?,?){3}\)$/ig.test(model)) {
                let values = fromHsla(model.match(/(-?\d+\.?\d*)/g));
                if (values) return [values, toHslString(values, true)];
            } else if (/^hsla\(((-?\d+\.?\d*)%?,?){4}\)$/ig.test(model)) {
                let values = fromHsla(model.match(/(-?\d+\.?\d*)/g));
                if (values) return [values, toHslString(values, true)];
            } else if (/^hsv\(((-?\d+\.?\d*)%?,?){3}\)$/ig.test(model)) {
                let values = fromHsva(model.match(/(-?\d+\.?\d*)/g));
                if (values) return [values, toHsvString(values, true)];
            } else if (/^hsva\(((-?\d+\.?\d*)%?,?){4}\)$/ig.test(model)) {
                let values = fromHsva(model.match(/(-?\d+\.?\d*)/g));
                if (values) return [values, toHsvString(values, true)];
            }  else if (/^cmyk\(((\d+\.?\d*)%,?){4}\)$/ig.test(model)) {
                let values = fromCmyk(model.match(/(\d+\.?\d*)/g));
                if (values) return [values, toCmykString(values)];
            } else if (/^((\d+\.?\d*),?){3,4}$/ig.test(model) ) {
                let values = fromRgba(model.match(/(\d+\.?\d*)/g));
                if (values) return [values, toRgbString(values, true)];
            }
        } else if (typeof model == 'number' && isFinite(model)) {
            return parse(model.toString(16).padStart(6, '0'));
        } else if (Array.isArray(model) && (model.length == 3 || model.length == 4)) {
            for (i in model)
                if (!isContained(parseFloat(model[i], 10), [0, 1])) return null;
            if (model.length == 3) return [model.map(value => parseFloat(value, 10)).concat(1.0), model.concat(1.0).toString().replace(/,/g, ', ')]
            return [model.map(value => parseFloat(value, 10)), model.toString().replace(/,/g, ', ')];
        }
    } else if (args.length <= 4) {
        return parse(Array.from(args));
    }
    return null;
        */

    // NOTE: Currently working on implementing the grab function
    // We should add selectors for id, class
    // and create element with <>
const grab = (...args) => {
    if (args.length === 1) {
        let selector = args[0];
        if (selector instanceof GrabElement || GrabCollection) {
            return selector;
        } else if (selector instanceof HTMLElement || HTML) {
        } else if (typeof selector === 'string' && selector.length) {
            if (/^#[a-z][\da-z-_]*$/ig.test(selector)) {
                console.log('id only');
            } else if (/^\.[a-z][\da-z-_]*$/ig) {
                console.log('class only');
            }
        } else if (Array.isArray(selector) && selector.length) {
            console.log('collection');
        }
    } else {
        console.log('collection');
    }
    return null;
};
grab.async = executor => new Promise(executor);
grab.get = (path, options={}) => fetch(path, Object.assign({}, options, {method: 'GET'}));
grab.post = (path, options={}) => fetch(path, Object.assign({}, options, {method: 'POST'}));
grab.send = (form, path, captcha) => {
    if (!captcha) {
        const data = new URLSearchParams(new FormData(form.node));
        return fetch(path, {body: data, method: 'POST'});
    }
    captcha.ready(() => {
        captcha.execute(form.key, {action: 'submit'})
            .then(token => {
                const data = new URLSearchParams(new FormData(form.node));
                data.append('token', token);
                return fetch(path, {body: data, method: 'POST'});
            })
            .catch(error => console.error(error));
    });
};
grab.ready = callback => {
    const fn = e => {
        callback(e);
        window.removeEventListener('load', fn);
    };
    window.addEventListener('load', fn);
};

export default grab;