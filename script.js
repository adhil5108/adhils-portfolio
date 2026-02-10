document.addEventListener("DOMContentLoaded", function () {



const menuBtn = document.getElementById("menuBtn");
const navLinks = document.getElementById("navLinks");

if(menuBtn && navLinks){

menuBtn.addEventListener("click", () => {

navLinks.classList.toggle("active");

menuBtn.innerHTML =
navLinks.classList.contains("active")
? '<i class="fa-solid fa-xmark"></i>'
: '<i class="fa-solid fa-bars"></i>';

});

}




const hero = document.querySelector(".hero-content");

if(hero){
hero.animate(
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
}




document.querySelectorAll('a[href^="#"]').forEach(anchor => {

anchor.addEventListener("click", function(e){

const href = this.getAttribute("href");
if(!href || href === "#") return;

const target = document.querySelector(href);
if(!target) return;

e.preventDefault();


if(navLinks && navLinks.classList.contains("active")){
navLinks.classList.remove("active");
menuBtn.innerHTML = '<i class="fa-solid fa-bars"></i>';
}


const navHeight = document.querySelector(".navbar")?.offsetHeight || 70;

window.scrollTo({
top: target.offsetTop - navHeight,
behavior:"smooth"
});

});

});




const form = document.getElementById("contactForm");
const btn = document.getElementById("submitBtn");
const successPopup = document.getElementById("successPopup");
const errorPopup = document.getElementById("errorPopup");

if(form){

form.addEventListener("submit", async function(e){

e.preventDefault();

if(btn){
btn.disabled = true;
btn.textContent = "Sending...";
}

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

if(btn){
btn.disabled = false;
btn.textContent = "Send Message →";
}

});

}


/* ================= POPUP ================= */

function showPopup(popup){

if(!popup) return;

popup.classList.add("show");

setTimeout(()=>{
popup.classList.remove("show");
},2600);

}




const year = document.getElementById("year");
if(year){
year.textContent = new Date().getFullYear();
}

});
