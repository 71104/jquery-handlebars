(function ($) {
	'use strict';

	var cache = {};

	var defaultSettings = {
		templatePath: '',
		templateExtension: 'handlebars',
		partialPath: '',
		partialExtension: 'partial',
		sync: false,
	};

	var settings = $.extend({}, defaultSettings);

	function resolvePath(basePath, name, extension) {
		basePath = basePath.replace(/[(^\s)(\s$)]/g, '');
		if (basePath.length) {
			return basePath + '/' + name + '.' + extension;
		} else {
			return name + '.' + extension;
		}
	}

	function resolveTemplatePath(name) {
		return resolvePath(settings.templatePath, name, settings.templateExtension);
	}

	function resolvePartialPath(name) {
		return resolvePath(settings.partialPath, name, settings.partialExtension);
	}

	function registerPartial(path, name) {
		$.get(resolvePartialPath(path), function (partial) {
			Handlebars.registerPartial(name, partial);
		}, 'text');
	}

	$.handlebars = function () {
		if (typeof arguments[0] !== 'string') {
			var options = arguments[0];
			settings = $.extend(defaultSettings, options);
			settings.templatePath = settings.templatePath.replace(/\\\/$/, '');
			settings.partialPath = settings.partialPath.replace(/\\\/$/, '');
			if (options.hasOwnProperty('partials')) {
				var names;
				if (typeof options.partials !== 'string') {
					names = options.partials;
				} else {
					names = options.partials.split(/\s+/g);
				}
				for (var i = 0; i < names.length; i++) {
					registerPartial(names[i], names[i]);
				}
			}
		} else {
			switch (arguments[0]) {
			case 'partial':
				if (arguments.length < 3) {
					registerPartial(arguments[1], arguments[1]);
				} else {
					registerPartial(arguments[1], arguments[2]);
				}
				break;
			case 'helper':
				Handlebars.registerHelper(arguments[1], arguments[2]);
				break;
			case 'add':
				var tplname = arguments[1];
				var tpldata = arguments[2];
				console.log('h.add', tplname);
				cache[ tplname ] = Handlebars.compile(tpldata);
				break;
			case 'has':
				var tplname = arguments[1];
				var res = !! cache.hasOwnProperty( tplname );
				console.log('h.has', tplname, res);
				return res;
				break;
			case 'cache':
				return cache;
			default:
				throw 'invalid action specified to jQuery.handlebars: ' + arguments[0];
			}
		}
	};

	$.fn.render = function (templateName, data) {
		if (cache.hasOwnProperty( templateName )) {
			this.html(cache[templateName](data)).trigger('render.handlebars', [templateName, data]);
		} else if (settings.sync) {
			console.warn({
				msg: 'template not in cache',
				tpl: templateName,
				cache: cache,
				settings: settings,
			});
			throw "jquery.handlerbars.sync: Template not in cache and sync = true: " + templateName;
		} else {
			var url = resolveTemplatePath(templateName);
			var $this = this;
			$.get(url, function (template) {
				cache[templateName] = Handlebars.compile(template);
				$this.html(cache[templateName](data)).trigger('render.handlebars', [templateName, data]);
			}, 'text');
		}

		return this;
	};
}(jQuery));
