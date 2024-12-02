class Course {
  constructor(courseId, courseName, instructorName, ects, midtermPercent, gradingScale) {
    this.courseId = courseId;
    this.courseName = courseName;
    this.instructorName = instructorName;
    this.ects = ects;
    this.midtermPercent = midtermPercent;
    this.gradingScale = gradingScale;
  }
}

class Student {
  constructor(studentId, studentName, studentSurname) {
    this.studentId = studentId;
    this.studentName = studentName;
    this.studentSurname = studentSurname;
    this.courses = [];
  }
}

let coursesArray = [];
let studentsArray = [];
let assignmentsArray = [];

// DOM Elements for Course
const courseForm = document.getElementById("addCourseForm");
const courseIdInput = document.getElementById("course-id");
const courseNameInput = document.getElementById("course-name");
const instructorNameInput = document.getElementById("instructor-name");
const ectsInput = document.getElementById("ects");
const midtermPercentInput = document.getElementById("midterm-percent");
const gradingScaleInput = document.getElementById("grading-scale");
const courseCardsContainer = document.getElementById("courseCardsContainer");
let editingCourse = null;

// DOM Elements for Student
const studentForm = document.getElementById("addStudentForm");
const studentIdInput = document.getElementById("student-id");
const studentNameInput = document.getElementById("student-name");
const studentSurnameInput = document.getElementById("student-surname");
const studentsTableBody = document.getElementById("studentsTableBody");
let editingStudent = null;

// DOM Elements for Assign Students to Courses
const assignStudentToCourseForm = document.getElementById("assignStudentToCourseForm");
const selectCourseDropdown = document.getElementById("select-course");
const selectStudentDropdown = document.getElementById("select-studentID");
const midtermGradeInput = document.getElementById("midterm-grade");
const finalGradeInput = document.getElementById("final-grade");
const assignedStudentsTable = document.getElementById("getStudentsToCourseTable");

// DOM Elements for Search Student 
const studentSearchInput = document.getElementById("studentSearchInput");
const studentSearchButton = document.getElementById("studentSearchButton");
const clearButton = document.getElementById("clearButton");
const studentDetailsModal = document.getElementById("studentDetailsModal");
const closeModalButton = document.getElementById("closeModal");
const modalStudentDetails = document.getElementById("modalStudentDetails");
const modalStudentID = document.getElementById("modalStudentID");
const modalStudentGPA = document.getElementById("modalStudentGPA");
const modalCoursesTable = document.getElementById("modalCoursesTable");

// DOM Elements for Course Statistics
const courseSelect = document.getElementById("courseSelect");
const filterSelect = document.getElementById("filterSelect");
const viewCourseButton = document.getElementById("viewCourseButton");
const resultsTableBody = document.getElementById("resultsTableBody");
const courseTitle = document.getElementById("courseTitle");
const totalStudents = document.getElementById("totalStudents");
const passedStudents = document.getElementById("passedStudents");
const failedStudents = document.getElementById("failedStudents");
const meanScore = document.getElementById("meanScore");


//SECTION -1 : Adding Course

