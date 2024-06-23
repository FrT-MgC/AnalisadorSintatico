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

/**
 * Realiza um passo da análise sintática
 */
function AnalisSintatico() {

    // cria a linha da tabela de derivação
    var debugRow = {
        iter: iteration,
        stack: stack.join(''),
        input: input.join('')
    };

    // topo da pilha
    var topStack = stack[stack.length - 1];

    // simbolo atual na entrada
    var inSimbol = input[0];

    // se o topo for o final da pilha e o simbolo de entrada também, foi aceito
    if (topStack === END_OF_STACK && inSimbol === END_OF_STACK) {
        analising = false;
        accepted = true;
        debugRow.action = 'Aceito em ' + iteration + ' iterações';
    } else {
        // se o topo da pilha for igual ao simbolo da entrada, lê a entrada
        if (topStack === inSimbol) {
            debugRow.action = 'Ler \'' + inSimbol + '\'';
            stack.pop();
            input.shift();

            // se existir uma entrada equivalente ao simbolo de entrada ao 
            // não-terminal no topo da pilha na tabela de Parsing
        } else if (
            parsingTable[topStack] !== undefined &&
            parsingTable[topStack][inSimbol] !== undefined
        ) {
            // produção em array da tabela de parsing para o simbolo terminal da entrada
            var toStack = parsingTable[topStack][inSimbol];
            // produção em formato de string
            var production = toStack.join('');

            // adiciona a ação atual na tabela de derivação
            debugRow.action = topStack + ' ⭢ ' + production;

            // remove o topo da pilha
            stack.pop();

            // se a produção não for vazia (epsilon), coloca seu conteúdo da pilha
            if (production !== EPSILON) {
                for (var j = toStack.length - 1; j >= 0; j--) {
                    stack.push(toStack[j])
                }
            }

            // se a análise não for válida, finaliza a mesma com erro
        } else {
            analising = false;
            accepted = false;
            debugRow.action = 'Erro em ' + iteration + ' iterações';
        }
    }
    // incrementa a iteração e coloca a linha gerada na tabela de derivação
    iteration++;
    debugTable.push(debugRow);
}

/**
 * Realiza a análise sintática em um passo
 * 
 * @param {string} inputString 
 */
function analisCompleto(inputString) {

    // limpa as variáveis globais
    cleanGlobals();

    // transforma a entrada em array
    input = (inputString + '$').split('');

    // executa todos os passos até o final
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
