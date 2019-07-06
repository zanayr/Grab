# Grab.js
Grab is a small custom javascript library built to manipulate the DOM. It provides a
very basic approach to effect the DOM


```
<div id="grab-me" class="fizz, buzz"></div>
...
<script>
    var fizz = grab('#grab-me');
</script>
```
To grab a DOM element, simply call the global grab function, which returns an object
that has many fun and helpful methods and properties.


## Properties
**Background Color**  
The `fizz.backgroundColor` property effects the DOM element's background color styling.
it returns an object of rgba color channels and can be set using any of valid chroma.js
(see below) color models.
```
fizz.backgroundColor = 'hsva(45, 100%, 50%, 1)';
console.log(fizz.backgroundColor);
►{alpha: 1, blue: 0, green: 96, red: 128}
```

**Class List**  
The `fizz.classList` property is simply an abstraction of the grab object's internal
DOM element's classList property.

**Color**  
The `fizz.color` property effects the DOM element's color (font color) styling. It
returns an object of rgba color channels and can be set using any of valid chroma.js
(see below) color models.
```
fizz.color = 'lightcoral';
console.log(fizz.color);
►{alpha: 1, blue: 128, green: 128, red: 240}
```

**Children**  
The `fizz.children` property returns a grab collection of grab objects, each a child of
the DOM element.
```
var children = fizz.children;
console.log(children);
►{0: {…}, 1: {…}, 2: {…}, values: {…}, add: ƒ, remove: ƒ, empty: ƒ, animate: ƒ, …}
```

**Display**  
The `fizz.display` property returns and sets the DOM element's display styling.
The returned value is a string.
```
fizz.display = 'flex';
console.log(fizz.display);
flex
```

**Height**  
The `fizz.height` property returns (in pixels) or sets the DOM element's height styling.
See the above Models Chart for supported height models. The returned value is a number.
```
fizz.height = '50vh';
console.log(fizz.height);
250
```

**Html**  
The `fizz.html` property returns and sets the internal HTML of the DOM element. The
returned markup is a string.
```
fizz.html = '<h1>Hello World!</h1>';
console.log(fizz.html);
<h1>Hello World!</h1>
```

**Id**  
The `fizz.id` property returns and sets the id attribute of the DOM element. The
returned id is a string.
```
fizz.id = 'grab-me';
console.log(fizz.id);
grab-me
```

**Left**  
The `fizz.left` property returns (in pixels) and sets the DOM element's left styling.
See the above Models Chart for supported left models. The returned value is a number.
```
fizz.left = '33.34%';
console.log(fizz.left);
166.7
```

**Name**  
The `fizz.name` property returns a string by joining tag, id and all classes of the
DOM element.
```
console.log(fizz.name);
div#grab-me.fizz.buzz
```

**Opacity**  
The `fizz.opacity` property returns and sets the DOM element's opacity (tansparency)
styling. See the above Models Chart for supported opacity models. The returned value
is a number.
```
fizz.opacity = '50%';
console.log(fizz.opacity);
0.5
```

**Top**  
The `fizz.top` property returns (in pixels) and sets the DOM element's top styling.
See the above Models Chart for supported top models. The returned value is a number.
```
fizz.top = '100px';
console.log(fizz.top);
100
```

**Visibility**  
The `fizz.visibility` property returns and sets the DOM element's visibility styling.
See the above Models Chart for supported visibility models. The returned value is a
string.
```
fizz.visibility = 'hidden';
console.log(fizz.visibility);
hidden
```

**Width**  
The `fizz.width` property returns (in pixels) or sets the DOM element's width styling.
See the above Models Chart for supported width models. The returned value is a number.
```
fizz.width = 200;
console.log(fizz.width);
200
```

**Z Index**  
The `fizz.zIndex` property returns or sets the DOM element's z index. The returned
value is a number.
```
fizz.zIndex = 99;
console.log(fizz.zIndex);
99
```


## Methods