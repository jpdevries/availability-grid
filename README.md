AvailabilityGrid
========

An HTML Component for accepting weekly availability.

## HTML&ndash;first
AvailabilityGrid is progressively enhanced from a semantic HTML `<form>` made up of a `<table>` of&nbsp;`<input type="checkbox>"`.

### Demo
[Try the demo](http://jpdevries.github.io/availability-grid/).

![](http://j4p.us/1s191T244112/Screen%20Shot%202016-06-15%20at%201.19.43%20PM.png)

_Note: The interfaces for Military Time, Week Starts On, and Inverse Selection options are provided by and part of the demo but are not directly part of the VanillaJS Driver. The VanillaJS Driver is meant to be very light and does little other than assign keyboard and input listeners and handle selection and toggle of inputs._

## Usage
`AvailabilityGrid` is packaged by Webpack as a JavaScript module and can be included using&nbsp;`require()`.

```js
var availGrid = require('./node_modules/availability-grid/availability-grid');
grid = new availGrid.AvailabilityGrid();
```

_Note:If you aren't using a module loading system you can still using `AvailabilityGrid` by first [including&nbsp;require1k](http://stuk.github.io/require1k/)._

When a new `AvailabilityGrid` is created the instance automatically initializes itself. `AvailabilityGrid` instances can be destroyed via `.destroy()` and re-awoken from the dead with&nbsp;`.init()`.

```js
grid.destroy(); // remove listeners
// mutate the DOM or whatever...
grid.init(); // re-add listeners
```

## Screencasts

 - [AvailabilityGrid VoiceOver Preview](https://vimeo.com/170844798)
 - [AvailabilityGrid Demo + Shift Selection](https://vimeo.com/170857351)

## HTML Architecture
```html
<table class="availability-grid">
  <thead>
    <tr>
      <th data-dow="sun" data-index="0">Sun<span class="a11y-hidden">day</span></th>
      <th data-dow="mon" data-index="1">Mon<span class="a11y-hidden">day</span></th>
      <th data-dow="tue" data-index="2">Tues<span class="a11y-hidden">day</span></th>
      <th data-dow="wed" data-index="3">Wed<span class="a11y-hidden">nesday</span></th>
      <th data-dow="thur" data-index="4">Thur<span class="a11y-hidden">sday</span></th>
      <th data-dow="fri" data-index="5">Fri<span class="a11y-hidden">day</span></th>
      <th data-dow="sat" data-index="6">Sat<span class="a11y-hidden">urday</span></th>
    </tr>
  </thead>
  <tbody>
    <tr data-time="0">
      <td data-dow="6" data-index="0">
        <label for="avail-sun-12am" id="avail-sun-12am-label"><span class="a11y-hidden" data-checked-time="You are available Sundays at &lt;time&gt;12am&lt;/time&gt;." data-unchecked-time="Are you available Sundays at &lt;time&gt;12am&lt;/time&gt;?">Are you available Sundays at <time>12am</time>?</span>
        </label>
          <input type="checkbox" name="avail-sun-12am" id="avail-sun-12am" aria-describedby="avail-sun-12am-label howto">
          <div></div>
       </td>
       <td data-dow="0" data-index="1">
         <label for="avail-mon-12am" id="avail-mon-12am-label"><span class="a11y-hidden" data-checked-time="You are available Mondays at &lt;time&gt;12am&lt;/time&gt;." data-unchecked-time="Are you available Mondays at &lt;time&gt;12am&lt;/time&gt;?">Are you available Mondays at <time>12 am</time>?</span>
         </label>
          <input type="checkbox" name="avail-mon-12am" id="avail-mon-12am" aria-describedby="avail-mon-12am-label howto">
          <div></div>
       </td>
       <!-- continue days of week as <td>... -->
     </tr>
    <!-- continue time increments (hours) of day as <tr>... -->
  </tbody>
</table>
```

### Checkbox
```html
<input type="checkbox" name="avail-sun-12am" id="avail-sun-12am" aria-describedby="avail-sun-12am-label howto">  

```

Each input has the following&nbsp;attributes:

 - type
 - name
 - id
 -aria-describedby

All inputs are `type="checkbox"`. `name` and `id` are used for `<form>` and `<label>` associations. `name` and `id` values should be unique to the `<input>` but may be the same value ex:`name="avail-sun-12am" id="avail-sun-12am"`.

### `<label>`
```html
<label for="avail-mon-12am" id="avail-mon-12am-label">
  <span class="a11y-hidden"
    data-checked-time="You are available Mondays at &lt;time&gt;12am&lt;/time&gt;."
    data-unchecked-time="Are you available Mondays at &lt;time&gt;12am&lt;/time&gt;?">
  Are you available Mondays at <time>12 am</time>?
  </span>
</label>
```
Each Checkbox has a corresponding label element which describes it. Each `<label>` element has the following&nbsp;attributes:

- for
- id

`for` is used to associated the label with a Checkbox input. `id` is used to associate the `<label>` with the `aria-describedby` or `aria-labeledby` attributes of other elements.

The `innerHTML` of each label is wrapped in `span.a11y-hidden`. This technique is used to hide text visually but not semantically. The hidden text should ask the user if they are available at the given time on the given day ex:`<span class="a11y-hidden">Are you available Sundays at <time>12am</time>?</span>`. Each `span.a11y-hidden` should also have the following&nbsp;attributes:

 - data-checked-time
 - data-unchecked-time

 `data-checked-time` is the text to read when the input is&nbsp;checked. `data-unchecked-time` is the text to read when the input is not&nbsp;checked.

### `<td>`
```html
<td data-dow="0" data-index="1">
  <label for="avail-mon-12am" id="avail-mon-12am-label"><span class="a11y-hidden" data-checked-time="You are available Mondays at &lt;time&gt;12am&lt;/time&gt;." data-unchecked-time="Are you available Mondays at &lt;time&gt;12am&lt;/time&gt;?">Are you available Mondays at <time>12 am</time>?</span>
  </label>
   <input type="checkbox" name="avail-mon-12am" id="avail-mon-12am" aria-describedby="avail-mon-12am-label howto">
   <div></div>
</td>
```
Each group of `<label>` and `<input>` are wrapped in a `<td>`. Each `<td>` has the following&nbsp;attributes:

- data-dow
- data-index

`data-dow` is the "day of the week" as represented 0-6 where 0 is Monday. `data-index` is the numeric index of the `<td>` within its parent `<tr>`. If displaying Sunday as the first day of the week then Sunday with be&nbsp;`data-index="0"`.

_Note: `data-dow` may be depreciated._

### `<tr>`
Each `<td>` is wrapped in a `<tr>` that represents an increment of time, such as hours, for the given days of the week. Each `<tr>` has the following&nbsp;attribute:

 - `data-time`

 `data-time` is the index of the `<tr>` within the `<tbody>`. For example, with 1 hour increments the row for 1pm would be&nbsp;`data-index="13"`.

## Keyboard Accessibility
In addition to the inherent keyboard accessibility that comes with the ability to tab through a table of `<input type="checkbox">` elements and use space bar to check or un&ndash;check them, AvailabilityGrid adds the following keyboard&nbsp;considerations:
- Arrow Keys

### Arrow Keys
While focused on a cell, the up, right, down, and left arrow keys can be used to shift focus to a neighboring&nbsp;cell.

## Usability Considerations
The main usability consideration currently made&nbsp;is:

- range selection
- VoiceOver usage

### Range Selection
The Shift key can be used to select ranges of inputs. When focused on a cell, hold Shift while clicking another to toggle a range of time&nbsp;slots.

![](http://j4p.us/0Y3P2o1k3A1Q/Screen%20Shot%202016-06-15%20at%201.18.07%20PM.png)

### VoiceOver Usage
Accessibly hidden text is used to make screen readers read aloud a question like "Are you available Mondays at 9am?" or a statement like "You are available Mondays at 9am."&nbsp;accordingly.

See the [VoiceOver Screencast](https://vimeo.com/170844798).

## Styles
The default styles for `AvailabilityGrid` consist of [some simple&nbsp;Sass](https://github.com/jpdevries/availability-grid/blob/master/_build/scss/main.scss).

```html
<link rel="stylesheet" href="./assets/css/availability-grid.css">
```

You can include the default styles and/or override them with your&nbsp;own.

## Techniques
### Accessibly Hiding text
Elements are visually, but not not semantically, hidden using an `.a11y-hidden` class. This technique comes from the `spec/tacular` Sass&nbsp;include:
```bash
bower install spectacular --save-dev
```

```scss
@import spec/tacular;

.a11y-hidden {
 @extend %accessibly-hidden;
}
```

![](http://j4p.us/0E2f2Q0p323N/Screen%20Shot%202016-06-15%20at%201.18.58%20PM.png)

## Contribution Guidelines
Trying to follow the guidelines at [frend/frend.co](https://github.com/frend/frend.co#javascript). However, support for multiple "JS Drivers" is on the roadmap. The same style guide for the VanillaJS driver would not necessarily apply to a React or Angular driver. To suggest a feature or report a bug feel free to [open an&nbsp;issue](https://github.com/jpdevries/availability-grid/issues/new).

## Accessibility Proclaimer
This component strives for WCAG 2.0 Guidelines Level AA. Please [open an issue](https://github.com/jpdevries/availability-grid/issues/new) for any accessibility issue, feedback, or&nbsp;concern.
