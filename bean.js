"use strict";

class Bean {
  constructor(connectedBean, broker, delayInterval, logger) {
    this.id = connectedBean._peripheral.id;
    this.address = connectedBean._peripheral.address;
    this.localName = connectedBean._peripheral.advertisement.localName;
    this.txPowerLevel = connectedBean._peripheral.advertisement.txPowerLevel;
    connectedBean.on("accell", (x, y, z, valid) => {
      this.onAccelleration(x, y, z, valid, broker, connectedBean, logger)
    });
    connectedBean.connectAndSetup(() => {
      this.intervalId = setInterval(()=> {
       connectedBean.requestAccell(() => {} /* request accell sent */);
        //connectedBean.requestTemp(() => {} /* request temp sent */);
      }, delayInterval);
    });
  }
  
  
  onAccelleration(x, y, z, valid, broker, connectedBean, logger) {
          connectedBean.setColor(
          new Buffer([z*100, y*100, x*100]),
          () => {} // led color sent
        );
    logger.info('x:'+x+'y:'+y+'z:+'+z);
    broker.notify("accelleration", {
//      id: this.id,
//      address: this.address,
//      localName: this.localName,
//      txPowerLevel: this.txPowerLevel,
//      status: valid ? "valid" : "invalid",
      accelleration: {
        x: x, y: y, z: z
      }
    });
  }
  onTemperature(temp, valid, broker) {
    broker.notify("temperature", {
//      id: this.id,
//      address: this.address,
//      localName: this.localName,
//      txPowerLevel: this.txPowerLevel,
//      status: valid ? "valid" : "invalid",
//      temperature: temp
    });
  }

  onDisconnect(connectedBean, broker) {
    clearInterval(this.intervalId);
    // Turning off led...
    connectedBean.setColor(new Buffer([0x0,0x0,0x0]), () => {});
    //no way to know if succesful but often behind other commands going out, so just wait 2 seconds
    // Disconnecting from Device...
    setTimeout(connectedBean.disconnect.bind(connectedBean, () => {}), 2000);
    broker.notify("disconnect", {
      id: this.id,
      address: this.address,
      localName: this.localName,
      txPowerLevel: this.txPowerLevel
    });
  }
}

module.exports = Bean ;