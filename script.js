src="jquery-3.1.1.min.js"

var months = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
var maxDaysInMonth = [31, 29, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];
var weekdays = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];

var firstDayInNextMonth = 0;
var firstDayInMonth = 5;

var today = new Date();
var selectedMonthIndex = today.getMonth();
var todayDate = today.getDate();
var todayDay = today.getDay();

var daysGrid = [
    ["X","X","X","X","X","X","X"],
    ["X","X","X","X","X","X","X"],
    ["X","X","X","X","X","X","X"],
    ["X","X","X","X","X","X","X"],
    ["X","X","X","X","X","X","X"],
    ["X","X","X","X","X","X","X"]
]

window.onload = function() {
    document.getElementById("currMonth").innerHTML = months[selectedMonthIndex];
    document.getElementById("weekday" + todayDay).classList.add("weekday-today");

    if(todayDay === 0){
        todayDay = 7;
    }

    var todayRow = getActualRow(todayDate, todayDay);
    todayElement = document.getElementById("weekday_days_" + (todayDay - 1)+ "_row_" + (todayRow - 1));
    todayElement.classList.add("day-today");

    fillDaysGrid(todayRow, todayDay, todayDate);
}

function getActualRow(date, weekday) {
    var row = Math.floor(date / 7);
    if (weekday !== 7) {
        row++;
    }
    return row;
}

function getFirstDay(y) {
    help = maxDaysInMonth[selectedMonthIndex - 1] % 7;
    help = (y + 1) - help;

    switch (help) {
        case 0:
            firstDayInMonth = 7;
            break;
        case -1:
            firstDayInMonth = 6;
            break;
        case -2:
            firstDayInMonth = 5;
            break;
        case -3:
            firstDayInMonth = 4;
            break;
        default:
            firstDayInMonth = help;
            break;
    }
}

function fillDaysGrid(pRow, pDay, pDate) {
    
    var currentRow = pRow;
    var currentDay = pDay -1;
    var currentDate = pDate;
    var notInMonth = false
    
    console.log(pRow,pDay,pDate);
    daysGrid[pRow -1][pDay -1] = pDate;

    if(currentDay === 0){
        getFirstDay(1);
    }

    for(i = currentRow; i >= 1; i--){
        for(y = currentDay; y >= 1; y--){
            currentDate--;
            if(currentDate < 1){
                if (selectedMonthIndex === 0){
                    selectedMonthIndex = 12;
                }
                getFirstDay(y);
                console.log(firstDayInMonth);
                currentDate = maxDaysInMonth[selectedMonthIndex -1];
                notInMonth = true;
            }
            if(notInMonth){
                document.getElementById("weekday_days_" + (y -1) + "_row_" + (i -1)).classList.add("day-not-in-month");
            }
            daysGrid[i -1][y -1] = currentDate;
        }
        currentDay = 7;
    }

    currentRow = pRow;
    currentDay = pDay +1;
    currentDate = pDate;
    notInMonth = false;

    for(i = currentRow; i < 7; i++){
        for(y = currentDay; y <= 7; y++){
            currentDate++;
            if(currentDate > maxDaysInMonth[selectedMonthIndex]){
                firstDayInNextMonth = y;
                currentDate = 1;
                notInMonth = true;
            }
            if(notInMonth){
                document.getElementById("weekday_days_" + (y -1) + "_row_" +(i -1)).classList.add("day-not-in-month");
            }
            daysGrid[i -1][y -1] = currentDate;
        }
        currentDay = 1;
    }
    console.log(daysGrid);

    printDaysGrid();
}

function removeMonthSpecificClasses() {
    for(i = 0; i < 6; i++) {
        for(y = 0; y < 7; y++) {
            document.getElementById("weekday_days_" + y + "_row_" + i).classList.remove("day-not-in-month");
            document.getElementById("weekday_days_" + y + "_row_" + i).classList.remove("day-today");
        }
    }
}

function printDaysGrid() {
    for(i = 0; i < 6; i++) {
        for(y = 0; y < 7; y++) {
            document.getElementById("weekday_days_" + y + "_row_" + i).innerHTML = daysGrid[i][y];
        }
    }
}

function nextMonth() {
    selectedMonthIndex++;
    if(selectedMonthIndex > 11) {
        selectedMonthIndex = 0
    }
    document.getElementById("currMonth").innerHTML = months[selectedMonthIndex];

    removeMonthSpecificClasses();
    fillDaysGrid(1, firstDayInNextMonth, 1);
}

function prevMonth() {
    selectedMonthIndex--;
    if(selectedMonthIndex < 0) {
        selectedMonthIndex = 11
    }
    document.getElementById("currMonth").innerHTML = months[selectedMonthIndex];

    removeMonthSpecificClasses();
    fillDaysGrid(1, firstDayInMonth , 1);
}

function newEntry() {
    document.getElementById("screen").classList.add("blur");
    document.getElementById("new-entry-form").style.display = "block";
}

function hideDateEnd() {
    var objekt = document.getElementById("endDate").classList;
    if(objekt.contains("blur")) {
        objekt.remove("blur")
    }else{
        objekt.add("blur")
    }
}

document.querySelector('form.newEntry').addEventListener('submit', function (e) {
    var entryForm = document.getElementById("newEntry");
    var entryFormData = new FormData(entryForm);

    var Entry = {};
    entryFormData.forEach(function(value, key){
        Entry[key] = value;
    });

    console.log(JSON.stringify(Entry));
});