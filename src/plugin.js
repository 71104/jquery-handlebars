(function ($) {
	var cache = {};

	var defaultSettings = {
		templatePath: '',
		templateExtension: 'handlebars',
		partialPath: '',
		partialExtension: 'partial'
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

	$.handlebars = function () {
		if (typeof arguments[0] !== 'string') {
			settings = $.extend(defaultSettings, arguments[0]);
			settings.templatePath = settings.templatePath.replace(/\\\/$/, '');
			settings.partialPath = settings.partialPath.replace(/\\\/$/, '');
		} else {
			switch (arguments[0]) {
			case 'partial':
				if (arguments.length < 3) {
					$.get(resolvePartialPath(arguments[1], function (partial) {
						Handlebars.registerPartial(arguments[1], partial);
					}), 'text');
				} else {
					$.get(resolvePartialPath(arguments[1], function (partial) {
						Handlebars.registerPartial(arguments[2], partial);
					}), 'text');
				}
				break;
			default:
				console.log('invalid action specified to jQuery.handlebars: ' + arguments[0]);
				break;
			}
		}
	};

	$.fn.render = function (templateName, data) {
		var url = resolveTemplatePath(templateName);
		if (url in cache) {
			this.html(cache[url](data)).trigger('render', templateName, data);
		} else {
			$.get(url, function (template) {
				this.html((cache[url] = Handlebars.compile(template))(data)).trigger('render', templateName, data);
			}, 'text');
		}
		return this;
	};
}(jQuery));
