const nic = JSON.parse(sessionStorage.getItem('NIC'));

const mainURL = 'http://localhost:5091'

let students  = [];
const GetAllStudentsURL = mainURL + '/api/Student/Get-All-Students';
//Fetch Students Data from Database
async function GetAllStudents(){
    fetch(GetAllStudentsURL).then((response) => {
        if (!response.ok) {
            throw new Error('Network response was not ok ' + response.statusText);
        }
        return response.json();
    }).then((data) => {
        students = data;
        StudentNameShow();
    }).catch(error => {
        console.error('There was a problem with the fetch operation:', error);
    });
};
GetAllStudents()


let courses = [];
const GetAllCoursesURL = mainURL + '/api/Course/Get-All-Courses';
//Fetch Students Data from Database
async function GetAllCourses(){
    fetch(GetAllCoursesURL).then((response) => {
        if (!response.ok) {
            throw new Error('Network response was not ok ' + response.statusText);
        }
        return response.json();
    }).then((data) => {
        courses = data;
        DuplicateCourseRemove();

    }).catch(error => {
        console.error('There was a problem with the fetch operation:', error);
    });
};
GetAllCourses()


let courseEnrollData = [];
const GetAllCourseEnrollURL = mainURL + '/api/CourseEnroll/Get-All-Enroll-Data';
//Fetch CourseEnrollData Data from Database
async function GetAllCourseEnrollData(){
    fetch(GetAllCourseEnrollURL).then((response) => {
        if (!response.ok) {
            throw new Error('Network response was not ok ' + response.statusText);
        }
        return response.json();
    }).then((data) => {
        courseEnrollData = data;
        GetLastCourseEnrollId();
    }).catch(error => {
        console.error('There was a problem with the fetch operation:', error);
    });
};
GetAllCourseEnrollData()


// Update CourseEnrollId in Student Table in Database
const UpdateCourseEnrollIdURL = mainURL + '/api/Student/Update-CourseEnroll-Id';
async function UpdateCourseEnrollId(StudentNic , CourseEnrollId){
    await fetch(`${UpdateCourseEnrollIdURL}/${StudentNic}/${CourseEnrollId}`, {
        method: "PUT",
        headers: {
            "Content-Type": "application/json"
        },
    }).catch(error => {
        console.error('There was a problem with the fetch operation:', error);
    });
};


const AddCourseEnrollDataURL = mainURL + '/api/CourseEnroll/Add-Course-Enroll-Detail';
//Add CourseEnrollData in Database
async function AddCourseEnrollData(CourseEnrollData){
    await fetch(AddCourseEnrollDataURL, {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify(CourseEnrollData)
    }).catch(error => {
        console.error('There was a problem with the fetch operation:', error);
    });
};




// Remove Duplicates courses from Local Storage
let uniqueCourses = [];
async function DuplicateCourseRemove(){
    for (let i = 0; i < courses.length; i++) {

            let course = courses[i].courseName;
            if (!uniqueCourses.includes(course)) {
                uniqueCourses.push(course);
            }
        
    }
    CourseDropDown(uniqueCourses);
}

function CourseDropDown(){
    uniqueCourses.forEach(C => {
        const courseDropDown = document.createElement("option")
        courseDropDown.value = C
        courseDropDown.textContent = C
        document.getElementById("select-course").appendChild(courseDropDown)
    })
}


// Auto fill NIC in input field
if(nic){
    document.getElementById("nic").value = nic
}

function StudentNameShow(){
    const student = students.find(s => s.nic == nic);  
    if(student){
        document.getElementById('message').style.color = "green";
        document.getElementById('message').textContent = `${student.fullName}`;
    }
}

//disabled nic input 
document.getElementById("nic").disabled = true

// Generate Enroll ID
function generateCourseEnrollID(lastID) {
    let numericPart = parseInt(lastID.slice(1));
    numericPart++;
    let newID = "E" + numericPart.toString().padStart(3, "0");
    return newID;
}

let lastCourseEnrollID;
function GetLastCourseEnrollId(){
    if(courseEnrollData.length != 0){
        lastCourseEnrollID = courseEnrollData[courseEnrollData.length - 1].id
    }else{
        lastCourseEnrollID = "E000";
    }    
}

//submit form
document.getElementById("course-form").addEventListener('submit',(event)=>{
    event.preventDefault()

    //Get form values
    const nic = document.getElementById("nic").value; 
    const course = document.getElementById("select-course").value; 
    const ProficiencyLevels = document.getElementById("proficiency-levels").value; 
    const duration = document.getElementById("select-duration").value;
    const courseEnrollDate = new Date();
    let id = generateCourseEnrollID(lastCourseEnrollID);

    //Find the Student 
    const student = students.find(s => s.nic == nic);
    const cors = courses.find(c => c.courseName == course && c.level == ProficiencyLevels)

    if(student){
        if(cors){
            const CourseEnrollData = {
                id,
                nic,
                courseId:cors.id,
                duration,
                courseEnrollDate,
                status:"Pending"
            }

            AddCourseEnrollData(CourseEnrollData)
            UpdateCourseEnrollId(student.nic , id);

            document.getElementById('message').style.color = "green"
            document.getElementById('message').textContent = "Course Successfuly selected"

            setTimeout(()=>{
                window.location.href = "../03_Student_Dashboard/student_dashboard.html"
            }, 500);

            
        }else{
            document.getElementById('message').style.color = "red";
            document.getElementById('message').textContent = `Course Not Available..`;
        }
        
    }
    sessionStorage.setItem("NIC",JSON.stringify(nic))
})

