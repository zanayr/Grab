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
  
  
## Models
**Colors**
Grab uses my chorma.js library for color conversion. All color models are converted
to an object of rgba channels.
```
//  Standard browser color string
fizz.color = 'pink';

//  String of rgb and rgba values, delimited by commas
fizz.color = '255, 192, 203';
fizz.color = '255, 192, 203, 1';

//  Array of numeric rgb and rgba values
fizz.color = [255, 192, 203];
fizz.color = [255, 192, 203, 1];

//  Rgb and rgba model string
fizz.color = 'rgb(255, 192, 203)';
fizz.color = 'rgba(255, 192, 203, 1)';

//  Hex and hexa model string, starting with the characters #, 0x or 0X;
//  uppercase or lowercase; and their shorthand versions
fizz.color = '0xffc0cb';
fizz.color = '#FFC0CBFF';   //  Note: The last 'FF' is the alpha channel
fizz.color = '#a';          //  Equivalent to '#aaaaaa'
fizz.color = '#ab';         //  Equivalent to '#ababab'
fizz.color = '#abc';        //  Equivalent to '#aabbcc'
fizz.color = '#abcd';       //  Equivalent to '#aabbccdd'

//  Hsl and hsla model string
fizz.color = 'hsl(350, 100%, 88%)';
fizz.color = 'hsla(350, 100%, 88%, 1)';

//  Hsv and hsva model string
fizz.color = 'hsv(350, 25%, 100%)';
fizz.color = 'hsva(350, 25%, 100%, 1)';

//  All values are converted into an object of rgba channels
console.log(fizz.color);
►{alpha: 1, blue: 203, green: 192, red: 255}
```
  
**Dimensions**
Grab accepts many common browser supported dimensional units.
```
//  Number (pixels)
fizz.height = 50;

//  Pixel
fizz.height = '72px';

//  Percent
fizz.height = '33.34%';     //  Note: Precent values require a parent element

//  Viewport dimension
fizz.height = '100vh';
fizz.width = '66.66vw';

//  All values are converted into the equivalent pixel value
console.log(fizz.height);
417
```
  
**Translation**
Grab accepts many common browser supported translational units.
```
//  Number (pixels)
fizz.left = 100;
//  Pixel
fizz.left = '48px';

//  Percent
fizz.left = '75%';          //  Note: Precent values require a parent element

//  Viewport dimension
fizz.top = '33.34vh';
fizz.left = '120vw';

//  All values are converted into the equivalent pixel value
console.log(fizz.left);
600
```
  
**Opacity**
Grab accepts a couple of opacity values.
```
//  Number
fizz.opacity = 0.334;       //  Note: Numbers must be between 0.0 and 1.0

//  Percent
fizz.opacity = '75%';

//  All values are converted into a number between 0.0 and 1.0
console.log(fizz.opacity);
0.75
```
  
  
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
See the above Models section for supported height models. The returned value is a number.
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
See the above Models section for supported left models. The returned value is a number.
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
styling. See the above Models section for supported opacity models. The returned value
is a number.
```
fizz.opacity = '50%';
console.log(fizz.opacity);
0.5
```
  
**Top**  
The `fizz.top` property returns (in pixels) and sets the DOM element's top styling.
See the above Models section for supported top models. The returned value is a number.
```
fizz.top = '100px';
console.log(fizz.top);
100
```
  
**Visibility**  
The `fizz.visibility` property returns and sets the DOM element's visibility styling.
See the above Models section for supported visibility models. The returned value is a
string.
```
fizz.visibility = 'hidden';
console.log(fizz.visibility);
hidden
```
  
**Width**  
The `fizz.width` property returns (in pixels) or sets the DOM element's width styling.
See the above Models section for supported width models. The returned value is a number.
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
**Animate**  
  
**Fade In**  
  
**Fade Out**  
  
**Hide**  
  
**Show**  
  
**After**  
  
**Before**  
  
**Append**  
  
**Prepend**  
  
**Exit**  
  
**Remove**  
  
**Data**  
  
**Attr**  
  
**Get Class**  
  
**Add Class**  
  
**Remove Class**  
  
**Toggle Class**  
  
**CSS**  
  
**Clear**  
  
**Hover**  
  
**On**  
  
**Off**  
  
**Child**  
  
**Find**  
  