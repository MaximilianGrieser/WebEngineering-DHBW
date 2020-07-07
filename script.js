let today = new Date();
let todayDate = today.getDate();
let todayMonth = today.getMonth();
let todayYear = today.getFullYear();
let todayDay = today.getDay()

let currentDate = today.getDate();
let currentMonth = today.getMonth();
let currentYear = today.getFullYear();

let openDate = today.getDate();

let selectedId = -1;

let months = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
let options = ["X1", "X2", "X3", "X4"]

let daysGrid = [
    ["X", "X", "X", "X", "X", "X", "X"],
    ["X", "X", "X", "X", "X", "X", "X"],
    ["X", "X", "X", "X", "X", "X", "X"],
    ["X", "X", "X", "X", "X", "X", "X"],
    ["X", "X", "X", "X", "X", "X", "X"],
    ["X", "X", "X", "X", "X", "X", "X"]
]
let appointmentsGrid = [
    ["X", "X", "X", "X", "X", "X", "X"],
    ["X", "X", "X", "X", "X", "X", "X"],
    ["X", "X", "X", "X", "X", "X", "X"],
    ["X", "X", "X", "X", "X", "X", "X"],
    ["X", "X", "X", "X", "X", "X", "X"],
    ["X", "X", "X", "X", "X", "X", "X"]
]

let appointmentsList;

let isNewEntry = true;

window.onload = function () {
    readFromJSON();
    document.getElementById("weekday" + todayDay).classList.add("weekday-today");
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

    clearGrid();

    let date = 1;
    for (let i = 0; i < 6; i++) {
        for (let j = 0; j < 7; j++) {
            //Days in Prev Month
            if ((i === 0 && j < firstDay) || !prevMonthReset) {
                if (prevMonthReset) {
                    prevMonthReset = false;
                    date = startDaysInPrevMonth;
                }
                if (date < daysInPrevMonth) {
                    daysGrid[i][j] = date;
                    document.getElementById("weekday_days_" + (j) + "_row_" + (i)).classList.add("day-not-in-month");
                } else {
                    daysGrid[i][j] = date;
                    document.getElementById("weekday_days_" + (j) + "_row_" + (i)).classList.add("day-not-in-month");
                    date = 0;
                    prevMonthReset = true;
                }
                //Days in Next Month
            } else if ((date > daysInMonth) || !nextMonthReset) {
                if (nextMonthReset) {
                    nextMonthReset = false;
                    date = 1;
                }
                daysGrid[i][j] = date;
                document.getElementById("weekday_days_" + j + "_row_" + i).classList.add("day-not-in-month");
                //Days in Month
            } else {
                daysGrid[i][j] = date;
                if(year === todayYear && month === todayMonth && date === todayDate){
                    document.getElementById("weekday_days_" + j + "_row_" + i).classList.add("day-today");
                }
                let appointmentsAtDayList = appointmentsAtDay(year, month, date);
                if(appointmentsAtDayList.length > 0){
                    appointmentsGrid[i][j] = appointmentsAtDayList;
                }
            }
            date++;
        }
    }
    console.log("DaysGrid:");
    console.log(daysGrid);
    console.log("AppointmentsGrid:");
    console.log(appointmentsGrid);
    printDaysGrid();
}

function printDaysGrid() {
    for (i = 0; i < 6; i++) {
        for (y = 0; y < 7; y++) {
            let currElement = document.getElementById("weekday_days_" + y + "_row_" + i);
            currElement.innerHTML = daysGrid[i][y];
            if(appointmentsGrid[i][y] != "X"){
                currElement.innerHTML += "<br> Termin";
            }
        }
    }
}

function appointmentsAtDay(year, month, date) {
    let filterString = new Date(year, month, date + 1).toISOString().slice(0, 10);
    let appointmentsAtDayList = [];
    appointmentsList.forEach(appointment => {
        if(appointment.start.slice(0, 10).localeCompare(filterString) == 0){
            appointmentsAtDayList.push(appointment);
        }
    });
    return appointmentsAtDayList;
}

