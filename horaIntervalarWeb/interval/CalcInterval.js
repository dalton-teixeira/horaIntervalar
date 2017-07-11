const Interval = require('./models/Interval.js');
const WorkedDay = require('./models/WorkedDay.js');

class CalcInterval {
    constructor() {
        this.INTERVAL_MAX_LIMIT = 5 * 60000;
        this.TOTAL_MAX_LIMIT = 10 * 60000;
    }

    roundTens(workedDay) {
        var roundedWorkDay = new WorkedDay();

        var totalDiff =
            sumTotalInterval(workedDay.firstInterval)
            + sumTotalInterval(workedDay.secondInterval);

        if (totalDiff <= this.TOTAL_MAX_LIMIT) {
            roundedWorkDay.firstInterval = roundFives(workedDay.firstInterval);
            roundedWorkDay.secondInterval = roundFives(workedDay.secondInterval);
            return roundedWorkDay;
        }

        return workedDay;
    }

    sumTotalInterval(interval) {
        return (interval.expectedStart - interval.start)
            + (interval.expectedEnd - interval.end);
    }

    roundInterval(interval) {
        var newInterval = new Interval();

        newInterval.Start = this.roundFives(interval.Start, interval.ExpectedStart);
        newInterval.End = this.roundFives(interval.End, interval.ExpectedEnd);
        
        return newInterval;
    }

    roundFives(actual, expected) {
        var limit = this.INTERVAL_MAX_LIMIT;
        var diff = actual - expected;
        
        if (diff >= -Math.abs(limit) && diff <= limit)
            return new Date(actual - diff);
        return actual;
    }
}
module.exports = CalcInterval;