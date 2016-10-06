"use strict";

class Broker {
  constructor() {
    this.subscriptions = [];
  }

  addSubscription(topic, object) {
    this.subscriptions.push({topic: topic, subscriber: object});
  }

  removeSubscription(topic, object) {/*TODO*/}

  notify(topic, message) {
    if(this.log) console.info(topic, message);
    this.subscriptions
      .filter(item => item.topic == topic)
      .forEach(item => {
        let getOnMessageMethod = item.subscriber.onMessage !== undefined
          ? () => item.subscriber.onMessage(topic, message)
          : () => {throw Error(`${item.subscriber.tagName.toLowerCase()}: onMessage method is undefined!`);};
        getOnMessageMethod();
      });
  }
}
module.exports = Broker ;