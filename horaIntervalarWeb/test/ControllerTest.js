﻿var assert = require('assert');
const Controller = require('../interval/Controller.js');

describe('Controller', function () {
    
    describe('#Calcule()', function () {
        it('should return total day formatted.', function () {
            //arrange
            var sut = new Controller();
            var date = 42742;
            var startHours = 0.371527777777;
            var endHours = 0.5034722222;
            var expectedDate = 42742;
            var expectedStart = "09:00";
            var expectedEnd = "12:00";
            //act
            var result = sut.calcule(date, startHours, endHours, expectedStart, expectedEnd, null, null, null, null);

            //assert
            assert.equal("03:00", result);
           
        });
        
        it('should return new WorkedDay.', function () {
            //arrange
            var sut = new Controller();
            var date = 42742;
            var startHours = 0.371527777777;
            var endHours = 0.5034722222;
            var expectedDate = 42742;
            var expectedStart = "09:00";
            var expectedEnd = "12:00";
            var startHours2 = 0.54513888888;
            var endHours2 = 0.711805555555;
            var expectedStart2 = "13:00";
            var expectedEnd2 = "17:00";
            //act
            var result = sut.calcule(
                date
                , startHours
                , endHours
                , expectedStart
                , expectedEnd
                , startHours2
                , endHours2
                , expectedStart2
                , expectedEnd2);

            //assert
            assert.equal("07:15", result);
        });
    });
    
});