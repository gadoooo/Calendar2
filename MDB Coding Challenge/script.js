// Variables
var task = document.getElementById("task");
var start = document.getElementById("start");
var end = document.getElementById("end");
var addButton = document.getElementById("add");
var resetButton = document.getElementById("reset");
var showButton = document.getElementById("show");
var table = document.getElementsByTagName("table")[0];
var calendar = document.getElementById("calendar");
var hours = document.getElementById("hours");
var counter = 0;
var startTimeHours;
var startTimeMinutes;
var endTimeHours;
var endTimeMinutes;
var tasksArray = [];
var timeUnitHeight = 720 / 24 / 30;

// AddButton Function
var addButtonClick = () => {
    if (task.value != "" && start.value != "" && end.value != "") {
        if (Number(end.value > 720) || Number(start.value) >= 720) {
            alert("End Time must be less than or equal 720 and Start Time must be less than 720")
        } else {
            if (Number(end.value) > Number(start.value)) {
                var tableRow = table.insertRow();
                var tableTaskCell = tableRow.insertCell(0);
                var tableStartCell = tableRow.insertCell(1);
                var tableEndCell = tableRow.insertCell(2);
                var tableOpertaions = tableRow.insertCell(3);
                var deleteOperations = document.createElement("button");
                deleteOperations.innerHTML = "Delete";
                tableTaskCell.innerHTML = task.value;
                deleteOperations.setAttribute("id", tableTaskCell.innerHTML);
                deleteOperations.onclick = deleteOperationsClick;
                tableOpertaions.append(deleteOperations);
                startTimeHours = Math.trunc(Number(start.value) / 60) + 9;
                startTimeMinutes = Number(start.value) % 60;
                endTimeHours = Math.trunc(Number(end.value) / 60) + 9;
                endTimeMinutes = Number(end.value) % 60;
                if (startTimeHours > 12) {
                    startTimeHours -= 12;
                }
                if (endTimeHours > 12) {
                    endTimeHours -= 12;
                }
                if (startTimeMinutes == 0) {
                    tableStartCell.innerHTML = `${startTimeHours}:${startTimeMinutes}0`;
                } else {
                    tableStartCell.innerHTML = `${startTimeHours}:${startTimeMinutes}`;
                }
                if (endTimeMinutes == 0) {
                    tableEndCell.innerHTML = `${endTimeHours}:${endTimeMinutes}0`;
                } else {
                    tableEndCell.innerHTML = `${endTimeHours}:${endTimeMinutes}`;
                }
                tableRow.classList.add("tasks");
                tasksArray.push({
                    "id": counter,
                    "label": tableTaskCell.innerHTML,
                    "start": start.value,
                    "end": end.value
                });
                counter++;
            }
            else {
                alert("EndTime must be greater than StartTime");
            }
        }
    } else {
        alert("Please fill input data");
    }
};

// DeleteButton Function
function deleteOperationsClick() {
    let deletedTask = tasksArray.find(dt => dt.label == this.id);
    tasksArray = tasksArray.filter(ta => ta != deletedTask);
    this.parentElement.parentElement.remove();
};

// ResetButton Function
var resetButtonClick = () => {
    var tableRows = document.getElementsByClassName("tasks");
    var tablelength = tableRows.length;
    tasksArray = [];
    for (let index = 0; index < tablelength; index++) {
        tableRows[0].remove();
    }
};

// Function to check Overlaping
function isOverlapping(task1, task2) {
    return Number(task1.start) < Number(task2.end) && Number(task2.start) < Number(task1.end);
}


// Function to group Overlaping
function groupTasks(tasks) {
    const groups = [];

    tasks.forEach(task => {
        let added = false;

        for (const group of groups) {
            if (group.some(t => isOverlapping(t, task))) {
                group.push(task);
                added = true;
                break;
            }
        }

        if (!added) {
            groups.push([task]);
        }
    });
    return groups;
}

// Function to reshape the tasks of calendar in some conditions
function reShaped(group) {
    const groupItem = group[0];
    let detector = 1;
    for (let index = 1; index < group.length; index++) {
        if (Number(group[index].start) >= Number(groupItem.start) && Number(group[index].start) < Number(groupItem.end)) {
            detector++;
        }
    }
    return detector;
}

