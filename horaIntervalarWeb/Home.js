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
    /*
    function validateInput(inputs) {
        if (isNaN(parseInt(inputs.date, 10))) {
            errorHandler("Dia Inválido!");
            return false;
        }

        if (isNaN(parseInt(inputs.startHours, 10))
            || isNaN(parseInt(inputs.endHours, 10)))
        {
            return false;
        }
        if (inputs.expectedStart.split(":").length != 2
            || inputs.expectedEnd.split(":").length != 2)
        {
            errorHandler("Hora inicial e final da jornada está inválida!");
            return false;
        }

        if (!isNaN(parseInt(inputs.startHours2, 10))) {

            if (isNaN(parseInt(inputs.endHours2, 10))
                || inputs.expectedEnd2.split(":").length != 2
                || inputs.expectedEnd2.split(":").length != 2) return false;
        }
        
        return true;
    }*/
    
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
        return result;
    }

    function calculate() {
        // Run a batch operation against the Excel object model
        Excel.run(function (ctx) {
            // Create a proxy object for the selected range and load its properties
            var sourceRange = ctx.workbook.getSelectedRange().load("values, rowCount, columnCount");
            return ctx.sync()
                .then(function () {
                    for (var i = 0; i < sourceRange.rowCount; i++) {
                        var inputs = readValues(sourceRange, i);
                        //var isValid = validateInput(inputs); 
                        //if () {
                        var controller = new Controller();

                        var result = controller.calcule(
                                inputs.date
                                , inputs.startHours
                                , inputs.endHours
                                , inputs.expectedStart
                                , inputs.expectedEnd
                                , inputs.startHours2
                                , inputs.endHours2
                                , inputs.expectedStart2
                                , inputs.expectedEnd2);
                            sourceRange.getCell(i, sourceRange.columnCount).values = [[result]];
                    }
                })
                .then(ctx.sync);
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
