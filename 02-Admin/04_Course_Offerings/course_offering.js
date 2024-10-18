//Courses retrive from Local storage
let courses = [];

const GetAllCoursesURL = 'http://localhost:7069/api/Course/Get-All-Courses';
const AddCourseURL = 'http://localhost:7069/api/Course/Add-Course';
const UpdateCourseURL = 'http://localhost:7069/api/Course/Update-Course';
const DeleteCourseURL = 'http://localhost:7069/api/Course/Delete-Course';


//Fetch Students Data from Database
async function GetAllCourses(){
    fetch(GetAllCoursesURL).then((response) => {
        return response.json();
    }).then((data) => {
        courses = data;
        CoursesTable();
        GetLastCourseId();
    })
};
GetAllCourses()

//Add Courses in Database
async function AddCourse(CourseData){
    await fetch(AddCourseURL, {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify(CourseData)
    });
    GetAllCourses();
    CoursesTable();
};

//Update Course Fee
async function UpdateCourseFee(CourseId , NewFee){
    await fetch(`${UpdateCourseURL}/${CourseId}/${NewFee}`, {
        method: "PUT",
        // headers: {
        //     "Content-Type": "application/json"
        // },
    });
    GetAllCourses();
    CoursesTable();
};

// Delete Course From Database
async function DeleteCourse(CourseId){
    await fetch(`${DeleteCourseURL}/${CourseId}`, {
        method: "DELETE"
    });
};

let students = [];
const GetAllStudentsURL = 'http://localhost:7069/api/Student/Get-All-Students';
async function GetAllStudents(){
    //Fetch Students Data from Database
    fetch(GetAllStudentsURL).then((response) => {
        return response.json();
    }).then((data) => {
        students = data;
    })
};
GetAllStudents()


const AddNotificationURL = 'http://localhost:7069/api/Notification/Add-Notification';
// Add Notifications
async function AddNotification(NotificationData){
    await fetch(AddNotificationURL,{
        method:'Post',
        headers: {
            "Content-Type": "application/json"
        },
        body:JSON.stringify(NotificationData)

    })
}

//Site Navebar
const toggle = document.querySelector(".fa-bars")
const toggleClose = document.querySelector(".fa-xmark")
const sideNavebar = document.querySelector(".side-navebar")

toggle.addEventListener("click" ,function(){
    sideNavebar.style.right = "0"
})

toggleClose.addEventListener("click" , function(){
    sideNavebar.style.right = "-60%"
})

function generateCourseID(lastID) {
    let numericPart = parseInt(lastID.slice(1));
    numericPart++;
    let newID = "C" + numericPart.toString().padStart(3, "0");
    return newID;
}

let lastCourseID;
function GetLastCourseId(){
    if(courses.length != 0){
        lastCourseID = courses[courses.length - 1].id
    }else{
        lastCourseID = "C000";
    }    
}

//Form Submit Function
document.getElementById("course-offerings-form").addEventListener('submit',(event) =>{
    event.preventDefault();

    const courseName = document.getElementById("courseName").value.trim();
    const level = document.getElementById("level").value;
    const totalFee = Number(document.getElementById("fee").value.trim());
    let id = generateCourseID(lastCourseID);

    const course = courses.find(c=>c.courseName == courseName && c.level == level)
    if(course){
        UpdateCourseFee(course.id , totalFee)
        document.getElementById('course-offerings-message').innerHTML = "Update Fee Successfully"
    }else{
        const CourseData = {
            id,
            courseName,
            level,
            totalFee
        };
        AddCourse(CourseData);

        students.forEach(s => {
            const NotificationData ={
                nic:s.nic,
                type:"Course",
                sourceId:id,
                date:new Date()
            }
            AddNotification(NotificationData);
        });

        document.getElementById('course-offerings-message').innerHTML = "Added New Course"
    }
    event.target.reset()

    setTimeout(()=>{
        document.getElementById('course-offerings-message').textContent = ""
    }, 2000);

    CoursesTable();
});


//Pop up box For Course details
document.getElementById("view-courses-btn").addEventListener("click" , ()=>{
    document.getElementById("overlay").style.display ="block"
    document.getElementById("popupbox").style.display ="block"
});

document.getElementById("overlay").addEventListener("click" , ()=>{
    document.getElementById("overlay").style.display ="none"
    document.getElementById("popupbox").style.display ="none"
});


//Show Table
function CoursesTable(){
    const table = document.getElementById('table-body-courses');
    table.innerHTML = "";
    courses.forEach((course) => {
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${course.courseName}</td>
            <td>${course.level}</td>
            <td>${course.totalFee}/= </td>
            <td><button class ="action-btn btn2" onclick="removeCourseById(event,'${course.id}')" >Remove</button></td>
        `;
        table.appendChild(row);
    });
}
CoursesTable();

//Remove Course
function removeCourseById(event,courseIdToRemove) {
    
    let indexToRemove = courses.findIndex(obj => obj.id === courseIdToRemove);
    if (indexToRemove !== -1) {
        DeleteCourse(courseIdToRemove)
        document.getElementById('course-offerings-message-2').style.color = "Green";
        document.getElementById('course-offerings-message-2').textContent = "Course Removed Successfully";
        const row = event.target.parentElement.parentElement;
        row.remove();
    } else {
        document.getElementById('course-offerings-message-2').textContent = "Course not found in local storage";
    }

    setTimeout(()=>{
        document.getElementById('course-offerings-message-2').textContent = "";
        }, 2000);
}


//Logout function

function logout() {
    window.location.href = "../01_Admin_Login/admin_login.html";
}

const logoutButton = document.getElementById('logoutButton');
logoutButton.addEventListener('click', function() {
  logout();
});