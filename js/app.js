$(document).foundation()


// AMOUNTS CONTROLLER
var amountsController = (function() {

  var Person1 = function(id, description, amount) {
    this.id = id;
    this.description = description;
    this.amount = amount;
  };

  var Person2 = function(id, description, amount) {
    this.id = id;
    this.description = description;
    this.amount = amount;
  };

  var data = {
    allItems: {
      p1: [],
      p2: []
    },
    totals: {
      p1: 0,
      p2: 0
    },
    owedAmt: 0,
  };

  var calculateTotal = function(person) {
    var sum = 0;
    data.allItems[person].forEach(function(cur) {
      sum += cur.amount;
    });
    data.totals[person] = sum;
    return sum;
  };

  return {
    addItem: function(person, des, amt) {
      var ID, newItem;

      // Create new ID based on current array length
      ID = data.allItems[person].length;

      // Create new item based on if it's p1 or p2
      if (person === 'p1') {
        newItem = new Person1(ID, des, amt);
      }
      else if (person === 'p2') {
        newItem = new Person2(ID, des, amt);
      }

      // Push new item into data structure
      data.allItems[person].push(newItem);

      // Return new element
      return newItem;
    },

    calculateOwed: function() {
      var p1Total, p2Total, outcome;

      // Calculate totals of each person's payments
      p1Total = calculateTotal('p1');
      p2Total = calculateTotal('p2');

      // Calculate owed amount
      if (p1Total > p2Total) {
        data.owedAmt = (p1Total - p2Total) / 2;
      }
      else if (p1Total < p2Total) {
        data.owedAmt = (p2Total - p1Total) / 2;
      }
      else {
        data.owedAmt = 0;
      }
    },

    getOwedCalc: function() {
      return {
        owedAmt: data.owedAmt,
        totalp1: data.totals.p1,
        totalp2: data.totals.p2
      };
    }

  };



})();

















// UI CONTROLLER
var UIController = (function() {

  var DOMstrings = {
    inputPerson: '.add__person',
    inputDescription: '.add__description',
    inputAmount: '.add__amount',
    inputBtn: '.add__btn',
    p1Container: '.p1__list',
    p2Container: '.p2__list',
    p1Amt: '.person1__total',
    p2Amt: '.person2__total',
    owedAmt: '.owed__amt',
    p1Title: '.person1__title',
    p2Title: '.person2__title',
    p1ListTitle: '.p1__list__title',
    p2ListTitle: '.p2__list__title',
    p1Opt: '.p1__option',
    p2Opt: '.p2__option'
  };

  var formatNumber = function(num, type) {
    var numSplit, int, dec;

    num = Math.abs(num);
    num = num.toFixed(2);

    numSplit = num.split('.');

    int = numSplit[0];
    if (int.length > 3) {
      int = int.substr(0, int.length - 3) + ',' + int.substr(int.length - 3, 3); //input 23510, output 23,510
    }

    dec = numSplit[1];

    return int + '.' + dec;
};

  var changeClass = function(class1, class2, class3) {
    document.querySelector(DOMstrings.owedAmt).classList.remove(class1);
    document.querySelector(DOMstrings.owedAmt).classList.remove(class2);
    document.querySelector(DOMstrings.owedAmt).classList.add(class3);
  };

  return {
    getDOMstrings: function() {
      return DOMstrings;
    },

    updateUINames: function(n1, n2) {
      document.querySelector(DOMstrings.p1Title).innerHTML = '<p>' + n1 + ' paid:</p>';
      document.querySelector(DOMstrings.p2Title).innerHTML = '<p>' + n2 + ' paid:</p>';
      document.querySelector(DOMstrings.p1ListTitle).innerHTML = '<h2>' + n1 + ' paid:</p>';
      document.querySelector(DOMstrings.p2ListTitle).innerHTML = '<h2>' + n2 + ' paid:</p>';
      document.querySelector('.p1__option').textContent = n1;
      document.querySelector('.p2__option').textContent = n2;
    },

    getInput: function() {
      return {
        person: document.querySelector(DOMstrings.inputPerson).value,
        description: document.querySelector(DOMstrings.inputDescription).value,
        amount: parseFloat(document.querySelector(DOMstrings.inputAmount).value)
      };
    },

    addListItem: function(obj, person) {
      var html, newHtml, element;

      // Create HTML string with placeholder text
      if (person === 'p1') {
        element = DOMstrings.p1Container;
        html = '<div class="item" id="p1-%id%"><div class="row"><div class="columns large-8"><div class="item__description">%description%</div></div><div class="columns large-4 text-right"><div class="item__amount">$%amount%</div></div></div></div><hr/>';
      }
      else if (person === 'p2') {
        element = DOMstrings.p2Container;
        html = '<div class="item" id="p2-%id%"><div class="row"><div class="columns large-8"><div class="item__description">%description%</div></div><div class="columns large-4 text-right"><div class="item__amount">$%amount%</div></div></div></div><hr/>';
      }

      newHtml = html.replace('%id%', obj.id);
      newHtml = newHtml.replace('%description%', obj.description);
      newHtml = newHtml.replace('%amount%', formatNumber(obj.amount));

      // Insert new HTML into DOM
      document.querySelector(element).insertAdjacentHTML('beforeend', newHtml);
    },

    clearFields: function() {
      document.querySelector(DOMstrings.inputDescription).value = "";
      document.querySelector(DOMstrings.inputAmount).value = "";
      document.querySelector(DOMstrings.inputDescription).focus();
    },

    displayOwed: function(obj, name1, name2) {
      document.querySelector(DOMstrings.p1Amt).innerHTML = '<p class="amount">$' + formatNumber(obj.totalp1) + '</p>';
      document.querySelector(DOMstrings.p2Amt).innerHTML = '<p class="amount">$' + formatNumber(obj.totalp2) + '</p>';

      // var outcomeClass = document.getElementById("outcome").classList;

      if(obj.totalp1 > obj.totalp2) {
        document.querySelector(DOMstrings.owedAmt).innerHTML = '<p>' + name2 + ' owes ' + '$' + formatNumber(obj.owedAmt) + '</p>';
        changeClass('neutral-bg', 'red-bg', 'blue-bg');
      }
      else if(obj.totalp1 < obj.totalp2) {
        document.querySelector(DOMstrings.owedAmt).innerHTML = '<p>' + name1 + ' owes ' + '$' + formatNumber(obj.owedAmt) + '</p>';
        changeClass('neutral-bg', 'blue-bg', 'red-bg');
      }
      else if(obj.totalp1 === obj.totalp2) {
        document.querySelector(DOMstrings.owedAmt).innerHTML = '<p>Settled up!</p>';
        changeClass('red-bg', 'blue-bg', 'neutral-bg');
      }
    },

    changeFocus: function() {
      document.querySelector(DOMstrings.inputPerson).classList.toggle('blue-focus');
      document.querySelector(DOMstrings.inputDescription).classList.toggle('blue-focus');
      document.querySelector(DOMstrings.inputAmount).classList.toggle('blue-focus');

      document.querySelector(DOMstrings.inputBtn).classList.toggle('blue');
    }

  };


})();


















