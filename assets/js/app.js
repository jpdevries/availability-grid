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

	var availGrid = __webpack_require__(1);

	document.addEventListener('DOMContentLoaded', function () {
	    var grid = new availGrid.AvailabilityGrid();
	});

/***/ },
/* 1 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	var getClosest = __webpack_require__(2).getClosest;
	var getSiblings = __webpack_require__(3).getSiblings;
	var serializeArray = __webpack_require__(4);

	var AvailabilityGrid = function AvailabilityGrid() {
	  var keyCoords = { x: 0, y: 0 },
	      availGrid = document.querySelector('.availability-grid'),
	      inputs = availGrid.querySelectorAll('input[type="checkbox"]');

	  availGrid.addEventListener("keydown", handleKeyPress, false);

	  var rows = availGrid.querySelectorAll('tbody tr');
	  var numCols = rows[0].querySelectorAll('td').length;

	  function handleKeyPress(e) {
	    switch (e.which) {
	      case 38:
	        // up
	        e.preventDefault();
	        keyCoords.y = Math.max(0, keyCoords.y - 1);
	        focusTD();
	        break;

	      case 39:
	        // right
	        e.preventDefault();
	        keyCoords.x = Math.min(numCols - 1, keyCoords.x + 1);
	        focusTD();
	        break;

	      case 40:
	        // down
	        e.preventDefault();
	        keyCoords.y = Math.min(rows.length - 1, keyCoords.y + 1);
	        focusTD();
	        break;

	      case 37:
	        // left
	        e.preventDefault();
	        keyCoords.x = Math.max(0, keyCoords.x - 1);
	        focusTD();
	        break;
	    }

	    function focusTD() {
	      var tr = availGrid.querySelector('tbody tr[data-time="' + keyCoords.y + '"]'),
	          td = tr.querySelector('td[data-dow="' + keyCoords.x + '"]');

	      td.querySelector('input').focus();
	    }
	  }

	  for (var i = 0; i < inputs.length; i++) {
	    var input = inputs[i],
	        label = getSiblings(input)[0],
	        span = label.querySelector('span.a11y-hidden');

	    (function (input, span) {
	      input.addEventListener('change', function (e) {
	        this.focus();
	        span.innerHTML = e.target.checked ? span.innerHTML = span.getAttribute('data-checked-time') : span.innerHTML = span.getAttribute('data-unchecked-time');
	      });
	      input.addEventListener('focus', function (e) {
	        var td = getClosest(this, 'td'),
	            tr = getClosest(this, 'tr'),
	            time = tr.getAttribute('data-time'),
	            dow = parseInt(td.getAttribute('data-dow'));

	        keyCoords.x = parseInt(dow);
	        keyCoords.y = parseInt(time);

	        removeSelectedClasses();

	        tr.classList.add('selected');
	        td.classList.add('selected');

	        function removeSelectedClasses() {
	          var selecteds = document.querySelectorAll('.selected');
	          for (var i = 0; i < selecteds.length; i++) {
	            selecteds[i].classList.remove('selected');
	          }
	        }
	      });
	    })(input, span);
	  }
	};

	exports.AvailabilityGrid = AvailabilityGrid;

/***/ },
/* 2 */
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
/* 3 */
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
/* 4 */
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

/***/ }
/******/ ]);