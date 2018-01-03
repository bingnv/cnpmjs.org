var getSettings = function() {
  var settings = {};
  if (process.env.NODE_ENV == 'dev') {
    console.log('使用[本地]配置环境');
    settings = require('./devConfig');
  } else if (process.env.NODE_ENV == 'daily') {
    console.log('使用[日常]配置环境');
    settings = require('./dailyConfig');
  } else if (process.env.NODE_ENV == 'production') {
    settings = require('./productionConfig');
    console.log('使用[线上]配置环境');
  } else {
    settings = require('./devConfig');
    console.log('使用默认[本地开发]配置环境');
  }
  return settings;
}

module.exports = getSettings();