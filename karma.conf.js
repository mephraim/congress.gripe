var testFiles = process.env.npm_config_single_file ?
                process.env.npm_config_single_file : 'tests/**.js';

var options = {
  basePath: '.',
  browsers: ['PhantomJS'],
  frameworks: ['jasmine'],
  preprocessors: { '**/*.js': ['webpack'] },
  webpackMiddleware: { stats: 'errors-only' }
};

options.files = [{
  pattern: testFiles,
  watch: false
}];

options.preprocessors = {
  '*/**.js': ['webpack']
};

module.exports = function(config) {
  config.set(options);
};