// Add or Update Course
function addOrUpdateCourse(event) {
  event.preventDefault();

  const courseId = courseIdInput.value.trim();
  const courseName = courseNameInput.value.trim();
  const instructorName = instructorNameInput.value.trim();
  const ects = ectsInput.value.trim();
  const midtermPercent = midtermPercentInput.value.trim();
  const gradingScale = gradingScaleInput.value.trim();
  
  
  const messageDiv = document.getElementById("courseMessage"); // Message area

  if (editingCourse) {
    // Update Existing Course
    const oldCourseName = editingCourse.courseName;

    editingCourse.courseName = courseName;
    editingCourse.instructorName = instructorName;
    editingCourse.ects = ects;
    editingCourse.midtermPercent = midtermPercent;
    editingCourse.gradingScale = gradingScale;

    updateCourseNameInAssignments(oldCourseName, courseName);
    renderCourses();
    renderAssignments();
    renderDropdownOptions();
    renderCourseOptions(); // Render courses again
    resetCourseForm(); // Reset form and state
    
    showMessage("The course has been successfully updated!", "success", messageDiv);
    
  } else {
    // Check if a course with the same name already exists (with a different courseId)
    const courseExists = coursesArray.some((course) =>
    course.courseName === courseName && course.courseId !== courseId
    );
     
    if (courseExists) {
      alert("A course with this name already exists, please choose a different course name!");
      return;
    }

    const newCourse = new Course(courseId, courseName, instructorName, ects, midtermPercent, gradingScale);
    coursesArray.push(newCourse);
    renderCourses();
    renderDropdownOptions();
    renderCourseOptions();
    resetCourseForm(); // Reset form
    
    showMessage("A new course has been successfully added!", "success", messageDiv);
  }
}
// Show Message
function showMessage(message, type, targetDiv) {
  targetDiv.textContent = message;
  targetDiv.style.display = "block"; // Make visible
  targetDiv.className = `message ${type}`; // Style for success or error 

  setTimeout(() => {
    targetDiv.style.display = "none"; // Hide the message after a while
    targetDiv.textContent = "";
    targetDiv.className = ""; // Clear the style class
  }, 3000); //  Message disappears after 3 seconds
}


// Render Course Cards
function renderCourses() {
  courseCardsContainer.innerHTML = "";  // Kursları sıfırla

  coursesArray.forEach((course) => {
    const card = document.createElement("div");
    card.classList.add("course-card");
    card.innerHTML = `
      <div class="course-card-header">
        <img src="./assets/course2.png" alt="Course Image" class="course-image" />
        <h4>${course.courseName} (${course.courseId})</h4>
      </div>
      <div class="course-card-body">
        <p><strong>Instructor:</strong> ${course.instructorName}</p>
        <p><strong>ECTS:</strong> ${course.ects}</p>
        <p><strong>Midterm Percent:</strong> ${course.midtermPercent}%</p>
        <p><strong>Grading Scale:</strong> ${course.gradingScale}</p>
      </div>
      <div class="course-card-footer">
        <button class="btn-update">Update</button>
        <button class="btn-delete">Delete</button>
      </div>
    `;

    // Kursu güncelleme ve silme butonlarına event listener ekle
    card.querySelector(".btn-update").addEventListener("click", () => loadCourseToForm(course));
    card.querySelector(".btn-delete").addEventListener("click", () => {
      console.log("Delete button clicked for course", course.courseName);  // Debug log
      deleteCourse(course.courseId);
    });
    

    courseCardsContainer.appendChild(card);
  });
}


// Load Course to Form for Editing
function loadCourseToForm(course) {
  courseIdInput.value = course.courseId;
  courseIdInput.disabled = true; // Disable Course ID input
  courseNameInput.value = course.courseName;
  instructorNameInput.value = course.instructorName;
  ectsInput.value = course.ects;
  midtermPercentInput.value = course.midtermPercent;
  gradingScaleInput.value = course.gradingScale;

  editingCourse = course; // Set the editing course
  courseForm.querySelector("button[type='submit']").textContent = "Update Course";
}

// Delete Course
function deleteCourse(courseId) {
  const index = coursesArray.findIndex((course) => course.courseId === courseId);
  if (index !== -1) {
    const deletedCourse = coursesArray[index].courseName;
    coursesArray.splice(index, 1);

    // Remove related assignments
    assignmentsArray = assignmentsArray.filter((assignment) => assignment.courseName !== deletedCourse);

    renderCourses();
    renderAssignments();
    renderDropdownOptions();
    renderCourseOptions();
  }
}

// Update Course Name in Assignments
function updateCourseNameInAssignments(oldName, newName) {
  assignmentsArray.forEach((assignment) => {
    if (assignment.courseName === oldName) {
      assignment.courseName = newName;
    }
  });
}


// Reset Course Form
function resetCourseForm() {
  courseForm.reset();
  courseIdInput.disabled = false; // Enable Course ID field
  editingCourse = null; // Exit edit mode
  courseForm.querySelector("button[type='submit']").textContent = "Add Course"; //Reset button text
}

