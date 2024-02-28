/*Current year*/
let currentYear = $("#current-year");
currentYear.html(new Date().getFullYear());

/*Toggle theme*/
let themeBtn = $("#toggle-theme");

themeBtn.on("click", changeTheme);
function changeTheme () {
  if (!themeBtn.hasClass("dark")) {
    themeBtn.addClass("dark");
    $("body").addClass("dark-theme");
    localStorage.setItem("theme", "dark");
  } else {
    themeBtn.removeClass("dark");
    $("body").removeClass("dark-theme");
    localStorage.setItem("theme", "light");
  }
}

$(document).ready(function() {
  if (localStorage.getItem('theme') === 'dark') {
    $("body").addClass("dark-theme");
    themeBtn.addClass("dark");
  }
});

$(document).ready(function() {
  const localTheme = window.localStorage.getItem("theme");
  const colorScheme = window.matchMedia("(prefers-color-scheme: dark)").matches;

  if (localTheme === null && colorScheme) {
    themeBtn.addClass("dark");
    $("body").addClass("dark-theme");
  }
});

/*Scroll*/
$(document).ready(function () {
  $("#menu").on("click", "a", function (event) {
    event.preventDefault();
    let id = $(this).attr("href"),
      top = $(id).offset().top;
    $("body,html").animate({ scrollTop: top - 25 }, 500);
  });
});

