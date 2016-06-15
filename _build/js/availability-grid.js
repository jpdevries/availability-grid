var getClosest = require('./globals/getclosest').getClosest;
var getSiblings = require('./globals/getsiblings').getSiblings;
var serializeArray = require('./globals/serializearray');
var index = require('./globals/index');

var AvailabilityGrid = function(_opts) {
  this.opts = Object.assign({},{
    selector:'.availability-grid',
    inputSelector:'input[type="checkbox"]',
    whenTextSelector:'span.a11y-hidden'
  },_opts);

  this.lastFocusedInput = null;
  this.shiftKeyDown = false;

  this.init();
};

AvailabilityGrid.prototype.init = function() {
  var that = this;

  this.keyCoords = {x:0,y:0};
  this.entity = document.querySelector(this.opts.selector);

  this.addListeners();

  try {
    this._doInputFocus(this.entity.querySelector('tbody input:focus'))
  } catch(e) {}
};

AvailabilityGrid.prototype.destroy = function() {
  this.removeListeners();
};

AvailabilityGrid.prototype.inverse = function() {
  var inputs = this.entity.querySelectorAll('tbody input[type="checkbox"]');
  for(var i = 0; i < inputs.length; i++) {
    var input = inputs[i];
    input.checked = !input.checked;
  }
};

AvailabilityGrid.prototype.addListeners = function() {
  this.addKeyboardListeners();
  this.addInputListeners();
};

AvailabilityGrid.prototype.removeListeners = function() {
  this.removeKeyboardListeners();
  this.removeInputListeners();
};

AvailabilityGrid.prototype.addKeyboardListeners = function() {
  var availGrid = document.querySelector(this.opts.selector);

  availGrid.addEventListener("keydown", this.handleKeyPress.bind(this), false);
  availGrid.addEventListener("keyup", this.handleKeyUp.bind(this), false);
};

AvailabilityGrid.prototype.removeKeyboardListeners = function() {
  var availGrid = document.querySelector(this.opts.selector);

  availGrid.removeEventListener("keydown", this.handleKeyPress.bind(this), false);
  availGrid.removeEventListener("keyup", this.handleKeyUp.bind(this), false);
};

AvailabilityGrid.prototype.addInputListeners = function() {
  var inputs = this.entity.querySelectorAll(this.opts.inputSelector);

  for(var i = 0; i < inputs.length; i++) {
    var input = inputs[i];

    input.addEventListener('change',this.handleInputChange.bind(this));
    input.addEventListener('focus',this.handleInputFocus.bind(this));
  }
};

AvailabilityGrid.prototype.handleInputChange = function(event) {
  var label = getSiblings(event.target)[0],
  span = label.querySelector(this.opts.whenTextSelector);

  event.target.focus();

  span.innerHTML = (event.target.checked) ? span.innerHTML = span.getAttribute('data-checked-time') : span.innerHTML = span.getAttribute('data-unchecked-time');
};

AvailabilityGrid.prototype.removeInputListeners = function() {
  var inputs = this.entity.querySelectorAll(this.opts.inputSelector);

  for(var i = 0; i < inputs.length; i++) {
    var input = inputs[i];
    input.removeEventListener('change',this.handleInputChange.bind(this));
    input.removeEventListener('focus',this.handleInputFocus.bind(this));
  }
};

AvailabilityGrid.prototype._doInputFocus = function(input) {
  var td = getClosest(input,'td'),
  tr = getClosest(input,'tr'),
  tbody = getClosest(tr,'tbody'),
  trIndex = index(tr),
  time = tr.getAttribute('data-time'),
  that = this,
  dow = index(td);

  if(that.shiftKeyDown) { // check/uncheck multiple "matrix" style
    (function(){
      var lastFocusedInput = document.querySelector('input[name="' + that.lastFocusedInput + '"]'),
      lastTd = getClosest(lastFocusedInput,'td'),
      lastTr = getClosest(lastFocusedInput,'tr'),
      lastTrIndex = index(lastTr),
      colsToSelect = uniq([index(lastTd),index(td)]).sort(numCompare),
      rowsToSelect = uniq([index(lastTr),index(tr)]).sort(numCompare),
      doCheck = input.checked;

      for(var c = colsToSelect[0]; c <= colsToSelect[colsToSelect.length-1]; c++) {
        for(var r = rowsToSelect[0]; r <= rowsToSelect[rowsToSelect.length-1]; r++) {
          try {
            tbody.querySelector('tr[data-time="' + r + '"]')
            .querySelector('td[data-index="' + c + '"]')
            .querySelector('input[type="checkbox"]').checked = doCheck;
          } catch(e) {}
        }
      }

      function uniq(a) {
        return Array.from(new Set(a));
      }

      function numCompare(a,b) {
        if(a === b) return 0;
        return (a > b) ? 1 : -1;
      }

    })();
  }

  this.keyCoords.x = index(td);
  this.keyCoords.y = parseInt(time);

  removeSelectedClasses();

  tr.classList.add('selected');
  td.classList.add('selected');

  this.lastFocusedInput = input.getAttribute('name');

  function removeSelectedClasses() {
    var selecteds = document.querySelectorAll('.selected');
    for(var i = 0; i < selecteds.length; i++) selecteds[i].classList.remove('selected');
  }
}

AvailabilityGrid.prototype.handleInputFocus = function(event){
  this._doInputFocus(event.target);
};

AvailabilityGrid.prototype.handleKeyPress = function(event) {
  var that = this;
  var availGrid = document.querySelector(this.opts.selector);
  var rows = availGrid.querySelectorAll('tbody tr');
  var numCols = rows[0].querySelectorAll('td').length;

  switch(event.which) {
    case 16: // event.shiftKey
    that.shiftKeyDown = true;
    break;

    case 38: // up
    event.preventDefault();
    that.keyCoords.y = Math.max(0,that.keyCoords.y - 1);
    focusTD();
    break;

    case 39: // right
    event.preventDefault();
    that.keyCoords.x = Math.min(numCols - 1,that.keyCoords.x + 1);
    focusTD();
    break;

    case 40: // down
    event.preventDefault();
    that.keyCoords.y = Math.min(rows.length - 1,that.keyCoords.y + 1);
    focusTD();
    break;

    case 37: // left
    event.preventDefault();
    that.keyCoords.x = Math.max(0,that.keyCoords.x - 1);
    focusTD();
    break;
  }

  function focusTD() {
    var tr = availGrid.querySelector('tbody tr[data-time="' + that.keyCoords.y + '"]'),
    td = tr.querySelector('td[data-index="' + that.keyCoords.x + '"]');

    td.querySelector('input').focus();
  }

}

AvailabilityGrid.prototype.handleKeyUp = function(event) {
  if(event.which == 16) this.shiftKeyDown = false;
};

exports.AvailabilityGrid = AvailabilityGrid;
