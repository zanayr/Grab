/**
 * @author Ryan Fickenscher | https://github.com/zanayr
 * @description Grab is a small document manipulation library that abstracts away the 80% of repetitive code I've written for personal projects.
 * @license TBA
 */
const events = {channels: {}, reducers: {}};

// AUXILLARY FUNCTIONS
/**
 * @returns a unique id with 28 hexadecimal characters
 */
function uniqueId () {
    return ('xxxxxxxx-xxxx-xxxx-yxxx-xxxxxxxxxxxx').replace(/[xy]/g, function(c) {
        var r = Math.random() * 16 | 0,
            v = c === 'x' ? r : (r & 0x3 | 0x8);
        return v.toString(16);
    });
}
/**
 * @param {Object} value is an object literal
 * @returns a boolean value if passed a valid object literal
 */
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


// EVENT DELEGATION
/**
 * Remove an channel from the events object
 * @param {string} channel is a valid event string name
 */
function release(channel) {
    document.removeEventListener(event, events.reducers[channel]);
    delete evetns.channels[channel];
    delete evetns.reducers[channel];
}
/**
 * Delegate an event
 * @param {string} channel is a valid event string name
 */
function delegate(channel) {
    const reducer = e => {
        for (let id in events.channels[channel]) {
            const event = events.channels[channel][id];
            if (id === e.target.getAttribute('data-grab-id')) return event.fn(e, event.ref);
        }
    };
    events.channels[channel] = {};
    events.reducers[channel] = reducer; // save if so we can remove it ?
    document.addEventListener(channel, reducer);
}

// GRAB CLASSES
/**
 * GrabCollection should return a new GrabCollection object when passed an arary of 
 * GrabElements
 */
class GrabCollection {
    constructor(collection=[]) {
        let count = 0;
        if (Array.isArray(collection)) {
            for (let i = 0, len = collection.length; i < len; i++) {
                if (!(collection[i] instanceof GrabElement)) continue;
                this[i] = collection[i];
                count++;
            }
        }
        this.length = count;
    }
    
    //  EVENT METHODS
    /**
     * Clear all event channels from all elements in the collection
     */
    clear() {
        return this.each(element => element.clear());
    }
    /**
     * Remove an event channel from all elements in the collection
     * @param {string} channel is a valid event name
     */
    off(channel) {
        return this.each(element => element.off(channel));
    }
    on(channel, callback) {
        return this.each(element => element.on(channel, callback));
    }

    // Attribute Manipulation
    attributes(name, value) {
        return this.each(element => element.attributes(name, value));
    }
    data(data, value) {
        return this.each(element => element.data(data, value));
    };

    // Class Manipulation
    add(className) {
        return this.each(element => element.add(className));
    }
    remove(className) {
        return this.each(element => element.remove(className));
    }
    toggle(className) {
        return this.each(element => element.toggle(className));
    }

    // Collection Manipulation Methods
    addElement(element) {
        this[this.length] = element;
        this.length++;
        return this;
    }
    removeElement(index) {
        delete this[index];
        this.length--;
        return this;
    }

    // Collection Iteration Methods
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
}

class GrabElement {
    constructor(htmlElement) {
        const node = htmlElement instanceof HTMLElement ? htmlElement : undefined;
        if (!node) throw Error('Error');
        const id = uniqueId();
        node.setAttribute('data-grab-id', id);
        Object.defineProperties(this, {
            __grabId: {
                enumerable: false,
                value: id,
            },
            __node: {
                enumerable: false,
                value: node,
            },
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
                },
            },
            classList: {
                get: () => this.node.classList,
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
                },
            },
            grabId: {
                get: () => this.__grabId,
            },
            href: {
                get: () => this.node.href,
                set: value => this.node.href = value,
            },
            html: {
                get: () => this.node.innerHTML,
                set: value => this.node.innerHTML = value,
            },
            id: {
                get: () => this.node.id,
                set: value => this.node.id = value,
            },
            node: {
                get: () => this.__node,
            }
        })
    }

    // Event Handling
    clear() {
        Object.keys(events.channels).forEach(channel => {
            if (Object.keys(events.channels[channel]).includes(this.grabId)) this.off(channel);
        });
        return this;
    }
    off(channel) {
        if (Object.keys(events.channels[channel]).includes(this.grabId)) delete events.channels[channel][this.grabId];
        if (!Object.keys(events.channels[channel]).length) release(channel);
        return this;
    }
    on(channel, callback) {
        if (!events.channels[channel]) delegate(channel);
        events.channels[channel][this.grabId] = {fn: callback, ref: this};
        return this;
    }

    // Attribute Manipulation
    attributes(name, value) {
        if (typeof name === 'string' && name.length && value) {
            if (/^data-/.test(name) || !/^[a-z-]+$/ig.test(name)) return this;
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
            if (!/^[a-z]+$/ig.test(data) || data === 'grabId') return this;
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

/**
 * Grab a DOM element and return a Grab object
 * @param  {...any} args can be a list of items, and array of items a single string, HTML object or Grab object
 */
function grab(...args) {
    if (!args) return null;
    if (args.length === 1) {
        if (typeof args[0] === 'string' && args[0].length) {
            if (/^<[a-z]+>$/ig.test(args[0])) return new GrabElement(document.createElement(args[0].replace(/<|>/g, '')));
            return grab(document.querySelectorAll(args[0]));
        } else if (args[0] instanceof GrabElement) {
            return new GrabElement(args[0].node);
        } else if (args[0] instanceof GrabCollection) {
            return args[0].map(element => element);
        } else if (args[0] instanceof HTMLElement) {
             return new GrabElement(args[0]);
        } else if (args[0] instanceof HTMLCollection || args[0] instanceof NodeList) {
            if (args[0].length === 1) return new GrabElement(args[0][0]);
            return new GrabCollection(Object.keys(args[0]).map(key => new GrabElement(args[0][key])));
        } else if (Array.isArray(args[0])) {
            const items = [];
            // Iterate through each element, grab it, check if it have a length, and
            // push each item to the items array
            for (let i = 0, len = args[0].length; i < len; i++) {
                let item = grab(args[0][i]); // grab item here, not in postcedent
                if (!item) continue;
                if (item.length) {
                    for (let key in item) items.push(grab(item[key]));
                    continue;
                }
                items.push(item);
            }
            return new GrabCollection(items);
        }
    } else if (args.length > 1) {
        // Convert args into an array and pass it to grab
        return grab(args.map(arg => arg));
    }
    return null;
}
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