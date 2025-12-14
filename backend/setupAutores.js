// setupAutores.js
const { exec } = require("child_process");
const path = require("path");

function run(command) {
  return new Promise((resolve, reject) => {
    const proc = exec(command, { cwd: __dirname }, (err) => {
      if (err) return reject(err);
      resolve();
    });
    proc.stdout.pipe(process.stdout);
    proc.stderr.pipe(process.stderr);
  });
}

async function main() {
  try {
    console.log(">> Rodando preencherAutoresCategorias...");
    await run("node preencherAutoresCategorias.js");

    console.log(">> Rodando fixAutoresEspeciais...");
    await run("node fixAutoresEspeciais.js");

    console.log(">> Setup de autores concluído.");
    process.exit(0);
  } catch (err) {
    console.error("Erro no setupAutores:", err.message);
    process.exit(1);
  }
}

main();
