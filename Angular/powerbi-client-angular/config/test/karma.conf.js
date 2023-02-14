// Copyright (c) Microsoft Corporation.
// Licensed under the MIT License.

// Karma configuration file, see link for more information
// https://karma-runner.github.io/1.0/config/configuration-file.html

module.exports = function (config) {
  config.set({

    // base path that will be used to resolve all patterns (eg. files, exclude)
    basePath: '',

    // List of test frameworks need to be used
    // Available frameworks: https://www.npmjs.com/search?q=keywords:karma-adapter
    frameworks: ['jasmine', '@angular-devkit/build-angular'],

    // List of plugins to load
    // Karma loads all sibling NPM modules which have a name starting with karma-*
    plugins: [
      require('karma-jasmine'),
      require('karma-chrome-launcher'),
      require('karma-jasmine-html-reporter'),
      require('karma-coverage'),
      require('@angular-devkit/build-angular/plugins/karma')
    ],

    // Specify Client to run the tests
    client: {

      // Behavior driven testing framework
      jasmine: {
        // you can add configuration options for Jasmine here
        // the possible options are listed at https://jasmine.github.io/api/edge/Configuration.html
        // for example, you can disable the random execution with `random: false`
        // or set a specific seed with `seed: 4321`
      },

      // Leave Jasmine Spec Runner output visible in browser
      clearContext: false 
    },
    jasmineHtmlReporter: {

      // Removes the duplicated traces
      suppressAll: true 
    },

    // Generate code coverage
    coverageReporter: {
      dir: require('path').join(__dirname, '../../coverage/powerbi-client-angular'),
      subdir: '.',
      reporters: [
        { type: 'html' },
        { type: 'text-summary' }
      ]
    },

    // test results reporter to use
		// possible values: 'dots', 'progress'
		// available reporters: https://npmjs.org/browse/keyword/karma-reporter
    reporters: ['progress', 'kjhtml'],

    // Port where the web server will be listening
    port: 9876,

    // Enable / disable colors in the output (reporters and logs)
    colors: true,

    // Level of logging
		// Possible values: config.LOG_DISABLE || config.LOG_ERROR || config.LOG_WARN || config.LOG_INFO || config.LOG_DEBUG
    logLevel: config.LOG_INFO,

    // Enable / disable watching file and executing tests whenever any file changes
    autoWatch: true,

    // Start these browsers
		// Available browser launchers: https://npmjs.org/browse/keyword/karma-launcher
    browsers: ['ChromeHeadless'],

    // Continuous Integration mode
		// If true, Karma captures browsers, runs the tests and exits
    singleRun: true,

    // Restart testing on file changes, leaving running test canceled
    restartOnFileChange: true
  });
};
