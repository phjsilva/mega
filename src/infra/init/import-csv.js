const fs = require("fs");
const path = require("path");
const Papa = require("papaparse");
const pool = require("../../database/db");

const csvPath = path.resolve(__dirname, "seed-data", "megasena.csv");

function converterData(dataBR) {
  const [dia, mes, ano] = dataBR.split("/");
  return `${ano}-${mes}-${dia}`;
}

async function importCsv() {
  await pool.query("TRUNCATE TABLE megasena");

  const fileContent = fs
    .readFileSync(csvPath, "utf-8")
    .replace(/^\uFEFF/, "");

  const { data: allRows } = Papa.parse(fileContent, {
    delimiter: ";",
    header: false,
    skipEmptyLines: true,
  });

  const rows = allRows.slice(1);

  const values = [];
  const params = [];
  let i = 1;

  for (const row of rows) {
    const [
      concurso,
      data_do_sorteio,
      bola1,
      bola2,
      bola3,
      bola4,
      bola5,
      bola6,
      ganhadores_6_acertos,
      cidade_uf,
      rateio_6_acertos,
      ganhadores_5_acertos,
      rateio_5_acertos,
      ganhadores_4_acertos,
      rateio_4_acertos,
      acumulado_6_acertos,
      arrecadacao_total,
      estimativa_premio,
      acumulado_sorteio_especial_mega_da_virada,
      observacao,
    ] = row;

    values.push(
      `($${i},$${i+1},$${i+2},$${i+3},$${i+4},$${i+5},$${i+6},$${i+7},$${i+8},$${i+9},$${i+10},$${i+11},$${i+12},$${i+13},$${i+14},$${i+15},$${i+16},$${i+17},$${i+18},$${i+19})`
    );
    params.push(
      concurso,
      converterData(data_do_sorteio),
      bola1,
      bola2,
      bola3,
      bola4,
      bola5,
      bola6,
      ganhadores_6_acertos,
      cidade_uf === "NULL" ? null : cidade_uf,
      rateio_6_acertos,
      ganhadores_5_acertos,
      rateio_5_acertos,
      ganhadores_4_acertos === "NULL" ? null : ganhadores_4_acertos,
      rateio_4_acertos,
      acumulado_6_acertos,
      arrecadacao_total,
      estimativa_premio,
      acumulado_sorteio_especial_mega_da_virada,
      observacao === "NULL" ? null : observacao
    );
    i += 20;
  }

  await pool.query(
    `INSERT INTO megasena (
      concurso,
      data_do_sorteio,
      bola1,
      bola2,
      bola3,
      bola4,
      bola5,
      bola6,
      ganhadores_6_acertos,
      cidade_uf,
      rateio_6_acertos,
      ganhadores_5_acertos,
      rateio_5_acertos,
      ganhadores_4_acertos,
      rateio_4_acertos,
      acumulado_6_acertos,
      arrecadacao_total,
      estimativa_premio,
      acumulado_sorteio_especial_mega_da_virada,
      observacao
    ) VALUES ${values.join(",")}`,
    params
  );

  console.log("CSV importado com sucesso");

  await pool.end();
}

importCsv().catch(console.error);