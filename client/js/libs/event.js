class Event {
  constructor(sender) {
    this.sender = sender;
    this.listeners = [];
  }

  attach(callback) {
    this.listeners.push(callback);
  }

  notify(args) {
    this.listeners.forEach((listen) => listen(this.sender, args));
  }
}

export default Event;
