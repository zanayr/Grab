// @ts-nocheck
/**
 * @author Ryan Fickenscher | https://github.com/zanayr
 * @description Grab is a small document manipulation library that abstracts away the 80% of repetitive code I've written for personal projects.
 * @license TBA
 */
// The `events` object is used for event delegation
const events = {channels: {}, delegates: {}};
/**
 * `uniqueId` creates a unique 28 character hex id
 * NOTE: I stole this from somewhere a long time ago and memorized it's pattern, but I
 *       have no idea where..
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
 * `isLiteral` validates object literals
 * NOTE: I stole this from somewhere a long time ago and memorized it's pattern, but I
 *       have no idea where..
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
/**
 * `releaseChannel` calls `removeEventListener` on the `document` (event delegation)
 * and then deletes the event channel and delegate
 * @param {*} channel is a string
 */
function releaseDelegate(channel) {
    document.removeEventListener(event, events.reducers[channel]);
    delete evetns.channels[channel];
    delete evetns.delegates[channel];
}
/**
 * `delegateEvent` creates an event delegate
 * NOTE: https://gomakethings.com/listening-for-click-events-with-vanilla-javascript/
 * @param {*} channel is a string
 */
function delegateEvent(channel) {
    // Event delegation is a proven method for handling DOM events in the browser
    // Create a "delegate" which is just an event handler that iterates through all
    // associated `GrabElement`s that are registered, matching on the `data-grab-id`
    // attribute, calling the corrisponding callback and passing it a reference to
    // the `GrabElement`
    const delegate = e => {
        for (let id in events.channels[channel]) {
            const event = events.channels[channel][id];
            if (id === e.target.getAttribute('data-grab-id')) return event.fn(e, event.ref);
        }
    };
    // Set the empty channel and delegate
    // Add the event listener on the `document`
    events.channels[channel] = {};
    events.delegates[channel] = delegate;
    document.addEventListener(channel, delegate);
}
/**
 * `addEvent` adds a new event to a delegated channel
 * @param {string} id is a grab ID
 * @param {string} channel is a string
 * @param {Object} event is an object
 */
function addEvent (id, channel, event) {
    // If the channel doesn't exist, create a new delegation
    if (!events.channels[channel]) delegateEvent(channel);
    // Add the passed event object to the channel
    events.channels[channel][id] = event;
}
/**
 * `removeElement` removes an event from a delegated channel
 * @param {string} id is a grab ID
 * @param {string} channel is a string
 */
function removeEvent(id, channel) {
    // Check if the event does exist in the channel
    if (Object.keys(events.channels[channel]).includes(id)) delete events.channels[channel][id];
    // If there are no remaining events in the channel, release the delegation
    if (!Object.keys(events.channels[channel]).length) releaseDelegate(channel);
}
/**
 * `removeAllEvents` removes all events from all delegated channels
 * @param {string} id is a Grab ID 
 */
function removeAllEvents (id) {
    Object.keys(events.channels).forEach(channel => {
        if (Object.keys(events.channels[channel]).includes(id)) removeEvent(id, channel);
    });
}

/**
 * GrabCollection class
 */
