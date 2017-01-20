var Papa = require("papaparse"); // CSV parser
var $ = require("jquery");

var url = "http://developer.mbta.com/lib/gtrtfs/Departures.csv"; //The url of our data

// Write the table header.
// For mysterious reasons it likes to repeat itself if
// written out in the plain html
var head = $('<tr>');
var items = ["Origin", "Trip", "Destination", "Scheduled Time", "Lateness", "Track", "Status"]
items.forEach(function(item) {
    element = $("<th>");
    element.html(item);
    head.append(element);
});
$("#departures_board thead").append(head);

$.get(url, function( response ) {
  var response = Papa.parse(response, {header: true});

  response.data.forEach( function(datum) {
    //Some work on the scheduled time...
    //Convert the time from epoch time to js Date object
    var scheduledTime = new Date(parseInt(datum.ScheduledTime)*1000);

    // The last object is empty, the time will not parse correctly.
    // We should just simply omit it from the rendering.
    if (isNaN(scheduledTime))
        return;
    
    // Check if AM or PM
    var ampm = "am";
    if (scheduledTime.getHours() > 12){
        var hours = scheduledTime.getHours - 12;
        ampm = "pm"
    }
    // Make sure all minutes are 2-digit
    if (scheduledTime.getMinutes() < 10)
        var minutes = "0" + scheduledTime.getMinutes();
    else 
        minutes = scheduledTime.getMinutes();

    // Build the scheduled time as a string.
    scheduledTime = scheduledTime.getHours() + ":" + minutes + " " + ampm;
    // Set it back into the object because it makes the next piece more consistent.
    datum.ScheduledTime = scheduledTime;

    // Lateness is in seconds, let's make that into minutes...
    datum.Lateness = Math.floor(datum.Lateness/60) + " min";

    // Create a table row
    var row = $('<tr>');

    // Create all the table cells
    var originCell = $('<td>');
    var tripCell = $('<td>');
    var destinationCell = $('<td>');
    var scheduledTimeCell = $('<td>');
    var latenessCell = $('<td>');
    var trackCell = $('<td>');
    var statusCell = $('<td>');    

    // Maybe this will work...
    row.append(originCell);
    row.append(tripCell);
    row.append(destinationCell);
    row.append(scheduledTimeCell);
    row.append(latenessCell);
    row.append(trackCell);
    row.append(statusCell);

    // Add each cell to the row
    originCell.html(datum.Origin);
    tripCell.html(datum.Trip);
    destinationCell.html(datum.Destination);
    scheduledTimeCell.html(datum.ScheduledTime);
    latenessCell.html(datum.Lateness);
    trackCell.html(datum.Track);
    statusCell.html(datum.Status);

    $("#departures_board tbody").append(row);
  });

});