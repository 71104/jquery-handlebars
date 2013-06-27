module.exports = function (grunt) {
	grunt.initConfig({
		pkg: grunt.file.readJSON('package.json'),

		clean: {
			dist: [
				'bin'
			]
		},

		jshint: {
			options: {
				camelcase: true,
				curly: true,
				forin: true,
				immed: true,
				indent: 4,
				latedef: true,
				newcap: true,
				noarg: true,
				quotmark: 'single',
				undef: true,
				unused: true,
				strict: true,
				trailing: true,
				boss: true,
				debug: true,
				expr: true,
				smarttabs: true,
				browser: true,
				jquery: true,
				globals: {
					Handlebars: false
				}
			},
			files: [
				'src/plugin.js'
			]
		},

		uglify: {
			options: {
				banner: '/*!\n' +
					' * Handlebars.js for jQuery\n' +
					' * A templating engine for jQuery based on Handlebars.js\n' +
					' * by Alberto La Rocca <a71104@gmail.com> (https://github.com/71104)\n' +
					' * Released under the MIT license, copyright 2013 Alberto La Rocca\n' +
					' * This script includes Handlebars.js, which is not mine. See <http://handlebarsjs.com/>\n' +
					' */\n'
			},
			dist: {
				src: [
					'src/handlebars-1.0.0.js',
					'src/plugin.js'
				],
				dest: 'bin/jquery-handlebars-<%= pkg.version %>.min.js'
			}
		},

		concat: {
			dist: {
				src: [
					'src/handlebars-1.0.0.js',
					'src/plugin.js'
				],
				dest: 'bin/jquery-handlebars-<%= pkg.version %>.js'
			}
		}
	});

	grunt.loadNpmTasks('grunt-contrib-clean');
	grunt.loadNpmTasks('grunt-contrib-jshint');
	grunt.loadNpmTasks('grunt-contrib-concat');
	grunt.loadNpmTasks('grunt-contrib-uglify');

	grunt.registerTask('default', ['clean', 'jshint', 'uglify']);
	grunt.registerTask('debug', ['clean', 'jshint', 'concat']);
};
