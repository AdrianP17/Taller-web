
const page = document.getElementById("page");
var counterClicks = 0;

page.addEventListener("click", (event) => {
    counterClicks++;
    console.log("Click number: " + counterClicks);
    page.innerHTML = "Click number: " + counterClicks; 
})
    
