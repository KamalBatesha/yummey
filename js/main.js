let rowData = document.getElementById("rowData");
let searchContainer = document.getElementById("searchContainer");
let navItems = document.querySelectorAll(".side-nav-menu .links ul li");
let submitBtn;

$(document).ready(() => {
  searchByName("").then(() => {
    $(".loading-screen").fadeOut(500);
    $("body").css("overflow", "visible");
  });
});

//   add event to nav items
navItems[0].addEventListener("click", function () {
  showSearchInputs();
  closeSideNav();
});
navItems[1].addEventListener("click", function () {
  getCategories();
  closeSideNav();
});
navItems[2].addEventListener("click", function () {
  getArea();
  closeSideNav();
});
navItems[3].addEventListener("click", function () {
  getIngredients();
  closeSideNav();
});
navItems[4].addEventListener("click", function () {
  showContacts();
  closeSideNav();
});

//  open side nav
function openSideNav() {
  $(".side-nav-menu").animate(
    {
      left: 0,
    },
    500
  );

  $(".open-close-icon").removeClass("fa-align-justify");
  $(".open-close-icon").addClass("fa-x");

  for (let i = 0; i < 5; i++) {
    $(".links li")
      .eq(i)
      .animate(
        {
          top: 0,
        },
        (i + 5) * 100
      );
  }
}
//  close side nav

function closeSideNav() {
  let boxWidth = $(".side-nav-menu .nav-tab").outerWidth();
  $(".side-nav-menu").animate(
    {
      left: -boxWidth,
    },
    500
  );

  $(".open-close-icon").addClass("fa-align-justify");
  $(".open-close-icon").removeClass("fa-x");

  $(".links li").animate(
    {
      top: 300,
    },
    500
  );
}

$(".side-nav-menu i.open-close-icon").click(() => {
  if ($(".side-nav-menu").css("left") == "0px") {
    closeSideNav();
  } else {
    openSideNav();
  }
});

//     display the meals
function displayMeals(arr) {
  let cartoona = "";

  for (let i = 0; i < arr.length; i++) {
    cartoona += `
          <div class="col-md-3">
                  <div onclick="getMealDetails('${arr[i].idMeal}')" class="meal position-relative overflow-hidden rounded-2 cursor-pointer">
                      <img class="w-100" src="${arr[i].strMealThumb}" alt="">
                      <div class="meal-layer position-absolute d-flex align-items-center text-black p-2">
                          <h3>${arr[i].strMeal}</h3>
                      </div>
                  </div>
          </div>
          `;
  }

  rowData.innerHTML = cartoona;
}

//    search the meal by name

async function searchByName(term) {
  closeSideNav();
  rowData.innerHTML = "";
  $(".inner-loading-screen").fadeIn(300);

  let response = await fetch(
    `https://www.themealdb.com/api/json/v1/1/search.php?s=${term}`
  );
  response = await response.json();
  console.log(response);

  response.meals ? displayMeals(response.meals) : displayMeals([]);
  $(".inner-loading-screen").fadeOut(300);
}
//    search the meal by first leter

async function searchByFLetter(term) {
  closeSideNav();
  rowData.innerHTML = "";
  $(".inner-loading-screen").fadeIn(300);

  term == "" ? (term = "a") : "";
  let response = await fetch(
    `https://www.themealdb.com/api/json/v1/1/search.php?f=${term}`
  );
  response = await response.json();

  response.meals ? displayMeals(response.meals) : displayMeals([]);
  $(".inner-loading-screen").fadeOut(300);
}

//   get specific meal and display it
async function getMealDetails(mealID) {
  closeSideNav();
  rowData.innerHTML = "";
  $(".inner-loading-screen").fadeIn(300);

  searchContainer.innerHTML = "";
  let respone = await fetch(
    `https://www.themealdb.com/api/json/v1/1/lookup.php?i=${mealID}`
  );
  respone = await respone.json();
  console.log(respone);

  displayMealDetails(respone.meals[0]);
  $(".inner-loading-screen").fadeOut(300);
}

function displayMealDetails(meal) {
  searchContainer.innerHTML = "";

  let ingredients = ``;

  for (let i = 1; i <= 20; i++) {
    if (meal[`strIngredient${i}`]) {
      ingredients += `<li class="alert alert-info m-2 p-1">${
        meal[`strMeasure${i}`]
      } ${meal[`strIngredient${i}`]}</li>`;
    }
  }

  let tags = meal.strTags?.split(",");
  if (!tags) tags = [];

  let tagsStr = "";
  for (let i = 0; i < tags.length; i++) {
    tagsStr += `
          <li class="alert alert-danger m-2 p-1">${tags[i]}</li>`;
  }

  let cartoona = `
      <div class="col-md-4">
                  <img class="w-100 rounded-3" src="${meal.strMealThumb}"
                      alt="">
                      <h2>${meal.strMeal}</h2>
              </div>
              <div class="col-md-8">
                  <h2>Instructions</h2>
                  <p>${meal.strInstructions}</p>
                  <h3><span class="fw-bolder">Area : </span>${meal.strArea}</h3>
                  <h3><span class="fw-bolder">Category : </span>${meal.strCategory}</h3>
                  <h3>Recipes :</h3>
                  <ul class="list-unstyled d-flex g-3 flex-wrap">
                      ${ingredients}
                  </ul>
  
                  <h3>Tags :</h3>
                  <ul class="list-unstyled d-flex g-3 flex-wrap">
                      ${tagsStr}
                  </ul>
  
                  <a target="_blank" href="${meal.strSource}" class="btn btn-success">Source</a>
                  <a target="_blank" href="${meal.strYoutube}" class="btn btn-danger">Youtube</a>
              </div>`;

  rowData.innerHTML = cartoona;
}

