(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
"use strict";

var Controller = require("./interval/Controller.js");
(function () {
    "use strict";

    var messageBanner;
    // The initialize function must be run each time a new page is loaded.
    Office.initialize = function (reason) {
        $(document).ready(function () {
            // Initialize the FabricUI notification mechanism and hide it
            var element = document.querySelector('.ms-MessageBanner');
            messageBanner = new fabric.MessageBanner(element);
            messageBanner.hideBanner();

            // If not using Excel 2016, use fallback logic.
            if (!Office.context.requirements.isSetSupported('ExcelApi', '1.1')) {
                $("#template-description").text("This sample will display the value of the cells that you have selected in the spreadsheet.");
                $('#button-text').text("Display!");
                $('#button-desc').text("Display the selection");

                return;
            }
            $('#highlight-button').click(calculate);
        });
    };

    function validateInput(inputs) {
        if (isNaN(parseInt(inputs.date, 10))) {
            errorHandler("Dia Inválido!");
            return false;
        }

        if (isNaN(parseInt(inputs.startHours, 10)) || isNaN(parseInt(inputs.endHours, 10))) {
            return false;
        }
        if (inputs.expectedStart.split(":").length != 2 || inputs.expectedEnd.split(":").length != 2) {
            errorHandler("Hora inicial e final da jornada está inválida!");
            return false;
        }
        /*
        if (!isNaN(parseInt(inputs.startHours2, 10))) {
              if (isNaN(parseInt(inputs.endHours2, 10))
                || inputs.expectedEnd2.split(":").length != 2
                || inputs.expectedEnd2.split(":").length != 2) return false;
        }*/

        return true;
    }

    function readValues(sourceRange, i) {
        var result = {};
        result.date = sourceRange.values[i][0];
        result.startHours = sourceRange.values[i][2];
        result.endHours = sourceRange.values[i][3];
        result.startHours2 = sourceRange.values[i][4];
        result.endHours2 = sourceRange.values[i][5];

        result.expectedStart = $("#first-start").val();
        result.expectedEnd = $("#first-end").val();
        result.expectedStart2 = $("#second-start").val();
        result.expectedEnd2 = $("#second-end").val();
        result.continued = $("#continued").val();
        return result;
    }

    function calculate() {
        // Run a batch operation against the Excel object model
        Excel.run(function (ctx) {
            // Create a proxy object for the selected range and load its properties
            var sourceRange = ctx.workbook.getSelectedRange().load("values, rowCount, columnCount");
            return ctx.sync().then(function () {
                for (var i = 0; i < sourceRange.rowCount; i++) {
                    var inputs = readValues(sourceRange, i);
                    if (validateInput(inputs)) {
                        var controller = new Controller();
                        var totalHours = controller.calcule(inputs.date, inputs.startHours, inputs.endHours, inputs.expectedStart, inputs.expectedEnd, inputs.startHours2, inputs.endHours2, inputs.expectedStart2, inputs.expectedEnd2, inputs.continued);
                        var totalNightHours = controller.totalNightHours(inputs.date, inputs.startHours, inputs.endHours, inputs.expectedStart, inputs.expectedEnd, inputs.startHours2, inputs.endHours2, inputs.expectedStart2, inputs.expectedEnd2, inputs.continued);
                        sourceRange.getCell(i, sourceRange.columnCount).values = [[totalHours]];
                        sourceRange.getCell(i, sourceRange.columnCount + 1).values = [[totalNightHours]];
                    }
                }
            }).then(ctx.sync);
        }).catch(errorHandler);
    }

    // Helper function for treating errors
    function errorHandler(error) {
        // Always be sure to catch any accumulated errors that bubble up from the Excel.run execution
        showNotification("Error", error);
        console.log("Error: " + error);
        if (error instanceof OfficeExtension.Error) {
            console.log("Debug info: " + JSON.stringify(error.debugInfo));
        }
    }

    // Helper function for displaying notifications
    function showNotification(header, content) {
        $("#notification-header").text(header);
        $("#notification-body").text(content);
        messageBanner.showBanner();
        messageBanner.toggleExpansion();
    }
})();

},{"./interval/Controller.js":3}],2:[function(require,module,exports){
'use strict';

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var Interval = require('./models/Interval.js');
var WorkedDay = require('./models/WorkedDay.js');
var NightHours = require('./NightHours.js');

var CalcInterval = function () {
    function CalcInterval() {
        _classCallCheck(this, CalcInterval);

        this.INTERVAL_MAX_LIMIT = 5 * 60000;
        this.TOTAL_MAX_LIMIT = 10 * 60000;
        this.NEGATIVE = '-';
        this.POSITIVE = '+';
    }

    _createClass(CalcInterval, [{
        key: 'totalDay',
        value: function totalDay(workedDay) {
            var continued = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : true;

            workedDay = this.roundTens(workedDay);
            var totalHours = this.getSimpleTotalHours(workedDay);

            var nightHours = new NightHours();
            var regular = totalHours - nightHours.reducedHoursNoFactor(workedDay, continued);
            var result = regular + nightHours.reducedHours(workedDay, continued);
            return result;
        }
    }, {
        key: 'getRegularHours',
        value: function getRegularHours(workedDay) {
            var continued = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : true;

            var totalHours = this.getSimpleTotalHours(workedDay);
            return totalHours - new NightHours().reducedHoursNoFactor(workedDay, continued);
        }
    }, {
        key: 'getSimpleTotalHours',
        value: function getSimpleTotalHours(workedDay) {
            var totalHours = workedDay.firstInterval.End - workedDay.firstInterval.Start;
            if (workedDay.secondInterval != null) totalHours = totalHours + (workedDay.secondInterval.End - workedDay.secondInterval.Start);
            return totalHours;
        }
    }, {
        key: 'totalNightReduced',
        value: function totalNightReduced(workedDay) {
            var continued = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : true;

            return this.totalDay(workedDay, continued) - this.getRegularHours(workedDay, continued);
        }
    }, {
        key: 'totalNegatives',
        value: function totalNegatives(interval) {
            var result = interval.totalStart() < 0 ? interval.totalStart() : 0;
            result = interval.totalEnd() < 0 ? result + interval.totalEnd() : result;
            return result;
        }
    }, {
        key: 'totalPositives',
        value: function totalPositives(interval) {
            var result = interval.totalStart() > 0 ? interval.totalStart() : 0;
            result = interval.totalEnd() > 0 ? result + interval.totalEnd() : result;
            return result;
        }
    }, {
        key: 'roundInterval',
        value: function roundInterval(interval, operation) {
            interval.Start = this.roundFives(interval.Start, interval.ExpectedStart - interval.Start, interval.ExpectedStart, operation);
            interval.End = this.roundFives(interval.End, interval.End - interval.ExpectedEnd, interval.ExpectedEnd, operation);
            return interval;
        }
    }, {
        key: 'roundFives',
        value: function roundFives(actual, diff, expected, operation) {

            if (operation == this.NEGATIVE && diff < 0 && diff >= -Math.abs(this.INTERVAL_MAX_LIMIT)) {
                return expected;
            }

            if (operation == this.POSITIVE && diff > 0 && diff <= this.INTERVAL_MAX_LIMIT) {
                return expected;
            }

            return actual;
        }
    }, {
        key: 'roundTens',
        value: function roundTens(workedDay) {
            var isMultipleInterval = workedDay.secondInterval != null;
            var negatives = this.totalNegatives(workedDay.firstInterval);
            var positives = this.totalPositives(workedDay.firstInterval);

            if (isMultipleInterval) {
                negatives = negatives + this.totalNegatives(workedDay.secondInterval);
                positives = positives + this.totalPositives(workedDay.secondInterval);
            }
            if (negatives != 0 && negatives >= -Math.abs(this.TOTAL_MAX_LIMIT)) {
                workedDay.firstInterval = this.roundInterval(workedDay.firstInterval, this.NEGATIVE);
                workedDay.secondInterval = isMultipleInterval ? this.roundInterval(workedDay.secondInterval, this.NEGATIVE) : null;
            }

            if (positives != 0 && positives <= this.TOTAL_MAX_LIMIT) {
                workedDay.firstInterval = this.roundInterval(workedDay.firstInterval, this.POSITIVE);
                workedDay.secondInterval = isMultipleInterval ? this.roundInterval(workedDay.secondInterval, this.POSITIVE) : null;
            }

            return workedDay;
        }
    }]);

    return CalcInterval;
}();

module.exports = CalcInterval;

},{"./NightHours.js":5,"./models/Interval.js":6,"./models/WorkedDay.js":7}],3:[function(require,module,exports){
'use strict';

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var CalcInterval = require('./CalcInterval.js');
var Factory = require('./Factory.js');
var NightHours = require('./NightHours.js');

var Controller = function () {
    function Controller() {
        _classCallCheck(this, Controller);
    }

    _createClass(Controller, [{
        key: 'calcule',
        value: function calcule(date, startHours, endHours, expectedStart, expectedEnd, startHours2, endHours2, expectedStart2, expectedEnd2) {
            var continued = arguments.length > 9 && arguments[9] !== undefined ? arguments[9] : true;


            var factory = new Factory();
            var calcInterval = new CalcInterval();

            var workedDay = factory.createWorkedDay(date, startHours, endHours, expectedStart, expectedEnd, startHours2, endHours2, expectedStart2, expectedEnd2);

            var result = calcInterval.totalDay(workedDay, continued);
            return this.formatTotalHours(result);
        }
    }, {
        key: 'totalNightHours',
        value: function totalNightHours(date, startHours, endHours, expectedStart, expectedEnd, startHours2, endHours2, expectedStart2, expectedEnd2) {
            var continued = arguments.length > 9 && arguments[9] !== undefined ? arguments[9] : true;


            var workedDay = new Factory().createWorkedDay(date, startHours, endHours, expectedStart, expectedEnd, startHours2, endHours2, expectedStart2, expectedEnd2);
            var result = new CalcInterval().totalNightReduced(workedDay, continued);

            return this.formatTotalHours(result);
        }
    }, {
        key: 'formatTotalHours',
        value: function formatTotalHours(number) {
            var totalHours = this.createRoundedDate(number);
            var _h = parseInt(totalHours.getUTCHours());
            var _m = totalHours.getUTCMinutes();

            return _h + "." + Math.ceil(_m / 60 * 100);
        }
    }, {
        key: 'createRoundedDate',
        value: function createRoundedDate(number) {
            var result = new Date(number);
            var seconds = result.getSeconds();

            if (seconds >= 30) {
                result.setMinutes(result.getMinutes() + 1);
                result.setSeconds(0);
            }
            return result;
        }
    }]);

    return Controller;
}();

module.exports = Controller;

},{"./CalcInterval.js":2,"./Factory.js":4,"./NightHours.js":5}],4:[function(require,module,exports){
'use strict';

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var Interval = require('./models/Interval.js');
var CalcInterval = require('./CalcInterval.js');
var WorkedDay = require('./models/WorkedDay.js');

var Factory = function () {
    function Factory() {
        _classCallCheck(this, Factory);
    }

    _createClass(Factory, [{
        key: 'createDate',
        value: function createDate(number) {
            var result = new Date((number - 25569) * 86400 * 1000);
            var seconds = result.getSeconds();
            if (seconds > 30) result.setMinutes(result.getMinutes() + 1);else if (seconds > 0 && seconds < 30) result.setMinutes(result.getMinutes() - 1);

            result.setMilliseconds(0);
            result.setSeconds(0);
            return result;
        }
    }, {
        key: 'createExpectedDate',
        value: function createExpectedDate(date, value) {
            var hours = parseInt(value.split(":")[0]);
            var minutes = value.split(":")[1];
            var result = new Date((date - 25569) * 86400 * 1000);
            result.setHours(result.getHours() + hours);

            if (minutes != undefined) {
                result.setMinutes(parseInt(minutes));
            }
            return result;
        }
    }, {
        key: 'createWorkedDay',
        value: function createWorkedDay(date, startHours, endHours, expectedStart, expectedEnd, startHours2, endHours2, expectedStart2, expectedEnd2) {

            var expectedDate = date;
            var workedDay = new WorkedDay();

            workedDay.firstInterval = this.createInterval(date, startHours, endHours, expectedDate, expectedStart, expectedEnd);

            if (this.isMultipleInterval(startHours2)) {

                expectedDate = expectedStart2 < expectedEnd ? expectedDate + 1 : expectedDate;
                date = startHours2 < endHours ? date + 1 : date;

                workedDay.secondInterval = this.createInterval(date, startHours2, endHours2, expectedDate, expectedStart2, expectedEnd2);
            } else {
                workedDay.secondInterval = null;
            }

            workedDay.date = this.createDate(date);

            return workedDay;
        }
    }, {
        key: 'createInterval',
        value: function createInterval(date, startHours, endHours, expectedDate, expectedStart, expectedEnd) {
            var start = this.createDate(date + startHours);
            if (endHours < startHours) {
                date = date + 1;
            }
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
    }, {
        key: 'isMultipleInterval',
        value: function isMultipleInterval(startHours2) {
            return !isNaN(parseInt(startHours2, 10));
        }
    }]);

    return Factory;
}();

module.exports = Factory;

},{"./CalcInterval.js":2,"./models/Interval.js":6,"./models/WorkedDay.js":7}],5:[function(require,module,exports){
"use strict";

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var NightHours = function () {
    function NightHours() {
        _classCallCheck(this, NightHours);
    }

    _createClass(NightHours, [{
        key: "totalNightHours",
        value: function totalNightHours(workedDay) {

            var result = this.getNightHours(workedDay.firstInterval, workedDay.date) + this.getNightHours(workedDay.secondInterval, workedDay.date);
            return result;
        }
    }, {
        key: "getNightHoursBegin",
        value: function getNightHoursBegin(date) {
            var result = new Date(date.getTime());
            result.setHours(date.getHours() + 22);
            result.setMinutes(0);
            result.setSeconds(0);
            result.setMilliseconds(0);
            return result;
        }
    }, {
        key: "getNightHours",
        value: function getNightHours(interval, date) {
            if (interval === undefined || interval === null) return 0;

            var nightBegin = this.getNightHoursBegin(date);

            if (interval.start >= nightBegin) return interval.end - interval.start;
            if (interval.end > nightBegin) return interval.end - nightBegin;
            return 0;
        }
    }, {
        key: "reducedHours",
        value: function reducedHours(workedDay, continued) {
            var factor = 1.14285;
            var result = this.reducedHoursNoFactor(workedDay, continued);
            return result > 0 ? result * factor : 0;
        }
    }, {
        key: "reducedHoursNoFactor",
        value: function reducedHoursNoFactor(workedDay, continued) {
            return continued ? this.totalNightHours(workedDay) : this.getReduced(workedDay.firstInterval, workedDay.date) + this.getReduced(workedDay.secondInterval, workedDay.date);
        }
    }, {
        key: "getReduced",
        value: function getReduced(interval, date) {
            var result = 0;

            if (interval === undefined || interval === null) return 0;

            var end = this.getNightHoursEnd(date);
            var begin = this.getNightHoursBegin(date);
            if (interval.start >= begin) result = interval.end - interval.start;

            if (interval.end > begin) result = interval.end - begin;

            if (result > 0 && interval.end > end) result = result - (interval.end - end);

            return result;
        }
    }, {
        key: "getNightHoursEnd",
        value: function getNightHoursEnd(date) {
            var result = new Date(date.getTime());
            result.setDate(result.getDate() + 1);
            result.setHours(5);
            result.setMinutes(0);
            result.setSeconds(0);
            result.setMilliseconds(0);
            return result;
        }
    }]);

    return NightHours;
}();

module.exports = NightHours;

},{}],6:[function(require,module,exports){
"use strict";

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var Interval = function () {
    function Interval() {
        _classCallCheck(this, Interval);
    }

    _createClass(Interval, [{
        key: "totalStart",
        value: function totalStart() {
            return this.expectedStart - this.start;
        }
    }, {
        key: "totalEnd",
        value: function totalEnd() {
            return this.end - this.expectedEnd;
        }
    }, {
        key: "Start",
        get: function get() {
            return this.start;
        },
        set: function set(newValue) {
            this.start = newValue;
        }
    }, {
        key: "End",
        get: function get() {
            return this.end;
        },
        set: function set(value) {
            this.end = value;
        }
    }, {
        key: "ExpectedStart",
        get: function get() {
            return this.expectedStart;
        },
        set: function set(value) {
            this.expectedStart = value;
        }
    }, {
        key: "ExpectedEnd",
        get: function get() {
            return this.expectedEnd;
        },
        set: function set(value) {
            this.expectedEnd = value;
        }
    }]);

    return Interval;
}();

module.exports = Interval;

},{}],7:[function(require,module,exports){
'use strict';

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var Interval = require('./Interval.js');

var WorkedDay = function () {
    function WorkedDay() {
        _classCallCheck(this, WorkedDay);
    }

    _createClass(WorkedDay, [{
        key: 'FirstInterval',
        get: function get() {
            return this.firstInterval;
        },
        set: function set(interval) {
            this.firstInterval = interval;
        }
    }, {
        key: 'SecondInterval',
        get: function get() {
            return this.secondInterval;
        },
        set: function set(interval) {
            this.secondInterval = interval;
        }
    }, {
        key: 'Date',
        get: function get() {
            return this.date;
        },
        set: function set(date) {
            this.date = date;
        }
    }]);

    return WorkedDay;
}();

module.exports = WorkedDay;

},{"./Interval.js":6}]},{},[1]);
