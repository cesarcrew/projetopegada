let graficoAtual = null;

function calcularPegada() {
  const energia = parseFloat(document.getElementById('energia').value);
  const agua = parseFloat(document.getElementById('agua').value);
  const resultado = document.getElementById('resultado');

  if (isNaN(energia) || isNaN(agua)) {
    resultado.innerHTML = "<span style='color: red;'>Por favor, preencha os dois campos corretamente.</span>";
    return;
  }

  if (energia < 0 || agua < 0) {
    resultado.innerHTML = "<span style='color: red;'>Os valores não podem ser negativos.</span>";
    return;
  }

  const fatorEnergia = 0.092;
  const fatorAgua = 0.000298;
  const limiteAgressao = 0.5;

  const emissaoEnergia = energia * fatorEnergia;
  const emissaoAgua = agua * fatorAgua;
  const emissaoTotal = emissaoEnergia + emissaoAgua;

  let mensagemImpacto = '';
  if (emissaoTotal <= limiteAgressao) {
    mensagemImpacto = `<div class="alerta-verde">✅ Sua pegada de carbono está dentro de um nível considerado <strong>baixo impacto</strong>. Bom trabalho!</div>`;
  } else {
    mensagemImpacto = `<div class="alerta-vermelho">⚠️ Sua pegada de carbono está <strong>alta</strong>. Considere reduzir o uso ou melhorar a eficiência da máquina.</div>`;
  }

  resultado.innerHTML = `
    <p>Consumo de energia: <strong>${energia.toFixed(2)} kWh</strong><br>
    Emissão: <strong>${emissaoEnergia.toFixed(4)} kg CO₂</strong></p>
    <p>Consumo de água: <strong>${agua.toFixed(2)} litros</strong><br>
    Emissão: <strong>${emissaoAgua.toFixed(4)} kg CO₂</strong></p>
    <p><strong>🌍 Pegada total estimada: ${emissaoTotal.toFixed(4)} kg CO₂</strong></p>
    ${mensagemImpacto}
  `;

  if (graficoAtual) {
    graficoAtual.destroy();
  }

  const ctx = document.getElementById('grafico').getContext('2d');
  graficoAtual = new Chart(ctx, {
    type: 'pie',
    data: {
      labels: ['Energia', 'Água'],
      datasets: [{
        data: [emissaoEnergia, emissaoAgua],
        backgroundColor: ['#0077b6', '#90e0ef'],
        borderColor: ['#023e8a', '#48cae4'],
        borderWidth: 1
      }]
    },
    options: {
      responsive: true,
      plugins: {
        datalabels: {
          formatter: (value, context) => {
            const total = context.chart._metasets[0].total;
            const percent = (value / total * 100).toFixed(1);
            return `${percent}%`;
          },
          color: '#000',
          font: {
            weight: 'bold',
            size: 14
          }
        },
        legend: {
          position: 'bottom'
        },
        title: {
          display: true,
          text: 'Distribuição das Emissões de CO₂'
        }
      }
    },
    plugins: [ChartDataLabels]
  });
}
