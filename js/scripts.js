// Escutadores de clique para os botões
document.getElementById('singlePlayer-btn').addEventListener('click', () => {
    window.location.href = 'singlePlayer.html';
});

document.getElementById('multiplayer-btn').addEventListener('click', () => {
    window.location.href = 'multiplayer.html';
});

// Criar estrelas no fundo
function createStars() {
    const starsContainer = document.getElementById('stars'); //Insere dentro do id stars

    for (let i = 0; i < 100; i++) {
        const star = document.createElement('div'); //Cria uma div para representar a estrela
        star.classList.add('star'); //Permite que 3o css estilize essa div

        // Gera os dados aleatóriamente
        const size = Math.random() * 3 + 1;
        const xPosition = Math.random() * window.innerWidth; 
        const yPosition = Math.random() * window.innerHeight; 
        const animationDuration = Math.random() * 1.5 + 1; 

        // Aplica os estilos criados à aquela estrela
        star.style.width = `${size}px`; 
        star.style.height = `${size}px`;
        star.style.left = `${xPosition}px`;
        star.style.top = `${yPosition}px`;
        star.style.animationDuration = `${animationDuration}s`;

        // Adicionar a estrela ao container
        starsContainer.appendChild(star);
    } 
}

// Carregar o dom antes de chamar a função
document.addEventListener('DOMContentLoaded', createStars);
