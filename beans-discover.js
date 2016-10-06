"use strict";
let BeansMother = require('ble-bean');
let Bean = require('./bean.js');
let Broker = require('./broker.js');
let winston = require('winston');
let fs = require('fs');
let env = process.env.NODE_ENV || 'development';
let logDir = 'log';

let beans = [];

// winston 
if (!fs.existsSync(logDir)) {
  fs.mkdirSync(logDir);
}
let tsFormat = () => (new Date()).toLocaleTimeString();
let logger = new (winston.Logger)({
  transports: [
    // colorize the output to the console
    new (winston.transports.Console)({
      timestamp: tsFormat,
      colorize: true,
      level: 'info' 
    }),
    new (winston.transports.File)({
      filename: `${logDir}/results.log`,
      timestamp: tsFormat,
      level: env === 'development' ? 'debug' : 'info'
    })
  ]
});


beans.onMessage = (topic, data) => {
  console.log(topic, data);
  if(topic=="disconnect") { // remove bean from beans
    beans.slice(
      beans.indexOf(beans.find((bean) => bean.id = data.id)),
      1
    );
  }
}

let messagesBroker = new Broker();

messagesBroker.addSubscription("disconnect", beans);
messagesBroker.addSubscription("temperature", beans);
messagesBroker.addSubscription("accelleration", beans);

  
console.log("discovering beans ...")
BeansMother.discoverAll(connectedBean => {
  let bean = new Bean(connectedBean, messagesBroker, 1000, logger);
  beans.push(bean);
  console.log("---------------------------------------");
  console.log(bean);
  console.log("---------------------------------------");
});