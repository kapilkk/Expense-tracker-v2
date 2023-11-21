import { defaultProject } from "./init-firebase.js";

let db = defaultProject.firestore();

let expenseTypes = [
  {
    id: 1,
    title: "Shopping",
    iconClass: "fa-cart-shopping",
  },
  {
    id: 2,
    title: "Food/Drinks",
    iconClass: "fa-burger",
  },
  {
    id: 3,
    title: "Entertainment",
    iconClass: "fa-film",
  },
  {
    id: 4,
    title: "Transportation",
    iconClass: "fa-train-subway",
  },
  {
    id: 5,
    title: "Communication",
    iconClass: "fa-phone",
  },
  {
    id: 6,
    title: "Housing",
    iconClass: "fa-house-circle-check",
  },
  {
    id: 7,
    title: "Vehicle",
    iconClass: "fa-car",
  },
];
let expenseList = [];

getAllExpenses();

const formElem = document.querySelector("#expenseForm");
const bottomRightSection = document.querySelector(".bottom-right-section");
const addExpenseButton = document.querySelector(".add-expense-button");
const closeButton = document.querySelector(".close-button");

formElem.addEventListener("submit", (e) => {
  e.preventDefault();
  const expenseForElem = document.getElementById("expense-for");
  const expenseTypeElem = document.getElementById("expense-type");
  const expenseAmountElem = document.getElementById("expense-amount");

  const expenseForElemVal = expenseForElem.value;
  const expenseTypeElemVal = expenseTypeElem.value;
  const expenseAmountElemVal = expenseAmountElem.value;

  if (
    expenseForElemVal == "" ||
    expenseTypeElemVal == "" ||
    expenseTypeElemVal == "0" ||
    expenseAmountElemVal == ""
  ) {
    displayToaster(0, "Fill all the inputs.");
    return;
  }

  const expenseObj = {
    title: expenseForElemVal,
    type: parseInt(expenseTypeElemVal),
    amount: parseInt(expenseAmountElemVal),
  };
  db.collection("Expenses")
    .add(expenseObj)
    .then(() => {
      displayToaster(1, "Expense added successfully.");

      expenseForElem.value = "";
      expenseTypeElem.value = 0;
      expenseAmountElem.value = "";

      if (window.innerWidth <= 567) hideBottomRightSection();
      getAllExpenses();
    })
    .catch((err) => {
      displayToaster(0, "Error adding expense.");
    });
});

addExpenseButton.addEventListener("click", () => {
  bottomRightSection.style.display = "block";
});

closeButton.addEventListener("click", () => {
  hideBottomRightSection();
});

function hideBottomRightSection() {
  bottomRightSection.style.display = "none";
}

function displayExpenseCounts() {
  let expenseTypeMap = new Map();
  expenseTypes.forEach((_) => {
    expenseTypeMap.set(_.id, 0);
  });

  expenseList.forEach((_) => {
    let val = parseInt(expenseTypeMap.get(_.type));
    expenseTypeMap.set(_.type, parseInt(val + _.amount));
  });

  let topSectionElement = document.querySelector(".top-section");
  topSectionElement.innerHTML = "";
  expenseTypes.forEach((_) => {
    let topSectionCountElem = document.createElement("div");
    topSectionCountElem.classList.add("top-section-count");

    let categoryElem = document.createElement("p");
    categoryElem.innerText = _.title;

    let countValElem = document.createElement("div");
    countValElem.classList.add("top-section-count-val");

    let countElem = document.createElement("p");
    countElem.innerText = `Rs. ${expenseTypeMap.get(_.id)}`;

    let categoryIcon = document.createElement("i");
    categoryIcon.classList.add("fa");
    categoryIcon.classList.add(_.iconClass);

    countValElem.appendChild(countElem);
    countValElem.appendChild(categoryIcon);

    topSectionCountElem.appendChild(categoryElem);
    topSectionCountElem.appendChild(countValElem);

    topSectionElement.appendChild(topSectionCountElem);
  });
}

function getAllExpenses() {
  const expenseListElem = document.querySelector(".expense-list");
  expenseListElem.innerHTML = "";

  db.collection("Expenses")
    .get()
    .then((querySnapshot) => {
      expenseList = [];
      const expenseListElem = document.querySelector(".expense-list");

      querySnapshot.forEach((doc) => {
        expenseList.push(doc.data());
        expenseListElem.appendChild(createExpenseItem(doc.data()));
      });

      displayExpenseCounts();
    })
    .catch((error) => {
      displayToaster(0, "Error fetching expenses.");
    });
}

function createExpenseItem(expenseData) {
  const listItem = document.createElement("li");
  listItem.classList.add("expense-list-item");

  const listItemIcon = document.createElement("i");
  const iconClass = getExpenseTypeIconClass(expenseData.type);
  listItemIcon.classList.add("fa");
  listItemIcon.classList.add(iconClass);

  const listItemTitle = document.createElement("span");
  listItemTitle.innerText = expenseData.title;

  const listItemAmt = document.createElement("span");
  listItemAmt.classList.add("expense-amt");
  listItemAmt.innerText = `Rs. ${expenseData.amount}`;

  listItem.appendChild(listItemIcon);
  listItem.appendChild(listItemTitle);
  listItem.appendChild(listItemAmt);

  return listItem;
}

function getExpenseTypeIconClass(type) {
  const expenseType = expenseTypes.find((_) => _.id == type);
  return expenseType.iconClass;
}

function displayToaster(type, toasterMsg) {
  const toasterElem = document.querySelector(".toaster");

  if (type == 1) toasterElem.classList.add("toaster-success");
  else if (type == 0) toasterElem.classList.add("toaster-error");

  toasterElem.innerText = toasterMsg;
  toasterElem.style.display = "block";

  setTimeout(() => {
    toasterElem.style.display = "none";
  }, 2500);
}