//SECTION-2 ADD STUDENT TO THE SYSTEM
// Add or Update Student
function addOrUpdateStudent(event) {
  event.preventDefault();

  const studentId = studentIdInput.value.trim();
  const studentName = studentNameInput.value.trim();
  const studentSurname = studentSurnameInput.value.trim();

  if (editingStudent) {
    editingStudent.studentName = studentName;
    editingStudent.studentSurname = studentSurname;

    renderStudents();
    studentForm.reset();
    editingStudent = null;
    studentForm.querySelector("button[type='submit']").textContent = "Add Student";
  } else {
    const studentExists = studentsArray.some((student) => student.studentId === studentId);
    if (studentExists) {
      alert("Student ID already exists!");
      return;
    }

    const newStudent = new Student(studentId, studentName, studentSurname);
    studentsArray.push(newStudent);
    renderStudents();
    studentForm.reset();
  }

  renderDropdownOptions();
  renderCourseOptions();
}

// Render Students Table
function renderStudents() {
  studentsTableBody.innerHTML = "";

  studentsArray.forEach((student, index) => {
    const row = document.createElement("tr");
    row.innerHTML = `
      <td>${index + 1}</td>
      <td>${student.studentId}</td>
      <td>${student.studentName}</td>
      <td>${student.studentSurname}</td>
      <td>
        <button class="btn-update">Update</button>
        <button class="btn-delete">Delete</button>
      </td>
    `;

    row.querySelector(".btn-update").addEventListener("click", () => loadStudentToForm(student));
    row.querySelector(".btn-delete").addEventListener("click", () => deleteStudent(student.studentId));

    studentsTableBody.appendChild(row);
  });
}

// Load Student to Form for Editing
function loadStudentToForm(student) {
  studentIdInput.value = student.studentId;
  studentIdInput.disabled = true; // Disable Student ID input
  studentNameInput.value = student.studentName;
  studentSurnameInput.value = student.studentSurname;

  editingStudent = student;
  studentForm.querySelector("button[type='submit']").textContent = "Update Student";
}

// Delete Student
function deleteStudent(studentId) {
  const index = studentsArray.findIndex((student) => student.studentId === studentId);
  if (index !== -1) {
    studentsArray.splice(index, 1);

    // Remove related assignments
    assignmentsArray = assignmentsArray.filter((assignment) => assignment.studentId !== studentId);

    renderStudents();
    renderAssignments();
    renderDropdownOptions();
    renderCourseOptions();
  }
}
// Display Update Message
function displayMessage(message) {
  // Check if a message is already displayed, if so remove it
  const existingMessage = document.getElementById("update-message");
  if (existingMessage) {
    existingMessage.remove();
  }

  // Create a new message element
  const messageElement = document.createElement("div");
  messageElement.id = "update-message";
  messageElement.textContent = message;
  

  // Insert the message above the assignStudentToCourseForm
  assignStudentToCourseForm.parentElement.insertBefore(messageElement, assignStudentToCourseForm);

  // Remove message after 3 seconds
  setTimeout(() => {
    messageElement.remove();
  }, 3000);
}

// SECTION-3 Assign Student to Course
// Calculate Grade
function calculateGrade(midterm, final, midtermPercent, finalPercent, scale) {
  const total = (midterm * (midtermPercent / 100)) + (final * (finalPercent / 100));

  const scales = ["AA", "BA", "BB", "CB", "CC", "CD", "DD", "FF"];
  let threshold = 100;
  const step = scale === "10" ? 10 : 7; // Skala 10 tabanlıysa 10, 7 tabanlıysa 7 adım

  for (let i = 0; i < scales.length - 1; i++) { // "FF" hariç tüm harf notları
    if (total >= threshold) {
      return scales[i];
    }
    threshold -= step; // Her adımda eşiği düşür
  }
  return "FF"; // Eğer hiçbir eşiğe uymazsa "FF" döner
}
// Assign Student to Course
function assignStudentToCourse(event) {
  event.preventDefault();

  const courseName = selectCourseDropdown.value;
  const studentId = selectStudentDropdown.value;
  const midterm = parseFloat(midtermGradeInput.value);
  const final = parseFloat(finalGradeInput.value);

  if (!courseName || !studentId || isNaN(midterm) || isNaN(final)) {
    alert("All fields are required!");
    return;
  }

const course = coursesArray.find((c) => c.courseName === courseName);

if (!course) {
  alert("Course not found!");
  return;
}
const grade = calculateGrade(midterm, final, course.midtermPercent, 100 - course.midtermPercent, course.gradingScale);

  const assignmentExists = assignmentsArray.some(
    (assignment) => assignment.courseName === courseName && assignment.studentId === studentId
  );

  if (assignmentExists) {
    return;
  }

  const assignment = {
    courseName,
    midterm,
    final,
    grade,
  };

  const student = studentsArray.find((s) => s.studentId === studentId);
  if (!student) {
    alert("Student not found!");
    return;
  }
  

  student.courses.push(assignment); // add course to student
  assignmentsArray.push({ studentId, ...assignment }); // add general assignment array

  

  renderAssignments();
  assignStudentToCourseForm.reset();
}