export class GrabCollection {
    /**
     * Create a new `GrabCollection`
     * @param {Array} collection is an array of `GrabElement`s
     */
    constructor(collection=[]) {
        let count = 0;
        if (Array.isArray(collection)) {
            for (let i = 0, len = collection.length; i < len; i++) {
                if (!(collection[i] instanceof GrabElement)) continue;
                this[i] = collection[i];
                count++;
            }
        }
        Object.defineProperties(this, {
            __length: {
                enumerable: false,
                value: count,
            },
            length: {
                enumerable: false,
                get: () => this.__length,
                writable: false,
            },
        });
    }
    /**
     * `addEvent` cycles through owned elements, adding each to a delegated event
     * @param {*} channel 
     * @param {*} callback 
     * @returns itself for method chaining
     */
    addEvent(channel, callback) {
        return this.each(el => el.addEvent(channel, callback));
    }
    /**
     * `removeEvent` cycles through owned elements, removing each from a delegated
     * event
     * @param {string} channel is a string
     * @returns itself for method chaining
     */
    removeEvent(channel) {
        return this.each(el => el.removeEvent(channel));
    }
    /**
     * `removeAllEvents` cycles through owned elements, removing each from all
     * delegated events
     * @returns itself for method chaining
     */
    removeAllEvents() {
        return this.each(el => el.removeAllEvents());
    }
    /**
     * `setAttribute` cycles through owned elements, setting attributes on each
     * NOTE: use `setDatum` if setting a `data-` attribute 
     * @param {any} can be a string or object of name, value pairs
     * @param {any} value is any value, leave undefined if passing an object
     * @returns itself for method chaining
     */
    setAttribute(name, value) {
        return this.each(element => element.attributes(name, value));
    }
    /**
     * `setDatum` cycles through owned elements, setting a `data-` attribute on each
     * @param {any} name can be a string or object of name, value pairs
     * @param {any} value is any value, leave undefined if passing an object
     * @returns itself for method chaining
     */
    setDatum(data, value) {
        return this.each(element => element.data(data, value));
    };
    /**
     * `addClass` cycles through owned elements, adding a CSS class selector to each
     * @param {string} className is a string
     * @returns itself for method chaining
     */
    addClass(className) {
        return this.each(element => element.add(className));
    }
    /**
     * `removeClass` cycles through owned elements, removing a CSS class selector to
     * each
     * @param {string} className is a string
     * @returns itself for method chaining
     */
    removeClass(className) {
        return this.each(element => element.remove(className));
    }
    /**
     * `toggleClass` cycles through owned elements, toggling a CSS class selector to
     * each
     * @param {string} className is a string
     * @returns itself for method chaining
     */
    toggleClass(className) {
        return this.each(element => element.toggle(className));
    }
    /**
     * `addElement` adds a new `GrabElement` to the collection
     * @param {*} element is a `GrabElement`
     */
    addElement(selector) {
        const e = element(selector);
        // Check if the passed selecter was able to grab a valid element, and it is an
        // instance of `GrabElement`
        if (e != null && e instanceof GrabElement) {
            this[this.length] = element;
            this.__length++;
        }
        return this;
    }
    /**
     * `removeElement` removes an owned element from the collection
     * @param {any} index is an number index of the item to remove
     */
    removeElement(index) {
        if (this[index]) {
            for (let i = index, len = this.length; i < len; i++) this[i] = this[i + 1];
            delete this[this.length];
            this.__length--;
        }
        return this;
    }
    /**
     * `concat` concats a new array of `GrabElement`s to the existing collection
     * @param {Array} collection can be either a `GrabCollection` of an array of `GrabElement`s
     * @returns a new `GrabCollection` of combined elements
     */
    concat(collection=[]) {
        const result = [];
        if (collection instanceof GrabCollection || Array.isArray(collection)) {
            for (let i = 0, len = this.length + collection.length; i < len; i++) result.push(i < this.length ? this[i] : collection[i - collection.length]);
            return new GrabCollection(result);
        }
        return this.map(el => el); // return a copy if an invalid collection is passed
    }
    /**
     * `each` cycles through owned elements, acting on each
     * @param {Function} fn is a function, it is passed an element and its index
     * @returns itself for method chaining
     */
    each(fn) {
        if (typeof fn === 'function')
            for (let i = 0; i < this.length; i++) fn.apply(null, [this[i], i]);
        return this;
    }
    /**
     * `filter` cycles through owned elements, acting on each
     * @param {Function} fn is a function that returns a bool, it is passed an element and its index
     * @returns a new `GrabCollection` of the filtered elements
     */
    filter(fn) {
        const result = [];
        if (typeof fn === 'function') {
            for (let i = 0; i < this.length; i++) {
                if (fn.apply(null, [this[i], i])) result.push(this[i]);
            }
            return new GrabCollection(result);
        }
        return this.map(el => el); // return a copy if an invalid filtering function is passed
    }
    /**
     * `map` cycles through owned elements, acting on each
     * @param {Function} fn is a function, returning an element, it is passed an element and its index
     * @returns a new `GrabCollection` of mapped elements
     */
    map(fn) {
        const result = [];
        if (typeof fn === 'function')
            for (let i = 0; i < this.length; i++) result.push(fn.apply(null, [this[i], i]));
        return new GrabCollection(result);
    }
    sort(fn) {
        if (typeof fn === 'function')
            for (let i = 0, len = this.length; i < len - 1; i++) fn.apply(null, [this[i], this[i + 1]]);
        return this;
    }
}

/**
 * GrabElement class
 */
