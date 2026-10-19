'use strict';

// калькулятор на DOM
// получаем элементы со страницы
var input1 = document.getElementById('numA');
var input2 = document.getElementById('numB');
var rezultat = document.getElementById('result');
var vyrazhenie = document.getElementById('expression');
var oshibka = document.getElementById('error');
var istoriya = document.getElementById('history');
var knopki = document.getElementById('ops');
var knopkaOchistit = document.getElementById('clearBtn');
var knopkaOchistitIstoriyu = document.getElementById('clearHistoryBtn');

// проверка что ввели число
function proverkaChisla(znachenie, nazvanie) {
    znachenie = String(znachenie).trim();

    if (znachenie == '') {
        return 'Введите ' + nazvanie.toLowerCase();
    }

    // заменяем запятую на точку
    znachenie = znachenie.replace(',', '.');

    // если не число
    if (isNaN(znachenie) == true) {
        return nazvanie + ' должно быть числом';
    }

    return null; // ошибок нет
}

// основная функция расчета
function schitat(znak, knopka) {
    // прячем старую ошибку
    oshibka.hidden = true;
    oshibka.textContent = '';

    var osh1 = proverkaChisla(input1.value, 'Первое число');
    var osh2 = proverkaChisla(input2.value, 'Второе число');

    if (osh1 != null) {
        oshibka.textContent = osh1;
        oshibka.hidden = false;
        return;
    }

    if (osh2 != null) {
        oshibka.textContent = osh2;
        oshibka.hidden = false;
        return;
    }

    var a = Number(String(input1.value).trim().replace(',', '.'));
    var b = Number(String(input2.value).trim().replace(',', '.'));
    var otvet;
    var nazvanieOperacii;
    var simvol;

    // считаем в зависимости от операции
    if (znak == '+') {
        otvet = a + b;
        nazvanieOperacii = 'сложение';
        simvol = '+';
    } else if (znak == '-') {
        otvet = a - b;
        nazvanieOperacii = 'вычитание';
        simvol = '−';
    } else if (znak == '*') {
        otvet = a * b;
        nazvanieOperacii = 'умножение';
        simvol = '×';
    } else if (znak == '/') {
        // деление на ноль нельзя
        if (b == 0) {
            oshibka.textContent = 'Деление на ноль невозможно';
            oshibka.hidden = false;
            return;
        }
        otvet = a / b;
        nazvanieOperacii = 'деление';
        simvol = '÷';
    } else if (znak == '^') {
        otvet = a ** b;
        nazvanieOperacii = 'степень';
        simvol = '^';
    } else {
        oshibka.textContent = 'Неизвестная операция';
        oshibka.hidden = false;
        return;
    }

    // выводим на экран
    var tekst = a + ' ' + simvol + ' ' + b;
    vyrazhenie.textContent = nazvanieOperacii + ': ' + tekst;
    rezultat.textContent = otvet;

    // подсвечиваем нажатую кнопку
    var vseKnopki = knopki.querySelectorAll('.op-btn');
    for (var i = 0; i < vseKnopki.length; i++) {
        vseKnopki[i].classList.remove('is-active');
    }
    if (knopka != null) {
        knopka.classList.add('is-active');
    }

    // добавляем в историю
    var li = document.createElement('li');
    li.innerHTML = '<span>' + tekst + '</span><strong>' + otvet + '</strong>';
    istoriya.prepend(li);
}

// очистка формы
function ochistit() {
    input1.value = '';
    input2.value = '';
    vyrazhenie.textContent = '—';
    rezultat.textContent = '0';
    oshibka.hidden = true;
    oshibka.textContent = '';

    var vseKnopki = knopki.querySelectorAll('.op-btn');
    for (var i = 0; i < vseKnopki.length; i++) {
        vseKnopki[i].classList.remove('is-active');
    }
}

// очистка истории
function ochistitIstoriyu() {
    istoriya.innerHTML = '';
}

// обработка нажатий на кнопки операций
knopki.addEventListener('click', function (e) {
    var knopka = e.target.closest('.op-btn');
    if (knopka == null) {
        return;
    }
    var znak = knopka.dataset.op;
    schitat(znak, knopka);
});

knopkaOchistit.addEventListener('click', ochistit);
knopkaOchistitIstoriyu.addEventListener('click', ochistitIstoriyu);

// если нажали Enter - считаем сложение
input1.addEventListener('keydown', function (e) {
    if (e.key == 'Enter') {
        var plus = knopki.querySelector('[data-op="+"]');
        schitat('+', plus);
    }
});

input2.addEventListener('keydown', function (e) {
    if (e.key == 'Enter') {
        var plus = knopki.querySelector('[data-op="+"]');
        schitat('+', plus);
    }
});
