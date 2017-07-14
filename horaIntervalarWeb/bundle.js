(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
"use strict";

var Controller = require("./interval/Controller.js");
(function () {
    "use strict";

    var cellToHighlight;
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

                $('#highlight-button').click(displaySelectedCells);
                return;
            }

            $("#template-description").text("This sample highlights the highest value from the cells you have selected in the spreadsheet.");

            //loadSampleData();

            // Add a click event handler for the highlight button.
            $('#highlight-button').click(calculate);
        });
    };

    function loadSampleData() {

        // Run a batch operation against the Excel object model
        Excel.run(function (ctx) {
            // Create a proxy object for the active sheet
            //var sheet = ctx.workbook.worksheets.getActiveWorksheet();
            // Queue a command to write the sample data to the worksheet
            //sheet.getRange("B3:D5").values = values;
            //sheet.getRange("B1:B1").values = [[1000]];
            //var test = sheet.getCell(3, 1).select();

            // Run the queued-up commands, and return a promise to indicate task completion
            return ctx.sync();
        }).catch(errorHandler);
    }

    function calculate() {
        // Run a batch operation against the Excel object model
        Excel.run(function (ctx) {
            // Create a proxy object for the selected range and load its properties
            var sourceRange = ctx.workbook.getSelectedRange().load("values, rowCount, columnCount");

            return ctx.sync().then(function () {
                var date = sourceRange.values[0][0];
                var startHours = sourceRange.values[0][2];
                var endHours = sourceRange.values[0][3];

                var expectedStart = $("#first-start").val();
                var expectedEnd = $("#first-end").val();
                var controller = new Controller();
                var result = controller.calcule(date, startHours, endHours, expectedStart, expectedEnd, null, null, null, null);

                //var result = calcInterval.roundTens(workedDay);
            });

            // Run the queued-up command, and return a promise to indicate task completion
            /*return ctx.sync()
                .then(function () {
                    var highestRow = 0;
                    var highestCol = 0;
                    var highestValue = sourceRange.values[0][0];
                      // Find the cell to highlight
                    for (var i = 0; i < sourceRange.rowCount; i++) {
                        for (var j = 0; j < sourceRange.columnCount; j++) {
                            if (!isNaN(sourceRange.values[i][j]) && sourceRange.values[i][j] > highestValue) {
                                highestRow = i;
                                highestCol = j;
                                highestValue = sourceRange.values[i][j];
                            }
                        }
                    }
                      cellToHighlight = sourceRange.getCell(highestRow, highestCol);
                    sourceRange.worksheet.getUsedRange().format.fill.clear();
                    sourceRange.worksheet.getUsedRange().format.font.bold = false;
                      // Highlight the cell
                    cellToHighlight.format.fill.color = "orange";
                    cellToHighlight.format.font.bold = true;
                })
                .then(ctx.sync);*/
        }).catch(errorHandler);
    }

    function displaySelectedCells() {
        Office.context.document.getSelectedDataAsync(Office.CoercionType.Text, function (result) {
            if (result.status === Office.AsyncResultStatus.Succeeded) {
                showNotification('The selected text is:', '"' + result.value + '"');
            } else {
                showNotification('Error', result.error.message);
            }
        });
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

var CalcInterval = function () {
    function CalcInterval() {
        _classCallCheck(this, CalcInterval);

        this.INTERVAL_MAX_LIMIT = 5 * 60000;
        this.TOTAL_MAX_LIMIT = 10 * 60000;
        this.NEGATIVE = '-';
        this.POSITIVE = '+';
    }

    _createClass(CalcInterval, [{
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

            if (negatives >= -Math.abs(this.TOTAL_MAX_LIMIT)) {
                workedDay.firstInterval = this.roundInterval(workedDay.firstInterval, this.NEGATIVE);
                workedDay.secondInterval = isMultipleInterval ? this.roundInterval(workedDay.secondInterval, this.NEGATIVE) : null;
            }

            if (positives <= this.TOTAL_MAX_LIMIT) {
                workedDay.firstInterval = this.roundInterval(workedDay.firstInterval, this.POSITIVE);
                workedDay.secondInterval = isMultipleInterval ? this.roundInterval(workedDay.secondInterval, this.POSITIVE) : null;
            }

            return workedDay;
        }
    }]);

    return CalcInterval;
}();

module.exports = CalcInterval;

},{"./models/Interval.js":4,"./models/WorkedDay.js":5}],3:[function(require,module,exports){
'use strict';

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var CalcInterval = require('./CalcInterval.js');
var Interval = require('./models/Interval.js');
var WorkedDay = require('./models/WorkedDay.js');

var Controller = function () {
    function Controller() {
        _classCallCheck(this, Controller);
    }

    _createClass(Controller, [{
        key: 'createDate',
        value: function createDate(number) {
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
    }, {
        key: 'getExpectedDate',
        value: function getExpectedDate(date, value) {
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
        key: 'calcule',
        value: function calcule(date, startHours, endHours, expectedStart, expectedEnd, secondStartHours, secondEndHours, secondExpectedStart, secondExpectedEnd) {
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
    }, {
        key: 'toExcelDateTime',
        value: function toExcelDateTime(interval) {
            if (interval == null) return interval;
            interval.start = (interval.start.valueOf() + 25569) / 86400 / 1000;
            interval.end = (interval.end.valueOf() + 25569) / 86400 / 1000;
            return interval;
        }
    }]);

    return Controller;
}();

module.exports = Controller;

},{"./CalcInterval.js":2,"./models/Interval.js":4,"./models/WorkedDay.js":5}],4:[function(require,module,exports){
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

},{}],5:[function(require,module,exports){
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
    }]);

    return WorkedDay;
}();

module.exports = WorkedDay;

},{"./Interval.js":4}]},{},[1]);
