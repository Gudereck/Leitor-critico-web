async function BuscaLivros(url) {
    try {
        const response = await fetch(url);
        if (!response.ok) {
            throw new Error(`Erro na requisição: ${response.status}`);
        }
        const dados = await response.json();
        return dados;
    } catch (erro) {
        console.error("Erro ao buscar livros:", erro);
        return null;
    }
}

async function main() {
    const url = "https://openlibrary.org/search.json?q=harry+potter";
    const resultado = await BuscaLivros(url);
    console.log(resultado);
}

main();
