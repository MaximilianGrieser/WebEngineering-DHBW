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
let selectedRow = -1;
let selectedCell = -1;

let months = ["JANNUARY", "FEBRUARY", "MARCH", "APRIL", "MAY", "JUNE", "JULY", "AUGUST", "SEPTEMBER", "OCTOBER", "NOVEMBER", "DECEMBER"];
let options = [];

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
    loadCategorysFromDataBase();
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
                let entrys = 0;
                appointmentsGrid[i][y].forEach(appointment => {
                    if(entrys <= 3){
                        currElement.innerHTML += "<br>" + appointment.title.substr(0,12) ;
                        entrys++;
                    }
                })
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

    blurScreenAndButton();
    document.getElementById("screen").disabled = true;
    document.getElementById("new-entry-form").style.display = "block";
}

function hideDateEnd() {
    let objekt_text = document.getElementById("endDate-text").classList;
    let objekt_date = document.getElementById("endDate-date").classList;
    let objekt_time = document.getElementById("endDate-time").classList;
    if (objekt_text.contains("blur")) {
        objekt_text.remove("blur")
        objekt_date.remove("blur")
        objekt_time.remove("blur")
    } else {
        objekt_text.add("blur")
        objekt_date.add("blur")
        objekt_time.add("blur")
    }
}

function closeNewEntry() {
    let newEntry = document.getElementById("new-entry-form");
    if (newEntry.style.display === "block") {
        newEntry.style.display = "none";
        removeBlurScreenAndButton();
    }
}

function closeListAppointments() {
    let listAppointment = document.getElementById("appointments-at-day");
    if (listAppointment.style.display === "block") {
        listAppointment.style.display = "none";
        removeBlurScreenAndButton();
    }
}

function blurScreenAndButton(){
    document.getElementById("screen").classList.add("blur");
    document.getElementById("add-callender-entry").classList.add("blur");
}

function removeBlurScreenAndButton(){
    document.getElementById("screen").classList.remove("blur");
    document.getElementById("add-callender-entry").classList.remove("blur");
}

function listAppointments(row, cell) {
    selectedRow = row;
    selectedCell = cell;
    closeNewEntry();
    blurScreenAndButton();
    document.getElementById("appointments-at-day").style.display = "block";

    document.getElementById("appointments-at-day-text").innerHTML = "APPOINTMENTS AT " + months[currentMonth] + " " + daysGrid[row][cell] + " " + currentYear + ":"
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

                    request.open("DELETE", "http://dhbw.radicalsimplicity.com/calendar/2319319/events/" + appointmentsGrid[row][cell][selectedId].id, false);
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

    request.open("GET", "http://dhbw.radicalsimplicity.com/calendar/2319319/events", false);
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
    let entry = {
        title: document.getElementById("ftitle").value,
        location: document.getElementById("flocation").value,
        organizer: "dhbw@radicalsimplicity.com",
        start: document.getElementById("fstartdate").value.slice(0, 10) + "T" + document.getElementById("fstarttime").value.slice(0,5),
        end: document.getElementById("fenddate").value.slice(0, 10) + "T" + document.getElementById("fendtime").value.slice(0,5),
        status: "Busy",
        allday: false,
        webpage: "http://www.radicalsimplicity.com/",
        imageurl: null,
        categories: [],
        extra: document.getElementById("fsummary").value
    }

    let request = new XMLHttpRequest();

    if (isNewEntry){    
        request.open("POST", "http://dhbw.radicalsimplicity.com/calendar/2319319/events", true);
    }
    else{
        console.log(selectedRow, selectedCell, selectedId);
        console.log(appointmentsGrid[selectedRow][selectedCell][selectedId].id);
        request.open("PUT", "http://dhbw.radicalsimplicity.com/calender/2319319/events/" + appointmentsGrid[selectedRow][selectedCell][selectedId].id, true);
    }
    
    request.send(JSON.stringify(entry));
    console.log(JSON.stringify(entry));
}

function getImageURL(){
    var file = document.querySelector('input[type=file]')['files'][0];
    var FR = new FileReader();
    FR.addEventListener("load", function(e) {
        return e.target.result;
    });
    FR.readAsDataURL(file);
}

function loadCategorysFromDataBase() {
    let request = new XMLHttpRequest();

    request.onreadystatechange = function () {
        if (this.readyState == 4 && this.status == 200) {
            let categories = JSON.parse(this.responseText);
            console.log("Read Categories");
            console.log(categories);
            categories.forEach(categorie => {
                options.push(categorie.name)
            })
        }
    }

    request.open("GET", "http://dhbw.radicalsimplicity.com/calendar/2319319/categories", true);
    request.send();
}

function addCategoryToDataBase(data) {
    let categorie = {
        name: data
    }

    let request = new XMLHttpRequest();
    request.open("POST", "http://dhbw.radicalsimplicity.com/calendar/2319319/categories", true);
    request.send(JSON.stringify(categorie));
}

window.onkeydown = function (event) {
    if (event.keyCode === 27) {
        closeNewEntry();
        closeListAppointments();
    }
};