document.addEventListener("DOMContentLoaded", () => {
    const sliderContainerSeries = document.querySelector(".slider-container-series");
    const setaEsquerdaSeries = document.querySelector(".seta-esquerda-series");
    const setaDireitaSeries = document.querySelector(".seta-direita-series");

    // Garante que os elementos existem
    if (!sliderContainerSeries || !setaEsquerdaSeries || !setaDireitaSeries) {
        console.error("❌ Elementos do carrossel de séries não encontrados no HTML.");
        return;
    }

    let slideIndexSeries = 0;

    function criaSlideSerie(serie) {
        const slide = document.createElement("div");
        slide.classList.add("slide-series");

        //   console.log(serie.overview);


        const imagem = serie.backdrop_path ? serie.backdrop_path : (serie.poster_path ? serie.poster_path : '');
        const descricao = (serie.overview && serie.overview.trim() !== '') ? serie.overview : 'Sem descrição disponível.';

        slide.innerHTML = `
                ${imagem ? `<img src="https://image.tmdb.org/t/p/w780${imagem}" alt="${serie.name}">` : ''}
                 <div class="info-series">
                 <h3>${serie.name}</h3>
                    <p>${descricao || "Sem descrição disponível."}</p>
                </div>
        `;

        slide.addEventListener("click", () => {
            window.location.href = `detalhes.html?id=${serie.id}`;
        });

        return slide;
    }

    async function carregaCarrosselSeries() {
        try {
            const resposta = await fetch(`https://api.themoviedb.org/3/tv/popular?api_key=4372ca995828207e4bb6001942ca8c00&language=pt-BR`);
            const dados = await resposta.json();

            dados.results.forEach((serie) => {
                const slide = criaSlideSerie(serie);
                sliderContainerSeries.appendChild(slide);
            });
        } catch (erro) {
            console.error("Erro ao carregar séries:", erro);
            sliderContainerSeries.innerHTML = `<p style="color:red;">Erro ao carregar séries.</p>`;
        }
    }

    function atualizarCarrosselSeries() {
        sliderContainerSeries.style.transform = `translateX(-${slideIndexSeries * 100}%)`;
    }

    setaEsquerdaSeries.addEventListener("click", () => {
        slideIndexSeries = Math.max(slideIndexSeries - 1, 0);
        atualizarCarrosselSeries();
    });

    setaDireitaSeries.addEventListener("click", () => {
        const totalSlides = document.querySelectorAll(".slide-series").length;
        if (slideIndexSeries < totalSlides - 1) {
            slideIndexSeries++;
            atualizarCarrosselSeries();
        }
    });

    carregaCarrosselSeries();
    async function carregaSeriesNovas() {
        const container = document.querySelector('.container-novas-series');
        if (!container) return;

        try {
            const resposta = await fetch(`https://api.themoviedb.org/3/tv/on_the_air?api_key=4372ca995828207e4bb6001942ca8c00&language=pt-BR`);
            const dados = await resposta.json();

            dados.results.slice(0, 8).forEach(serie => {
                const card = document.createElement('div');
                card.classList.add('card-serie');

                const imagem = serie.poster_path
                    ? `https://image.tmdb.org/t/p/w500${serie.poster_path}`
                    : 'https://via.placeholder.com/250x370?text=Sem+Imagem';

                const descricao = serie.overview && serie.overview.trim() !== ''
                    ? serie.overview
                    : 'Sem descrição disponível.';

                card.innerHTML = `
                    <img src="${imagem}" alt="${serie.name}">
                    <div class="info">
                        <h3>${serie.name}</h3>
                        <p>${descricao.substring(0, 100)}...</p>
                    </div>
                `;

                card.addEventListener("click", () => {
                    window.location.href = `detalhes.html?id=${serie.id}`;
                });

                container.appendChild(card);
            });
        } catch (erro) {
            console.error("Erro ao carregar séries novas:", erro);
            container.innerHTML = `<p style="color:red;">Erro ao carregar séries novas.</p>`;
        }
    }

    // Chama a função
    carregaSeriesNovas();

});
fetch("http://localhost:3000/equipe")
    .then(response => response.json())
    .then(data => {
        const container = document.getElementById("cards-equipe");

        data.forEach(pessoa => {
            const card = document.createElement("div");
            card.classList.add("card-integrante");

            card.innerHTML = `
                <div class= "foto"> <img src="${pessoa.imagem}"> </div>
                <div> 
                <h3>${pessoa.nome}</h3>
                <p>${pessoa.curso}</p>
                <p>${pessoa.minibio}</p>
                <a href="${pessoa.instagram}" target="_blank">Instagram</a>
                </div> 

            `;

            container.appendChild(card);
        });
    })
    .catch(error => console.error("Erro ao carregar equipe:", error));