// GLOBAL APP CONTROLLER

var controller = (function(amtCtrl, UICtrl) {

  var setupEventListeners = function() {
    var DOM = UICtrl.getDOMstrings();

    document.querySelector(DOM.inputBtn).addEventListener('click', ctrlAddItem);
    document.addEventListener('keypress', function(e) {
      if (e.keyCode === 13 || e.which === 13) {
        ctrlAddItem();
      }
    });

    document.querySelector(DOM.inputPerson).addEventListener('change', UICtrl.changeFocus);
  };

  var getNames = function() {
    var name1, name2;
    name1 = prompt('What is your name?');
    if (name1 !== null) {
      name2 = prompt("What is the name of the person you are settling up with?");
      if (name2 !== null) {
        if (name1 === '') {
          name1 = 'Person 1';
        }
        if (name2 === '') {
          name2 = 'Person 2';
        }
        return {
          name1: name1,
          name2: name2
        }
      }
    }
  };

  var ctrlAddItem = function() {
    var input, newItem;

    // Get field input data
    input = UICtrl.getInput();

    if (input.description !== "" && !isNaN(input.amount) && input.amount > 0) {
      // Add item to amounts controller
      newItem = amtCtrl.addItem(input.person, input.description, input.amount);

      // Add item to UI
      UICtrl.addListItem(newItem, input.person);

      // Clear fields
      UICtrl.clearFields();

      // Calculate and update amounts in final display
      amtCtrl.calculateOwed();
      var owedObj = amtCtrl.getOwedCalc();
      UICtrl.displayOwed(owedObj, name1, name2);
    }
  };


  return {
    init: function() {
      console.log('App started');
      setupEventListeners();

      // Get names of user and friend, and update UI
      var names = getNames();
      name1 = names.name1;
      name2 = names.name2;

      UICtrl.updateUINames(name1, name2);
    }
  };


})(amountsController, UIController);


controller.init();