function clearGrid() {
    for (i = 0; i < 6; i++) {
        for (y = 0; y < 7; y++) {
            document.getElementById("weekday_days_" + y + "_row_" + i).classList.remove("day-not-in-month");
            document.getElementById("weekday_days_" + y + "_row_" + i).classList.remove("day-today");
            daysGrid[i][y] = "X";
            appointmentsGrid[i][y] = "X";
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

function newEntryBtn() {
    openDate = todayDate;
    isNewEntry = true;
    newEntry();
}

function newEntry() {
    closeListAppointments();

    let today = new Date(currentYear, currentMonth, openDate + 1).toISOString().slice(0, 10);
    document.getElementById("fstartdate").value = today;

    let select = document.getElementById("fcategory");
    options.forEach(option => {
        newOption = document.createElement("option");
        newOption.text = option;
        select.add(newOption);
    });

    let doc = document.getElementById("table-select-td");
    while(doc.children.length > 2){
        doc.removeChild(doc.childNodes[0]);
    }

    document.getElementById("screen").classList.add("blur");
    document.getElementById("screen").disabled = true;
    document.getElementById("new-entry-form").style.display = "block";
}

function hideDateEnd() {
    let objekt = document.getElementById("endDate").classList;
    if (objekt.contains("blur")) {
        objekt.remove("blur")
    } else {
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
    selectedId = -1;
    let listAppointment = document.getElementById("appointments-at-day");
    if (listAppointment.style.display === "block") {
        listAppointment.style.display = "none";
        document.getElementById("screen").classList.remove("blur");
    }
}

function listAppointments(row, cell) {
    closeNewEntry();
    document.getElementById("screen").classList.add("blur");
    document.getElementById("appointments-at-day").style.display = "block";

    document.getElementById("appointments-at-day-text").innerHTML = "Appointments at " + months[currentMonth] + " " + daysGrid[row][cell] + " " + currentYear + ":"
    openDate = daysGrid[row][cell];

    let list = document.getElementById("appointments-at-day-content");
    while(list.firstChild){
        list.removeChild(list.firstChild);
    }

    if(appointmentsGrid[row][cell] != "X") {
        appointmentsGrid[row][cell].sort((a, b) => parseInt(a.start.slice(11)) - parseInt(b.start.slice(11)));
        let idx = 0;
        appointmentsGrid[row][cell].forEach(appointment => {
            let text = appointment.start.slice(11) + " : " + appointment.title;
            let item = document.createElement("div");
            item.innerHTML = text;
            item.classList.add("appointments-at-day-content-entry");
            item.id = "appointments-at-day-content-entry-"+idx;
            list.appendChild(item);
            idx++;
        })

        $(".appointments-at-day-content-entry").on("click", function() {
            $(".appointments-at-day-content>div.selected").removeClass("selected");
            this.classList.add("selected");
            selectedId = parseInt(this.id.slice(34, 35));
        });

        $(".bi-pencil-square").on("click", function(){
            if(selectedId == -1){
                alert("Bitte wähle einen Termin aus!!!!!! Dummkopf")
            }else {
                isNewEntry = false;
                document.getElementById("ftitle").value = appointmentsGrid[row][cell][selectedId].title;
                document.getElementById("fganztag").value = appointmentsGrid[row][cell][selectedId].allday;
                document.getElementById("fstarttime").value = appointmentsGrid[row][cell][selectedId].start.slice(11);
                document.getElementById("fsummary").value = appointmentsGrid[row][cell][selectedId].extra;
                document.getElementById("flocation").value = appointmentsGrid[row][cell][selectedId].location;
                if(!appointmentsGrid[row][cell][selectedId].allday){
                    document.getElementById("fenddate").value = appointmentsGrid[row][cell][selectedId].end.slice(0, 10);
                    document.getElementById("fendtime").value = appointmentsGrid[row][cell][selectedId].end.slice(11);
                }
                newEntry();
            }
        });

        $(".bi-dash-square").on("click", function(){
            if(selectedId == -1){
                alert("Bitte wähle einen Termin aus!!!!!! Dummkopf");
            }else {
                if (confirm('Sicher löschen ?')) {
                    let request = new XMLHttpRequest();

                    request.onreadystatechange = function () {
                        if (this.readyState == 204){
                            alert("Erfolgreich gelöscht");
                        }
                    }

                    request.open("DELETE", "http://dhbw.radicalsimplicity.com/calendar/test/events/" + appointmentsGrid[row][cell][selectedId].id, false);
                    request.send();

                    readFromJSON();
                    showCalendar(currentMonth, currentYear);
                    listAppointments(row, cell);
                }
            }
        });
    }
}

function readFromJSON() {
    let request = new XMLHttpRequest();

    request.onreadystatechange = function () {
        if (this.readyState == 4 && this.status == 200) {
            appointmentsList = JSON.parse(this.responseText);
            console.log("Read Apponitmens:");
            console.log(appointmentsList);
        }
    }

    request.open("GET", "http://dhbw.radicalsimplicity.com/calendar/test/events", false);
    request.send();
}

function addMoreCategorys() {
    let doc = document.getElementById("table-select-td");
    let newSelect = document.createElement("select");
    options.forEach(option => {
        newOption = document.createElement("option")
        newOption.text = option;
        newSelect.add(newOption);
    });
    newSelect.id = "fcategory";
    newSelect.classList.add("fcategory");
    doc.insertBefore(newSelect, doc.children[doc.childElementCount - 1]);
}

function submitEntry(){
    if (isNewEntry){
        console.log("new");        
        let request = new XMLHttpRequest();

        let entry = {
            title: "Christmas Feast",
            location: "Stuttgart",
            organizer: "dhbw@radicalsimplicity.com",
            start: "2020-07-25T18:00",
            end: "2020-07-25T23:30",
            status: "Busy",
            allday: false,
            webpage: "http://www.radicalsimplicity.com/",
            categories: [],
            extra: null
        }
        
        //TODO
        request.open("POST", "http://dhbw.radicalsimplicity.com/calender/test/events", true);
        //request.setRequestHeader("Content-Type", "application/json; charset=utf-8");
        request.send(JSON.stringify(entry));
        console.log(JSON.stringify(entry));
    }
    else{
        console.log("update");
        let request = new XMLHttpRequest();

        let entry = {
            title: document.getElementById("ftitle").value,
            location: document.getElementById("flocation").value,
            organizer: "dhbw@radicalsimplicity.com",
            start: document.getElementById("fstartdate").value.slice(0, 10) + "T" +
            document.getElementById("fstarttime").value.slice(11),
            end: document.getElementById("fenddate").value.slice(0, 10) + "T" +
            document.getElementById("fendtime").value.slice(11),
            status: "Busy",
            allday: document.getElementById("fganztag").value,
            webpage: "http://www.radicalsimplicity.com/",
            categories: [],
            extra: document.getElementById("fsummary").value
        }
        
        //TODO
        request.open("PUT", "http://dhbw.radicalsimplicity.com/calender/test/events/" + appointmentsGrid[row][cell][selectedId].id, true);
        request.send(JSON.stringify(entry));
        console.log(JSON.stringify(entry));
    }
}

window.onkeydown = function (event) {
    if (event.keyCode === 27) {
        closeNewEntry();
        closeListAppointments();
    }
};