export class GrabElement {
    /**
     * Create a new `GrabElement`
     * @param {HTMLElement} htmlElement is an HTMLElement object
     */
    constructor(htmlElement) {
        const node = htmlElement instanceof HTMLElement ? htmlElement : undefined;
        const id = uniqueId();
        // Throw an `Error` if an invalid html DOM element was passed to the
        // constructor
        if (!node) throw new Error('Invalid DOM element passed to GrabElement constructor');
        // Set the owned html node `data-grab-id` attribute (used for event delegation)
        node.setAttribute('data-grab-id', id);
        // Define getters and setters
        Object.defineProperties(this, {
            __grabId: {
                // The internal grab ID (used for event delegation)
                enumerable: false,
                value: id,
                writable: false,
            },
            __node: {
                // The owned html node
                enumerable: false,
                value: node,
                writable: false,
            },
            attributeList: {
                // Gets a list of all the attributes on the owned html node
                get: () => {
                    const result = {};
                    // Loop through all attributes on the owned html node
                    // Convert the attribute name to "camel case"
                    // Add the paired value to the `result` object
                    for (let attribute of this.node.attributes) {
                        if (/^data-/ig.test(attribute.name)) continue; // skip all `data-` prefixed attributes
                        let key = attribute.name.split('-').map((string, i) => {
                            return i ? string[0].toUpperCase() + string.slice(1).toLowerCase() : string.toLowerCase();
                        }).join('');
                        result[key] = attribute.value;
                    }
                    return result;
                },
                writable: false,
            },
            classList: {
                // Gets a the `classList` of the owned html node
                get: () => this.node.classList,
                writable: false,
            },
            dataList: {
                // Gets a list of all the `data-` attributes on the owned html node
                get: () => {
                    const result = {};
                    // Loop through all attributes on the owned html node
                    // If the attribute name begins with `data-`
                    // Truncate `data-` from the name and convert it to "camel case"
                    // Add the paired value to the `result` object
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
                writable: false,
            },
            grabId: {
                // Gets the internal grab ID (used for event delegation)
                get: () => this.__grabId,
                writable: false,
            },
            href: {
                // Gets and sets the owned html node's href havlue
                get: () => this.node.href,
                set: value => this.node.href = value,
            },
            html: {
                // Gets and sets the internal HTML of the owned html node
                get: () => this.node.innerHTML,
                set: value => this.node.innerHTML = value,
            },
            id: {
                // Gets and sets the CSS id selector of the owned html node
                get: () => this.node.id,
                set: value => this.node.id = value,
            },
            node: {
                // Gets the owned html node
                get: () => this.__node,
                writable: false,
            }
        });
    }
    /**
     * `addEvent` adds a delegated event when passed a channel and callback
     * @param {string} channel is a string
     * @param {Function} callback is a function
     * @returns itself for method chaining
     */
    addEvent(channel, callback) {
        addEvent(this.grabId, channel, {fn: callback, ref: this});
        return this;
    }
    /**
     * `removeEvent` removes a delegated event when passed a channel
     * @param {string} channel is a string
     * @returns itself for method chaining
     */
    removeEvent(channel) {
        removeEvent(this.grabId, channel);
        return this;
    }
    /**
     * `removeAllEvents` removes all delegated events
     * @returns itself for method chaining
     */
    removeAllEvents() {
        removeAllEvents(this.grabId);
        return this;
    }
    /**
     * `setAttribute` sets an attribute on the owned html node when passed a name and
     * value
     * NOTE: use `setDatum` if setting a `data-` attribute 
     * @param {any} can be a string or object of name, value pairs
     * @param {any} value is any value, leave undefined if passing an object
     * @returns itself for method chaining
     */
    setAttribute(name, value) {
        // Check if `name` is a string
        if (typeof name === 'string' && name.length && value) {
            // If the passed a value of `data-` or an invalid attribute name, return 
            // mmediately
            if (/^data-/.test(name) || !/^[a-z-]+$/ig.test(name)) return this;
            // Set the attribute with a hyphen seperated name
            this.node.setAttribute(`${name.replace(/\s/g, '-').trim().toLowerCase()}`, `${value}`);
        } else if (isLiteral(name)) {
            for (let key in name) {
                // If the passed key begins with a `data-` or if it's an invalid
                // attribute name, skip
                if (/^data/.test(name) || !/^[a-z]+$/ig.test(key)) continue;
                // Replace "camel case" keys with hyphen seperated keys
                this.node.setAttribute(`${key.replace(/([A-Z])/g, ' $1').replace(/\s/g, '-').trim().toLowerCase()}`, `${name[key]}`);
            }
        }
        return this;
    }
    /**
     * `setDatum` sets a `data-` attribute on the owned html node when passed a name
     * and value
     * @param {any} name can be a string or object of name, value pairs
     * @param {any} value is any value, leave undefined if passing an object
     * @returns itself for method chaining
     */
    setDatum(name, value) {
        if (typeof data === 'string' && data.length && value) {
            // If the passed `grabId` or an invalid attribute name, return immediately
            if (data === 'grabId' || !/^[a-z]+$/ig.test(data)) return this;
            // Set the attribute by concatinating `data-` and a hyphen seperated name
            this.node.setAttribute(`data-${data.replace(/\s/g, '-').trim().toLowerCase()}`, `${value}`);
        } else if (isLiteral(data)) {
            for (let key in data) {
                if (data === 'grabId' || !/^[a-z]+$/ig.test(key)) continue;
                this.node.setAttribute(`data-${key.replace(/([A-Z])/g, ' $1').replace(/\s/g, '-').trim().toLowerCase()}`, `${name[key]}`);
            }
        }
        return this;
    };
    /**
     * `addClass` adds a CSS class selector to the owned html node when passed a class
     * name
     * @param {string} className is a string
     * @returns itself for method chaining
     */
    addClass(className) {
        if (typeof className === 'string' && className.length) {
            this.node.classList.add(className);
        } else if (Array.isArray(className) && className.length) {
            for (let i = 0, len = className.length; i < len; i++)
                this.node.classList.add(className[i]);
        }
        return this;
    }
    /**
     * `removeClass` removes a CSS class selector from the owned html node when passed
     * a class name
     * @param {string} className is a string
     * @returns itself for method chaining
     */
    removeClass(className) {
        if (typeof className === 'string' && className.length) {
            this.node.classList.remove(className);
        } else if (Array.isArray(className) && className.length) {
            for (let i = 0, len = className.length; i < len; i++)
                this.node.classList.remove(className[i]);
        }
        return this;
    }
    /**
     * `toggleClass` toggles a CSS class selector on the owned html node when passed a
     * class name
     * @param {string} className is a string
     * @returns itself for method chaining
     */
    toggleClass(className) {
        if (typeof className === 'string' && className.length) {
            this.node.classList.toggle(className);
        } else if (Array.isArray(className) && className.length) {
            for (let i = 0, len = className.length; i < len; i++) his.node.classList.toggle(className[i]);
        }
        return this;
    }
}
/**
 * Create a `GrabElement` or GrabCollection from a DOM selector
 * NOTE: Check documentation for all valid argumentvalues
 * @param  {...any} args is a DOM element to "grab"
 * @returns a `GrabElement` or GrabCollection
 */
export function element(...args) {
    // If args is undefined, return null
    if (!args) return null;
    // Check the length of args
    if (args.length === 1) {
        if (typeof args[0] === 'string' && args[0].length) {
            // String value that can be a DOM selector or a "create" pattern e.g.
            // `<div>`
            // Return a new `GrabElement`
            if (/^<[a-z]+>$/ig.test(args[0])) return new GrabElement(document.createElement(args[0].replace(/<|>/g, '')));
            return element(document.querySelectorAll(args[0]));
        } else if (args[0] instanceof GrabElement) {
            // A `GrabElement`
            // Return a new `GrabElement` of the owned html node
            return new GrabElement(args[0].node);
        } else if (args[0] instanceof GrabCollection) {
            // A `GrabCollection`
            // Return a new `GrabCollection` using the map method
            return args[0].map(element => element);
        } else if (args[0] instanceof HTMLElement) {
            // An `HTMLElement`
            // Return a new `GrabElement`
             return new GrabElement(args[0]);
        } else if (args[0] instanceof HTMLCollection || args[0] instanceof NodeList) {
            // An `HTMLCollection`
            // Return a new `GrabCollection`
            if (args[0].length === 1) return new GrabElement(args[0][0]);
            return new GrabCollection(Object.keys(args[0]).map(key => new GrabElement(args[0][key])));
        } else if (Array.isArray(args[0])) {
            const items = [];
            // An array of items
            // Grab each element of the array
            // Push the new `GrabElement` into the items array
            // Return a new `GrabCollection`
            // NOTE: Flat cannot be used because the element may be a `GrabCollection`
            //       or something other than an array
            for (let i = 0, len = args[0].length; i < len; i++) {
                let item = element(args[0][i]); // grab item here, not in postcedent
                if (!item) continue;
                if (item.length) {
                    // If the item has a length, pass each element to `element`
                    // Return to the top of the iteration when complete
                    // This is an attempt to "flatten" the passed array of items
                    for (let key in item) items.push(element(item[key]));
                    continue;
                }
                items.push(item);
            }
            return new GrabCollection(items);
        }
    } else if (args.length > 1) {
        // A collection with a length..
        // Convert args into an array and pass it to `element` again
        return element(args.map(arg => arg));
    }
    return null;
}