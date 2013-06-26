module.exports = function (grunt) {
	grunt.initConfig({
		pkg: grunt.file.readJSON('package.json'),
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
			dist: {
				src: [
					'src/handlebars-1.0.0.js',
					'src/plugin.js'
				],
				dest: 'bin/jquery-handlebars-<%= pkg.version %>.min.js'
			}
		}
	});

	grunt.loadNpmTasks('grunt-contrib-jshint');
	grunt.loadNpmTasks('grunt-contrib-uglify');

	grunt.registerTask('default', ['jshint', 'uglify']);
};
