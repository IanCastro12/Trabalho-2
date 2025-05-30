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
});