// Render Assignments Table
function renderAssignments() {
  assignedStudentsTable.innerHTML = "";

  assignmentsArray.forEach((assignment) => {
    const row = document.createElement("tr");
    row.innerHTML = `
      <td>${assignment.courseName}</td>
      <td>${assignment.studentId}</td>
      <td>${assignment.midterm}</td>
      <td>${assignment.final}</td>
      <td>${assignment.grade}</td>
      <td>
        <button class="btn-update">Update</button>
        <button class="btn-delete">Delete</button>
      </td>
    `;

    // Update Assignment
    row.querySelector(".btn-update").addEventListener("click", () => updateAssignment(assignment));

    // Delete Assignment
    row.querySelector(".btn-delete").addEventListener("click", () => deleteAssignment(assignment));

    assignedStudentsTable.appendChild(row);
  });
}

// Update Assignment
function updateAssignment(assignment) {
  // Populate form with current assignment details
  selectCourseDropdown.value = assignment.courseName;
  selectStudentDropdown.value = assignment.studentId;
  midtermGradeInput.value = assignment.midterm;
  finalGradeInput.value = assignment.final;

  // Temporarily disable dropdowns to prevent changing the course or student
  selectCourseDropdown.disabled = true;
  selectStudentDropdown.disabled = true;

  // Update the submit button to handle updates
  assignStudentToCourseForm.querySelector("button[type='submit']").textContent = "Update Assignment";

  assignStudentToCourseForm.onsubmit = (event) => {
    event.preventDefault();

    const midterm = parseFloat(midtermGradeInput.value);
    const final = parseFloat(finalGradeInput.value);
    const course = coursesArray.find((c) => c.courseName === assignment.courseName);
  
    const grade = calculateGrade(midterm, final, course.midtermPercent, 100 - course.midtermPercent, course.gradingScale);

    // Update assignment values
    assignment.midterm = midterm;
    assignment.final = final;
    assignment.grade = grade;

    // Update student's course data
    const student = studentsArray.find((s) => s.studentId === assignment.studentId);
    if (student) {
      const studentAssignment = student.courses.find((c) => c.courseName === assignment.courseName);
      if (studentAssignment) {
        studentAssignment.midterm = midterm;
        studentAssignment.final = final;
        studentAssignment.grade = grade;
      }
    }

    // Reset form and update table
    renderAssignments();
    displayMessage("Student's grades have been successfully updated!");
    resetAssignmentForm();
  };
}

// Delete Assignment
function deleteAssignment(assignment) {
  console.log("Deleting assignment:", assignment);  // Debug log
  const index = assignmentsArray.indexOf(assignment);
  if (index !== -1) {
    assignmentsArray.splice(index, 1);

    // Delete course which is related to student
    const student = studentsArray.find((s) => s.studentId === assignment.studentId);
    if (student) {
      console.log("Deleting course from student:", assignment.courseName);  // Debug log
      student.courses = student.courses.filter((c) => c.courseName !== assignment.courseName);
    }

    renderAssignments();
  }}

