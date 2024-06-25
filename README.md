Analisador-Sintatico para a disciplina de compiladores

Link para o repositório GitHub:
https://github.com/FrT-MgC/AnalisadorSintatico

Grámatica:
S ::= aAb | bB
A ::= aCc | c
B ::= Abc
C ::= aBc | ε

    FIRST			   FOLLOW
S ::= { a, b }		S ::= { $ }
A ::= { a, c }		A ::= { b }
B ::= { a, c }		B ::= { $, c }
C ::= { a, ε }		C ::= { c }


              TABELA DE PARSING
	   a		     b		  c		 $
S	S ::= aAb	  S ::= bB		
A	A ::= aCc			    A ::= c	
B	B ::= Abc			    B ::= Abc	
C	C ::= aBc			    C ::= ε	



Entradas:
baaaacbcccbcccbc - Aceita em 26 iterações
bacbc            - Aceita em 10 iterações
aacb			 - Aceita em 8 iterações
aaacbcccb        - Aceita em 15 iterações
aaacbcbcabccb    - Erro em 12 iterações
aabacbcccb       - Erro em 5 iterações