//   show the search input (the first item in sidenav) and search by tow different kind ways
function showSearchInputs() {
  searchContainer.innerHTML = `
      <div class="row py-4 ">
          <div class="col-md-6 ">
              <input onkeyup="searchByName(this.value)" class="form-control bg-transparent text-white" type="text" placeholder="Search By Name">
          </div>
          <div class="col-md-6">
              <input onkeyup="searchByFLetter(this.value)" maxlength="1" class="form-control bg-transparent text-white" type="text" placeholder="Search By First Letter">
          </div>
      </div>`;

  rowData.innerHTML = "";
}

//   get categories and display them

async function getCategories() {
  rowData.innerHTML = "";
  $(".inner-loading-screen").fadeIn(300);
  searchContainer.innerHTML = "";

  let response = await fetch(
    `https://www.themealdb.com/api/json/v1/1/categories.php`
  );
  response = await response.json();
  console.log(response);
  displayCategories(response.categories);
  $(".inner-loading-screen").fadeOut(300);
}

function displayCategories(arr) {
  let cartoona = "";

  for (let i = 0; i < arr.length; i++) {
    cartoona += `
        <div class="col-md-3">
                <div onclick="getCategoryMeals('${
                  arr[i].strCategory
                }')" class="meal position-relative overflow-hidden rounded-2 cursor-pointer">
                    <img class="w-100" src="${arr[i].strCategoryThumb}" alt="${
      arr[i].strCategory
    }">
                    <div class="meal-layer position-absolute text-center text-black p-2">
                        <h3>${arr[i].strCategory}</h3>
                        <p>${arr[i].strCategoryDescription
                          .split(" ")
                          .slice(0, 20)
                          .join(" ")}</p>
                    </div>
                </div>
        </div>
        `;
  }

  rowData.innerHTML = cartoona;
}

async function getCategoryMeals(category) {
  rowData.innerHTML = "";
  $(".inner-loading-screen").fadeIn(300);

  let response = await fetch(
    `https://www.themealdb.com/api/json/v1/1/filter.php?c=${category}`
  );
  response = await response.json();

  displayMeals(response.meals.slice(0, 20));
  $(".inner-loading-screen").fadeOut(300);
}

//  get area
async function getArea() {
  rowData.innerHTML = "";
  $(".inner-loading-screen").fadeIn(300);

  searchContainer.innerHTML = "";

  let respone = await fetch(
    `https://www.themealdb.com/api/json/v1/1/list.php?a=list`
  );
  respone = await respone.json();
  console.log(respone.meals);

  displayArea(respone.meals);
  $(".inner-loading-screen").fadeOut(300);
}

function displayArea(arr) {
  let cartoona = "";

  for (let i = 0; i < arr.length; i++) {
    cartoona += `
        <div class="col-md-3">
                <div onclick="getAreaMeals('${arr[i].strArea}')" class="rounded-2 text-center cursor-pointer">
                        <i class="fa-solid fa-house-laptop fa-4x"></i>
                        <h3>${arr[i].strArea}</h3>
                </div>
        </div>
        `;
  }

  rowData.innerHTML = cartoona;
}
async function getAreaMeals(area) {
  rowData.innerHTML = "";
  $(".inner-loading-screen").fadeIn(300);

  let response = await fetch(
    `https://www.themealdb.com/api/json/v1/1/filter.php?a=${area}`
  );
  response = await response.json();
  console.log(response);

  displayMeals(response.meals.slice(0, 20));
  $(".inner-loading-screen").fadeOut(300);
}

//
async function getIngredients() {
  rowData.innerHTML = "";
  $(".inner-loading-screen").fadeIn(300);

  searchContainer.innerHTML = "";

  let respone = await fetch(
    `https://www.themealdb.com/api/json/v1/1/list.php?i=list`
  );
  respone = await respone.json();
  console.log(respone.meals);

  displayIngredients(respone.meals.slice(0, 20));
  $(".inner-loading-screen").fadeOut(300);
}

