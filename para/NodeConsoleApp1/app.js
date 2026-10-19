'use strict';

// лабораторная работа - калькулятор в консоли
const readline = require('readline');

const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});

// спрашиваем пользователя
function vopros(tekst) {
    return new Promise(function (resolve) {
        rl.question(tekst, function (otvet) {
            resolve(otvet);
        });
    });
}

// тут считаем результат
function schitat(a, znak, b) {
    let rezultat;

    // проверяем что это числа
    a = Number(a);
    b = Number(b);

    if (isNaN(a) == true || isNaN(b) == true) {
        console.log('Ошибка! Нужно вводить числа');
        return;
    }

    // выбираем операцию
    if (znak == '+') {
        rezultat = a + b;
        console.log('Сложение: ' + a + ' + ' + b + ' = ' + rezultat);
    } else if (znak == '-') {
        rezultat = a - b;
        console.log('Вычитание: ' + a + ' - ' + b + ' = ' + rezultat);
    } else if (znak == '*') {
        rezultat = a * b;
        console.log('Умножение: ' + a + ' * ' + b + ' = ' + rezultat);
    } else if (znak == '/') {
        // нельзя делить на 0
        if (b == 0) {
            console.log('Ошибка! На ноль делить нельзя');
            return;
        }
        rezultat = a / b;
        console.log('Деление: ' + a + ' / ' + b + ' = ' + rezultat);
    } else if (znak == '^') {
        // степень
        rezultat = a ** b;
        console.log('Степень: ' + a + ' ^ ' + b + ' = ' + rezultat);
    } else {
        console.log('Неизвестная операция! Можно: + - * / ^');
    }
}

async function start() {
    console.log('=== Калькулятор ===');
    console.log('Операции: + - * / ^');
    console.log('Для выхода напишите q');
    console.log('');

    // бесконечный цикл пока не выйдем
    while (true) {
        let chislo1 = await vopros('Первое число (или q): ');

        // выход
        if (chislo1.trim().toLowerCase() == 'q') {
            console.log('До свидания!');
            break;
        }

        let operaciya = await vopros('Операция (+ - * / ^): ');
        let chislo2 = await vopros('Второе число: ');

        schitat(chislo1, operaciya.trim(), chislo2);
        console.log('');
    }

    rl.close();
}

// если передали аргументы в командной строке
let args = process.argv;

if (args[2] != undefined && args[3] != undefined && args[4] != undefined) {
    schitat(args[2], args[3], args[4]);
    rl.close();
} else {
    // иначе интерактивный режим
    start();
}
