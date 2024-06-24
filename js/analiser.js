const EPSILON = 'ε';
const END_OF_STACK = '$';

const TERMINALS = ['a', 'b', 'c'];
const NON_TERMINALS = ['S', 'A', 'B', 'C'];

var grammar = {
    'S': ['aAb', 'bB'],
    'A': ['aCc', 'c'],
    'B': ['Abc'],
    'C': ['aBc', EPSILON]
};

var parsingTable = {
    'S': {
        'a': ['a', 'A', 'b'],
        'b': ['b', 'B']
    },
    'A': {
        'a': ['a', 'C', 'c'],
        'c': ['c']
    },
    'B': {
        'a': ['A', 'b', 'c'],
        'c': ['A', 'b', 'c'],
    },
    'C': {
        'a': ['a', 'B', 'c'],
        'c': [EPSILON]
    }
};

var input = [];
var stack = [END_OF_STACK, 'S'];
var debugTable = [];
var analising = true;

/**
 * @type {boolean}
 */
var accepted = null;
var iteration = 1;

function cleanGlobals() {
    stack = [END_OF_STACK, 'S'];
    input = [];
    analising = true;
    accepted = null;
    debugTable = [];
    iteration = 1;
}

function analisisState() {
    return {
        input: input.join(''),
        stack: stack.join(''),
        accepted: accepted,
        table: debugTable
    };
}

function acceptanceFeedback(accepted) {
    $('#input-sentence').removeClass('is-invalid is-valid');
    if (accepted === true) {
        $('#input-sentence').addClass('is-valid');
    } else if (accepted === false) {
        $('#input-sentence').addClass('is-invalid');
    }
}

function updateView(analisis) {
    if (analisis === undefined) {
        acceptanceFeedback(null);
        writeDebugTable([]);
    } else {
        acceptanceFeedback(analisis.accepted);
        writeDebugTable(analisis.table);
    }
}

function randomSentence() {
    var rule = 'S';
    var generating = true;
    var sentence = '';
    while (generating) {
        var ruleLength = grammar[rule].length;
        var production = grammar[rule][Math.floor(Math.random() * ruleLength)];
        if (sentence === '') {
            sentence = production;
        } else {
            sentence = sentence.replace(rule, production);
        }
        var ruleIndex = -1;
        for (var i = 0; i < sentence.length; i++) {
            ruleIndex = NON_TERMINALS.indexOf(sentence[i]);
            if (ruleIndex !== -1) {
                rule = NON_TERMINALS[ruleIndex];
                break;
            }
        }
        if (ruleIndex === -1) {
            generating = false;
        } 
    }
    sentence = sentence.replace(EPSILON, '');
    if (sentence.indexOf(EPSILON) !== -1) {
        sentence = sentence.replace(EPSILON, '');
    }
    return sentence;
}

//Analisador Sintatico
function AnalisSintatico() {

    var debugRow = {
        iter: iteration,
        stack: stack.join(''),
        input: input.join('')
    };

    var topStack = stack[stack.length - 1];
    var inSimbol = input[0];

    if (topStack === END_OF_STACK && inSimbol === END_OF_STACK) {
        analising = false;
        accepted = true;
        debugRow.action = 'Aceito em ' + iteration + ' iterações';
    } else {
        if (topStack === inSimbol) {
            debugRow.action = 'Ler \'' + inSimbol + '\'';
            stack.pop();
            input.shift();

        } else if (
            parsingTable[topStack] !== undefined &&
            parsingTable[topStack][inSimbol] !== undefined
        ) {
            var toStack = parsingTable[topStack][inSimbol];
            var production = toStack.join('');
            debugRow.action = topStack + ' ⭢ ' + production;

            stack.pop();

            if (production !== EPSILON) {
                for (var j = toStack.length - 1; j >= 0; j--) {
                    stack.push(toStack[j])
                }
            }

        } else {
            analising = false;
            accepted = false;
            debugRow.action = 'Erro em ' + iteration + ' iterações';
        }
    }
    iteration++;
    debugTable.push(debugRow);
}

/**
 * Realiza a análise de forma completa
 * 
 * @param {string} inputString 
 */

function analisCompleto(inputString) {

    cleanGlobals();
    input = (inputString + '$').split('');

    while (analising) {
        AnalisSintatico();
    }

    return analisisState();
}

var savedInput = '';

//Realiza a análise passo a passo
function analisPassoPasso(inputString) {
    if (inputString !== savedInput || !analising) {
        cleanGlobals();
        savedInput = inputString;
        input = (inputString + '$').split('');
    }

    AnalisSintatico();

    return analisisState();
}

function writeDebugTable(table) {
    if (table === undefined) {
        table = debugTable;
    }

    $htmlTable = $('.debug-table > tbody');
    $htmlTable.html('');

    for (var i = 0; i < table.length; i++) {
        $row = $('<tr>');
        $row.append('<td>' + table[i].stack + '</td>');
        $row.append('<td>' + table[i].input + '</td>');
        $row.append('<td>' + table[i].action + '</td>');
        $row.append('<td>' + table[i].iter + '</td>');
        $htmlTable.append($row);
    }
}
