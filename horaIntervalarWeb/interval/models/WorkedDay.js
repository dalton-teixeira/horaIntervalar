const Interval = require('./Interval.js');
class WorkedDay {
    constructor() { }

    get FirstInterval() { return this.firstInterval; }
    get SecondInterval() { return this.secondInterval; }
    get Date() { return this.date; }

    set FirstInterval(interval) { this.firstInterval = interval; }
    set SecondInterval(interval) { this.secondInterval = interval; }
    set Date(date) { this.date = date; }

}
module.exports = WorkedDay;