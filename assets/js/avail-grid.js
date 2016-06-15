/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};

/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {

/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId])
/******/ 			return installedModules[moduleId].exports;

/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			exports: {},
/******/ 			id: moduleId,
/******/ 			loaded: false
/******/ 		};

/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);

/******/ 		// Flag the module as loaded
/******/ 		module.loaded = true;

/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}


/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;

/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;

/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";

/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(0);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	var getClosest = __webpack_require__(1).getClosest;
	var getSiblings = __webpack_require__(2).getSiblings;
	var serializeArray = __webpack_require__(3);
	var index = __webpack_require__(4);

	var AvailabilityGrid = function AvailabilityGrid(_opts) {
	  this.opts = Object.assign({}, {
	    selector: '.availability-grid',
	    inputSelector: 'input[type="checkbox"]',
	    whenTextSelector: 'span.a11y-hidden'
	  }, _opts);

	  this.lastFocusedInput = null;
	  this.shiftKeyDown = false;

	  this.init();
	};

	AvailabilityGrid.prototype.init = function () {
	  var that = this;

	  this.keyCoords = { x: 0, y: 0 };
	  this.entity = document.querySelector(this.opts.selector);

	  this.addListeners();

	  try {
	    this._doInputFocus(this.entity.querySelector('tbody input:focus'));
	  } catch (e) {}
	};

	AvailabilityGrid.prototype.destroy = function () {
	  this.removeListeners();
	};

	AvailabilityGrid.prototype.inverse = function () {
	  var inputs = this.entity.querySelectorAll('tbody input[type="checkbox"]');
	  for (var i = 0; i < inputs.length; i++) {
	    var input = inputs[i];
	    input.checked = !input.checked;
	  }
	};

	AvailabilityGrid.prototype.addListeners = function () {
	  this.addKeyboardListeners();
	  this.addInputListeners();
	};

	AvailabilityGrid.prototype.removeListeners = function () {
	  this.removeKeyboardListeners();
	  this.removeInputListeners();
	};

	AvailabilityGrid.prototype.addKeyboardListeners = function () {
	  var availGrid = document.querySelector(this.opts.selector);

	  availGrid.addEventListener("keydown", this.handleKeyPress.bind(this), false);
	  availGrid.addEventListener("keyup", this.handleKeyUp.bind(this), false);
	};

	AvailabilityGrid.prototype.removeKeyboardListeners = function () {
	  var availGrid = document.querySelector(this.opts.selector);

	  availGrid.removeEventListener("keydown", this.handleKeyPress.bind(this), false);
	  availGrid.removeEventListener("keyup", this.handleKeyUp.bind(this), false);
	};

	AvailabilityGrid.prototype.addInputListeners = function () {
	  var inputs = this.entity.querySelectorAll(this.opts.inputSelector);

	  for (var i = 0; i < inputs.length; i++) {
	    var input = inputs[i];

	    input.addEventListener('change', this.handleInputChange.bind(this));
	    input.addEventListener('focus', this.handleInputFocus.bind(this));
	  }
	};

	AvailabilityGrid.prototype.handleInputChange = function (event) {
	  var label = getSiblings(event.target)[0],
	      span = label.querySelector(this.opts.whenTextSelector);

	  event.target.focus();

	  span.innerHTML = event.target.checked ? span.innerHTML = span.getAttribute('data-checked-time') : span.innerHTML = span.getAttribute('data-unchecked-time');
	};

	AvailabilityGrid.prototype.removeInputListeners = function () {
	  var inputs = this.entity.querySelectorAll(this.opts.inputSelector);

	  for (var i = 0; i < inputs.length; i++) {
	    var input = inputs[i];
	    input.removeEventListener('change', this.handleInputChange.bind(this));
	    input.removeEventListener('focus', this.handleInputFocus.bind(this));
	  }
	};

	AvailabilityGrid.prototype._doInputFocus = function (input) {
	  var td = getClosest(input, 'td'),
	      tr = getClosest(input, 'tr'),
	      tbody = getClosest(tr, 'tbody'),
	      trIndex = index(tr),
	      time = tr.getAttribute('data-time'),
	      that = this,
	      dow = index(td);

	  if (that.shiftKeyDown) {
	    // check/uncheck multiple "matrix" style
	    (function () {
	      var lastFocusedInput = document.querySelector('input[name="' + that.lastFocusedInput + '"]'),
	          lastTd = getClosest(lastFocusedInput, 'td'),
	          lastTr = getClosest(lastFocusedInput, 'tr'),
	          lastTrIndex = index(lastTr),
	          colsToSelect = uniq([index(lastTd), index(td)]).sort(numCompare),
	          rowsToSelect = uniq([index(lastTr), index(tr)]).sort(numCompare),
	          doCheck = input.checked;

	      for (var c = colsToSelect[0]; c <= colsToSelect[colsToSelect.length - 1]; c++) {
	        for (var r = rowsToSelect[0]; r <= rowsToSelect[rowsToSelect.length - 1]; r++) {
	          try {
	            tbody.querySelector('tr[data-time="' + r + '"]').querySelector('td[data-index="' + c + '"]').querySelector('input[type="checkbox"]').checked = doCheck;
	          } catch (e) {}
	        }
	      }

	      function uniq(a) {
	        return Array.from(new Set(a));
	      }

	      function numCompare(a, b) {
	        if (a === b) return 0;
	        return a > b ? 1 : -1;
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
	    for (var i = 0; i < selecteds.length; i++) {
	      selecteds[i].classList.remove('selected');
	    }
	  }
	};

	AvailabilityGrid.prototype.handleInputFocus = function (event) {
	  this._doInputFocus(event.target);
	};

	AvailabilityGrid.prototype.handleKeyPress = function (event) {
	  var that = this;
	  var availGrid = document.querySelector(this.opts.selector);
	  var rows = availGrid.querySelectorAll('tbody tr');
	  var numCols = rows[0].querySelectorAll('td').length;

	  switch (event.which) {
	    case 16:
	      // event.shiftKey
	      that.shiftKeyDown = true;
	      break;

	    case 38:
	      // up
	      event.preventDefault();
	      that.keyCoords.y = Math.max(0, that.keyCoords.y - 1);
	      focusTD();
	      break;

	    case 39:
	      // right
	      event.preventDefault();
	      that.keyCoords.x = Math.min(numCols - 1, that.keyCoords.x + 1);
	      focusTD();
	      break;

	    case 40:
	      // down
	      event.preventDefault();
	      that.keyCoords.y = Math.min(rows.length - 1, that.keyCoords.y + 1);
	      focusTD();
	      break;

	    case 37:
	      // left
	      event.preventDefault();
	      that.keyCoords.x = Math.max(0, that.keyCoords.x - 1);
	      focusTD();
	      break;
	  }

	  function focusTD() {
	    var tr = availGrid.querySelector('tbody tr[data-time="' + that.keyCoords.y + '"]'),
	        td = tr.querySelector('td[data-index="' + that.keyCoords.x + '"]');

	    td.querySelector('input').focus();
	  }
	};

	AvailabilityGrid.prototype.handleKeyUp = function (event) {
	  if (event.which == 16) this.shiftKeyDown = false;
	};

	exports.AvailabilityGrid = AvailabilityGrid;

/***/ },
/* 1 */
/***/ function(module, exports) {

	'use strict';

	/**
	 * Get the closest matching element up the DOM tree.
	 * @param  {Element} elem     Starting element
	 * @param  {String}  selector Selector to match against (class, ID, data attribute, or tag)
	 * @return {Boolean|Element}  Returns null if not match found
	 */
	var getClosest = function getClosest(elem, selector) {

	    // Variables
	    var firstChar = selector.charAt(0);
	    var supports = 'classList' in document.documentElement;
	    var attribute, value;

	    // If selector is a data attribute, split attribute from value
	    if (firstChar === '[') {
	        selector = selector.substr(1, selector.length - 2);
	        attribute = selector.split('=');

	        if (attribute.length > 1) {
	            value = true;
	            attribute[1] = attribute[1].replace(/"/g, '').replace(/'/g, '');
	        }
	    }

	    // Get closest match
	    for (; elem && elem !== document && elem.nodeType === 1; elem = elem.parentNode) {

	        // If selector is a class
	        if (firstChar === '.') {
	            if (supports) {
	                if (elem.classList.contains(selector.substr(1))) {
	                    return elem;
	                }
	            } else {
	                if (new RegExp('(^|\\s)' + selector.substr(1) + '(\\s|$)').test(elem.className)) {
	                    return elem;
	                }
	            }
	        }

	        // If selector is an ID
	        if (firstChar === '#') {
	            if (elem.id === selector.substr(1)) {
	                return elem;
	            }
	        }

	        // If selector is a data attribute
	        if (firstChar === '[') {
	            if (elem.hasAttribute(attribute[0])) {
	                if (value) {
	                    if (elem.getAttribute(attribute[0]) === attribute[1]) {
	                        return elem;
	                    }
	                } else {
	                    return elem;
	                }
	            }
	        }

	        // If selector is a tag
	        if (elem.tagName.toLowerCase() === selector) {
	            return elem;
	        }
	    }

	    return null;
	};

	exports.getClosest = getClosest;

/***/ },
/* 2 */
/***/ function(module, exports) {

	"use strict";

	var getSiblings = function getSiblings(elem) {
	    // https://gomakethings.com/ditching-jquery/#get-sibling-elements
	    var siblings = [];
	    var sibling = elem.parentNode.firstChild;
	    for (; sibling; sibling = sibling.nextSibling) {
	        if (sibling.nodeType === 1 && sibling !== elem) {
	            siblings.push(sibling);
	        }
	    }
	    return siblings;
	};

	exports.getSiblings = getSiblings;

/***/ },
/* 3 */
/***/ function(module, exports) {

	'use strict';

	var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol ? "symbol" : typeof obj; };

	function serializeArray(form) {
	    var field,
	        l,
	        s = [];
	    if ((typeof form === 'undefined' ? 'undefined' : _typeof(form)) == 'object' && form.nodeName == "FORM") {
	        var len = form.elements.length;
	        for (var i = 0; i < len; i++) {
	            field = form.elements[i];
	            if (field.name && !field.disabled && field.type != 'file' && field.type != 'reset' && field.type != 'submit' && field.type != 'button') {
	                if (field.type == 'select-multiple') {
	                    l = form.elements[i].options.length;
	                    for (j = 0; j < l; j++) {
	                        if (field.options[j].selected) s[s.length] = { name: field.name, value: field.options[j].value };
	                    }
	                } else if (field.type != 'checkbox' && field.type != 'radio' || field.checked) {
	                    s[s.length] = { name: field.name, value: field.value };
	                }
	            }
	        }
	    }
	    return s;
	}

	module.exports = serializeArray;

/***/ },
/* 4 */
/***/ function(module, exports) {

	"use strict";

	function index(element) {
	    var sib = element.parentNode.childNodes;
	    var n = 0;
	    for (var i = 0; i < sib.length; i++) {
	        if (sib[i] == element) return n;
	        if (sib[i].nodeType == 1) n++;
	    }
	    return -1;
	}

	module.exports = index;

/***/ }
/******/ ]);