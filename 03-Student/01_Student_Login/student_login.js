let students  = [];
const GetAllStudentsURL = 'https://localhost:7069/api/Student/Get-All-Students';
async function GetAllStudents(){
    //Fetch Students Data from Database
    fetch(GetAllStudentsURL).then((response) => {
        if (!response.ok) {
            throw new Error('Network response was not ok ' + response.statusText);
        }
        return response.json();
    }).then((data) => {
        students = data;
    }).catch(error => {
        console.error('There was a problem with the fetch operation:', error);
    });
};
GetAllStudents()

let courseEnrollData = [];
const GetAllCourseEnrollURL = 'https://localhost:7069/api/CourseEnroll/Get-All-Enroll-Data';
async function GetAllCourseEnrollData(){
    //Fetch Students Data from Database
    fetch(GetAllCourseEnrollURL).then((response) => {
        if (!response.ok) {
            throw new Error('Network response was not ok ' + response.statusText);
        }
        return response.json();
    }).then((data) => {
        courseEnrollData = data;
    }).catch(error => {
        console.error('There was a problem with the fetch operation:', error);
    });
};
GetAllCourseEnrollData()


function encryption(password){
    return btoa(password)
}

document.getElementById('login-form').addEventListener('submit' , (event)=>{
    event.preventDefault();

    const Nic = document.getElementById("nic-input").value.trim();
    const Password = encryption(document.getElementById("password-input").value.trim());

    const student = students.find(s => s.nic == Nic && s.password == Password)

    if(student){
        if(student.courseEnrollId == null){
            window.location.href = "../02_Student_Course_Selection/student_course_selection.html"
        }else if(student.courseEnrollId != null){
            const SelectedCourse = courseEnrollData.find(c => c.id == student.courseEnrollId);
            if(SelectedCourse.status == "InActive" || SelectedCourse == null){
                 window.location.href = "../02_Student_Course_Selection/student_course_selection.html"
            }
            else{
                window.location.href = "../03_Student_Dashboard/student_dashboard.html"
            }
        }
        
    }else{
        document.getElementById('login-message').textContent = "Invalid Nic Number or Password"
    }

    sessionStorage.setItem("NIC",JSON.stringify(Nic))

    event.target.reset();
})

