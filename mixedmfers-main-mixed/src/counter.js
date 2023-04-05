const counterInput = document.querySelector('.counter-input');
const incrementBtn = document.querySelector('.increment');
const decrementBtn = document.querySelector('.decrement');

incrementBtn.addEventListener('click', () => {
  let currentValue = parseInt(counterInput.value);
  currentValue++;
  counterInput.value = currentValue;
});

decrementBtn.addEventListener('click', () => {
  let currentValue = parseInt(counterInput.value);
  if (currentValue > 1) {
    currentValue--;
    counterInput.value = currentValue;
  }
});
