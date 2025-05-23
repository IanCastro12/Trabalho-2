document.addEventListener("DOMContentLoaded", () => {

    //eu to deixando a api pq eu ja tinha começado a fazer, achando que era obrigatorio a fazer
    //EU fui pesquisando como funcionava essa api e deixei

    const apiKey = '4372ca995828207e4bb6001942ca8c00'; // Chave da API do TMDB
    const apiUrl = `https:api.themoviedb.org/3/movie/popular?api_key=${apiKey}&language=pt-BR&page=1`;
    const container = document.querySelector('.carrossel-trailers'); // Seleciona o container do carrossel
    const catalogo = document.querySelector('.catalogo'); // captura a div do catalogo para aparecer os cards dos filmes
    const iframe = document.createElement('iframe'); //cria o elemento do iframe

    //Função para buscar o trailer de um filme por ID
    async function buscarTrailer(idFilme) {
        const url = `https:api.themoviedb.org/3/movie/${idFilme}/videos?api_key=${apiKey}&language=pt-BR`;

        return fetch(url)
            .then(res => res.json())
            .then(data => {
                // Procura o primeiro trailer do YouTube
                const trailer = data.results.find(video => video.type === 'Trailer' && video.site === 'YouTube');
        return trailer ? `https://www.youtube.com/embed/${trailer.key}`: null;
            });
    }

    //Parte 1: Apenas para verificar os dados no console (opcional para testes)
    fetch(apiUrl)
        .then(response => response.json()) 
        .then(data => {
            const filmes = data.results; 
            console.log(filmes); // Mostra os dados no console
        });

    // Parte 2: Carrossel de trailers
    iframe.width = "100%"; // Define o tamanho do iframe
    iframe.height = "100%";
    iframe.allow = "accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"; // Permissões do iframe
    iframe.allowFullscreen = true;
    container.appendChild(iframe); // Adiciona o iframe ao container

    let trailers = []; // Array para armazenar os trailers
    let trailerIndex = 0; // contador para os index do array

    // Função para carregar o trailer atual
    fetch(apiUrl)
    .then(res => res.json()) // transforma em json
    .then(async data => {
        const filmes = data.results.slice(0, 5); // Pega os 5 primeiros filmes da lista
        for(const filme of filmes) {
            const trailer = await buscarTrailer(filme.id);
            if(trailer) {
                trailers.push(trailer);
            }
        }

        // Função para carregar o trailer atual
        if(trailers.length > 0) {
            iframe.src = trailers[0]; // Carrega o primeiro trailer
            setInterval(() => { // Função para trocar o trailer a cada 5 segundos
               trailerIndex = (trailerIndex + 1) % trailers.length;
               iframe.src = trailers[trailerIndex];
            }, 6000);
        }
    });

    // parte 3 cria os cards dos filmes:

    function criaCard(filme) {
        const card = document.createElement('div'); // Cria um novo elemento div
        card.classList.add('card'); //adiciona a classe card

        const imagem = document.createElement('img'); // cria o elemnto img
        imagem.src = `https:image.tmdb.org/t/p/w500${filme.poster_path}`; // adiciona a imagem do filme
        imagem.alt = filme.title; // adiciona o titulo da imagem com alt do img

        const titulo = document.createElement('h3'); 
        titulo.textContent = filme.title; //adiciona o titulo no h3

        card.appendChild(imagem);
        card.appendChild(titulo);

        return card; // retorna o card
    }

    // parte 4: cria os cards dos filmes
    fetch(apiUrl) 
        .then(response => response.json())
        .then(data => {
            const filmes = data.results; // pega os filmes da lista
            filmes.forEach(filme => {
                const card = criaCard(filme); // cria o card
                catalogo.appendChild(card); //adiciona no container
            });
        });
});