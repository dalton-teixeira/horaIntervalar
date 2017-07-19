const Interval = require('./models/Interval.js');
const CalcInterval = require('./CalcInterval.js');
const WorkedDay = require('./models/WorkedDay.js');

class Factory {
    
    createDate(number) {
        var result = new Date((number - 25569) * 86400 * 1000);
        var seconds = result.getSeconds();
        if (seconds > 30)
            result.setMinutes(result.getMinutes() + 1);
        else if (seconds > 0 && seconds < 30)
            result.setMinutes(result.getMinutes() - 1);
         
        result.setMilliseconds(0);
        result.setSeconds(0);
        return result;
    }

    createExpectedDate(date, value) {
        var hours = parseInt(value.split(":")[0]);
        var minutes = value.split(":")[1];
        var result = new Date((date - 25569) * 86400 * 1000);
        result.setHours(result.getHours() + hours);

        if (minutes != undefined) {
            result.setMinutes(parseInt(minutes));
        }
        return result;
    }

    createWorkedDay(
        date
        , startHours
        , endHours
        , expectedStart
        , expectedEnd
        , startHours2
        , endHours2
        , expectedStart2
        , expectedEnd2) {

        var expectedDate = date;
        var workedDay = new WorkedDay();

        workedDay.firstInterval =
            this.createInterval(date
            , startHours
            , endHours
            , expectedDate
            , expectedStart
            , expectedEnd);
        
        if (this.isMultipleInterval(startHours2)) {
            
            expectedDate = expectedStart2 < expectedEnd ? expectedDate + 1 : expectedDate;
            date = startHours2 < endHours ? date + 1 : date;

            workedDay.secondInterval =
                this.createInterval(date
                    , startHours2
                    , endHours2
                    , expectedDate
                    , expectedStart2
                    , expectedEnd2);
        }
        else {
            workedDay.secondInterval = null;
        }

        workedDay.date = this.createDate(date);

        return workedDay;
    }
    
    createInterval(
        date
        , startHours
        , endHours
        , expectedDate
        , expectedStart
        , expectedEnd) {
        var start = this.createDate(date + startHours);
        if (endHours < startHours) { date = date + 1; }
        var end = this.createDate(date + endHours);

        var calcInterval = new CalcInterval();

        var result = new Interval();
        result.Start = start;
        result.ExpectedStart = this.createExpectedDate(expectedDate, expectedStart);
        result.End = end;
        if (expectedEnd < expectedStart) expectedDate = expectedDate + 1;
        result.ExpectedEnd = this.createExpectedDate(expectedDate, expectedEnd);
       
        return result;
    }

    isMultipleInterval(startHours2) {
        return !isNaN(parseInt(startHours2, 10));
    }    
}
module.exports = Factory;