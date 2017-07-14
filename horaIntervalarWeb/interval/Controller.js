const CalcInterval = require('./CalcInterval.js');
var Interval = require('./models/Interval.js');
var WorkedDay = require('./models/WorkedDay.js');

class Controller {
    createDate(number) {
        var result = new Date((number - 25569) * 86400 * 1000);
        var seconds = result.getSeconds();

        if (seconds > 30) {
            result.setMinutes(result.getMinutes() + 1);
            result.setSeconds(0);
            return result;
        } else if (seconds > 0 && seconds < 30) {
            result.setMinutes(result.getMinutes() - 1);
            result.setSeconds(0);
            return result;
        }
        return result;
    }

    getExpectedDate(date, value) {
        var hours = parseInt(value.split(":")[0]);
        var minutes = value.split(":")[1];
        var result = new Date((date - 25569) * 86400 * 1000);
        result.setHours(result.getHours() + hours);

        if (minutes != undefined) {
            result.setMinutes(parseInt(minutes));
        }
        return result;
    }

    calcule(date
        , startHours
        , endHours
        , expectedStart
        , expectedEnd

        , secondStartHours
        , secondEndHours
        , secondExpectedStart
        , secondExpectedEnd) {
        var start = this.createDate(date + startHours);
        var end = this.createDate(date + endHours);
        var calcInterval = new CalcInterval();

        var firstInterval = new Interval();
        firstInterval.Start = start;
        firstInterval.ExpectedStart = this.getExpectedDate(date, expectedStart);
        firstInterval.End = end;
        firstInterval.ExpectedEnd = this.getExpectedDate(date, expectedEnd);
        
        var workedDay = new WorkedDay();
        workedDay.firstInterval = firstInterval;
        workedDay.secondInterval = null;

        var result = calcInterval.roundTens(workedDay);
        result.firstInterval = this.toExcelDateTime(result.firstInterval);
        result.secondInterval = this.toExcelDateTime(result.secondInterval);
        return result;
    }

    toExcelDateTime(interval) {
        if (interval == null) return interval;
        interval.start = (interval.start.valueOf() + 25569) / 86400 / 1000;
        interval.end = (interval.end.valueOf() + 25569) / 86400 / 1000;
        return interval;
    }
}
module.exports = Controller;