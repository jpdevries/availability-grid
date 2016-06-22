## HTML&ndash;first
`AvailabilityGrid` is progressively enhanced from a semantic HTML `<form>` made up of a `<table>` of&nbsp;`<input type="checkbox>"`.

`AvailabilityGrid` will listen to your grid of inputs and provide functionality to select them in ranges, inverse the selection, navigating the grid with arrow keys, as well as asynchronous considerations for VoiceOver screen reader support.

### Demo
[Try the demo](http://jpdevries.github.io/availability-grid/).

![](http://j4p.us/093I2y0R322A/hero.gif)

_Note: The interfaces for Military Time, Week Starts On, and Inverse Selection options are provided by and part of the demo but are not directly part of the VanillaJS Driver. The VanillaJS Driver is meant to be very light and does little other than assign keyboard and input listeners and handle selection and toggle of inputs._

## Usage
`AvailabilityGrid` is packaged by Webpack as a UMD JavaScript module and can be universally used as such.

### Universal Module Definition
#### `require()`
```js
var AvailabilityGrid = require('availability-grid').AvailabilityGrid;

document.addEventListener('DOMContentLoaded', function() {
    var grid = new AvailabilityGrid();
});

```

_Note:If you aren't using a module loading system you can still using `AvailabilityGrid` via a `AvailabilityGrid` global variable exposed by the UMD loader._

#### `global`
```html
<script defer src="./assets/js/availability-grid.js"></script>
<script defer>
  document.addEventListener('DOMContentLoaded',function(){
    var grid = new AvailabilityGrid();
  });
</script>
```

### Methods
When a new `AvailabilityGrid` is created the instance automatically initializes itself. `AvailabilityGrid` instances can be destroyed via `.destroy()` and re-awoken from the dead with&nbsp;`.init()`.

```js
grid.destroy(); // remove listeners
// mutate the DOM or whatever...
grid.init(); // re-add listeners
```

When calling `.init()` you may pass in a fresh set of options.

```js
grid.init({
  element:document.getElementById('new-grid')
});
```

Calling `.destroy()` will remove all listeners and references to `element` but options like `inputSelector` will persist and do not need to be reset when reawakening an instance by later calling&nbsp;`.init()`.

_Note: As AvailabilityGrid instances `.destroy()` themselves they look for an `id` on `element`. If found, `element` will be set to the string `id` so as to remove references to that element while still being able to query the DOM for it if `.init()` is later called without passing in an&nbsp;element._

The current selection can be inverted using the `.inverse()`&nbsp;method.

```js
var grid = new AvailabilityGrid();
grid.inverse(); // inverse the selection
```

### Options
| key | default | description |
| ---- | ---- | ---- |
| `element` | `'availability-grid'` | The HTML Element or `id` of the HTML element |
| `inputSelector` | `'input[type="checkbox"]'` | Selector used when querying DOM for checkbox inputs |
| `whenTextSelector` | `'span.a11y-hidden'` | Selector used when querying DOM to change hidden text for screen readers |

## Weigh&ndash;In
| Type           | Un&ndash;minified (kB) | Minified (kB) | GZIP (kB)
| ------------- | ------------- | --- | --- |
| CSS  | 7.14  | 6.01  | 0.846  |
| JavaScript  | 12.32  | 5.77  | 1.96  |

## Screencasts

 - [AvailabilityGrid VoiceOver Preview](https://vimeo.com/170844798)
 - [AvailabilityGrid Demo + Shift Selection](https://vimeo.com/170857351)

## HTML Architecture
See [the Wiki](https://github.com/jpdevries/availability-grid/wiki/HTML-Architecture).

## Keyboard Accessibility
In addition to the inherent keyboard accessibility that comes with the ability to tab through a table of `<input type="checkbox">` elements and use space bar to check or un&ndash;check them, AvailabilityGrid adds the following keyboard&nbsp;considerations:
- Arrow Keys

### Arrow Keys
While focused on a cell, the up, right, down, and left arrow keys can be used to shift focus to a neighboring&nbsp;cell.

![](http://j4p.us/3N3M38273H1F/arrow-key.gif)

## Usability Considerations
The main usability consideration currently made&nbsp;is:

- range selection
- inverse selection
- VoiceOver usage

### Range Selection
The Shift key can be used to select ranges of inputs. When focused on a cell, hold Shift while clicking another to toggle a range of time&nbsp;slots.

![](http://j4p.us/3h0f071i2F04/shift-selection.gif)

### Inverse Selection
`AvailabilityGrid` exposes a `.inverse()` method that inverts the checked property of each option. This user consideration can be used as a shortcut to make particular selections.

![](http://j4p.us/0i3l3S3F3I1B/inverse-selection.gif)

### VoiceOver Usage
Accessibly hidden text is used to make screen readers read aloud a question like "Are you available Mondays at 9am?" or a statement like "You are available Mondays at 9am."&nbsp;accordingly. It will also read aloud keyboard shorcuts and&nbsp;tips.

![](http://j4p.us/0N2J0K0S1202/Screen%20Shot%202016-06-15%20at%204.14.30%20PM.png)

See the [VoiceOver Screencast](https://vimeo.com/170844798).

## Styles
The default styles for `AvailabilityGrid` consist of [some simple&nbsp;Sass](https://github.com/jpdevries/availability-grid/blob/master/_build/scss/main.scss).

```html
<link rel="stylesheet" href="./assets/css/availability-grid.css">
```

You can include the default styles and/or override them with your&nbsp;own.

## Techniques
See [the Wiki](https://github.com/jpdevries/availability-grid/wiki/Techniques).

## Contribution Guidelines
Trying to follow the guidelines at [frend/frend.co](https://github.com/frend/frend.co#javascript). However, support for multiple "JS Drivers" is on the roadmap. The same style guide for the VanillaJS driver would not necessarily apply to a React or Angular driver. To suggest a feature or report a bug feel free to [open an&nbsp;issue](https://github.com/jpdevries/availability-grid/issues/new).

## Accessibility Proclaimer
This component strives for WCAG 2.0 Guidelines Level AA. Please [open an issue](https://github.com/jpdevries/availability-grid/issues/new) for any accessibility issue, feedback, or&nbsp;concern.
