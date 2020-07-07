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
function uniqueId () {
    return ('xxxxxxxx-xxxx-xxxx-yxxx-xxxxxxxxxxxx').replace(/[xy]/g, function(c) {
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
const events = {channels: {}, reducers: {}};
function release(channel) {
    document.removeEventListener(event, events.reducers[channel]);
    delete evetns.channels[channel];
    delete evetns.reducers[channel];
}
function delegate(channel) {
    const reducer = e => {
        for (let id in events.channels[channel]) {
            const event = events.channels[channel][id];
            if (id === e.target.getAttribute('data-grab-id')) return event.fn.apply(event.ref, [e]);
        }
    };
    events.channels[channel] = {};
    events.reducers[channel] = reducer; // save if so we can remove it ?
    document.addEventListener(channel, reducer);
}


class GrabElement {
    constructor(node) {
        if (node.length) node = node[0];
        const id = uniqueId();
        node.setAttribute('data-grab-id', id);
        this.__grabId = id;
        this.node = node;
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
            grabId: {
                get: () => this.__grabId
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
    once(channel, callback) {
        this.on(channel, e => {
            callback(e);
            this.off(channel);
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


function grab(...args) {
    if (args.length === 1) {
        if (typeof args[0] === 'string' && args[0].length) {
            if (/^<[a-z]+>$/ig.test(args[0])) return new GrabElement(document.createElement(args[0].replace(/<|>/g, '')));
            return new GrabElement(document.querySelectorAll(args[0]));
        } else if (args[0] instanceof GrabElement || GrabCollection) {
            return args[0];
        } else if (args[0] instanceof HTMLElement) {
            return new GrabElement(args[0]);
        } else if (args[0] instanceof HTMLCollection) {
            // return new GrabCollection(Object.keys(args[0]).map(key => new GrabElement(args[0][key])));
        }
    } else if (args.length > 1) {
        // return new GrabCollection(args.map(arg => grab(arg)));
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