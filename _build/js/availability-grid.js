var getClosest = require('./globals/getclosest').getClosest;
var getSiblings = require('./globals/getsiblings').getSiblings;
var serializeArray = require('./globals/serializearray');

var AvailabilityGrid = function() {
  var keyCoords = {x:0,y:0},
  availGrid = document.querySelector('.availability-grid'),
  inputs = availGrid.querySelectorAll('input[type="checkbox"]');

  availGrid.addEventListener("keydown", handleKeyPress, false);

  var rows = availGrid.querySelectorAll('tbody tr');
  var numCols = rows[0].querySelectorAll('td').length;

  function handleKeyPress(e) {
    switch(e.which) {
      case 38: // up
      e.preventDefault();
      keyCoords.y = Math.max(0,keyCoords.y - 1);
      focusTD();
      break;

      case 39: // right
      e.preventDefault();
      keyCoords.x = Math.min(numCols - 1,keyCoords.x + 1);
      focusTD();
      break;

      case 40: // down
      e.preventDefault();
      keyCoords.y = Math.min(rows.length - 1,keyCoords.y + 1);
      focusTD();
      break;

      case 37: // left
      e.preventDefault();
      keyCoords.x = Math.max(0,keyCoords.x - 1);
      focusTD();
      break;
    }

    function focusTD() {
      var tr = availGrid.querySelector('tbody tr[data-time="' + keyCoords.y + '"]'),
      td = tr.querySelector('td[data-dow="' + keyCoords.x + '"]');

      td.querySelector('input').focus();
    }

  }

  for(var i = 0; i < inputs.length; i++) {
    var input = inputs[i],
    label = getSiblings(input)[0],
    span = label.querySelector('span.a11y-hidden');

    (function(input,span){
      input.addEventListener('change',function(e){
        this.focus();
        span.innerHTML = (e.target.checked) ? span.innerHTML = span.getAttribute('data-checked-time') : span.innerHTML = span.getAttribute('data-unchecked-time');
      });
      input.addEventListener('focus',function(e){
        var td = getClosest(this,'td'),
        tr = getClosest(this,'tr'),
        time = tr.getAttribute('data-time'),
        dow = parseInt(td.getAttribute('data-dow'));

        keyCoords.x = parseInt(dow);
        keyCoords.y = parseInt(time);

        removeSelectedClasses();

        tr.classList.add('selected');
        td.classList.add('selected');

        function removeSelectedClasses() {
          var selecteds = document.querySelectorAll('.selected');
          for(var i = 0; i < selecteds.length; i++) selecteds[i].classList.remove('selected');
        }
      })
    })(input,span);
  }
};

exports.AvailabilityGrid = AvailabilityGrid;
