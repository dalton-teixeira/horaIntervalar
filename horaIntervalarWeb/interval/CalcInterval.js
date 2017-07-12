const Interval = require('./models/Interval.js');
const WorkedDay = require('./models/WorkedDay.js');

class CalcInterval {
    constructor() {
        this.INTERVAL_MAX_LIMIT = 5 * 60000;
        this.TOTAL_MAX_LIMIT = 10 * 60000;
        this.NEGATIVE = '-';
        this.POSITIVE = '+';
    }
    
    totalNegatives(interval) {
        var result = interval.totalStart() < 0 ? interval.totalStart() : 0;
        result = interval.totalEnd() < 0 ? result + interval.totalEnd() : result;
        return result;
    }

    totalPositives(interval) {
        var result = interval.totalStart() > 0 ? interval.totalStart() : 0;
        result = interval.totalEnd() > 0 ? result + interval.totalEnd() : result;
        return result;
    }

    roundInterval(interval, operation) {
        
        interval.Start = this.roundFives(interval.Start, interval.ExpectedStart - interval.Start, interval.ExpectedStart, operation);
        interval.End = this.roundFives(interval.End, interval.End - interval.ExpectedEnd, interval.ExpectedEnd, operation);
        
        return interval;
    }

    roundFives(actual, diff, expected, operation) {
      
        if (operation == this.NEGATIVE
            && diff < 0
            && diff >= -Math.abs(this.INTERVAL_MAX_LIMIT)) {
            return expected;
        }

        if (operation == this.POSITIVE
            && diff > 0
            && diff <= this.INTERVAL_MAX_LIMIT) {
            return expected;
        }
        
        return actual;
    }
    
    roundTens(workedDay) {

        var negatives = (this.totalNegatives(workedDay.firstInterval)) + (this.totalNegatives(workedDay.secondInterval));

        var positives =
            this.totalPositives(workedDay.firstInterval)
            + this.totalPositives(workedDay.secondInterval);

        if (negatives >= -Math.abs(this.TOTAL_MAX_LIMIT)) {
            workedDay.firstInterval = this.roundInterval(workedDay.firstInterval, this.NEGATIVE);
            workedDay.secondInterval = this.roundInterval(workedDay.secondInterval, this.NEGATIVE);
        }

        if (positives <= this.TOTAL_MAX_LIMIT) {
            workedDay.firstInterval = this.roundInterval(workedDay.firstInterval, this.POSITIVE);
            workedDay.secondInterval = this.roundInterval(workedDay.secondInterval, this.POSITIVE);
        }

        return workedDay;
    }

}
module.exports = CalcInterval;