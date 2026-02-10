
/* MOBILE NAV */

const menuBtn = document.getElementById("menuBtn");
const navLinks = document.getElementById("navLinks");

menuBtn.addEventListener("click",()=>{

navLinks.classList.toggle("active");

menuBtn.innerHTML =
navLinks.classList.contains("active")
? '<i class="fa-solid fa-xmark"></i>'
: '<i class="fa-solid fa-bars"></i>';

});
window.addEventListener("load",()=>{

document.querySelector(".hero-content").animate(

[
{opacity:0, transform:"translateY(40px)"},
{opacity:1, transform:"translateY(0)"}
],

{
duration:1200,
easing:"cubic-bezier(.16,1,.3,1)",
fill:"forwards"
}

);

});


/* PREMIUM SMOOTH SCROLL */

document.querySelectorAll('a[href^="#"]').forEach(anchor => {

anchor.addEventListener("click", function(e){

e.preventDefault();

const target = document.querySelector(this.getAttribute("href"));

if(!target) return;

window.scrollTo({
top: target.offsetTop - 70, 
behavior:"smooth"
});

});

});




const form = document.getElementById("contactForm");
const btn = document.getElementById("submitBtn");
const successPopup = document.getElementById("successPopup");
const errorPopup = document.getElementById("errorPopup");

form.addEventListener("submit", async function(e){

e.preventDefault();

btn.disabled = true;
btn.textContent = "Sending...";

const data = new FormData(form);

try{

const res = await fetch(form.action,{
method:"POST",
body:data
});

if(res.ok){

form.reset();
showPopup(successPopup);

}else{

showPopup(errorPopup);

}

}catch{

showPopup(errorPopup);

}

btn.disabled = false;
btn.textContent = "Send Message →";

});



function showPopup(popup){

if(!popup) return;

popup.classList.add("show");

setTimeout(()=>{
popup.classList.remove("show");
},2600);

}


document.getElementById("year").textContent =
new Date().getFullYear();
