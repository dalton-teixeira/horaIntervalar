var assert = require('assert');
const NightHours = require('../interval/NightHours.js');
const Interval = require('../interval/models/Interval.js');
const WorkedDay = require('../interval/models/WorkedDay.js');

describe('NightHours', function () {
    describe('#totalNightHours()', function () {
        it('should return night hours for single interval.', function () {
            //arrange
            var sut = new NightHours();
            var firstInterval = new Interval();
            firstInterval.Start = new Date(2017, 0, 24, 16, 00);
            firstInterval.ExpectedStart = new Date(2017, 0, 24, 08, 00);
            firstInterval.End = new Date(2017, 0, 24, 22, 10);
            firstInterval.ExpectedEnd = new Date(2017, 0, 24, 12, 00);

            var workedDay = new WorkedDay();
            workedDay.firstInterval = firstInterval;
            workedDay.secondInterval = null;
            workedDay.date = new Date(2017, 0, 24, 00, 00);
            //act
            var result = sut.totalNightHours(workedDay);
            //assert
            assert.equal(600000, result);
        });

        it('should return night hours for single interval.', function () {
            //arrange
            var sut = new NightHours();
            var firstInterval = new Interval();
            firstInterval.Start = new Date(2017, 0, 24, 19, 00);
            firstInterval.ExpectedStart = new Date(2017, 0, 24, 08, 00);
            firstInterval.End = new Date(2017, 0, 25, 07, 00);
            firstInterval.ExpectedEnd = new Date(2017, 0, 24, 12, 00);

            var workedDay = new WorkedDay();
            workedDay.firstInterval = firstInterval;
            workedDay.secondInterval = null;
            workedDay.date = new Date(2017, 0, 24, 00, 00);
            //act
            var result = sut.totalNightHours(workedDay);
            //assert
            assert.equal(9 * 60 * 60000, result);
        });



        it('should return night hours for single interval.', function () {
            //arrange
            var sut = new NightHours();
            var firstInterval = new Interval();
            firstInterval.Start = new Date(2017, 0, 24, 23, 00);
            firstInterval.ExpectedStart = new Date(2017, 0, 24, 08, 00);
            firstInterval.End = new Date(2017, 0, 25, 16, 00);
            firstInterval.ExpectedEnd = new Date(2017, 0, 24, 12, 00);

            var workedDay = new WorkedDay();
            workedDay.firstInterval = firstInterval;
            workedDay.secondInterval = null;
            workedDay.date = new Date(2017, 0, 24, 00, 00);
            //act
            var result = sut.totalNightHours(workedDay);
            //assert
            assert.equal(17 * 60 * 60000, result);
        });

        it('should return night hours for multiples interval.', function () {
            //arrange
            var sut = new NightHours();
            var firstInterval = new Interval();
            firstInterval.Start = new Date(2017, 0, 24, 16, 00);
            firstInterval.ExpectedStart = new Date(2017, 0, 24, 08, 00);
            firstInterval.End = new Date(2017, 0, 24, 21, 00);
            firstInterval.ExpectedEnd = new Date(2017, 0, 24, 12, 00);
            var secondInterval = new Interval();
            secondInterval.Start = new Date(2017, 0, 24, 22, 00);
            secondInterval.ExpectedStart = new Date(2017, 0, 25, 08, 00);
            secondInterval.End = new Date(2017, 0, 25, 07, 00);
            secondInterval.ExpectedEnd = new Date(2017, 0, 25, 12, 00);

            var workedDay = new WorkedDay();
            workedDay.firstInterval = firstInterval;
            workedDay.secondInterval = secondInterval;
            workedDay.date = new Date(2017, 0, 24, 00, 00);
            //act
            var result = sut.totalNightHours(workedDay);
            //assert
            assert.equal(9 * 60 * 60000, result);
        });

        it('should return no night hours for single interval.', function () {
            //arrange
            var sut = new NightHours();
            var firstInterval = new Interval();
            firstInterval.Start = new Date(2017, 0, 24, 07, 55);
            firstInterval.ExpectedStart = new Date(2017, 0, 24, 08, 00);
            firstInterval.End = new Date(2017, 0, 24, 11, 58);
            firstInterval.ExpectedEnd = new Date(2017, 0, 24, 12, 00);

            var workedDay = new WorkedDay();
            workedDay.firstInterval = firstInterval;
            workedDay.secondInterval = null;
            workedDay.date = new Date(2017, 0, 24, 00, 00);
            //act
            var result = sut.totalNightHours(workedDay);
            //assert
            assert.equal(0, result);
        });

    });

    describe('#reducedHours()', function () {
        it('should return reduced hours for single interval.', function () {
            //arrange
            var sut = new NightHours();
            var firstInterval = new Interval();
            firstInterval.Start = new Date(2017, 0, 24, 16, 00);
            firstInterval.ExpectedStart = new Date(2017, 0, 24, 08, 00);
            firstInterval.End = new Date(2017, 0, 24, 22, 10);
            firstInterval.ExpectedEnd = new Date(2017, 0, 24, 12, 00);

            var workedDay = new WorkedDay();
            workedDay.firstInterval = firstInterval;
            workedDay.secondInterval = null;
            workedDay.date = new Date(2017, 0, 24, 00, 00);
            //act
            var result = sut.reducedHours(workedDay, true);
            //assert
            assert.equal(600000 * 1.14285, result);
        });

        it('should return reduced hours for single interval.', function () {
            //arrange
            var sut = new NightHours();
            var firstInterval = new Interval();
            firstInterval.Start = new Date(2017, 0, 24, 21, 00);
            firstInterval.ExpectedStart = new Date(2017, 0, 24, 08, 00);
            firstInterval.End = new Date(2017, 0, 25, 07, 00);
            firstInterval.ExpectedEnd = new Date(2017, 0, 25, 12, 00);

            var workedDay = new WorkedDay();
            workedDay.firstInterval = firstInterval;
            workedDay.secondInterval = null;
            workedDay.date = new Date(2017, 0, 24, 00, 00);
            //act
            var result = sut.reducedHours(workedDay, true);
            //assert
            assert.equal(9 * 60 * 60000 * 1.14285, result);
        });


        it('should return reduced hours for single interval.', function () {
            //arrange
            var sut = new NightHours();
            var firstInterval = new Interval();
            firstInterval.Start = new Date(2017, 0, 24, 21, 00);
            firstInterval.ExpectedStart = new Date(2017, 0, 24, 08, 00);
            firstInterval.End = new Date(2017, 0, 25, 07, 00);
            firstInterval.ExpectedEnd = new Date(2017, 0, 25, 12, 00);

            var workedDay = new WorkedDay();
            workedDay.firstInterval = firstInterval;
            workedDay.secondInterval = null;
            workedDay.date = new Date(2017, 0, 24, 00, 00);
            //act
            var result = sut.reducedHours(workedDay, false);
            //assert
            assert.equal(7 * 60 * 60000 * 1.14285, result);
        });
        

        it('should return reduced hours for single interval.', function () {
            //arrange
            var sut = new NightHours();
            var firstInterval = new Interval();
            firstInterval.Start = new Date(2017, 0, 24, 16, 00);
            firstInterval.End = new Date(2017, 0, 24, 23, 00);
            firstInterval.ExpectedStart = new Date(2017, 0, 24, 08, 00);
            firstInterval.ExpectedEnd = new Date(2017, 0, 25, 12, 00);
            var secondInterval = new Interval();
            secondInterval.Start = new Date(2017, 0, 25, 00, 00);
            secondInterval.End = new Date(2017, 0, 25, 10, 00);
            secondInterval.ExpectedEnd = new Date(2017, 0, 25, 12, 00);
            secondInterval.ExpectedStart = new Date(2017, 0, 24, 22, 00);

            var workedDay = new WorkedDay();
            workedDay.firstInterval = firstInterval;
            workedDay.secondInterval = secondInterval;
            workedDay.date = new Date(2017, 0, 24, 00, 00);
            //act
            var result = sut.reducedHours(workedDay, true);
            //assert
            assert.equal(11 * 60 * 60000 * 1.14285, result);
        });


        it('should return reduced hours for single interval.', function () {
            //arrange
            var sut = new NightHours();
            var firstInterval = new Interval();
            firstInterval.Start = new Date(2017, 0, 24, 16, 00);
            firstInterval.End = new Date(2017, 0, 24, 23, 00);
            firstInterval.ExpectedStart = new Date(2017, 0, 24, 08, 00);
            firstInterval.ExpectedEnd = new Date(2017, 0, 25, 12, 00);
            var secondInterval = new Interval();
            secondInterval.Start = new Date(2017, 0, 25, 00, 00);
            secondInterval.End = new Date(2017, 0, 25, 10, 00);
            secondInterval.ExpectedEnd = new Date(2017, 0, 25, 12, 00);
            secondInterval.ExpectedStart = new Date(2017, 0, 24, 22, 00);

            var workedDay = new WorkedDay();
            workedDay.firstInterval = firstInterval;
            workedDay.secondInterval = secondInterval;
            workedDay.date = new Date(2017, 0, 24, 00, 00);
            //act
            var result = sut.reducedHours(workedDay, false);
            //assert
            assert.equal(8 * 60 * 60000 * 1.14285, result);
        });

    });
    
});