//Storage Controller
const StorageCtrl = (function () {
  // public methods
  return {
    // Stores an item in the local storage
    storeItem: function (item) {
      let items;
      //check if any items in local storage
      if (localStorage.getItem("items") === null) {
        items = [];
        //push new items
        items.push(item);
        //set local storage
        localStorage.setItem("items", JSON.stringify(items));
      } else {
        items = JSON.parse(localStorage.getItem("items"));
        items.push(item);
        localStorage.setItem("items", JSON.stringify(items));
      }
    },
    // Retrieves items from the local storage
    getItemFromStorage: function () {
      let items;
      if (localStorage.getItem("items") === null) {
        items = [];
      } else {
        items = JSON.parse(localStorage.getItem("items"));
      }
      return items;
    },
    // Updates an item in the local storage
    updateItemStorage: function (updatedItem) {
      let items = JSON.parse(localStorage.getItem("items"));
      items.forEach((item, index) => {
        if (updatedItem.id === item.id) {
          items.splice(index, 1, updatedItem);
        }
      });
      localStorage.setItem("items", JSON.stringify(items));
    },
    // Deletes an item from the local storage
    deleteItemStorage: function (itemToDeleteID) {
      let items = JSON.parse(localStorage.getItem("items"));
      items.forEach((item, index) => {
        if (itemToDeleteID === item.id) {
          items.splice(index, 1);
        }
      });
      localStorage.setItem("items", JSON.stringify(items));
    },
    // Removes all items from the local storage
    removeAllItems: function () {
      localStorage.removeItem("items");
    },
  };
})();

//Item Controller
const ItemCtrl = (function () {
  //item Constructor
  const Item = function (name, calories) {
    this.id = id.next().value;
    this.calories = calories;
    this.name = name;
    // The item constructor function creates new item objects with properties like name and calories
  };

  function* genID() {
    let id = 1;
    while (true) {
      yield id++;
      // Generator function that generates unique IDs for items
    }
  }
  const id = genID(); // Generate a new ID

  // Data Structure / State
  const data = {
    items: StorageCtrl.getItemFromStorage(), // Retrieve items from local storage
    currentItem: null,
    totalCalories: 0,
  };

  //public methods
  return {
    // Retrieves all items
    getItems: function () {
      return data.items;
    },
    // Logs the current data state
    logData: function () {
      return data;
    },
    // Adds a new item
    addItem: function (name, calories) {
      const newItem = new Item(name, parseInt(calories));
      data.items.push(newItem);
      return newItem;
    },
    // Calculates the total calories
    getTotCalories: function () {
      let cal = 0;
      data.items.forEach((item) => {
        cal += item.calories;
      });
      data.totalCalories = cal;
      return data.totalCalories;
    },
    // Retrieves an item by its ID
    getItemByID: function (id) {
      let found = null;
      data.items.forEach((item) => {
        if (item.id === id) {
          found = item;
        }
      });
      return found;
    },
    // Updates an item by its ID
    updateItemByID: function (id, name, calories) {
      let updatedItem = null;
      data.items.forEach((item) => {
        if (item.id === id) {
          item.name = name;
          item.calories = parseInt(calories);
          updatedItem = item;
        }
      });
      return updatedItem;
    },
    // Sets the current item
    setCurrentItem: function (item) {
      data.currentItem = item;
    },
    // Retrieves the current item
    getCurrentItem: function () {
      return data.currentItem;
    },
    // Marks an item to be deleted
    itemToBeDeleted: function (id) {
      //Get ids;
      const ids = data.items.map((item) => {
        return item.id;
      });
      const index = ids.indexOf(id);

      //Remove item
      data.items.splice(index, 1);
    },
    // Clears all items
    clearAllItems: function () {
      data.items = [];
    },
  };
})();

