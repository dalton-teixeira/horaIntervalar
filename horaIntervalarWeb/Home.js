const Controller = require("./interval/Controller.js");
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
    
    function validateHoursInput(date, startHours, endHours, expectedStart, expectedEnd) {
        if (date !== parseInt(date, 10)) {
            errorHandler("Dia Inválido!");
            return false;
        }

        if (startHours !== parseInt(date, 10)
            || endHours !== parseInt(date, 10))
        {
            return false;
        }
        if (expectedStart == null
            || expectedEnd == null)
        {
            errorHandler("Hora inicial e final da jornada está inválida!");
            return false;
        }

        return true;
    }

    function validInput(date, startHours, endHours, expectedStart, expectedEnd, startHours2, endHours2, expectedStart2, expectedEnd2) {
        if ((validateHoursInput(date, startHours, endHours, expectedStart, expectedEnd) == false)
            || (validateHoursInput(date, startHours2, endHours2, expectedStart2, expectedEnd2) == false))
            return false;
        return true;
    }

    function calculate() {
        // Run a batch operation against the Excel object model
        Excel.run(function (ctx) {
            // Create a proxy object for the selected range and load its properties
            var sourceRange = ctx.workbook.getSelectedRange().load("values, rowCount, columnCount");
            return ctx.sync().then(function () {
                    
                var sheet = ctx.workbook.worksheets.getActiveWorksheet();

                for (var i = 0; i < sourceRange.rowCount; i++) {
                    var date = sourceRange.values[i][0];
                    var startHours = sourceRange.values[i][2];
                    var endHours = sourceRange.values[i][3];
                    var startHours2 = sourceRange.values[i][4];
                    var endHours2 = sourceRange.values[i][5];
                        
                    var expectedStart = $("#first-start").val();
                    var expectedEnd = $("#first-end").val();
                    var expectedStart2 = $("#second-start").val();
                    var expectedEnd2 = $("#second-end").val();

                    if (validInput(date, startHours, endHours, expectedStart, expectedEnd, startHours2, endHours2, expectedStart2, expectedEnd2)) {
                        var controller = new Controller();
                        var result = controller.calcule(date, startHours, endHours, expectedStart, expectedEnd, null, null, null, null);
                        sourceRange.getCell(i, sourceRange.columnCount).values = [[result]];
                    }
                        
                }
            });
        })
        .catch(errorHandler);
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
