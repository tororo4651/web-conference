window.addEventListener("DOMContentLoaded", (e) => {

  let gNavBtn = document.getElementById("js-gNavBtn");
  let html = document.documentElement;

  gNavBtn.addEventListener("click", (e) => {
    html.classList.toggle("is-gNavOpen");

    if (gNavBtn.textContent === "Menu") {
      gNavBtn.textContent = "Close";
    } else {
      gNavBtn.textContent = "Menu";
    }
  });

});