//UI Controller
const UICrtl = (function () {
  const UISelectors = {
    itemList: "#item-list",
    listItems: "#item-list li",
    addBtn: ".add-btn",
    updateBtn: ".update-btn",
    deleteBtn: ".delete-btn",
    backBtn: ".back-btn",
    clearBtn: ".clear-btn",
    itemNameInput: "#item-name",
    itemCaloriesInput: "#item-calories",
    totalCalories: ".total-calories",
  };

  // public method
  return {
    populateItemList: function (items) {
      // Populates the item list in the UI
      let html = "";
      items.forEach((item) => {
        html += `<li class="collection-item" id="item-${item.id}">
                <strong>${item.name}</strong> - <em>${item.calories} calories</em>
                <a href=3"" class="secondary-content"><i class="edit-item fas fa-wrench"></i></a>
            </li>`;
      });
      document.querySelector(UISelectors.itemList).innerHTML = html;
    },
    // Clears the edit state in the UI
    clearEditState: function () {
      UICrtl.clearInputs();
      document.querySelector(UISelectors.updateBtn).style.display = "none";
      document.querySelector(UISelectors.deleteBtn).style.display = "none";
      document.querySelector(UISelectors.backBtn).style.display = "none";
      document.querySelector(UISelectors.addBtn).style.display = "inline";
    },
    // Shows the edit state in the UI
    showEditState: function () {
      document.querySelector(UISelectors.updateBtn).style.display = "inline";
      document.querySelector(UISelectors.deleteBtn).style.display = "inline";
      document.querySelector(UISelectors.backBtn).style.display = "inline";
      document.querySelector(UISelectors.addBtn).style.display = "none";
    },
    // Retrieves selectors from the UI
    getSelectors: function () {
      return UISelectors;
    },
    // Retrieves input values from the UI
    getItemInput: function () {
      return {
        name: document.querySelector(UISelectors.itemNameInput).value,
        calories: document.querySelector(UISelectors.itemCaloriesInput).value,
      };
    },
    // Adds a new item to the UI list
    addListItem(item) {
      const li = document.createElement("li");
      li.className = "collection-item";
      li.id = `item-${item.id}`;
      li.innerHTML = `
        <strong>${item.name}</strong> - <em>${item.calories} calories</em>
        <a href=3"" class="secondary-content">
        <i class="edit-item fas fa-wrench"></i></a>`;
      document
        .querySelector(UISelectors.itemList)
        .insertAdjacentElement("beforeend", li);
    },
    // Clears the input fields in the UI
    clearInputs: function () {
      document.querySelector(UISelectors.itemNameInput).value = "";
      document.querySelector(UISelectors.itemCaloriesInput).value = "";
    },
    // Updates the status list in the UI
    statusList: function (status) {
      document.querySelector(UISelectors.itemList).style.display = status;
    },
    // Updates the total calories in the UI
    updateTotCalories: function (totalCal) {
      document.querySelector(UISelectors.totalCalories).innerHTML = totalCal;
    },
    // Adds the current item to the form for editing
    addItemToForm: function () {
      const currentItem = ItemCtrl.getCurrentItem();
      document.querySelector(UISelectors.itemNameInput).value =
        currentItem.name;
      document.querySelector(UISelectors.itemCaloriesInput).value =
        currentItem.calories;
      UICrtl.showEditState();
    },
    // Updates an item in the UI list
    updateListItem: function (item) {
      const listItems = document.querySelectorAll("#item-list li");
      const listItemsConvert = Array.from(listItems);
      listItemsConvert.forEach((li) => {
        const liID = li.getAttribute("id");
        if (liID === `item-${parseInt(item.id)}`) {
          li.innerHTML = `
              <strong>${item.name}</strong> - <em>${item.calories} calories</em>
              <a href=3"" class="secondary-content">
              <i class="edit-item fas fa-wrench"></i></a>`;
        }
      });
    },
    removeLiItem: function (id) {
      const itemID = `#item-${id}`;
      const item = document.querySelector(itemID);
      item.remove();
    },
    removeAllItems: function () {
      const items = document.getElementById("item-list");
      items.innerHTML = "";
    },
  };
})();

