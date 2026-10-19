'use strict';

// === DOM: находим элементы страницы ===
const numAInput = document.getElementById('numA');
const numBInput = document.getElementById('numB');
const resultEl = document.getElementById('result');
const expressionEl = document.getElementById('expression');
const errorEl = document.getElementById('error');
const historyEl = document.getElementById('history');
const opsEl = document.getElementById('ops');
const clearBtn = document.getElementById('clearBtn');
const clearHistoryBtn = document.getElementById('clearHistoryBtn');

const OPERATIONS = {
  '+': { symbol: '+', name: 'сложение', fn: (a, b) => a + b },
  '-': { symbol: '−', name: 'вычитание', fn: (a, b) => a - b },
  '*': { symbol: '×', name: 'умножение', fn: (a, b) => a * b },
  '/': { symbol: '÷', name: 'деление', fn: (a, b) => a / b },
  '^': { symbol: '^', name: 'степень', fn: (a, b) => a ** b },
};

// число: необязательный минус, цифры, одна точка или запятая
const NUMBER_PATTERN = /^-?\d+([.,]\d+)?$/;

function normalizeNumberText(raw) {
  return String(raw).trim().replace(',', '.');
}

function getInputError(raw, label) {
  const value = String(raw).trim();

  if (value === '') {
    return `Введите ${label.toLowerCase()}`;
  }

  if (/[a-zа-яё]/i.test(value)) {
    return `${label}: буквы вводить нельзя`;
  }

  if (/[^\d.,\s+-]/.test(value)) {
    return `${label}: недопустимые символы`;
  }

  if (!NUMBER_PATTERN.test(value)) {
    return `${label}: введите корректное число (например 12 или -3.5)`;
  }

  const num = Number(normalizeNumberText(value));

  if (Number.isNaN(num)) {
    return `${label} должно быть числом`;
  }

  if (!Number.isFinite(num)) {
    return `${label}: слишком большое или бесконечное значение`;
  }

  return null;
}

function parseValue(input, label) {
  const error = getInputError(input.value, label);
  if (error) {
    throw new Error(error);
  }
  return Number(normalizeNumberText(input.value));
}

function validateOperation(opKey, a, b) {
  if (opKey === '/' && b === 0) {
    throw new Error('Деление на ноль невозможно');
  }

  if (opKey === '^') {
    if (a === 0 && b <= 0) {
      throw new Error('0 в неположительной степени невозможно');
    }
    if (a < 0 && !Number.isInteger(b)) {
      throw new Error('Отрицательное число нельзя возвести в дробную степень');
    }
  }
}

function showError(message) {
  errorEl.textContent = message;
  errorEl.hidden = false;
}

function hideError() {
  errorEl.hidden = true;
  errorEl.textContent = '';
}

function setFieldState(input, message) {
  const field = input.closest('.field');
  let hint = field.querySelector('.hint');

  if (!hint) {
    hint = document.createElement('p');
    hint.className = 'hint';
    field.append(hint);
  }

  if (message) {
    field.classList.add('invalid');
    hint.textContent = message;
  } else {
    field.classList.remove('invalid');
    hint.textContent = '';
  }
}

function validateFieldLive(input, label) {
  const value = input.value.trim();
  if (value === '') {
    setFieldState(input, null);
    return true;
  }

  const error = getInputError(value, label);
  setFieldState(input, error);
  return error === null;
}

function formatNumber(n) {
  if (Number.isInteger(n)) {
    return String(n);
  }
  return String(Number(n.toFixed(8)));
}

function setActiveOp(activeBtn) {
  const buttons = opsEl.querySelectorAll('.op-btn');
  buttons.forEach((btn) => btn.classList.remove('is-active'));
  if (activeBtn) {
    activeBtn.classList.add('is-active');
  }
}

function animateResult() {
  resultEl.classList.remove('pop');
  void resultEl.offsetWidth;
  resultEl.classList.add('pop');
}

function addHistoryItem(text, result) {
  const li = document.createElement('li');
  const left = document.createElement('span');
  const right = document.createElement('strong');

  left.textContent = text;
  right.textContent = result;

  li.append(left, right);
  historyEl.prepend(li);
}

function calculate(opKey, button) {
  hideError();

  const aOk = validateFieldLive(numAInput, 'Первое число');
  const bOk = validateFieldLive(numBInput, 'Второе число');

  try {
    if (!aOk || !bOk) {
      throw new Error('Исправьте ошибки во вводе чисел');
    }

    const a = parseValue(numAInput, 'Первое число');
    const b = parseValue(numBInput, 'Второе число');

    validateOperation(opKey, a, b);

    const operation = OPERATIONS[opKey];
    const value = operation.fn(a, b);

    if (Number.isNaN(value)) {
      throw new Error('Результат не является числом');
    }
    if (!Number.isFinite(value)) {
      throw new Error('Результат слишком большой (бесконечность)');
    }

    const formatted = formatNumber(value);
    const expr = `${formatNumber(a)} ${operation.symbol} ${formatNumber(b)}`;

    expressionEl.textContent = `${operation.name}: ${expr}`;
    resultEl.textContent = formatted;

    setActiveOp(button);
    animateResult();
    addHistoryItem(expr, formatted);
  } catch (err) {
    showError(err.message);
  }
}

function clearForm() {
  numAInput.value = '';
  numBInput.value = '';
  expressionEl.textContent = '—';
  resultEl.textContent = '0';
  hideError();
  setFieldState(numAInput, null);
  setFieldState(numBInput, null);
  setActiveOp(null);
  numAInput.focus();
}

function clearHistory() {
  historyEl.innerHTML = '';
}

// === DOM: слушатели событий ===

opsEl.addEventListener('click', (event) => {
  const button = event.target.closest('.op-btn');
  if (!button) {
    return;
  }
  calculate(button.dataset.op, button);
});

clearBtn.addEventListener('click', clearForm);
clearHistoryBtn.addEventListener('click', clearHistory);

numAInput.addEventListener('input', () => {
  validateFieldLive(numAInput, 'Первое число');
  hideError();
});

numBInput.addEventListener('input', () => {
  validateFieldLive(numBInput, 'Второе число');
  hideError();
});

[numAInput, numBInput].forEach((input) => {
  input.addEventListener('keydown', (event) => {
    if (event.key === 'Enter') {
      const plusBtn = opsEl.querySelector('[data-op="+"]');
      calculate('+', plusBtn);
    }
  });
});
