const frm = document.querySelector("form");
const respLista = document.querySelector("pre");
const respCavalo = document.querySelector("#outCavalo");

const CAVALOS = ["Marujo", "Tordilho", "Belga", "Twister", "Jade", "Lucky"];
const apostas = [];

// Adiciona uma nova aposta
frm.addEventListener("submit", (e) => {
  e.preventDefault();

  const cavalo = Number(frm.inCavalo.value);
  const valor = Number(frm.inValor.value);
  apostas.push({ cavalo, valor });

  let lista = `Apostas Realizadas\n${"-".repeat(25)}\n`;
  for (const aposta of apostas) {
    lista += `Nº ${aposta.cavalo} ${obterCavalo(
      aposta.cavalo
    )} - R$: ${aposta.valor.toFixed(2)}\n`;
  }

  respLista.innerText = lista;
  frm.reset();
  frm.inCavalo.focus();
});

// Retorna o nome do cavalo com base no número informado
const obterCavalo = (num) => CAVALOS[num - 1];

// Mostra resumo da aposta no cavalo ao perder o foco
frm.inCavalo.addEventListener("blur", () => {
  if (frm.inCavalo.value == "") {
    respCavalo.innerText = "";
    return;
  }

  const numCavalo = Number(frm.inCavalo.value);
  if (!validarCavalo(numCavalo)) {
    alert("Nº do cavalo inválido");
    frm.inCavalo.focus();
    return;
  }

  const nome = obterCavalo(numCavalo);
  const contaNum = contarApostas(numCavalo);
  const total = totalizarApostas(numCavalo);

  respCavalo.innerText = `${nome} (Apostas: ${contaNum} - R$: ${total.toFixed(
    2
  )})`;
});

// Valida se o número do cavalo é válido
const validarCavalo = (num) => num >= 1 && num <= CAVALOS.length;

// Conta quantas apostas foram feitas em um cavalo específico
const contarApostas = (num) => {
  let contador = 0;
  for (const aposta of apostas) {
    if (aposta.cavalo == num) contador++;
  }
  return contador;
};

// Soma os valores apostados em um cavalo específico
const totalizarApostas = (num) => {
  let total = 0;
  for (const aposta of apostas) {
    if (aposta.cavalo == num) total += aposta.valor;
  }
  return total;
};

// Limpa o campo e resultado ao focar no input
frm.inCavalo.addEventListener("focus", () => {
  frm.inCavalo.value = "";
  respCavalo.innerText = "";
});

// Gera um resumo com total de apostas por cavalo
frm.btResumo.addEventListener("click", () => {
  const somaApostas = Array(CAVALOS.length).fill(0);
  for (const aposta of apostas) {
    somaApostas[aposta.cavalo - 1] += aposta.valor;
  }

  let resposta = `Nº Cavalo.............. R$ Apostado\n${"-".repeat(35)}\n`;
  CAVALOS.forEach((cavalo, i) => {
    resposta += ` ${i + 1} ${cavalo.padEnd(20)} ${somaApostas[i]
      .toFixed(2)
      .padStart(11)}\n`;
  });

  respLista.innerText = resposta;
});

// Define o ganhador e exibe resultado final
frm.btGanhador.addEventListener("click", () => {
  const ganhador = Number(prompt("Nº Cavalo Ganhador: "));
  if (isNaN(ganhador) || !validarCavalo(ganhador)) {
    alert("Cavalo Inválido");
    return;
  }

  const total = apostas.reduce((acc, aposta) => acc + aposta.valor, 0);

  let resumo = `Resultado Final do Páreo\n${"-".repeat(30)}\n`;
  resumo += `Nº Total de Apostas: ${apostas.length}\n`;
  resumo += `Total Geral R$: ${total.toFixed(2)}\n\n`;
  resumo += `Ganhador Nº ${ganhador} - ${obterCavalo(ganhador)}\n\n`;
  resumo += `Nº de Apostas: ${contarApostas(ganhador)}\n`;
  resumo += `Total Apostado R$: ${totalizarApostas(ganhador).toFixed(2)}`;

  respLista.innerText = resumo;
  frm.btApostar.disabled = true;
  frm.btGanhador.disabled = true;
  frm.btNovo.focus();
});

// Reinicia a aplicação
frm.btNovo.addEventListener("click", () => window.location.reload());
