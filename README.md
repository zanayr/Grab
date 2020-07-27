# Grab.js
Grab is a small ES6 module that abstracts common patterns I repeat when developing for the world wide web.

### Feature List
Grab includes features that make webdev quicker.
- Event Delegation
- DOM element attribute (and `data-`) APIs
- `GrabElement` collections to act on many elements at once
- Abstraction of async, `GET` and `POST` APIs

### Getting Started
To use Grab simply import the module with an ES6 import statement.
```
import * as grab from '/grab.js';
```

From there, it's as easy as passing a CSS selector to the `element` function.
```
const grabElement = grab.element('#id');
```

CSS selectors aren't the only valid arguments that can be passed the the `element` function!
Valid selectors include the following:
- CSS Selector stirngs (e.g. `'#id'`, `'.class-name'`, `'[attrib=selectors]'`)
- An `HTMLElement` or `HTMLCollection` object (from any of the `document.getElement...` functions)
- Another `GrabElement` or `GrabCollection`
- Any collection of the above listed "selectors" that has a `length` property and has enumerated keys
- Homogenous or mixed Arrays of any of the above listed selectors

```
// All valid `selectors` for grab
const fromCss = grab.element('#id');
const fromHtml = grab.element(document.getElementById('id'));
const fromGrab = grab.element(fromCss);
const fromColl = grab.element({0: fromCss, 1: fromHtml, 2: fromGrab, length: 3});
const fromArr = grab.element(['#id', '.class-name', document.querySelector('#id > .class-name:not(:last-child)')]);
```

### GrabElement
A `GrabElement` is the basic object of the grab module. It encapsulates the methods and state of each passed DOM element node.

#### State
When a grab element is instanciated, it is given a unique ID, used for event delegation, and an owned html node.

*attributeList*
Get an object literal of name/value pairs of attributes.

Things to note:
- Use the `dataList` property to return a list of `data-` prefixed attributes
- To set an attribute, use the `setAttribute` method

*classList*
Get access to the well known `classList` API.

*dataList*
Get an object literal of name/value pairs of `data-` prefixed attributes.

Things to note:
- To set a `data-` prefixed attribute, use the `setDatum` method

*grabId*
Get the unique ID owned by the `GrabElement`.

*href*
Get and set the `href` attribute value.

*html*
Get and set the `innerHTML` attribute value.

*id*
Get and set the `id` attribute value.

*node*
Get the html node owned by the `GrabElement`.

#### Behavior
Methods on `GrabElemet` objects help to add some dynamicism and can be chained since they all return the obejct itself.

*addEvent*
The `addEvent` method sets an event delegate. Pass a valid browser event and event hander function.
```
grabElement.addEvent('click', handle_OnClick);
```

Things to note:
- Existing events on an `GrabElement` will be replaced by `addEvent`

*removeEvent*
The `removeEvent` method removes an event delegate. Pass a valid browser event.
```
grabElement.remove('click');
```

*removeAllEvents*
The `removeAllEvents` method removes all event delegates.
```
grabElement.removeAllEvents();
```

*setAttribute*
The `setAttribute` method sets an attribute on the owned html node.
```
grabElement.setAttribute('foo', 'bar');
/// <div foo="bar"></div>
```

In addition to a single value, an object literal of name/value pairs can be passed.
```
grabElement.setAttribute({ foo: 'bar', fizzBuzz: 'spam' });
/// <div foo="bar" fizz-buzz="spam"></div>
```
Things to note:
- Use camel case for names to be hyphen seperated
- Use the `attributeList` property get a list of existing attributes on the owned html node
- Setting any `data-` prefixed attributes will be ignored, use the `setDatum` method

*setDatum*
The `setDatum` method sets an attribute using the common `data-` prefix on the owned html node.
```
grabElement.setDatum('foo', 'bar');
/// <div data-foo="bar"></div>
```

In addition to a single value, an object literal of name/value pairs can be passed.
```
grabElement.setDatum({ foo: 'bar', fizzBuzz: 'spam' });
/// <div data-foo="bar" data-fizz-buzz="spam"></div>
```

Things to note:
- Use camel case for names to be hyphen seperated
- Use the `dataList` property to get a list of existing `data-` prefixed attributes on the owned html node
- Setting `data-grab-id` will be ignored

*addClass*
The `addClass` method adds a valid CSS class selector to the owned html node.
```
grabElement.addClass('fizz-buzz');
/// <div class="fizz-buzz"></div>
```

In addition to a single value, an arry of values can be passed.
```
grabElement.addClass(['foo', 'bar', 'spam']);
/// <div class="foo bar spam"></div>
```

*removeClass*
The `removeClass` method removes an existing CSS class selector from the owned html node.
```
/// <div class="fizz-buzz></div>
...
grabElement.removeClass('fizz-buzz');
/// <div class=""></div>
```

In addition to a single value, an arry of values can be passed.
```
/// <div class="foo bar spam"></div>
...
grabElement.removeClass(['foo', 'bar', 'spam']);
/// <div class=""></div>
```

