// Butonlara ve ilgili section'lara referanslar
const manageCoursesBtn = document.getElementById('courses-btn');
const addStudentsBtn = document.getElementById('students-btn');
const assignStudentsCoursesBtn = document.getElementById('assign-students-courses-btn');
const searchStudentsBtn = document.getElementById('search-students-btn');
const viewCourseStatsBtn = document.getElementById('view-course-stats-btn');

const manageCoursesSection = document.getElementById('manageCoursesSection');
const addStudentSection = document.getElementById('addStudentSection');
const assignStudentsToCoursesSection = document.getElementById('assignStudentsToCoursesSection');
const searchStudentsSection = document.getElementById('searchStudentsSection');
const courseStatsSection = document.getElementById('courseStatsSection');
const homeSection = document.getElementById('home-section');

// Hide All Sections
function hideAllSections() {
  manageCoursesSection.classList.add('hidden');
  addStudentSection.classList.add('hidden');
  assignStudentsToCoursesSection.classList.add('hidden');
  searchStudentsSection.classList.add('hidden');
  courseStatsSection.classList.add('hidden');
  homeSection.classList.add('hidden'); // Home section'ı da gizliyoruz
}

// Add EventListener to Sidebar
manageCoursesBtn.addEventListener('click', () => {
  hideAllSections();
  manageCoursesSection.classList.remove('hidden');
});

addStudentsBtn.addEventListener('click', () => {
  hideAllSections();
  addStudentSection.classList.remove('hidden');
});

assignStudentsCoursesBtn.addEventListener('click', () => {
  hideAllSections();
  assignStudentsToCoursesSection.classList.remove('hidden');
});

searchStudentsBtn.addEventListener('click', () => {
  hideAllSections();
  searchStudentsSection.classList.remove('hidden');
});

viewCourseStatsBtn.addEventListener('click', () => {
  hideAllSections();
  courseStatsSection.classList.remove('hidden');
});

// Sayfa ilk yüklendiğinde Home section'ını görünür yap
window.onload = () => {
  homeSection.classList.remove('hidden'); // Home görünür olacak
};


