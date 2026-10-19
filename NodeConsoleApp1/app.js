'use strict';

const readline = require('readline');

const OPERATIONS = {
    '+': { name: 'сложение', fn: (a, b) => a + b },
    '-': { name: 'вычитание', fn: (a, b) => a - b },
    '*': { name: 'умножение', fn: (a, b) => a * b },
    '/': {
        name: 'деление',
        fn: (a, b) => {
            if (b === 0) {
                throw new Error('Деление на ноль невозможно');
            }
            return a / b;
        },
    },
    '^': { name: 'возведение в степень', fn: (a, b) => a ** b },
};

function parseNumber(value, label) {
    const num = Number(value);
    if (String(value).trim() === '' || Number.isNaN(num)) {
        throw new Error(`${label} должно быть числом`);
    }
    return num;
}

function calculate(aRaw, opRaw, bRaw) {
    const a = parseNumber(aRaw, 'Первое число');
    const b = parseNumber(bRaw, 'Второе число');
    const op = String(opRaw).trim();

    const operation = OPERATIONS[op];
    if (!operation) {
        throw new Error(`Неизвестная операция: ${op}. Доступны: + - * / ^`);
    }

    const result = operation.fn(a, b);
    return { a, op, b, name: operation.name, result };
}

function printResult({ a, op, b, name, result }) {
    console.log(`${name}: ${a} ${op} ${b} = ${result}`);
}

function ask(rl, question) {
    return new Promise((resolve) => rl.question(question, resolve));
}

async function runInteractive() {
    const rl = readline.createInterface({
        input: process.stdin,
        output: process.stdout,
    });

    console.log('=== Калькулятор ===');
    console.log('Операции: +  -  *  /  ^');
    console.log('Для выхода введите q вместо первого числа\n');

    try {
        while (true) {
            const aRaw = await ask(rl, 'Первое число (или q): ');
            if (aRaw.trim().toLowerCase() === 'q') {
                console.log('До свидания!');
                break;
            }

            try {
                const opRaw = await ask(rl, 'Операция (+ - * / ^): ');
                const bRaw = await ask(rl, 'Второе число: ');
                printResult(calculate(aRaw, opRaw, bRaw));
            } catch (err) {
                console.error(`Ошибка: ${err.message}`);
            }

            console.log('');
        }
    } finally {
        rl.close();
    }
}

async function main() {
    const [, , aArg, opArg, bArg] = process.argv;

    if (aArg !== undefined && opArg !== undefined && bArg !== undefined) {
        printResult(calculate(aArg, opArg, bArg));
        return;
    }

    await runInteractive();
}

main().catch((err) => {
    console.error(`Ошибка: ${err.message}`);
    process.exitCode = 1;
});