// Reset Assignment Form
function resetAssignmentForm() {
  assignStudentToCourseForm.reset();
  assignStudentToCourseForm.querySelector("button[type='submit']").textContent = "Assign Student";
  selectCourseDropdown.disabled = false;
  selectStudentDropdown.disabled = false;

  // Restore original submit handler
  assignStudentToCourseForm.onsubmit = assignStudentToCourse;
}


// Render Dropdown Options
function renderDropdownOptions() {
  selectCourseDropdown.innerHTML = `<option value="" disabled selected>Select a Course</option>`;
  selectStudentDropdown.innerHTML = `<option value="" disabled selected>Select a Student</option>`;

  coursesArray.forEach((course) => {
    const option = document.createElement("option");
    option.value = course.courseName;
    option.textContent = course.courseName;
    selectCourseDropdown.appendChild(option);
  });

  studentsArray.forEach((student) => {
    const option = document.createElement("option");
    option.value = student.studentId;
    option.textContent = `${student.studentName} ${student.studentSurname} (${student.studentId})`;
    selectStudentDropdown.appendChild(option);
  });
}



// SECTION 4: Search Student Functionality
// view model when clik to search button
studentSearchButton.addEventListener("click", () => {
  const searchQuery = document.getElementById("studentSearchInput").value.trim().toLowerCase();

  if (!searchQuery) {
    alert("Please enter a name or ID to search.");
    return;
  }

  // Search student by name or ID
  const foundStudent = studentsArray.find(
    (student) =>
      String(student.studentId).toLowerCase() === searchQuery ||
      `${student.studentName} ${student.studentSurname}`.toLowerCase().includes(searchQuery)
  );

  if (!foundStudent) {
    alert("Student not found. Please try again.");
    return;
  }
   // open modal
   showStudentDetails(foundStudent);
  });
  // close modal
closeModalButton.addEventListener("click", () => {
  studentDetailsModal.close(); // Modalı kapat
});
function calculateStudentGPA(student, coursesArray) {
  const gradePoints = {
    "AA": 4.0,
    "BA": 3.5,
    "BB": 3.0,
    "CB": 2.5,
    "CC": 2.0,
    "CD": 1.5,
    "DD": 1.0,
    "FF": 0.0
  };

  let totalWeightedGrades = 0;
  let totalECTS = 0;

  // Visit all courses which student takes
  student.courses.forEach((assignment) => {
    const course = coursesArray.find((c) => c.courseName === assignment.courseName);
    if (!course) 
      return; 

    // Take ECTS
    const ects = parseFloat(course.ects);
    if (isNaN(ects)) return; 

    //Calculate the letter grade
    const grade = calculateGrade(assignment.midterm, assignment.final, course.midtermPercent, 100 - course.midtermPercent, course.gradingScale);

    // Take Corresponding letter grade
    const gradePoint = gradePoints[grade] || 0;

    // Weighted note and Ects
    totalWeightedGrades += gradePoint * ects;
    totalECTS += ects;
  });

  // Calculate GPA : Weighted score / ECTS
  return totalECTS > 0 ? (totalWeightedGrades / totalECTS).toFixed(2) : "N/A";
}


function showStudentDetails(student) {
  modalStudentDetails.textContent = `${student.studentName} ${student.studentSurname}'s Details`;
  modalStudentID.textContent = student.studentId;

  // calculate GPA
  const gpa = calculateStudentGPA(student, coursesArray);
  modalStudentGPA.textContent = gpa; // Show the GPA

  // Fill the table
  modalCoursesTable.innerHTML = ""; // Delete old table
  student.courses.forEach((assignment) => {
    const row = document.createElement("tr");
    row.innerHTML = `
      <td>${assignment.courseName}</td>
      <td>${assignment.midterm}</td>
      <td>${assignment.final}</td>
      <td>${assignment.grade}</td>
    `;
    modalCoursesTable.appendChild(row);
  });

  studentDetailsModal.classList.remove("hidden"); // Open modal
}


// Close modal
closeModalButton.addEventListener("click", () => {
  studentDetailsModal.classList.add("hidden");
});

