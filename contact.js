
const THEME_KEY ="godlygainsTheme";
const CONTACT_KEY= "godlygainsContact"


function getTodayDateString(){
  const date = new Date()
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2,"0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}` 
}

function saveContact(entry){
    const message= JSON.parse(localStorage.getItem(CONTACT_KEY)) || []
    message.push(entry)
    localStorage.setItem(CONTACT_KEY, JSON.stringify(message))
}

function handleContactSubmit(event){
event.preventDefault()
const entry = {
    name: document.getElementById("contact-name").value.trim(),
    email: document.getElementById("contact-email").value.trim(),
    message: document.getElementById("contact-message").value.trim(),
    date: getTodayDateString()
}

saveContact(entry)
document.getElementById("contact-confirmation").textContent = "Thanks your message has been submitted"
document.getElementById("contact-form").reset()

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


//  ======EVENT LISTENERS=====

document.getElementById("theme-btn")
.addEventListener("click",handleThemeToggle)

document.getElementById("contact-form")
.addEventListener("submit", handleContactSubmit)