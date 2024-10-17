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


let totalAmount = 0;
let installmentAmount = 0;

document.getElementById('nic').addEventListener("keyup" , () =>{
    const nic = document.getElementById('nic').value.trim();
    const student = students.find((student) => student.nic == nic);
            
    if(student){
        if(student.courseEnrollId != null){
            const CourseEnrollDetail = courseEnrollData.find(c => c.id === student.courseEnrollId);
            const CourseDetails = courses.find(c => c.id == CourseEnrollDetail.courseId)

            if(CourseEnrollDetail != null){
                document.getElementById('fee-management-message').textContent = student.fullName;
                document.getElementById('fee-management-message').style.color = "green";
    
                courses.forEach(element => {
                    if(element.courseName == CourseDetails.courseName && element.level == CourseDetails.level){
                        document.getElementById('total-course-fee').textContent = `${element.totalFee} Rs`;
                        document.getElementById('total-amount').textContent = `${element.totalFee} Rs`;
                        if(CourseEnrollDetail.duration == "3"){
                            installmentAmount = element.totalFee / 3;
                            document.getElementById('installment-amount').textContent = `${installmentAmount} Rs / Month`
                        }else if(CourseEnrollDetail.duration == "6"){
                                installmentAmount = element.totalFee / 6;
                                document.getElementById('installment-amount').textContent = `${installmentAmount} Rs / Month`
                        }
                        totalAmount = element.totalFee;
                    }
                });
    
            }

        }else{
            document.getElementById('fee-management-message').textContent = `${student.fullName} didnt select a course`;
            document.getElementById('fee-management-message').style.color = "red";
            document.getElementById('total-course-fee').textContent = `0 Rs`;
            document.getElementById('total-amount').textContent = `0 Rs`;
            document.getElementById('installment-amount').textContent = `0 Rs`;
        }

    }else{
        document.getElementById('fee-management-message').textContent = "Student not found";
        document.getElementById('fee-management-message').style.color = "red";
    }

    if(nic.length == 0){
        document.getElementById('fee-management-message').textContent = "";
    }

});

    //Form Submit Function
    document.getElementById('fee-management-form').addEventListener('submit' ,(event) =>{
        event.preventDefault();
    
    
        const paymentplan = document.getElementById('payment-plan').value;
        const nic = document.getElementById('nic').value.trim();
        const student = students.find((student) => student.nic == nic);
    
        const CourseEnrollDetail = courseEnrollData.find(c => c.id == student.courseEnrollId)
        const FullPayment = FullpaymentDetails.find(p => p.id == CourseEnrollDetail.fullPaymentId)
    
        const date = new Date();
        let id = Number(Math.floor(Math.random()*1000000));
    
        if(paymentplan == "fullpayment"){
    
            if(CourseEnrollDetail.installmentId != 0 && CourseEnrollDetail.fullPaymentId == 0){
                document.getElementById('fee-management-message').textContent = "Wrong Payment Method";
                document.getElementById('fee-management-message').style.color = "red";
            }else{
                if(FullPayment && CourseEnrollDetail.status == "Active"){
                    document.getElementById('fee-management-message').textContent = "Student already paid FullPayment";
                }else{
                    CourseEnrollDetail.fullPaymentId = id;
                    CourseEnrollDetail.status = "Active";

                    const FullPaymentData = {
                        id,
                        nic,
                        fullPayment:totalAmount,
                        paymentDate:date
                    }
                    FullpaymentDetails.push(FullPaymentData);

                    localStorage.setItem('FullPaymentDetails',JSON.stringify(FullpaymentDetails));
                    localStorage.setItem('CourseEnrollDetails',JSON.stringify(courseEnrollData));

                    document.getElementById('fee-management-message').textContent = `${student.fullName} Paid Full Payment`;
                    displayFullPaymentTable();
                }
            }
    

        }
        else if(paymentplan == "installment"){
    
            if(CourseEnrollDetail.fullPaymentId != 0 ){
                document.getElementById('fee-management-message').textContent = "Student already paid Full payment";
            }
            else{

                Installment(student,id,CourseEnrollDetail);
            }
    
        }else{
            document.getElementById('fee-management-message').textContent = "Please select the payment Plan";
        }
    
        setTimeout(()=>{
            document.getElementById('fee-management-message').textContent = "";
            }, 3000);
        
        document.getElementById('total-course-fee').textContent = `0 Rs`;
        document.getElementById('total-amount').textContent = `0 Rs`;
        document.getElementById('installment-amount').textContent = `0 Rs`;
    
        event.target.reset();
    
    });
    
    
    //Installment Calculation
    function Installment(student,paymentId,CourseEnrollDetail){
        // Today Date 
        const today = new Date();
    
        const studentInstallment = InstallmentDetails.find((installment) => installment.id == CourseEnrollDetail.installmentId)
    
        if(studentInstallment != null && CourseEnrollDetail.status != "Pending"){
            if(studentInstallment.paymentDue <= 0){
                document.getElementById('fee-management-message').style.color = "green";
                document.getElementById('fee-management-message').textContent = `${student.fullName} paid Full installment plan`;
            }else{
                studentInstallment.paymentDue -= installmentAmount
                studentInstallment.paymentPaid += installmentAmount
                studentInstallment.paymentDate = today;
                localStorage.setItem('InstallmentDetails',JSON.stringify(InstallmentDetails));
                document.getElementById('fee-management-message').textContent = `${student.fullName} Paid Installment Payment`;
                displayInstallmentPaymentTable();
            }
            
        }else{
            let paymentDue = totalAmount - installmentAmount

            CourseEnrollDetail.installmentId = paymentId;
            CourseEnrollDetail.status = "Active";

            const InstallmentData = {
                id:paymentId,
                nic:student.nic,
                totalAmount,
                installmentAmount,
                installments:CourseEnrollDetail.duration,
                paymentDue,
                paymentPaid:installmentAmount,
                paymentDate:today
            }

            InstallmentDetails.push(InstallmentData);

            localStorage.setItem('InstallmentDetails',JSON.stringify(InstallmentDetails));
            localStorage.setItem('CourseEnrollDetails',JSON.stringify(courseEnrollData));

            document.getElementById('fee-management-message').textContent = `${student.fullName} Paid Installment Payment`
            displayInstallmentPaymentTable();
        }
    }
    
    
    
    //Pop up box For Payment details
    document.getElementById("student-payment-details").addEventListener("click" , ()=>{
        document.getElementById("overlay").style.display ="block"
        document.getElementById("popupbox").style.display ="block"
    });
    
    document.getElementById("overlay").addEventListener("click" , ()=>{
        document.getElementById("overlay").style.display ="none"
        document.getElementById("popupbox").style.display ="none"
    });
    
    //Installment Payment Table
    function displayInstallmentPaymentTable(){
    
        const tableBody = document.getElementById('table-body-installment');
        tableBody.innerHTML = "";
        InstallmentDetails.forEach((installment) => {
            const student = students.find(s => s.nic == installment.nic)
            const row = document.createElement('tr');
            row.innerHTML = `
                <td>${installment.id}</td>
                <td>${student.fullName}</td>
                <td>${installment.installmentAmount}/= </td>
                <td>${installment.paymentPaid}/= </td>
                <td>${installment.paymentDue}/= </td>
            `;
            tableBody.appendChild(row);
        });
    }
    displayInstallmentPaymentTable();
    
    //Full Payment Table
    
    function displayFullPaymentTable(){
    
        const table = document.getElementById('table-body-fullpayment');
        table.innerHTML = "";
        FullpaymentDetails.forEach((fullpayment) => {
            const student = students.find(s => s.nic == fullpayment.nic);
            const row = document.createElement('tr');
            row.innerHTML = `
                <td>${fullpayment.id}</td>
                <td>${fullpayment.nic}</td>
                <td>${student.fullName}</td>
                <td>${fullpayment.fullPayment}/= </td>
                <td>${fullpayment.fullPayment}/= </td>
            `;
            table.appendChild(row);
        })
    }
    displayFullPaymentTable();
    
    
    
    document.getElementById("installment-btn").addEventListener('click',() =>{
        document.querySelector("#table-1").style.display = "block"
        document.querySelector("#table-2").style.display = "none"
    })
    document.getElementById("full-payment-btn").addEventListener('click',() =>{
        document.querySelector("#table-1").style.display = "none"
        document.querySelector("#table-2").style.display = "block"
    })
    
    
    //Logout function
    function logout() {
        window.location.href = "../01_Admin_Login/admin_login.html";
    }
    
    const logoutButton = document.getElementById('logoutButton');
    logoutButton.addEventListener('click', function() {
      logout();
    });


