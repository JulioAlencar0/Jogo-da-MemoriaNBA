// Lista dos 8 símbolos (um por par).
// Para usar imagens depois, é só trocar aqui (e o que é mostrado em criarTabuleiro).
const times = [
  { sigla: "LAL", cor: "#552583" },  // Lakers
  { sigla: "BOS", cor: "#007a33" },  // Celtics
  { sigla: "GSW", cor: "#1d428a" },  // Warriors
  { sigla: "CHI", cor: "#ce1141" },  // Bulls
  { sigla: "MIA", cor: "#98002e" },  // Heat
  { sigla: "NYK", cor: "#006bb6" },  // Knicks
  { sigla: "SAS", cor: "#5a5a5a" },  // Spurs
  { sigla: "DEN", cor: "#0e2240" }   // Nuggets
];

// Elementos da página que vamos usar
const tabuleiro = document.getElementById("tabuleiro");
const mensagemVez = document.getElementById("mensagem-vez");
const resultado = document.getElementById("resultado");
const textoResultado = document.getElementById("texto-resultado");
const botaoReiniciar = document.getElementById("botao-reiniciar");

// Estado do jogo (as "memórias" do jogo)
let primeiraCarta = null;   // primeira carta virada na jogada
let segundaCarta = null;    // segunda carta virada na jogada
let bloqueado = false;      // trava: true = não deixa clicar em cartas
let jogadorAtual = 0;       // 0 = Jogador 1, 1 = Jogador 2
let pontos = [0, 0];        // pontos de cada jogador
let paresEncontrados = 0;   // quantos pares já foram achados (máx. 8)

// Embaralha uma lista (algoritmo Fisher-Yates)
function embaralhar(lista) {
  for (let i = lista.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    const temp = lista[i];
    lista[i] = lista[j];
    lista[j] = temp;
  }
  return lista;
}

// Cria as 16 cartas na tela
function criarTabuleiro() {
  tabuleiro.innerHTML = "";                       // limpa o tabuleiro
  const lista = embaralhar(times.concat(times));  // 8 times x 2 = 16 cartas

  lista.forEach(function (time) {
    const carta = document.createElement("div");
    carta.className = "carta";
    carta.dataset.sigla = time.sigla;             // guarda o símbolo na carta

    carta.innerHTML =
      '<div class="interna">' +
        '<div class="costas">🏀</div>' +
        '<div class="frente" style="background:' + time.cor + '">' + time.sigla + '</div>' +
      '</div>';

    // quando clicar na carta, chama virarCarta
    carta.addEventListener("click", function () {
      virarCarta(carta);
    });

    tabuleiro.appendChild(carta);
  });
}

// Vira uma carta quando o jogador clica nela
function virarCarta(carta) {
  if (bloqueado) return;                           // esperando as cartas erradas desvirarem
  if (carta.classList.contains("virada")) return;  // carta já virada ou já encontrada

  carta.classList.add("virada");

  if (primeiraCarta === null) {
    primeiraCarta = carta;     // é a primeira da jogada, espera a segunda
  } else {
    segundaCarta = carta;      // é a segunda, então compara
    verificarPar();
  }
}

// Compara as duas cartas viradas
function verificarPar() {
  if (primeiraCarta.dataset.sigla === segundaCarta.dataset.sigla) {
    // ACERTOU: cartas ficam viradas, ganha ponto e joga de novo
    primeiraCarta.classList.add("encontrada");
    segundaCarta.classList.add("encontrada");
    pontos[jogadorAtual]++;
    paresEncontrados++;
    limparJogada();
    atualizarPlacar();

    if (paresEncontrados === 8) {
      finalizarPartida();
    }
  } else {
    // ERROU: trava os cliques, espera 1 segundo, desvira e passa a vez
    bloqueado = true;
    setTimeout(function () {
      primeiraCarta.classList.remove("virada");
      segundaCarta.classList.remove("virada");
      limparJogada();
      bloqueado = false;
      trocarVez();
    }, 1000);
  }
}

// Esquece as duas cartas da jogada (para começar uma nova jogada)
function limparJogada() {
  primeiraCarta = null;
  segundaCarta = null;
}

// Passa a vez para o outro jogador
function trocarVez() {
  if (jogadorAtual === 0) {
    jogadorAtual = 1;
  } else {
    jogadorAtual = 0;
  }
  atualizarPlacar();
}

// Atualiza na tela os pontos, o destaque e a mensagem de vez
function atualizarPlacar() {
  document.getElementById("pontos1").textContent = pontos[0];
  document.getElementById("pontos2").textContent = pontos[1];

  document.getElementById("jogador1").classList.toggle("ativo", jogadorAtual === 0);
  document.getElementById("jogador2").classList.toggle("ativo", jogadorAtual === 1);

  mensagemVez.textContent = "Vez do Jogador " + (jogadorAtual + 1);
}

// Mostra o resultado quando os 8 pares foram achados
function finalizarPartida() {
  const p1 = pontos[0];
  const p2 = pontos[1];

  if (p1 > p2) {
    textoResultado.textContent = "Jogador 1 venceu! (" + p1 + " × " + p2 + ")";
  } else if (p2 > p1) {
    textoResultado.textContent = "Jogador 2 venceu! (" + p2 + " × " + p1 + ")";
  } else {
    textoResultado.textContent = "Empate! (" + p1 + " × " + p2 + ")";
  }

  mensagemVez.textContent = "Fim de jogo!";
  resultado.classList.remove("escondido");
}

// Começa (ou recomeça) uma partida do zero
function iniciarPartida() {
  pontos = [0, 0];
  jogadorAtual = 0;        // sempre começa o Jogador 1
  paresEncontrados = 0;
  primeiraCarta = null;
  segundaCarta = null;
  bloqueado = false;
  resultado.classList.add("escondido");
  criarTabuleiro();
  atualizarPlacar();
}

// Botão "Jogar novamente"
botaoReiniciar.addEventListener("click", iniciarPartida);

// Quando a página abre, já começa a primeira partida
iniciarPartida();