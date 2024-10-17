//Courses retrive from Local storage
let courses = [];

const GetAllCoursesURL = 'http://localhost:5251/api/Course/Get-All-Courses';
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
    lastCourseID = newID
    return newID;
}


let lastCourseID;
if(courses.length != 0){
    lastCourseID = courses[courses.length - 1].id
}else{
    lastCourseID = "C000";
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
        course.totalFee = totalFee;
        localStorage.setItem('Courses', JSON.stringify(courses));
        document.getElementById('course-offerings-message').innerHTML = "Update Fee Successfully"
    }else{
        const CourseData = {
            id,
            courseName,
            level,
            totalFee
        };
        
        courses.push(CourseData);
        localStorage.setItem('Courses', JSON.stringify(courses));

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
        courses.splice(indexToRemove , 1)
        localStorage.setItem('Courses', JSON.stringify(courses));
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