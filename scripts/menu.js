var menu = document.querySelector(".overlay")
var ham = document.querySelector(".overlay__button")
var xIcon = document.querySelector(".overlay__button-Xicon")
var menuIcon = document.querySelector(".overlay__button-open")
var body = document.querySelector("body")

ham.addEventListener("click", toggleMenu)

function toggleMenu() {
  if (menu.classList.contains("showMenu")) {
    menu.classList.remove("showMenu");
    xIcon.style.display = "none";
    menuIcon.style.display = "block";
    body.style.overflowY = "visible";
    
    
  } else {
    menu.classList.add("showMenu");
    xIcon.style.display = "block";
    menuIcon.style.display = "none";
    body.style.overflowY = "hidden";
  }


}

var menuLink = document.querySelectorAll(".overlay-menu__link")

menuLink.forEach(
  function (menuLink) {
    menuLink.addEventListener("click", toggleMenu)
  }
)