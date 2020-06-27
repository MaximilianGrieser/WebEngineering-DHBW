src="jquery-3.1.1.min.js"

let today = new Date();
let currentMonth = today.getMonth();
let currentYear = today.getFullYear();

let months = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];

let daysGrid = [
    ["X","X","X","X","X","X","X"],
    ["X","X","X","X","X","X","X"],
    ["X","X","X","X","X","X","X"],
    ["X","X","X","X","X","X","X"],
    ["X","X","X","X","X","X","X"],
    ["X","X","X","X","X","X","X"]
]

window.onload = function() {
    showCalendar(currentMonth, currentYear);
}

function showCalendar(month, year) {
    let firstDay = ((new Date(year, month)).getDay());
    let daysInMonth = 32 - new Date(year, month, 32).getDate();
    let daysInPrevMonth = 32 - new Date(year, month - 1, 32).getDate();
    let startDaysInPrevMonth = (32 - new Date(year, month - 1, 32).getDate()) - (firstDay - 1);
    let nextMonthReset = true;
    let prevMonthReset = true;
    
    document.getElementById("currMonth").innerHTML = months[month] + " " + year;

    removeMonthSpecificClasses();

    let date = 1;
    for(let i = 0; i < 6; i++) {
        for(let j = 0; j < 7; j++) {
            //Days in Prev Month
            if((i === 0 && j < firstDay) || !prevMonthReset) {
                if(prevMonthReset) {
                    prevMonthReset = false;
                    date = startDaysInPrevMonth;
                }
                if(date < daysInPrevMonth) {
                    daysGrid[i][j] = date;
                    document.getElementById("weekday_days_" + (j) + "_row_" +(i)).classList.add("day-not-in-month");
                }else {
                    daysGrid[i][j] = date;
                    document.getElementById("weekday_days_" + (j) + "_row_" +(i)).classList.add("day-not-in-month");
                    date = 0;
                    prevMonthReset = true;
                }
                //Days in Next Month
            } else if((date > daysInMonth) || !nextMonthReset ) {
                if(nextMonthReset) {
                    nextMonthReset = false;
                    date = 1;
                }
                daysGrid[i][j] = date;
                document.getElementById("weekday_days_" + j + "_row_" + i).classList.add("day-not-in-month");
            //Days in Month
            } else {
                daysGrid[i][j] = date;
            }
            date++;
        } 
    }
    console.log(daysGrid);
    printDaysGrid();
}

function printDaysGrid() {
    for(i = 0; i < 6; i++) {
        for(y = 0; y < 7; y++) {
            document.getElementById("weekday_days_" + y + "_row_" + i).innerHTML = daysGrid[i][y];
        }
    }
}

function removeMonthSpecificClasses() {
    for(i = 0; i < 6; i++) {
        for(y = 0; y < 7; y++) {
            document.getElementById("weekday_days_" + y + "_row_" + i).classList.remove("day-not-in-month");
            document.getElementById("weekday_days_" + y + "_row_" + i).classList.remove("day-today");
        }
    }
}

function nextMonth() {
    currentYear = (currentMonth === 11) ? currentYear + 1 : currentYear;
    currentMonth = (currentMonth + 1) % 12;
    showCalendar(currentMonth, currentYear);
}

function prevMonth() {
    currentYear = (currentMonth === 0) ? currentYear - 1 : currentYear;
    currentMonth = (currentMonth === 0) ? 11 : currentMonth - 1;
    showCalendar(currentMonth, currentYear);
}

function newEntry() {
    document.getElementById("screen").classList.add("blur");
    document.getElementById("screen").disabled = true;
    document.getElementById("new-entry-form").style.display = "block";
}

function hideDateEnd() {
    let objekt = document.getElementById("endDate").classList;
    if(objekt.contains("blur")) {
        objekt.remove("blur")
    }else{
        objekt.add("blur")
    }
}

function closeNewEntry() {
    let newEntry = document.getElementById("new-entry-form");
    if (newEntry.style.display === "block") {
        newEntry.style.display = "none";
        document.getElementById("screen").classList.remove("blur");
    }
}

function closeListAppointments() {
    let listAppointment = document.getElementById("appointments-at-day");
    if (listAppointment.style.display === "block") {
        listAppointment.style.display = "none";
        document.getElementById("screen").classList.remove("blur");
    }
}

function listAppointments(row, cell) {
    document.getElementById("screen").classList.add("blur");
    document.getElementById("appointments-at-day").style.display = "block";

    document.getElementById("appointments-at-day-text").innerHTML = "Appointments at "+ months[currentMonth] + " " + daysGrid[row][cell] + " " + currentYear + ":"
}

function deleteEntry() {
    console.log("Löschen");
}

document.querySelector('form.newEntry').addEventListener('submit', function (e) {
    let entryForm = document.getElementById("newEntry");
    let entryFormData = new FormData(entryForm);

    let Entry = {};
    entryFormData.forEach(function(value, key){
        Entry[key] = value;
    });

    console.log(JSON.stringify(Entry));
});

document.querySelector('ul').addEventListener('click', function(e) {   // 1.
    let selected;

    if(e.target.tagName === 'LI') {                                      // 2.
        selected= document.querySelector('li.selected');                   // 2a.
        if(selected) selected.className= '';                               // "
        e.target.className= 'selected';                                    // 2b.
    }
});

window.onkeydown = function( event ) {
    if ( event.keyCode === 27 ) {
        closeNewEntry();
        closeListAppointments();
    }
};