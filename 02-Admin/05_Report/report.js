// Side NaveBar
const toggle = document.querySelector(".fa-bars");
const toggleClose = document.querySelector(".fa-xmark");
const sideNavebar = document.querySelector(".side-navebar");

toggle.addEventListener("click" ,function(){
    sideNavebar.style.right = "0";
})

toggleClose.addEventListener("click" , function(){
    sideNavebar.style.right = "-60%";
})

let students  = JSON.parse(localStorage.getItem('Students')) || [];
let courses = JSON.parse(localStorage.getItem('Courses')) || [];
let courseEnrollData = JSON.parse(localStorage.getItem('CourseEnrollDetails')) || [];
let InstallmentDetails  = JSON.parse(localStorage.getItem('InstallmentDetails')) || [];
let FullpaymentDetails  = JSON.parse(localStorage.getItem('FullPaymentDetails')) || [];


document.addEventListener("DOMContentLoaded",()=>{
    document.getElementById("report-generate-btn").addEventListener("click",()=>{
        const nic = document.getElementById("search-by-nic").value.trim();
        const student = students.find((student)=>student.nic == nic);
        let CourseEnrollDetails;
        let coursedetails;
        let installment;
        let fullPayment;

        
        if(student){
            if(student.courseEnrollId != 0){
                CourseEnrollDetails = courseEnrollData.find(c => c.id == student.courseEnrollId)
                coursedetails = courses.find(c => c.courseID == CourseEnrollDetails.courseID)
    
                if(CourseEnrollDetails.installmentId != 0){
                    installment = InstallmentDetails.find(i => i.id == CourseEnrollDetails.installmentId);
                    console.log(installment)
                }
                if(CourseEnrollDetails.fullPaymentId != 0){
                    fullPayment = FullpaymentDetails.find(f => f.id == CourseEnrollDetails.fullPaymentId)
                }
                
                if(CourseEnrollDetails.fullPaymentId != 0){
                    ShowFullPaymentStudentDetails(student , coursedetails , CourseEnrollDetails ,fullPayment);
                }else if(CourseEnrollDetails.installmentId != 0){
                    ShowInstallmentStudentDetails(student,installment,CourseEnrollDetails,coursedetails);
                }else if(CourseEnrollDetails.status == "Pending"){
                    StudentWhoDidntPay(student , coursedetails ,CourseEnrollDetails);
                }
            }else{
                if(student.courseEnrollId == 0 || CourseEnrollDetails.status == "InActive"){
                    StudentWhoDidntSelectACourse(student);
                }
            }
            
        }else{
            alert("Student not found");
        }
    });
    

    function StudentWhoDidntSelectACourse(student){
        //Personal Details
        document.getElementById('nic').value = student.nic;
        document.getElementById('name').value = student.fullName;
        document.getElementById("email").value = student.email;
        document.getElementById('phone').value = student.phone;
    
        //Hide Course Details and Payment Details
        document.getElementById("course-details").style.visibility = "hidden"
        document.getElementById("payment-details").style.visibility = "hidden"
        document.getElementById('full-payment-row').style.visibility = "hidden";
        
        document.getElementById('installments-row').style.visibility = "hidden";
        document.getElementById('installment-amount-row').style.visibility = "hidden";
        document.getElementById('payment-paid-row').style.visibility = "hidden";
        document.getElementById('payment-due-row').style.visibility = "hidden";
        document.getElementById('payment-date-row').style.visibility = "hidden";
    }
    
    function StudentWhoDidntPay(student , coursedetails ,CourseEnrollDetails){
        //Personal Details
        document.getElementById('nic').value = student.nic;
        document.getElementById('name').value = student.fullName;
        document.getElementById("email").value = student.email;
        document.getElementById('phone').value = student.phone;
    
        //Course Details
        document.getElementById('course-name').value = coursedetails.courseName;
        document.getElementById('level').value = coursedetails.level;
        document.getElementById('duration').value = `${CourseEnrollDetails.duration} Months`;
    
        //Hide Payment Details
        document.getElementById("payment-details").style.visibility = "hidden"
        document.getElementById('full-payment-row').style.visibility = "hidden";
        
        document.getElementById('installments-row').style.visibility = "hidden";
        document.getElementById('installment-amount-row').style.visibility = "hidden";
        document.getElementById('payment-paid-row').style.visibility = "hidden";
        document.getElementById('payment-due-row').style.visibility = "hidden";
        document.getElementById('payment-date-row').style.visibility = "hidden";

        //Un Hide
        document.getElementById("course-details").style.visibility = "visible"
    }
    
    
    function ShowFullPaymentStudentDetails(student,coursedetails , CourseEnrollDetails ,fullPayment){
        //Personal Details
        document.getElementById('nic').value = student.nic;
        document.getElementById('name').value = student.fullName;
        document.getElementById("email").value = student.email;
        document.getElementById('phone').value = student.phone;
    
        //Course Details
        document.getElementById('course-name').value = coursedetails.courseName;
        document.getElementById('level').value = coursedetails.level;
        document.getElementById('duration').value = `${CourseEnrollDetails.duration} Months`;
    
        //payment Details
        document.getElementById('fee').value = `${fullPayment.fullPayment}/=`;
        document.getElementById('plan').value = `Full Payment`;
        document.getElementById('full-payment').value = `${fullPayment.fullPayment}/=`;
    
        //Hide installment fields
        document.getElementById('installments-row').style.visibility = "hidden";
        document.getElementById('installment-amount-row').style.visibility = "hidden";
        document.getElementById('payment-paid-row').style.visibility = "hidden";
        document.getElementById('payment-due-row').style.visibility = "hidden";
        document.getElementById('payment-date-row').style.visibility = "hidden";
    
        //Un Hide Fields
        document.getElementById("course-details").style.visibility = "visible"
        document.getElementById("payment-details").style.visibility = "visible"
        document.getElementById('full-payment-row').style.visibility = "visible";
            
    }
    
    
    
    function ShowInstallmentStudentDetails(student,installment,CourseEnrollDetails,coursedetails){
        //Personal Details
        document.getElementById('nic').value = student.nic;
        document.getElementById('name').value = student.fullName;
        document.getElementById("email").value = student.email;
        document.getElementById('phone').value = student.phone;
    
        //Course Details
        document.getElementById('course-name').value = coursedetails.courseName;
        document.getElementById('level').value = coursedetails.level;
        document.getElementById('duration').value = `${CourseEnrollDetails.duration} Months`;
    
        //Payment Details
        document.getElementById('fee').value = `${installment.totalAmount}/=`;
        document.getElementById('plan').value = `Installment`;
        document.getElementById('installments').value = CourseEnrollDetails.duration;
        document.getElementById('installment-amount').value = `${installment.installmentAmount}/=`;
        document.getElementById('payment-paid').value =`${installment.paymentPaid}/=` ;
        document.getElementById('payment-due').value = `${installment.paymentDue}/=`;
        document.getElementById('payment-date').value = new Date(installment.paymentDate).toDateString();
    
        //Hide Full payment
        document.getElementById('full-payment-row').style.visibility = "hidden";
    
        //Un Hide fields
        document.getElementById("course-details").style.visibility = "visible"
        document.getElementById("payment-details").style.visibility = "visible"
    
        document.getElementById('installments-row').style.visibility = "visible";
        document.getElementById('installment-amount-row').style.visibility = "visible";
        document.getElementById('payment-paid-row').style.visibility = "visible";
        document.getElementById('payment-due-row').style.visibility = "visible";
        document.getElementById('payment-date-row').style.visibility = "visible";
    }
    
    
    
    //Course Enrollment
    //Course Enrollment
    //Course Enrollment
    //Course Enrollment
    
    
    function CourseEnrollmentReport(){
        const table = document.getElementById('course-enrollment-table');
        courses.forEach((course) => {

            let courseEnrollment = 0;

            students.forEach((student) => {
                const CourseEnrollDetails = courseEnrollData.find(c => c.id == student.courseEnrollId);
                if(student.courseEnrollId != 0){
                    const coursedetails = courses.find(c => c.id == CourseEnrollDetails.courseId);

                    if(coursedetails.courseName == course.courseName && coursedetails.level == course.level ){
                            courseEnrollment ++;
                    }    
                }
            })

            const row = document.createElement('tr');
            row.innerHTML = `
                <td>${course.id}</td>
                <td>${course.courseName}</td>
                <td>${course.level}</td>
                <td>${courseEnrollment}</td>
            `;
            table.appendChild(row);
        });
    }
    CourseEnrollmentReport();     
    
    //Financial Report
    //Financial Report
    //Financial Report
    //Financial Report
    
    
    function financialReport(){
        let initialAmount = 0;
        let fullPayment = 0;
        let paidInstallment = 0;
        let outStandingAmount = 0;
    
        if(students){
            students.forEach((student) => {
                initialAmount += student.registrationFee;
            })
        }
        
        if(FullpaymentDetails){
            FullpaymentDetails.forEach((FP) =>{
                fullPayment += FP.fullPayment;
            })
        }
    
        if(InstallmentDetails){
            InstallmentDetails.forEach((installment) =>{
                paidInstallment += installment.paymentPaid
                outStandingAmount += installment.paymentDue
            })
        }
    
        document.getElementById('initia-amount').value = `${initialAmount}/=`;
        document.getElementById('course-amount').value = `${fullPayment + paidInstallment}/=`;
        document.getElementById('total-amount').value = `${fullPayment + paidInstallment + initialAmount}/=`;
        document.getElementById('out-standing-amount').value = `${outStandingAmount}/=`;
    
        //Chart 
        const ctx = document.getElementById('myChart');
          
        new Chart(ctx, {
        type: 'doughnut',
        data: {
            labels: ['Initia Amount', 'Course Amount', 'Total Income', 'Out Standing Amount'],
            datasets: [{
            label: '# of Votes',
            data: [initialAmount, fullPayment + paidInstallment, fullPayment + paidInstallment + initialAmount, outStandingAmount],
            borderWidth: 1
            }]
        },
        options: {
            scales: {
            y: {
                beginAtZero: true
            }
            }
        }
        });
    }
    financialReport();
        
    //nave link function
    
    document.getElementById('student-report-link').addEventListener('click',()=>{
        document.getElementById('student-report').style.display = "block"
        document.getElementById('course-enrollment').style.display = "none"
        document.getElementById('financial-report').style.display = "none"
    })
    document.getElementById('course-enrollment-link').addEventListener('click',()=>{
        document.getElementById('student-report').style.display = "none"
        document.getElementById('course-enrollment').style.display = "block"
        document.getElementById('financial-report').style.display = "none"
    })
    document.getElementById('financial-report-link').addEventListener('click',()=>{
        document.getElementById('student-report').style.display = "none"
        document.getElementById('course-enrollment').style.display = "none"
        document.getElementById('financial-report').style.display = "block"
    })
    
    
    //Logout function
    
    function logout() {
        window.location.href = "../01_Admin_Login/admin_login.html";
    }
    
    const logoutButton = document.getElementById('logoutButton');
    logoutButton.addEventListener('click', function() {
      logout();
    });
});
    





