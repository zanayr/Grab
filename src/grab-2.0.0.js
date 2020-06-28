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
        this.id = getId(0);
        this.selector = selector;
        this.node = document.createElement('p');
    }
    
    clear() {
        Object.keys(channels.events).forEach(event => {
            if (Object.keys(channels.events[event]).includes(this.id)) this.off(event);
        });
        return this;
    }
    off(event) {
        if (Object.keys(channels.events[event]).includes(this.id)) delete channels.events[event][this.id];
        if (!Object.keys(channels.events[event]).length) release(event);
        return this;
    }
    on(event, callback) {
        if (!channels.events[event]) delegate(event);
        channels.events[event][this.id] = {callback: callback, element: this, gaurd: gaurd(this)};
        return this;
    }
    once(event, callback) {
        this.on(event, e => {
            callback(e);
            this.off(event);
        });
        return this;
    }
}

grab.get = (path, options={}) => {
    return fetch(path, Object.assign({}, options, {method: 'GET'}));
};
grab.post = (path, options={}) => {
    return fetch(path, Object.assign({}, options, {method: 'POST'}));
};
grab.async = (executor) => {
    return new Promise(executor);
};
function tokenize(params, token) {
    // .. do stuff
}
grab.submit = (form, options={}) => {
    options = {path: './', tokenize: tokenize, ...options};
    if (window[form.captcha]) {
        window[form.captcha].ready(() => {
            window[form.captcha].execute(form.key, {action: 'submit'})
                .then(token => {
                    const data = options.tokenize(new URLSearchParams(new FormData(form.element)), token);
                    return grab.post(path, {body: data});
                });
        })
    } else {
        const data = new URLSearchParams(new FormData(form.element));
        return grab.post(path, {body: data});
    }
};