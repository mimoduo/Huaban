/*

  site/main

*/


// ================
// Main Site Function
// ================

// Huaban setup
var huaban = Snap('.huaban');

// Huaban surface setup
var surface = document.querySelector('.huaban');
surface.addEventListener('mousedown', touchSurface, false);
surface.addEventListener('mousemove', drawSurface, false);
surface.addEventListener('mouseup', leaveSurface, false);

var sketchLink = document.createElement('a');

// Huaban menu setup
var menu = document.querySelectorAll('.huaban-menu li');
menu[0].addEventListener('click', resetSurface, false);
menu[1].addEventListener('click', undo, false);
menu[2].addEventListener('click', settings.bind(null, '.stroke-setting'), false);
menu[3].addEventListener('click', settings.bind(null, '.fill-setting'), false);
menu[4].addEventListener('click', downloadSketch, false);

// Huaban settings panel setup
var settings = document.querySelector('.huaban-settings');
var settingsClose = document.querySelector('.huaban-settings-close');
var selectedSetting = '';
settingsClose.addEventListener('click', closeSettings, false);

// Huaban settings setup
var strokeRedSetting = document.querySelector('.stroke-red');
var strokeGreenSetting = document.querySelector('.stroke-green');
var strokeBlueSetting = document.querySelector('.stroke-blue');
var strokeWidthSetting = document.querySelector('.stroke-width');
var strokeLinecapSetting = document.querySelector('.stroke-line-cap');
var strokeLinejoinSetting = document.querySelector('.stroke-line-join');

var fillRedSetting = document.querySelector('.fill-red');
var fillGreenSetting = document.querySelector('.fill-green');
var fillBlueSetting = document.querySelector('.fill-blue');
var fillOpacitySetting = document.querySelector('.fill-opacity');

// Huaban notification system setup
var message = document.querySelector('.huaban-message');
var messageText = document.querySelector('.huaban-message span');

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
    fill: 'rgba(' + fillRedSetting.value + ', ' + fillGreenSetting.value + ', ' + fillBlueSetting.value + ', ' + fillOpacitySetting.value + ')',
    stroke: 'rgb(' + strokeRedSetting.value + ', ' + strokeGreenSetting.value + ', ' + strokeBlueSetting.value + ')',
    strokeWidth: strokeWidthSetting.value,
    strokeLinecap: strokeLinecapSetting.value,
    strokeLinejoin: strokeLinejoinSetting.value,
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
// Huaban Menu Events
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

function downloadSketch(event) {

  if (pencilNumber != 0) {

    var sketch = new Blob([surface.outerHTML], {type: 'image/svg+xml'});
    var sketchUrl = window.URL.createObjectURL(sketch);

    sketchLink.href = sketchUrl;
    sketchLink.download = 'Sketch';
    sketchLink.click();

    window.URL.revokeObjectURL(sketchUrl);

    showMessage('Your sketch has been exported');

  } else {

    showMessage('There is no sketch to export');

  }

}

// ----------------
// Huaban Settings Events
// ----------------

function settings(selected) {

  if (selectedSetting != '') {
    selectedSetting.classList.remove('selected-setting');
  }

  selectedSetting = document.querySelector(selected);

  settings.classList.add('show-settings');
  selectedSetting.classList.add('selected-setting');

}

function closeSettings() {

  settings.classList.remove('show-settings');
  selectedSetting.classList.remove('selected-setting');

}
