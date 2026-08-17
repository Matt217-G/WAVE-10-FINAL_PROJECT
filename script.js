
//  ------CONSTANTS--------
const HABITS_KEY = "godlygainsHabits";
const THEME_KEY ="godlygainsTheme";

// =======LOCAL STORAGE CATCHERS========
function saveHabits() {
  localStorage.setItem(HABITS_KEY,JSON.stringify(habits))
}

function loadHabits() {
  const savedHabits = localStorage.getItem(HABITS_KEY)
  if(!savedHabits){
    return []
  }
  
  try{
    return JSON.parse(savedHabits)
  } catch(error){
  console.error("Could not parse saved habits;",error)
  return[]
  }
}

// ---let habits = [];this will hold our array of habit objects--
let habits = loadHabits();
let exercises = []



// =====DOm ELEMENTS I AM GRABBING/ RE USING===   
// /<div class="dashboard-right">/ 
const todayLabel = document.getElementById("todayLabel")
const habitForm = document.getElementById("habit-form");
const habitInput = document.getElementById("habit-name")


// -------GETTING OUR DATE----
function getTodayDateString(){
  const date = new Date()
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2,"0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}` 
}

function renderToday(){
  const dateFormatting = new Intl.DateTimeFormat('en', {
    weekday: "long",
    month: "short",
    day: "numeric"
  }).format(new Date());
  todayLabel.textContent = dateFormatting;

}

// ----CREATING HABIT CARDS-----

function createHabitCard(habit){
  const habitCard = document.createElement("li")
  habitCard.classList.add("habit-card")
  habitCard.dataset.id = habit.id

  const habitTitle = document.createElement("p")
  habitTitle.classList.add("habit-title")
  habitTitle.textContent = habit.name


  const completeBtn = document.createElement("span")
  completeBtn.classList.add("complete-btn")
  completeBtn.textContent = "✅ Complete"

  const removeBtn = document.createElement("span")
  removeBtn.classList.add("remove-btn")
  removeBtn.textContent = "🚮 Remove"

  habitCard.appendChild(habitTitle)
  habitCard.append(completeBtn)
  habitCard.appendChild(removeBtn)

  return habitCard
}


       // -----STREAK CALCULATION-----

function updateStreaks() {
  const today = getTodayDateString();

  const completedToday = habits.filter(function(habit) {
    return habit.completedDates.includes(today);
  });

  document.getElementById("current-streak").textContent = habits.length ? habits[0].completedDates.length : 0;
  document.getElementById("total-habits").textContent = `${completedToday.length}/${habits.length}`;
  document.getElementById("habits-completed").textContent = completedToday.length;

}


// -----RENDERING LOGIC INTO CARDS-----

function renderHabits(){
  const habitList = document.getElementById('habit-list')
  habitList.innerHTML=""

  habits.forEach(habit =>{
    const card = createHabitCard(habit)
    habitList.appendChild(card)
  })
  updateStreaks()
}


// ------ADDING A HABIT------ 

function handleAddHabit(){
   const habitName= document.getElementById("habit-name").value.trim()
   if(habitName === ""){
    console.log("title is required")
  return
   }
const newHabit = {
   id: crypto.randomUUID(),
   name: habitName,
   completedDates: [],
 };
  habits.push(newHabit)
   saveHabits()
   renderHabits()

   document.getElementById("habit-name").value.trim()
}

// ------ADDING COMPLETE / REMOVE CLICK---
function handleBoardClick(event){
  const target = event.target
  const habitCard = target.closest(".habit-card")
  if(!habitCard){
    return
}

const habitID = habitCard.dataset.id

const habit = habits.find(h => h.id === habitID)
if (!habit){
  return
}

if(target.classList.contains("complete-btn")){
  const today = getTodayDateString()
  if(!habit.completedDates.includes(today)){
    habit.completedDates.push(today)
  }
}

if(target.classList.contains("remove-btn")){
  const index = habits.findIndex(habit => habit.id === habitID)
  habits.splice(index, 1)
}
saveHabits()
renderHabits()
}

// --------DARK MODE-------
const themeBtn = document.getElementById("theme-btn");

function handleThemeToggle(){
  document.body.classList.toggle("dark-mode")
  
  const isDark = document.body.classList.contains("dark-mode")
  themeBtn.textContent = isDark ? "☀️Light Mode" : "🌙Dark Mode";

  localStorage.setItem(THEME_KEY, isDark ? "dark" : "light")
}

const savedTheme = localStorage.getItem(THEME_KEY) || "light";
if(savedTheme === "dark"){
  document.body.classList.add("dark-mode")
  themeBtn.textContent = "Light Mode"
}


// ======API------
async function fetchExercises() {
  try {
    const response = await axios.get('https://wger.de/api/v2/exerciseinfo/?language=2&limit=12');
    renderExercises(response.data.results);
  } catch (error) {
    console.error("Could not load exercises:", error);
  }
}

fetchExercises()

function createExerciseCard(exercise){
  const card = document.createElement("div")
  card.classList.add("exercise-card")

  const name = document.createElement("h3")
  name.textContent = exercise.translations[0] ? exercise.translations[0].name : "Unnamed"

  const category = document.createElement("p")
  category.textContent = "Category: "  + (exercise.category ? exercise.category.name : "Unknown")

  card.appendChild(name)
  card.appendChild(category)

  return card
}

function renderExercises(exerciseList){
  const grid = document.getElementById("exercise-grid")
  grid.innerHTML=""
  exerciseList.forEach(exercise => {
    const card = createExerciseCard(exercise)
    grid.appendChild(card)
  })

  document.getElementById("exercise-count").textContent =`Showing ${exerciseList.length} exercises`;

}




//  ----EVENT LISTENERS----- 

 document.getElementById("add-task-btn")
.addEventListener("click",handleAddHabit)


document.getElementById("habit-list")
.addEventListener("click", handleBoardClick)

document.getElementById("theme-btn")
.addEventListener("click",handleThemeToggle);


//  =====LOAD APP-----
renderHabits()
renderToday()


