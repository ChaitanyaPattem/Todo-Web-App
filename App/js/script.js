const form = document.querySelector("#form_in");
const inputItem = document.querySelector(".sent");
const itemsLists = document.querySelector("#itemsLists");
const filters = document.querySelectorAll(".status");

let todoItems = [];

const getItemsFilter = function(type) {
  let filterItems = [];
  switch (type) {
    case "active":
      filterItems = todoItems.filter((item) => !item.isDone);
      break;
    case "completed":
      filterItems = todoItems.filter((item) => item.isDone);
      break;
    default :
      filterItems = todoItems;
  }
  getList(filterItems);
};

const removeItem = function(item) {
  const removeIndex = todoItems.indexOf(item);
  todoItems.splice(removeIndex, 1);
};


const handleItem = function (itemData) {
  const items = document.querySelectorAll(".itemsList");
  items.forEach((item)=> {
    if(item.querySelector(".sent").getAttribute("data-time")== itemData.addedAt){
      item.querySelector("[data-done]").addEventListener('click',function (e){
        e.preventDefault();
        const itemIndex = todoItems.indexOf(itemData);
        const currentItem = todoItems[itemIndex];
        const currentClass = currentItem.isDone ? "checkIn" : "circle";
        
        currentItem.isDone = currentItem.isDone ? false : true;
        todoItems.splice(itemIndex, 1, currentItem);
        setLocalStorage(todoItems);
        const iconClass = currentItem.isDone ? "checkIn" : "circle";
        this.classList.replace(currentClass, iconClass);
      });
      item.querySelector("[data-delete]").addEventListener("click", function (e){
        e.preventDefault();
        itemsLists.removeChild(item);
        removeItem(item);
        setLocalStorage(todoItems);
        return todoItems.filter((item)=> item != itemData);
      });
    }
  });
};

const getList = function (todoItems) {
  itemsLists.innerHTML = " ";
  if(todoItems.length > 0){
    todoItems.forEach((item) => {
      const iconClass = item.isDone ? "checkIn" : "circle";
      itemsLists.insertAdjacentHTML(
        "beforeend", 
        `<li class="itemsList">
        <span class="${iconClass}" data-done></span>
        <div class="listItems">
          <p class="sent" data-time="${item.addedAt}">${item.name}</p>
          <span class="close" data-delete></span>
        </div>
      </li>`
      );
      handleItem(item);
    });
  }
}

const getLocalStorage = function () {
  const todoStorage = localStorage.getItem("todoItems");
  if(todoStorage === "undefined" || todoStorage === null) {
    todoItems = [];
  } else {
    todoItems = JSON.parse(todoStorage);
  }
  console.log("items", todoItems);
  getList(todoItems);
};

const setLocalStorage = function (todoItems) {
  localStorage.setItem("todoItems", JSON.stringify(todoItems));
};

document.addEventListener("DOMContentLoaded", ()=> {
  form.addEventListener("submit", (e)=> {
    e.preventDefault();
    const itemName = inputItem.value.trim();
    if(itemName.length === 0){
      alert("hello");
    } else {
      const itemObj = {
        name: itemName,
        isDone: false,
        addedAt: new Date().getTime(),
      };
      todoItems.push(itemObj);
      setLocalStorage(todoItems);
    }
    getList(todoItems);
    inputItem.value= " ";
  });

  filters.forEach((tab)=> {
    tab.addEventListener("click", function(e){
      e.preventDefault();
      const tabType = this.getAttribute("data-type");
      document.querySelectorAll(".status-Filter").forEach((status)=> {
        status.classList.remove("active");
      });
      this.firstElementChild.classList.add("active");
      getItemsFilter(tabType);
    });
  });
  
  getLocalStorage();
});

