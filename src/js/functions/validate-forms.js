// src/js/modules/validateForms.js
import JustValidate from "just-validate";
import Inputmask from "../../../node_modules/inputmask/dist/inputmask.es6.js";

/**
 * Валидация и отправка форм
 * @param {string} selector — селектор формы (#brandform / #cupsform)
 * @param {GraphModal} modal — экземпляр GraphModal
 */
export const validateForms = (selector, modal) => {
  // console.log('🔥 Вызов validateForms для:', selector, new Error().stack);

  const form = document.querySelector(selector);
  if (!form) return;

  const isBrand = selector === "#brandform";
  const isCups = selector === "#cupsform";

  // Маска телефона
  const phoneInputs = form.querySelectorAll("input[data-phone]");
  phoneInputs.forEach((input) => {
    if (!input.inputmask) {
      try {
        const mask = new Inputmask("+7 (999) 999-99-99");
        mask.mask(input);
      } catch (e) {
        console.warn("Не удалось применить маску", e);
        // Форма останется работоспособной без маски
      }
    }
  });

  const validator = new JustValidate(selector, {
    validateBeforeSubmitting: true,
  });

  // Общие поля
  validator.addField('[name="contact"]', [
    { rule: "required", errorMessage: "Укажите контактное лицо" },
    { rule: "minLength", value: 2, errorMessage: "Минимум 2 символа" },
  ]);

  validator.addField('[name="phone"]', [
    { rule: "required", errorMessage: "Укажите телефон" },
    {
      rule: "function",
      validator: () => {
        const phoneInput = form.querySelector('input[name="phone"]');
        if (!phoneInput || !phoneInput.inputmask) return false;
        const unmasked = phoneInput.inputmask.unmaskedvalue();
        return unmasked.length === 10;
      },
      errorMessage: "Неверный формат телефона",
    },
  ]);

  // === Для формы брендов: валидация размера (чекбокс) ===
  if (isBrand) {
    // Добавляем "виртуальное" поле для валидации чекбокса
    validator.addField('[name="size"]', [
      {
        rule: "function",
        validator: () => {
          return form.querySelector('input[name="size"]:checked') !== null;
        },
        errorMessage: "Выберите размер стаканчика",
      },
    ]);

    validator.addField('[name="comment"]', [
      { rule: "maxLength", value: 500, errorMessage: "Не более 500 символов" },
    ]);
  }

  // === Для кофейни: город ===
  if (isCups) {
    validator.addField('[name="city"]', [
      { rule: "required", errorMessage: "Укажите город" },
      { rule: "minLength", value: 2, errorMessage: "Минимум 2 символа" },
    ]);
  }

  // Отправка
  validator.onSuccess(async (event) => {
    const submitBtn = event.target.querySelector(
      ".form__submit, .coffe__form-submit",
    );

    // Сохраняем оригинальный текст, если ещё не сохранён
    if (submitBtn && !submitBtn.dataset.defaultText) {
      submitBtn.dataset.defaultText = submitBtn.textContent;
    }

    // Блокируем кнопку
    if (submitBtn) {
      submitBtn.disabled = true;
      submitBtn.textContent = "Отправка...";
    }

    const formData = new FormData(event.target);
    const data = {};
    for (const [key, value] of formData.entries()) {
      data[key] = value;
    }

    // === ТАЙМАУТ: 8 секунд ===
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 8000);

    try {
      const res = await fetch("/api/submit", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
        signal: controller.signal, // ← привязываем сигнал отмены
      });

      clearTimeout(timeoutId);

      event.target.reset();
      // const phoneInputs = event.target.querySelectorAll('input[data-phone]');
      // phoneInputs.forEach(input => {
      //   if (input) input.value = '';
      // });

      if (res.ok) {
        modal.open("success");
        // console.log('success');
      } else {
        const err = await res.json().catch(() => ({}));
        document.getElementById("modal-error-text").textContent =
          err.error || "Ошибка сервера";
        modal.open("error");
      }
    } catch (e) {
      clearTimeout(timeoutId);

      let message = "Не удалось отправить заявку. Попробуйте позже.";
      if (e.name === "AbortError") {
        message = "Сервер не отвечает. Повторите через минуту.";
      }
      document.getElementById("modal-error-text").textContent = message;
      modal.open("error");
    } finally {
      // 🔑 ВСЕГДА разблокируем кнопку — даже если ошибка или таймаут!
      if (submitBtn) {
        submitBtn.disabled = false;
        submitBtn.textContent = submitBtn.dataset.defaultText;
      }
    }
  });
};