//App Controller
const App = (function (ItemCtrl, StorageCtrl, UICrtl) {
  //load event listener
  const loadEventListeners = function () {
    const UISelectors = UICrtl.getSelectors();

    //add item event
    document
      .querySelector(UISelectors.addBtn)
      .addEventListener("click", itemAddSubmit);

    //Edit icon click event
    document
      .querySelector(UISelectors.itemList)
      .addEventListener("click", itemEditClick);

    // Update one item
    document
      .querySelector(UISelectors.updateBtn)
      .addEventListener("click", itemUpdateSubmit);

    // Return to list adding
    document
      .querySelector(UISelectors.backBtn)
      .addEventListener("click", function (e) {
        UICrtl.clearEditState();
        e.preventDefault();
      });

    //Delte one item
    document
      .querySelector(UISelectors.deleteBtn)
      .addEventListener("click", deleteItem);

    document
      .querySelector(UISelectors.clearBtn)
      .addEventListener("click", clearAllItem);

    document.addEventListener("keypress", function (e) {
      if (e.keyCode === 13 || e.which === 13) {
        e.preventDefault();
        return false;
      }
    });
  };

  //add item submit
  const itemAddSubmit = function (e) {
    //Get form input from UICtrl
    const input = UICrtl.getItemInput();
    if (input.name !== "" && input.calories !== "") {
      const newItem = ItemCtrl.addItem(input.name, input.calories);

      //add item to the UI
      UICrtl.addListItem(newItem);

      //Get total calorie
      const totalCal = ItemCtrl.getTotCalories();

      //Update calorie.
      UICrtl.updateTotCalories(totalCal);

      // made list appeared
      UICrtl.statusList("block");

      //store in localStorage
      StorageCtrl.storeItem(newItem);

      //clear input fields
      UICrtl.clearInputs();
    }

    e.preventDefault();
  };

  const itemEditClick = function (e) {
    if (e.target.classList.contains("edit-item")) {
      //Get List item id
      const listID = e.target.parentNode.parentNode.id;

      //split the item-id tp get omlu te id
      const listIdArr = listID.split("-");
      // get the id number
      const id = parseInt(listIdArr[1]);

      //Get Item
      const itemToEdit = ItemCtrl.getItemByID(id);

      //set curret item
      ItemCtrl.setCurrentItem(itemToEdit);

      //add item to form
      UICrtl.addItemToForm();
    }
    e.preventDefault();
  };

  const itemUpdateSubmit = function (e) {
    const input = UICrtl.getItemInput();
    const itemId = ItemCtrl.getCurrentItem().id;

    // update the data
    const updatedItemSubmit = ItemCtrl.updateItemByID(
      itemId,
      input.name,
      input.calories
    );

    // udpate item list in UI
    UICrtl.updateListItem(updatedItemSubmit);

    //Get total calorie
    const totalCal = ItemCtrl.getTotCalories();

    //Update calorie.
    UICrtl.updateTotCalories(totalCal);

    //set ititial states
    UICrtl.clearEditState();

    //Udpate local storage
    StorageCtrl.updateItemStorage(updatedItemSubmit);

    //clear input fields
    UICrtl.clearInputs();

    e.preventDefault();
  };

  const deleteItem = function (e) {
    // retrieve the item id
    const itemToDeleteID = ItemCtrl.getCurrentItem().id;

    ItemCtrl.itemToBeDeleted(itemToDeleteID);

    UICrtl.removeLiItem(itemToDeleteID);

    //Get total calorie
    const totalCal = ItemCtrl.getTotCalories();

    //Update calorie.
    UICrtl.updateTotCalories(totalCal);

    //delete fron local storage
    StorageCtrl.deleteItemStorage(itemToDeleteID);

    //set ititial states
    UICrtl.clearEditState();

    e.preventDefault();
  };

  const clearAllItem = function (e) {
    //remove all item in items list
    ItemCtrl.clearAllItems();

    //Remove items in UI
    UICrtl.removeAllItems();

    StorageCtrl.removeAllItems();

    //Get total calorie
    const totalCal = ItemCtrl.getTotCalories();

    //Update calorie.
    UICrtl.updateTotCalories(totalCal);

    //hide the list
    UICrtl.statusList("none");

    e.preventDefault();
  };

  //public method
  return {
    init: function () {
      //set ititial states
      UICrtl.clearEditState();

      //Fetch items from data structur
      const items = ItemCtrl.getItems();

      const totalCal = ItemCtrl.getTotCalories();
      //   update UI consequentlz to totCal
      UICrtl.updateTotCalories(totalCal);

      //Check if ther is any items
      if (items.length === 0) {
        UICrtl.statusList("none");
      } else {
        //Populate list with items
        UICrtl.populateItemList(items);
      }

      //load Event Listeneers
      loadEventListeners();
    },
  };
})(ItemCtrl, StorageCtrl, UICrtl);

//Initilizing App
App.init();
// Overall, this code follows a Model-View-Controller (MVC) architectural pattern, where StorageCtrl acts as the model, ItemCtrl represents the controller, and UICtrl represents the view.
