"use strict";

var counterInput = document.querySelector('.counter-input');
var incrementBtn = document.querySelector('.increment');
var decrementBtn = document.querySelector('.decrement');
incrementBtn.addEventListener('click', function () {
  var currentValue = parseInt(counterInput.value);
  currentValue++;
  counterInput.value = currentValue;
});
decrementBtn.addEventListener('click', function () {
  var currentValue = parseInt(counterInput.value);
  if (currentValue > 1) {
    currentValue--;
    counterInput.value = currentValue;
  }
});