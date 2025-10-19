// async function sendForm(form) {
//   const data = Object.fromEntries(new FormData(form).entries());
//   try {
//     const res = await fetch('http://localhost:3001/api/submit', {
//       method: 'POST',
//       headers: { 'Content-Type': 'application/json' },
//       body: JSON.stringify(data)
//     });
//     if (res.ok) {
//       alert('✅ Заявка отправлена!');
//       form.reset();
//     } else {
//       const err = await res.json();
//       alert('❌ ' + err.error);
//     }
//   } catch (e) {
//     alert('⚠️ Ошибка подключения');
//   }
// }

// document.getElementById('cupsform').addEventListener('submit', e => {
//   e.preventDefault();
//   sendForm(e.target);
// });

// document.getElementById('brandform').addEventListener('submit', e => {
//   e.preventDefault();
//   sendForm(e.target);
// });
