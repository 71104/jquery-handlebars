jquery-handlebars
=================

A [jQuery](http://jquery.com/) plugin to render [Handlebars.js](http://handlebarsjs.com/) templates into elements.

Template scripts are retrieved through AJAX, precompiled and cached.

Download
--------

[Version 0.1.4](https://raw.github.com/71104/jquery-handlebars/0.1.4/bin/jquery-handlebars-0.1.4.min.js) available.

Getting Started
---------------

Each jQuery object has a `render` method that:
- retrieves the specified template (either from cache or by fetching through AJAX and compiling with Handlebars),
- renders it through Handlebars using the specified context object,
- passes the output string to the jQuery object's `html` method.

Example:

```handlebars
<p>{{ field1 }}, {{ field2 }}</p>
```

```javascript
// will fetch <content.handlebars> and render to the DOM element whose id is "content"
$('#content').render('content', {
	field1: 'Hello',
	field2: 'world!'
});
```

The first argument to the `render` method is a template name. The plugin builds the template path to fetch from this name by prepending a base path and appending a file name extension. The default base path is the empty string, while the default extension is `.handlebars`. To configure them differently use the `jQuery.handlebars` method:

```javascript
$.handlebars({
	templatePath: 'path/to/templates',
	templateExtension: 'hbs'
});

// now this will fetch <path/to/templates/content.hbs>
$('#some-element').render('content', {
	// ...
});
```

When using this plugin you can use the `Handlebars` namespace normally if you want; this allows you to register helpers and partials.

For example:

```handlebars
{{! I'm using a custom "salute" helper }}
<p>{{salute what }}</p>

{{! I'm using a custom "csv" block helper }}
{{#csv array }}{{ this }}{{/csv}}
```

```javascript
Handlebars.registerHelper('salute', function (what) {
	return 'Hello, ' + what + '!';
});

Handlebars.registerHelper('csv', function (array, options) {
	return array.map(function (element) {
		return options.fn(element);
	}).join(', ');
});

$('#content').render('content', {
	what: 'world',
	array: [1, 2, 3]
});
```

The plugin also supports fetching and registering partials. You only need to configure the base path and filename extension for the partial files in the `jQuery.handlebars` method:

```javascript
$.handlebars({
	partialPath: 'partials',
	partialExtension: 'partial'
});
```

Then you can register a partial using the `partial` action of the `jQuery.handlebars` method:

```javascript
/* based on configured settings, this will fetch the <partials/element.partial>
	file and register it as a partial */
$.handlebars('partial', 'element');
```

At this point, assuming you have the following `partials/element.partial` file:

```html
<li>{{ this }}</li>
```

you can access it in your templates normally:

```handlebars
<ul>
{{#each array }}
	{{> element }}
{{/each}}
</ul>
```

```javascript
$('#content').render('content', {
	array: ['first', 'second', 'last']
});
```

As a shorthand you can register all the partials at inizialization time using the `partials` configuration setting:

```javascript
$.handlebars({
	templatePath: 'templates',
	partialPath: 'partials',
	partials: ['header', 'footer', 'user', 'another-partial', 'another-one']
});
```

License
-------

MIT. Copyright 2013 Alberto La Rocca.
