import { user, arr, necessaryExpenses, todo } from "./data.js";

const refs = {
  userPhoto: document.querySelector(".user-photo"),
  container: document.querySelector(".container"),
  userName: document.querySelector(".user-name"),
  qrCode: document.querySelector(".qr-code"),
  dreams: document.querySelector(".dreams"),
  plot1: document.querySelector(".plot-1"),
  plot2: document.querySelector(".plot-2"),
  plot3: document.querySelector(".accumulator"),
  clear: document.querySelector(".clear"),
  list: document.querySelector(".list"),
  dreamImg1: document.querySelector(".dream-1 .card-img"),
  dreamImg2: document.querySelector(".dream-2 .card-img"),
  dreamImg3: document.querySelector(".dream-3 .card-img"),
  dreamDescription1: document.querySelector(".dream-1 .card-description"),
  dreamDescription2: document.querySelector(".dream-2 .card-description"),
  dreamDescription3: document.querySelector(".dream-3 .card-description"),
};

/* =============== #PLOT ======================= */

function addNewDreamHandler() {
  const lastDreamClass = refs.dreams.querySelector("figure:last-child");
  console.log(lastDreamClass);
  lastDreamClass.insertAdjacentHTML(
    "beforebegin",
    `<figure class="card dream-2">
      <button class="button-reset">Reset</button>
      <div class="card-img-wrapper">
        <img src="./images/programming.jpg" 
          class="card-img" 
        />
      </div>
      <figcaption class="card-description"><input type="text"></figcaption>
    </figure>`
  );
  const input = refs.dreams.querySelector("input");
  input.onkeydown = inputHandler;
}

function deleteDream(event, index) {
  // get reset button, delete it with parent Element, delete localStorage record with index
  console.log("delete");
  const { target: button } = event;
  button.parentNode.remove();
  button.remove();
  const currentItems = JSON.parse(localStorage.getItem("dreams"));
  localStorage.removeItem("dreams");
  currentItems.splice(index, 1);
  localStorage.setItem("dreams", JSON.stringify([...currentItems]));
}

function inputHandler(event) {
  const { target: input } = event;
  const inputValue = input.value;
  if (event.key === "Enter") {
    const currentDreams = JSON.parse(localStorage.getItem("dreams")) || [];
    const jsonItem = JSON.stringify([...currentDreams, inputValue]);
    localStorage.setItem("dreams", jsonItem);
    input.insertAdjacentHTML(
      "beforebegin",
      `<figcaption> ${inputValue}</ figcaption>`
    );
    input.remove();
    document.querySelectorAll(".button-reset").forEach((element, i) => {
      element.onclick = (event) => deleteDream(event, i);
    });
  }
  if (event.key === "Escape") {
    input.parentNode.parentNode.remove();
  }
}

function showPlot(array) {
  const maxHeight = 260;
  const maxValue = Math.max(...array);
  let scalingFactor = maxHeight / maxValue;
  return array
    .map(
      (e) => `
  <li class="plot-item" 
      style="height: ${e * scalingFactor}px" 
      title="${e}">
  </li> 
  `
    )
    .join("");
}

const stringHTML1 = showPlot(arr);

// filter

function isOverNecessaryExpenses(value) {
  // return value > 800;
  return value > necessaryExpenses;
}

const over = arr.filter(isOverNecessaryExpenses);

function save(element) {
  return element - necessaryExpenses;
}

const overNecessaryExpenses = over.map(save);

const stringHTML2 = showPlot(overNecessaryExpenses);

// reduce
const years = over.length;

function getSumForYear(value) {
  const forSave = value - necessaryExpenses;
  return forSave * years;
}

const sumByYear = over.map(getSumForYear);

function getSum(accumulator, element) {
  return accumulator + element;
}

const accumulation = sumByYear.reduce(getSum, 0);

const stringHTML3 = `<p>
  За ${years} років я можу накопичити<br> 
  <span class="gold">${accumulation}</span>
</p>`;

function showDreams(root, array) {
  var previousRecords = JSON.parse(localStorage.getItem("dreams")) || [];
  var formatedPreviousRecords = previousRecords
    .map(
      (e) => `
  <figure class="card dream-2">
    <button class="button-reset">Reset</button>
    <div class="card-img-wrapper">
      <img src="./images/programming.jpg" 
           alt="${e}"
           class="card-img" 
      />
    </div>
    <figcaption class="card-description">${e}</figcaption>
  </figure>
  `
    )
    .join("");
  const btn = `<figure>
    <div class="card-img-wrapper">
      <button id="add_button"><img src="./images/plus.png" 
          alt="Добавить" 
          class="card-img" 
      /> Добавить
      </button>
    </div>
    <figcaption class="card-description">Добавить</figcaption>
  </figure>`;
  root.insertAdjacentHTML("afterbegin", formatedPreviousRecords + btn);
  const button = document.getElementById("add_button");
  document.querySelectorAll(".button-reset").forEach((element, i) => {
    element.onclick = (event) => deleteDream(event, i);
  });
  button.onclick = addNewDreamHandler;
}

function showPerson(ref, person) {
  const { name, surname, userPhoto, qrQode } = person;
  const getFullName = `${name} ${surname}`;
  ref.userName.textContent = getFullName;
  ref.userPhoto.alt = getFullName;
  ref.userPhoto.src = `./images/${userPhoto}`;
  ref.qrCode.src = `./images/${qrQode}`;
}

function showTODO(ref, array) {
  const todos = array
    .map(
      ({ month, skill }) =>
        `<li class="list-item">
           <span class="month">${month}</span>
           <span class="skill">${skill}</span>
         </li>`
    )
    .join("");

  ref.insertAdjacentHTML("afterbegin", todos);
}

function run() {
  refs.plot1.insertAdjacentHTML("afterbegin", stringHTML1);
  refs.plot2.insertAdjacentHTML("afterbegin", stringHTML2);
  refs.plot3.insertAdjacentHTML("afterbegin", stringHTML3);
  showPerson(refs, user);
  showDreams(refs.dreams, user.dreams);
  showTODO(refs.list, todo);
}

run();
