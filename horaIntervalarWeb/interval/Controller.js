const CalcInterval = require('./CalcInterval.js');
const Factory = require('./Factory.js');
class Controller {
        
    calcule(date
        , startHours
        , endHours
        , expectedStart
        , expectedEnd
        , startHours2
        , endHours2
        , expectedStart2
        , expectedEnd2) {

        var factory = new Factory();
        var calcInterval = new CalcInterval();
        var workedDay = factory.createWorkedDay(
                date
                , startHours
                , endHours
                , expectedStart
                , expectedEnd
                , startHours2
                , endHours2
                , expectedStart2
                , expectedEnd2);

        if (expectedStart2 === undefined || expectedStart2 == null || expectedStart2 == "")
            expectedStart2, expectedEnd2 = expectedEnd;
        
        var result = calcInterval.totalDay(workedDay);

        return this.formatTotalHours(result);
    }
    
    formatTotalHours(number) {
        var totalHours = this.createRoundedDate(number);
        var _h = totalHours.getUTCHours().toString();
        var _m = totalHours.getUTCMinutes().toString();
        if (_h.length == 1) _h = "0" + _h;
        if (_m.length == 1) _m = "0" + _m;
        return _h + ":" + _m;
    }

    createRoundedDate(number) {
        var result = new Date(number);
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

}
module.exports = Controller;