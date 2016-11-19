var files = process.env.npm_config_single_file ? 
  process.env.npm_config_single_file : 'tests/**.js';

var options = {
  basePath: '.',
  browsers: ['PhantomJS'],
  files: files,
  frameworks: ['jasmine'],
  preprocessors: { '**/*.js': ['webpack'] },
  webpackMiddleware: { stats: 'errors-only' }
};

options.files = [{
  pattern: files, watch: false
}];

options.preprocessors = {};
options.preprocessors[files] = ['webpack'];

module.exports = function(config) {
  config.set(options);
};
