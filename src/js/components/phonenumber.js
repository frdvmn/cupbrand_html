import { AsYouType } from 'libphonenumber-js';

// const input = document.getElementById('tel');
// input.addEventListener('input', (e) => {
// let digits = e.target.value.replace(/\D/g, '');

// if (digits.startsWith('8')) {
//   digits = '7' + digits.slice(1);
// } else if (digits && digits[0] === '9') {
//   digits = '7' + digits;
// }

// if (digits.length > 11) digits = digits.slice(0, 11);

// let formatted = '';
// if (digits) {
//   formatted = new AsYouType().input('+' + digits);
// }

// e.target.value = formatted;
// });

document.querySelectorAll('input[data-phone]').forEach(input => {
  input.addEventListener('input', formatPhoneAsYouType);
});

function formatPhoneAsYouType(e) {
  let digits = e.target.value.replace(/\D/g, '');

  if (digits.startsWith('8')) {
    digits = '7' + digits.slice(1);
  } else if (digits && digits[0] === '9') {
    digits = '7' + digits;
  }

  if (digits.length > 11) digits = digits.slice(0, 11);

  let formatted = '';
  if (digits) {
    // Используем AsYouType без страны, но с +
    formatted = new AsYouType().input('+' + digits);
  }

  e.target.value = formatted;
}