// Clear button
clearButton.addEventListener("click", () => {
  // clear input area
  studentSearchInput.value = "";

  // Clear modal content
  modalStudentDetails.textContent = "";
  modalStudentID.textContent = "";
  modalStudentGPA.textContent = "";
  modalCoursesTable.innerHTML = "";

  // Close modal if it is open
  if (studentDetailsModal.open) {
    studentDetailsModal.close();
  }

  console.log("Search cleared and modal reset.");
});

//SECTION-5: STATISTICS

// Filter and Statistics
viewCourseButton.addEventListener("click", (event) => {
  event.preventDefault(); // Sayfanın yeniden yüklenmesini engellemek için

  const selectedCourseName = courseSelect.value;
  const filterOption = filterSelect.value;

  if (selectedCourseName === "none") {
    alert("Please select a course.");
    return;
  }

  const course = coursesArray.find(c => c.courseName === selectedCourseName);
  if (!course) {
    alert("Course not found.");
    return;
  }

  // Filter Students and display
  const filteredAssignments = filterAssignmentsByCourse(course, filterOption);
  renderResultsTable(filteredAssignments, course);
  renderStatistics(filteredAssignments, course);
});

// Filter Students (Passed, Failed veya All)
function filterAssignmentsByCourse(course, filterOption) {
  const filteredAssignments = assignmentsArray.filter(assignment => assignment.courseName === course.courseName);

  switch (filterOption) {
    case "Passed":
      return filteredAssignments.filter(assignment => assignment.grade !== "FF");
    case "Failed":
      return filteredAssignments.filter(assignment => assignment.grade === "FF");
    default:
      return filteredAssignments; // "All" students
  }
}

// Render the results
function renderResultsTable(assignments, course) {
  resultsTableBody.innerHTML = ""; // Remove old data

  assignments.forEach((assignment, index) => {
    const student = studentsArray.find(s => s.studentId === assignment.studentId);
    // calculate letter grade
    const letterGrade = calculateGrade(assignment.midterm, assignment.final, course.midtermPercent, 100 - course.midtermPercent, course.gradingScale);
    const status = letterGrade === "FF" ? "Failed" : "Passed";

    const row = document.createElement("tr");
    row.innerHTML = `
      <td>${index + 1}</td>
      <td>${assignment.studentId}</td>
      <td>${student ? student.studentName + " " + student.studentSurname : "Unknown"}</td>
      <td>${assignment.midterm}</td>
      <td>${assignment.final}</td>
      <td>${letterGrade}</td>
      <td>${status}</td>
    `;
    resultsTableBody.appendChild(row);
  });
}

// Compute statistics and show
function renderStatistics(assignments, course) {
  const totalStudentsCount = assignments.length;
  const passedCount = assignments.filter(assignment => assignment.grade !== "FF").length;
  const failedCount = totalStudentsCount - passedCount;

  //Calculate mean of course
  const mean = calculateMeanScore(assignments, course);

  totalStudents.textContent = totalStudentsCount;
  passedStudents.textContent = passedCount;
  failedStudents.textContent = failedCount;
  meanScore.textContent = `Mean score of the class: ${mean.toFixed(2)}`;
}


// Calculate the mean score
function calculateMeanScore(assignments, course) {
  const totalScore = assignments.reduce((sum, assignment) => {
    // Midterm ve final nots with percentages
    const weightedMidterm = assignment.midterm * (course.midtermPercent / 100);
    const weightedFinal = assignment.final * (course.finalPercent / 100);
    return sum + weightedMidterm + weightedFinal;
  }, 0);

  // Calculate mean
  const averageScore = totalScore / assignments.length || 0;

  return averageScore;
}

//Add courses in dropdown menu
function renderCourseOptions() {
  courseSelect.innerHTML = '<option value="none" disabled selected>Select a course</option>';
  
  coursesArray.forEach(course => {
    const option = document.createElement("option");
    option.value = course.courseName;
    option.textContent = course.courseName;
    courseSelect.appendChild(option);
  });
}


renderCourseOptions();



// Event Listeners
courseForm.addEventListener("submit", addOrUpdateCourse);
studentForm.addEventListener("submit", addOrUpdateStudent);
assignStudentToCourseForm.addEventListener("submit", assignStudentToCourse);

// Initial Renders
renderCourses();
renderStudents();
renderDropdownOptions();

