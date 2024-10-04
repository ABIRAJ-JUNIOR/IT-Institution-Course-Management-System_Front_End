const nic = JSON.parse(sessionStorage.getItem('NIC'));

let students  = JSON.parse(localStorage.getItem('Students')) || [];
let courses = JSON.parse(localStorage.getItem('Courses')) || [];
let courseEnrollData = JSON.parse(localStorage.getItem('CourseEnrollDetails')) || [];

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
DuplicateCourseRemove();

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


//submit form
document.getElementById("course-form").addEventListener('submit',(event)=>{
    event.preventDefault()

    //Get form values
    const nic = document.getElementById("nic").value; 
    const course = document.getElementById("select-course").value; 
    const ProficiencyLevels = document.getElementById("proficiency-levels").value; 
    const duration = document.getElementById("select-duration").value;
    const courseEnrollDate = new Date();
    let id = Number(Math.floor(Math.random()*1000000))

    //Find the Student 
    const student = students.find(s => s.nic == nic);
    const cors = courses.find(c => c.courseName == course && c.level == ProficiencyLevels)

    if(student){
        if(cors){
  
            student.courseEnrollId = id;

            const CourseEnrollData = {
                id,
                nic,
                courseId:cors.id,
                duration,
                installmentId:0,
                fullPaymentId:0,
                courseEnrollDate,
                status:"Pending"
            }

            courseEnrollData.push(CourseEnrollData);
            localStorage.setItem('CourseEnrollDetails' , JSON.stringify(courseEnrollData));
            localStorage.setItem('Students' , JSON.stringify(students));
            

            document.getElementById('message').style.color = "green"
            document.getElementById('message').textContent = "Course Successfuly selected"

            window.location.href = "../03_Student_Dashboard/student_dashboard.html"
            
        }else{
            document.getElementById('message').style.color = "red";
            document.getElementById('message').textContent = `Course Not Available..`;
        }
        
    }
    sessionStorage.setItem("NIC",JSON.stringify(nic))
})

