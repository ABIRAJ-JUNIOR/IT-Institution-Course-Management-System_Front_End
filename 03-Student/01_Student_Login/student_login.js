let students  = JSON.parse(localStorage.getItem('Students')) || [];
let courseEnrollData = JSON.parse(localStorage.getItem('CourseEnrollDetails')) || [];


function encryption(password){
    return btoa(password)
}

document.getElementById('login-form').addEventListener('submit' , (event)=>{
    event.preventDefault();

    const Nic = document.getElementById("nic-input").value.trim();
    const Password = encryption(document.getElementById("password-input").value.trim());

    const student = students.find(s => s.nic == Nic && s.password == Password)

    if(student){
        if(student.courseEnrollId == 0){
            window.location.href = "../02_Student_Course_Selection/student_course_selection.html"
        }else if(student.courseEnrollId != 0){
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

