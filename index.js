document.addEventListener("DOMContentLoaded", () => {
    // Selecionando os botões (abas)
    const tabCadastro = document.getElementById("tab-cadastro");
    const tabMetricas = document.getElementById("tab-metricas");
    
    // Selecionando as telas
    const abaCadastro = document.getElementById("aba-cadastro");
    const abaMetricas = document.getElementById("aba-metricas");

    // Função que faz a troca das telas e do visual do botão
    function alternarAba(abaParaMostrar, abaParaEsconder, tabParaAtivar, tabParaDesativar) {
        // Altera a exibição das telas
        abaParaMostrar.style.display = "block";
        abaParaEsconder.style.display = "none";

        // Adiciona e remove a classe 'select' que muda a cor no CSS
        tabParaAtivar.classList.add("select");
        tabParaDesativar.classList.remove("select");
    }

    // Evento de clique na aba Cadastro
    tabCadastro.addEventListener("click", () => {
        alternarAba(abaCadastro, abaMetricas, tabCadastro, tabMetricas);
    });

    // Evento de clique na aba Métricas
    tabMetricas.addEventListener("click", () => {
        alternarAba(abaMetricas, abaCadastro, tabMetricas, tabCadastro);
    });
});