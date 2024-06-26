$(document).ready(function () {

    //Limpa os dados do analisador caso a sentença mude
    $('#input-sentence').on('keyup', function() {
        cleanGlobals();
        updateView();
    });

    //Limpa os dados do analisador e da view
    $('#btn-clean').click(function() {
        $('#input-sentence').val('').focus();
        cleanGlobals();
        updateView();
    });

    //Análisa a sentença na entrada em um passo
    $('#btn-verify-sentence').click(function() {
        var analisis = analisCompleto($('#input-sentence').val());
        updateView(analisis);
    });

    //Realiza a analise passo à passo
    $('#btn-verify-step').click(function() {
        var analisis = analisPassoPasso($('#input-sentence').val());
        updateView(analisis);
    });

    //gera entradas aleatorias validas
    $('#btn-generate').click(function() {
        $('#btn-clean').click();
        var sentence = randomSentence();
        $('#input-sentence').val(sentence);
    });
});