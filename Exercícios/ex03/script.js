// ====== ELEMENTOS ======
const tela = document.getElementById("resultado");
const cientificaBox = document.querySelector(".cientifica");

// ====== ESTADO ======
let expressao = "0";
let cientificaAtiva = false;

// ====== TELA ======
function atualizarTela() {
  tela.textContent = expressao;
}

// ====== UTIL: achar o "último bloco" (número, π ou parênteses) ======
function obterUltimoBloco(expr) {
  // remove espaços (se tiver)
  let s = expr;

  // se termina com ')', pega o bloco entre parênteses correspondente
  if (s.endsWith(")")) {
    let nivel = 0;
    for (let i = s.length - 1; i >= 0; i--) {
      if (s[i] === ")") nivel++;
      if (s[i] === "(") nivel--;
      if (nivel === 0) {
        return { start: i, end: s.length, texto: s.slice(i) };
      }
    }
    // se não achou, retorna tudo
    return { start: 0, end: s.length, texto: s };
  }

  // caso contrário, pega um "token" final (número com vírgula, ou π)
  let i = s.length - 1;

  // aceita π no final
  if (s[i] === "π") {
    return { start: i, end: i + 1, texto: "π" };
  }

  // número (0-9) e vírgula
  while (i >= 0) {
    const c = s[i];
    const ehNumeroOuVirgula = (c >= "0" && c <= "9") || c === ",";
    if (!ehNumeroOuVirgula) break;
    i--;
  }

  const start = i + 1;
  const texto = s.slice(start);
  return { start, end: s.length, texto };
}

function substituirUltimoBloco(novo) {
  const b = obterUltimoBloco(expressao);
  // se não tiver bloco válido (ex.: expressão termina em operador), não faz nada
  if (!b.texto) return;

  expressao = expressao.slice(0, b.start) + novo;
  atualizarTela();
}

// ====== AÇÕES BÁSICAS ======
function limparTudo() {
  expressao = "0";
  atualizarTela();
}

function apagar() {
  if (expressao.length <= 1) {
    expressao = "0";
  } else {
    expressao = expressao.slice(0, -1);
    if (expressao === "") expressao = "0";
  }
  atualizarTela();
}

function adicionarNumero(txt) {
  if (expressao === "0") {
    expressao = txt;
  } else {
    expressao += txt;
  }
  atualizarTela();
}

function adicionarOperador(op) {
  const ultimo = expressao[expressao.length - 1];
  const ops = ["+", "-", "x", "÷", "%", "^"];

  // não deixa dois operadores seguidos (troca o último)
  if (ops.includes(ultimo)) {
    expressao = expressao.slice(0, -1) + op;
  } else {
    expressao += op;
  }
  atualizarTela();
}

// ====== FUNÇÕES CIENTÍFICAS (aplicam no último bloco) ======
function aplicarFuncao(nome) {
  const b = obterUltimoBloco(expressao);
  if (!b.texto) return;

  // se o usuário ainda está em "0", aplica em 0
  let alvo = b.texto || "0";
  if (expressao === "0") alvo = "0";

  // monta "nome(alvo)"
  substituirUltimoBloco(`${nome}(${alvo})`);
}

function aplicarFatorial() {
  const b = obterUltimoBloco(expressao);
  if (!b.texto) return;
  substituirUltimoBloco(`fact(${b.texto})`);
}

function aplicarReciproco() {
  const b = obterUltimoBloco(expressao);
  if (!b.texto) return;
  substituirUltimoBloco(`(1/(${b.texto}))`);
}

function inserirPi() {
  if (expressao === "0") {
    expressao = "π";
  } else {
    expressao += "π";
  }
  atualizarTela();
}

// ====== CÁLCULO ======
function fact(n) {
  // fatorial simples (inteiro >= 0)
  if (!Number.isFinite(n)) return NaN;
  if (n < 0) return NaN;
  if (!Number.isInteger(n)) return NaN;

  let r = 1;
  for (let i = 2; i <= n; i++) r *= i;
  return r;
}

function calcular() {
  try {
    let conta = expressao;

    // conversões de símbolos para JS
    conta = conta.replaceAll("x", "*");
    conta = conta.replaceAll("÷", "/");
    conta = conta.replaceAll(",", ".");
    conta = conta.replaceAll("π", "Math.PI");
    conta = conta.replaceAll("^", "**"); // potência

    // converter funções "sin(" -> "Math.sin(" etc.
    conta = conta.replaceAll("sin(", "Math.sin(");
    conta = conta.replaceAll("cos(", "Math.cos(");
    conta = conta.replaceAll("tan(", "Math.tan(");
    conta = conta.replaceAll("ln(", "Math.log("); // ln = log natural
    conta = conta.replaceAll("log(", "Math.log10("); // log base 10
    conta = conta.replaceAll("√(", "Math.sqrt(");
    conta = conta.replaceAll("sqrt(", "Math.sqrt("); // se algum dia usar "sqrt"

    // fact( ... ) usa nossa função fact
    // (já está como "fact(")

    // avalia
    // eslint-disable-next-line no-new-func
    const resultado = Function("fact", `"use strict"; return (${conta});`)(fact);

    // mostra resultado (volta ponto para vírgula)
    expressao = String(resultado).replace(".", ",");
    atualizarTela();
  } catch {
    expressao = "Erro";
    atualizarTela();
  }
}

// ====== MOSTRAR/ESCONDER CIENTÍFICA ======
function alternarCientifica() {
  if (cientificaAtiva) {
    cientificaBox.style.display = "none";
    cientificaAtiva = false;
  } else {
    cientificaBox.style.display = "grid";
    cientificaAtiva = true;
  }
}

// ====== CLIQUES ======
document.addEventListener("click", (event) => {
  const botao = event.target;
  if (botao.tagName !== "BUTTON") return;

  const texto = botao.textContent.trim();

  // toggle científica
  if (texto === "⇄") {
    alternarCientifica();
    return;
  }

  // ações básicas
  if (texto === "AC") {
    limparTudo();
    return;
  }
  if (texto === "⌫") {
    apagar();
    return;
  }
  if (texto === "=") {
    calcular();
    return;
  }

  // se for botão científico (está dentro da div .cientifica)
  if (botao.closest(".cientifica")) {
    if (texto === "sin") return aplicarFuncao("sin");
    if (texto === "cos") return aplicarFuncao("cos");
    if (texto === "tan") return aplicarFuncao("tan");
    if (texto === "ln") return aplicarFuncao("ln");
    if (texto === "log") return aplicarFuncao("log");
    if (texto === "√") return aplicarFuncao("√");
    if (texto === "π") return inserirPi();
    if (texto === "xʸ") return adicionarOperador("^");
    if (texto === "x!") return aplicarFatorial();
    if (texto === "1/x") return aplicarReciproco();

    // parênteses: só adiciona
    if (texto === "(" || texto === ")") {
      if (expressao === "0") expressao = texto;
      else expressao += texto;
      atualizarTela();
      return;
    }

    return; // qualquer outro científico, ignora por enquanto
  }

  // números (você precisa marcar no HTML com class="numero")
  if (botao.classList.contains("numero")) {
    adicionarNumero(texto);
    return;
  }

  // operadores (você precisa marcar com class="operador")
  if (botao.classList.contains("operador")) {
    // não deixar passar AC/⌫/⇄/= aqui (já tratamos acima)
    // apenas operadores matemáticos
    const ops = ["+", "-", "x", "÷", "%"];
    if (ops.includes(texto)) adicionarOperador(texto);
    return;
  }
});

// inicializa
atualizarTela();