function displayIngredients(arr) {
  let cartoona = "";

  for (let i = 0; i < arr.length; i++) {
    cartoona += `
        <div class="col-md-3">
                <div onclick="getIngredientsMeals('${
                  arr[i].strIngredient
                }')" class="rounded-2 text-center cursor-pointer">
                        <i class="fa-solid fa-drumstick-bite fa-4x"></i>
                        <h3>${arr[i].strIngredient}</h3>
                        <p>${arr[i].strDescription
                          .split(" ")
                          .slice(0, 20)
                          .join(" ")}</p>
                </div>
        </div>
        `;
  }

  rowData.innerHTML = cartoona;
}
async function getIngredientsMeals(ingredients) {
  rowData.innerHTML = "";
  $(".inner-loading-screen").fadeIn(300);

  let response = await fetch(
    `https://www.themealdb.com/api/json/v1/1/filter.php?i=${ingredients}`
  );
  response = await response.json();

  displayMeals(response.meals.slice(0, 20));
  $(".inner-loading-screen").fadeOut(300);
}

//  contact and validation
let nameInputValide = false;
let emailInputValide = false;
let phoneInputValide = false;
let ageInputValide = false;
let passwordInputValide = false;
let repasswordInputValide = false;
function showContacts() {
  rowData.innerHTML = `<div class="contact min-vh-100 d-flex justify-content-center align-items-center">
    <div class="container w-75 text-center">
        <div class="row g-4">
            <div class="col-md-6">
                <input id="nameInput"  type="text" class="form-control" placeholder="Enter Your Name">
                <div id="nameAlert" class="alert alert-danger w-100 mt-2 d-none">
                    Special characters and numbers not allowed
                </div>
            </div>
            <div class="col-md-6">
                <input id="emailInput"  type="email" class="form-control " placeholder="Enter Your Email">
                <div id="emailAlert" class="alert alert-danger w-100 mt-2 d-none">
                    Email not valid *exemple@yyy.zzz
                </div>
            </div>
            <div class="col-md-6">
                <input id="phoneInput"  type="text" class="form-control " placeholder="Enter Your Phone">
                <div id="phoneAlert" class="alert alert-danger w-100 mt-2 d-none">
                    Enter valid Phone Number
                </div>
            </div>
            <div class="col-md-6">
                <input id="ageInput"  type="number" class="form-control " placeholder="Enter Your Age">
                <div id="ageAlert" class="alert alert-danger w-100 mt-2 d-none">
                    Enter valid age
                </div>
            </div>
            <div class="col-md-6">
                <input  id="passwordInput"  type="password" class="form-control " placeholder="Enter Your Password">
                <div id="passwordAlert" class="alert alert-danger w-100 mt-2 d-none">
                    Enter valid password *Minimum eight characters, at least one letter and one number:*
                </div>
            </div>
            <div class="col-md-6">
                <input  id="repasswordInput"  type="password" class="form-control " placeholder="Repassword">
                <div id="repasswordAlert" class="alert alert-danger w-100 mt-2 d-none">
                    Enter valid repassword 
                </div>
            </div>
        </div>
        <button id="submitBtn" disabled class="btn btn-outline-danger px-2 mt-3">Submit</button>
    </div>
</div> `;
  submitBtn = document.getElementById("submitBtn");

  document.getElementById("nameInput").addEventListener("input", function () {
    nameInputValide = validation(/^[a-zA-Z ]+$/, this);
    console.log(this);
    howSibling(nameInputValide, this);
    checkSubmitBtn();
  });

  document.getElementById("emailInput").addEventListener("input", function () {
    emailInputValide = validation(
      /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/,
      this
    );
    howSibling(emailInputValide, this);
    checkSubmitBtn();
  });

  document.getElementById("phoneInput").addEventListener("input", function () {
    phoneInputValide = validation(
      /^[\+]?[(]?[0-9]{3}[)]?[-\s\.]?[0-9]{3}[-\s\.]?[0-9]{4,6}$/,
      this
    );
    howSibling(phoneInputValide, this);
    checkSubmitBtn();
  });

  document.getElementById("ageInput").addEventListener("input", function () {
    ageInputValide = validation(
      /^(0?[1-9]|[1-9][0-9]|[1][1-9][1-9]|200)$/,
      this
    );
    howSibling(ageInputValide, this);
    checkSubmitBtn();
  });

  document
    .getElementById("passwordInput")
    .addEventListener("input", function () {
      passwordInputValide = validation(
        /^(?=.*\d)(?=.*[a-z])[0-9a-zA-Z]{8,}$/,
        this
      );
      howSibling(passwordInputValide, this);
      checkSubmitBtn();
    });

  document
    .getElementById("repasswordInput")
    .addEventListener("input", function () {
      repasswordInputValide = this.value == passwordInput.value ? true : false;
      howSibling(repasswordInputValide, this);
      checkSubmitBtn();
    });
}

function howSibling(bolean, input) {
  if (bolean) {
    input.nextElementSibling.classList.add("d-none");
  } else {
    input.nextElementSibling.classList.remove("d-none");
  }
}
function checkSubmitBtn() {
  if (
    nameInputValide &&
    emailInputValide &&
    phoneInputValide &&
    ageInputValide &&
    passwordInputValide &&
    repasswordInputValide
  ) {
    submitBtn.removeAttribute("disabled");
  } else {
    submitBtn.setAttribute("disabled", true);
  }
}

function validation(regex, input) {
  return regex.test(input.value);
}