// Function to shape Calendar
var layOutDay = (tarray) => {
    if (tarray.length > 0) {
        var deletedTasks = document.getElementsByClassName("tasksCreated");
        const deletedTasksSize = deletedTasks.length;
        for (let index = 0; index < deletedTasksSize; index++) {
            deletedTasks[0].remove();
        }
        tarray.sort((a, b) => Number(a.start) - Number(b.start) || Number(a.end) - Number(b.end));
        const groups = groupTasks(tarray);
        groups.forEach(group => {
            const numberOfReShaped = reShaped(group);
            group.forEach((task, index) => {
                const detectP = Number(group[0].end);
                // Create task element
                const taskElement = document.createElement("div");
                const tSide = document.createElement("div");
                const tLabel = document.createElement("div");
                taskElement.className = "tasksCreated";
                taskElement.style.position = "absolute";
                taskElement.style.top = `${Number(task.start) * timeUnitHeight}px`;
                taskElement.style.height = `${(Number(task.end) - Number(task.start)) * timeUnitHeight}px`;
                taskElement.style.width = `calc(${100 / numberOfReShaped}% - 4px)`;
                if (index != 0) {
                    if (Number(task.start) >= detectP) {
                        taskElement.style.left = `calc(${(100 / numberOfReShaped) * 0}% + 2px)`;
                    } else {
                        taskElement.style.left = `calc(${(100 / numberOfReShaped) * index}% + 2px)`;
                    }
                } else {
                    taskElement.style.left = `calc(${(100 / numberOfReShaped) * 0}% + 2px)`;
                }
                tSide.style.backgroundColor = "green";
                tSide.style.width = "5px";
                tSide.style.height = "100%";
                tSide.style.position = "absolute";
                tSide.style.left = "0px";
                tSide.style.top = "0px";
                taskElement.style.color = "green";
                tLabel.innerText = task.label;
                tLabel.style.paddingLeft = "5px";
                tLabel.style.fontSize = "20px";
                tLabel.style.fontWeight = "bold";
                taskElement.appendChild(tSide);
                taskElement.appendChild(tLabel);
                calendar.appendChild(taskElement);
            });
        });
    } else {
        location.reload();
        alert("Please input Events");
    }

};

var loadingPage = () => {
    for (let time = 9; time <= 11; time++) {
        var hour1 = document.createElement("p");
        var hour2 = document.createElement("p");
        var hourSpan = document.createElement("span");
        hour1.innerHTML = `${time}:00`;
        hourSpan.innerHTML = "AM";
        hour2.innerHTML = `${time}:30`;
        hour1.classList.add("time");
        hour2.classList.add("time");
        hour2.classList.add("timesmall");
        hour1.appendChild(hourSpan);
        hours.appendChild(hour1);
        hours.appendChild(hour2);
    }
    var hour1 = document.createElement("p");
    var hour2 = document.createElement("p");
    var hourSpan = document.createElement("span");
    hour1.innerHTML = `12:00`;
    hourSpan.innerHTML = "PM";
    hour2.innerHTML = `12:30`;
    hour1.classList.add("time");
    hour2.classList.add("time");
    hour2.classList.add("timesmall");
    hour1.appendChild(hourSpan);
    hours.appendChild(hour1);
    hours.appendChild(hour2);
    for (let time = 1; time <= 9; time++) {
        var hour1 = document.createElement("p");
        var hourSpan = document.createElement("span");
        hour1.innerHTML = `${time}:00`;
        hourSpan.innerHTML = "PM";
        hour1.classList.add("time");
        if (time != 9) {
            var hour2 = document.createElement("p");
            hour2.innerHTML = `${time}:30`;
            hour2.classList.add("time");
            hour2.classList.add("timesmall");
        }
        hour1.appendChild(hourSpan);
        hours.appendChild(hour1);
        if (time != 9) {
            hours.appendChild(hour2);
        }
    }
};

// Events
addButton.addEventListener("click", addButtonClick);
resetButton.addEventListener("click", resetButtonClick);
showButton.addEventListener("click", () => { layOutDay(tasksArray) });
window.onload = loadingPage;
