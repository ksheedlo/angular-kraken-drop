# angular-kraken-drop
AngularJS drag-n-drop wrapper for jQuery UI. Inspired by [angular-dragon-drop](https://github.com/btford/angular-dragon-drop).

## Install

```
bower install angular-kraken-drop
```

## Runtime dependencies

In addition to AngularJS, angular-kraken-drop requires [jQuery](http://goo.gl/knfVey)
and [jQuery UI](http://jqueryui.com). Fortunately, you don't need all of jQuery UI
to use angular-kraken-drop. The required modules are

- `jquery.ui.core.js`
- `jquery.ui.widget.js`
- `jquery.ui.mouse.js`
- `jquery.ui.draggable.js`
- `jquery.ui.droppable.js`

## Usage

1. Include `dist/kraken-drop.min.js` (or `dist/kraken-drop.js`) into your app.
2. Add `ks.kraken-drop` as a module dependency for your app.

To repeat a template over a list:

```html
<div ks-kraken="item in list">
  {{item.name}}
</div>
<div ks-kraken="item in otherList">
  {{item.name}}
</div>
```

You can drag from one kraken to another, and the models will be updated
accordingly.

It also works on objects:

```html
<div ks-kraken="(key, value) in hash">
  {{key}}: {{value}}
</div>
<div ks-kraken="(key, value) in otherHash">
  {{key}}: {{value}}
</div>
```

When working with arrays, `ks-kraken` exposes an `$index` on the scope just like
`ng-repeat`.

```html
<div ks-kraken="item in list">
  {{$index}} - {{item.name}}
</div>
```

If you use `ks-kraken` inside of a `ng-repeat`, you can use
[ngInit](http://docs.angularjs.org/api/ng/directive/ngInit) to alias the `$index`
from `ng-repeat`.

## Config

angular-kraken-drop is designed to be easy to extend. At the moment, most of
the options for [jQuery UI Draggable](http://jqueryui.com/draggable/) and
[jQuery UI Droppable](http://jqueryui.com/droppable/) are not yet supported.
However, it should be easy in most cases to add them as needed. PRs are welcome! :)

### ks-kraken-duplicate

Instead of removing values from the object this kraken is bound to, the values
are duplicated. Add the `ks-kraken-duplicate` attribute to an element with the
`ks-kraken` attribute to get the behavior.

Example:

```html
<h2>These get copied</h2>
<div ks-kraken="item in list" ks-kraken-duplicate>
  {{item.name}}
</div>
<h2>These get moved</h2>
<div ks-kraken="item in otherList">
  {{item.name}}
</div>
```

### ks-kraken-accept

Makes the kraken only accept items that pass the truth test function given by
this argument. Add the `ks-kraken-accept` attribute to an element to get this
behavior.

Example:

```html
<h2>You can only put unicorns here</h2>
<div ks-kraken="animal in zoo" ks-kraken-accept="unicorns">
  {{animal.name}}
</div>
<h2>This takes any animal</h2>
<div ks-kraken="animal in wilderness">
  {{animal.name}}
</div>
```

```js
// In a controller...
$scope.unicorns = function (animal) {
  return animal.species === 'unicorn unicornus';
};
```

### ks-kraken-cancel

Provide a jQuery selector to force parts of the template to
[cancel](http://jqueryui.com/draggable/#handle). This is useful for "X" buttons
and the like.

```html
<div ks-kraken="tag in tags" ks-kraken-cancel=".cancel">
  <!-- You can drag the tag around by this section -->
  <span ng-bind="tag.tag"></span>
  <!-- This section is not draggable. Clicking on it deletes the tag -->
  <span class="cancel" ng-click="deleteTag($index)">&times;</span>
</div>
```

```js
// In a controller...
$scope.deleteTag = function (index) {
  $scope.tags.splice(index, 1);
};
```

### ks-kraken-handle

The inverse of `ks-kraken-cancel`.

```html
<div ks-kraken="tag in tags" ks-kraken-handle=".handle">
  <!-- You can drag the tag around by this section -->
  <span class="handle" ng-bind="tag.tag"></span>
  <!-- This section is not draggable. Clicking on it deletes the tag -->
  <span ng-click="deleteTag($index)">&times;</span>
</div>
```

## FAQ

1. **Why would I want to use this?**

    Great question! angular-kraken-drop provides a versatile drag and drop widget
    with an idiomatic Angular API. This project came out of a design that called for
    drag and drop tags with a delete button attached. My team found that the jQuery
    approach made our design trivial, but angular-dragon-drop had a much better way
    of interacting with our Angular models. If you're already using jQuery UI,
    angular-kraken-drop gives you the best of both worlds.

2. **This looks a lot like angular-dragon-drop...**

    Great artists steal. But since everything is MIT anymore, I'm no great artist.

3. **Can I have a picture of a kraken?**

    No.

    ![](http://fc02.deviantart.net/fs70/f/2012/317/0/4/kraken_rough_4_by_lozanox-d5kvs3g.jpg)

