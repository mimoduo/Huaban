/*

  site/main

*/


// ================
// Main Site Function
// ================

// Setup interactive svg
var huaban = Snap('.huaban');

// Establish huaban elements
var surface = document.querySelector('.huaban');
var huabanOptions = document.querySelectorAll('.huaban-options li');
var message = document.querySelector('.huaban-message');
var messageText = document.querySelector('.huaban-message span');

// Establish huaban surface events
surface.addEventListener('mousedown', touchSurface, false);
surface.addEventListener('mousemove', drawSurface, false);
surface.addEventListener('mouseup', leaveSurface, false);

// Establish huaban option events
huabanOptions[0].addEventListener('click', resetSurface, false);
huabanOptions[1].addEventListener('click', undo, false);

// Establish user generated elements
var px = 0;
var py = 0;

var shape = [];
var pencil = [];
var pencilNumber = 0;


// ----------------
// Huaban Surface Events
// ----------------

function captureSurface(event) {

  px = event.pageX;
  py = event.pageY;

  shape[pencilNumber].push(px, py);

  pencil[pencilNumber].attr({
    points: shape[pencilNumber]
  })

}

function touchSurface(event) {

  shape.push([]);
  pencil.push([]);

  pencil[pencilNumber] = huaban.polyline().attr({
    fill: 'transparent',
    stroke: '#000'
  });

  captureSurface(event);

}

function drawSurface(event) {

  if(event.buttons != 0) {
    captureSurface(event);
  }

}

function leaveSurface(event) {

  pencilNumber++;

}

// ----------------
// Huaban Option Events
// ----------------

function showMessage(action) {

  messageText.innerHTML = action;
  message.classList.add('show-message');

  setTimeout(function() {

    message.classList.remove('show-message');

  }, 2000);

}

function resetSurface() {

  if (pencilNumber != 0) {

    huaban.clear();

    shape = [];
    pencil = [];

    pencilNumber = 0;

    showMessage('The entire huaban has been reset');

  } else {

    showMessage('There is nothing to reset');

  }

}

function undo() {

  // pencilNumber increases by 1 on mouseup which leaves an empty reference
  if (pencilNumber >= 1) {

    pencilNumber--;

    pencil[pencilNumber].remove();

    shape.pop();
    pencil.pop();

    showMessage('The last drawn shape has been removed');

  } else {

    showMessage('There are no shapes to remove');

  }


}