*toggleClass*
The `toggleClass` method toggles a CSS class selector to and from the owned html node.
```
/// <div></div>
...
grabElement.toggleClass('fizz-buzz');
/// <div class="fizz-buzz"></div>
...
grabElement.toggleClass('fizz-buzz');
/// <div class=""></div>
```

In addition to a single value, an arry of values can be passed.
```
/// <div></div>
...
grabElement.toggleClass(['foo', 'bar', 'spam']);
/// <div class="foo bar spam"></div>
...
grabElement.toggleClass(['foo', 'bar', 'spam']);
/// <div class=""></div>
```

### GrabCollection
A `GrabCollection` is a collection of `GrabElements` that is grouped together with methods that make acting on the group of elements easier.

#### State
The only property on a `GrabCollection` is the `length` accsesor that gets the count of `GrabElement`s in the collection.

*length*
Gets the count of `GrabElement`s by the collection.

#### Behavior
A `GrabCollection` has many of the same methods on a `GrabElement`. These methods can be chained, unless otherwise noted, as they all return itself.

*addEvent*
This method behaves similarly to the `GrabElement` equivalent, only acting on each element in the collection.

*removeEvent*
This method behaves similarly to the `GrabElement` equivalent, only acting on each element in the collection.

*removeAllEvents*
This method behaves similarly to the `GrabElement` equivalent, only acting on each element in the collection.

*setAttribute*
This method behaves similarly to the `GrabElement` equivalent, only acting on each element in the collection.

*setDatum*
This method behaves similarly to the `GrabElement` equivalent, only acting on each element in the collection.

*addClass*
This method behaves similarly to the `GrabElement` equivalent, only acting on each element in the collection.

*removeClass*
This method behaves similarly to the `GrabElement` equivalent, only acting on each element in the collection.

*toggleClass*
This method behaves similarly to the `GrabElement` equivalent, only acting on each element in the collection.

*addElement*
Add a `GrabElement` to the collection by passing any valid Grab selector.
```
grabElements.addElement('#foo');
```

Things to note:
- Any passed selector with a length greater than 1 will be ignored, use the `concat` method to combine length'd selectors

*removeElement*
Remove a `GrabElement` from the collection by passing a valid index value.
```
grabElements.removeElement(0);
```

Things to note:
- This will reset the collection's indexes, use the `filter` method to filter the collection's elements

*concat*
Combine two collections into a new `GrabCollection` containing all elements from both. Any array, `GrabCollection` or list with a length property and enumerated keys can be passed.
```
const combinedElements = grabElements.concat(otherCollection);
```

Things to note:
- The `concat` method returns a shallow copy of all elements

*each*
Iterate over each element, passing each into a function along with its index.
```
grabElements.each((element, i) => console.log(`The element at index ${i} has the grab ID of ${element.grabId}`));
```

*filter*
Iterate over each element, passing each into a filtering function, along with its index. The filter function should return a Boolean value of true if the element is to be included in the returned `GrabCollection`, false will remove it from this copy.
```
const filteredElements = grabElements.filter((element, i) => i > 0 || element.id != 'foo');
```

Things to note:
- The `filter` method returns a shallow copy of all passing elements

*map*
Iterate over each element, passing each into a mapping function along with its index. The mapping function should return the acted upon element.
```
const mappedElements = grabElements.map((element, i) => element.setDatum('index', i));
```

Things to note:
- The `map` method returns a shallow copy of all elements

*sort*
Iterate over each element, passing two elements into a sorting function. The sorting function should return a Boolean value of true if the element is to be inserted before the compared element.
```
grabElements.sort((a, b) => a.grabId > b.grabId);
```

### Event Delegation
A quick rundown on how event delegation works. See this post by Chris Ferdenandi for more information:
https://gomakethings.com/listening-for-click-events-with-vanilla-javascript/

*How It Works*
A modern and performant way of using events in the browser is called "Event Delegation". That is, setting the event on the document, and listening, at a high level, for all issued events, and filtering by some boolean expression. Grab matches on the `data-grab-id` attribute for this filtering. The callback is passed the `Event` object and a refernce to the owning `GrabElement`.
```
    // Somewhere in the grab module...
    ...
        for (let id in events.channels[channel]) {
            const event = events.channels[channel][id];
            if (id === e.target.getAttribute('data-grab-id')) return event.fn(e, event.ref);
        }
    ...

// Add an event delegate to a grabbed element
grabElement.addEvent('click', (e, element) => {
    e.preventDefault();
    console.log(`You clicked on the element with the grab ID ${element.grabId}`);
});
```

Things to note:
- From my experince, to use event delegation as best as possible, a minimal amount of DOM elements should be in your node tree.
- Event delegation does not work in IE, but there is a polyfill: https://vanillajstoolkit.com/polyfills/addeventlistener/

### Thank You
Thank your for looking at my small ES6 module.

Best,
zanayr