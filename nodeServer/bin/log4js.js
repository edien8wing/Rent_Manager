var log4js=require('log4js');
var log4js_config = require("../log4js.json");
const logg = log4js.getLogger('cheese');
log4js.configure(log4js_config);

module.exports=logg;
/*
logg.trace('Entering cheese testing');
logg.debug('Got cheese.');
logg.info('Cheese is Gouda.');
logg.warn('Cheese is quite smelly.');
logg.error('Cheese is too ripe!');
logg.fatal('Cheese was breeding ground for listeria.');
*/
