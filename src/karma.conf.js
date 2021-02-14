// Karma configuration file, see link for more information
// https://karma-runner.github.io/1.0/config/configuration-file.html

module.exports = function (config) {
  config.set({
    basePath: '',
    frameworks: ['jasmine', '@angular-devkit/build-angular'],
    plugins: [
      require('karma-jasmine'),
      require('karma-chrome-launcher'),
      require('karma-jasmine-html-reporter'),
      require('karma-coverage'),
      require('karma-spec-reporter'),
      require('@angular-devkit/build-angular/plugins/karma'),
      require('karma-coveralls')
    ],
    client: {
      clearContext: false // leave Jasmine Spec Runner output visible in browser
    },
    coverageReporter: {
      type: 'lcov', // lcov or lcovonly are required for generating lcov.info files
      dir: 'coverage/'
    },
    // reporters: ['progress', 'kjhtml', 'coverage-istanbul', 'coveralls', 'spec'],
    reporters: ['progress', 'kjhtml', 'coverage', 'coveralls'],
    port: 9876,
    colors: true,
    logLevel: config.LOG_INFO,
    autoWatch: true,
    browsers: ['Chrome'],
    singleRun: false,
    customLaunchers: {
      ChromeHeadlessNoSandbox: {
        base: 'ChromeHeadless',
        flags: ['--no-sandbox']
      }
    },
    specReporter: {
      // maxLogLines: 5,         // limit number of lines logged per test
      // suppressErrorSummary: false,  // do not print error summary
      // suppressPassed: true,  // do not print information about passed tests
      // suppressFailed: false,  // do not print information about failed tests
      // suppressSkipped: true,  // do not print information about skipped tests
      // showSpecTiming: false // print the time elapsed for each spec
    }
  });
};
