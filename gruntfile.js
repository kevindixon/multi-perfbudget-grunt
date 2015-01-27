/*
* Grunt definition
*/
module.exports = function(grunt) {
	// Time the execution of the task
	var timer = require("grunt-timer");
	timer.init(grunt);

	// Project configuration.
	grunt.initConfig({
		pagespeed: grunt.file.readJSON('pagespeed.json'),
		yslow: grunt.file.readJSON('yslow.json')
	});

	// Load dependency tasks 
	grunt.loadNpmTasks('grunt-yslow');
	grunt.loadNpmTasks('grunt-pagespeed');
	grunt.loadNpmTasks('grunt-perfbudget');

	grunt.registerMultiTask('webpagetest-run', 'Run webpage tests', function() {
		grunt.log.writeln("Checking URL "+this.data.default.options.url);
		grunt.config('perfbudget', this.data);
		grunt.task.run('perfbudget');
	});

	/*
	* Task to loop through tests in webpagetest.json
	*/
	grunt.registerTask('webpagetest', 'Run a set of webpage tests', function() {
		var tests = grunt.file.readJSON('webpagetest.json');
		var defaults = tests.default;
		if (typeof(defaults) == 'undefined') {
			grunt.fail.warn("No webpagetest defaults defined");
		}
		var keys = Object.keys(tests);
		for (var count = 0; count < keys.length; ++count) {
			var testName = keys[count];
			if (testName == 'default') {
				// The test is the defaults, so skip
				continue;
			}
			// Merge defaults into the test definition
			var mergedTest = {};
			deepExtend(mergedTest, defaults);
			deepExtend(mergedTest, tests[keys[count]]);
			var test = {'default': JSON.parse(JSON.stringify(mergedTest))};
			// Queue webpagetest to run in sequence when this task is done
			grunt.config('webpagetest-run.'+testName, test);
			grunt.task.run('webpagetest-run:'+testName);
		}
	});

	// Default task(s).
	grunt.registerTask('default', ['webpagetest', 'pagespeed', 'yslow']);
};

/* 
* Deep extend an object
* Modified from http://andrewdupont.net/2009/08/28/deep-extending-objects-in-javascript/
* Used for merging defaults into test object
*/
var deepExtend = function(destination, source) {
  for (var property in source) {
    if (source[property] && source[property].constructor &&
     source[property].constructor === Object) {
      destination[property] = destination[property] || {};
      arguments.callee(destination[property], source[property]);
    } else {
      destination[property] = source[property];
    }
  }
  return destination;
};
