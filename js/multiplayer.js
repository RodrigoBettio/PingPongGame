
const canvasEl = document.querySelector("canvas"), //Seletor do canvas
    canvasCtx = canvasEl.getContext("2d") //Item 2d ou 3d?

let jogoIniciado = false;

document.addEventListener("keydown", (event) => {
    if (event.code === "Space") {
        alternarJogo();
        event.preventDefault(); // Evita o scroll da página ao pressionar espaço
    }
});

function alternarJogo() {
    jogoIniciado = !jogoIniciado;

    const botao = document.getElementById("botao-iniciar");
    const overlay = document.getElementById("overlay-pausa");
    const botaoReset = document.getElementById("botao-reset");
    const casa = document.getElementById("casa");

    if (jogoIniciado) {
        botao.innerText = "Pausar Jogo";
        overlay.style.display = "none"; // Esconde a sobreposição
        botaoReset.style.display = "none";
        casa.style.display = "none";
    } else {
        botao.innerText = "Iniciar Jogo";
        overlay.style.display = "flex"; // Mostra a sobreposição
        botaoReset.style.display = "block";
        casa.style.display = "flex";
    }
}

function resetarPlacar() {
    placar.humano1 = 0;
    placar.humano2 = 0;

    bola._reset();
}


document.getElementById("botao-reset").addEventListener("click", resetarPlacar);
document.getElementById("botao-iniciar").addEventListener("click", alternarJogo);

const gapX = 10

const espaco = {
    w: window.innerWidth,
    h: window.innerHeight,
    estrelas: [], // Array para armazenar as estrelas

    criarEstrelas: function () {
        // Gerar as estrelas apenas uma vez
        this.estrelas = [];
        for (let i = 0; i < 100; i++) {
            const x = Math.random() * this.w;
            const y = Math.random() * this.h;
            const size = Math.random() * 1.5;
            this.estrelas.push({ x, y, size });
        }
    },

    desenhar: function () {
        // Gradiente de fundo
        const gradiente = canvasCtx.createLinearGradient(0, 0, this.w, this.h);
        gradiente.addColorStop(0, "#000428"); // Azul escuro
        gradiente.addColorStop(1, "#004e92"); // Azul claro

        canvasCtx.fillStyle = gradiente;
        canvasCtx.fillRect(0, 0, this.w, this.h);

        // Desenhar as estrelas armazenadas
        canvasCtx.fillStyle = "white";
        for (let i = 0; i < this.estrelas.length; i++) {
            const estrela = this.estrelas[i];
            canvasCtx.beginPath();
            canvasCtx.arc(estrela.x, estrela.y, estrela.size, 0, Math.PI * 2);
            canvasCtx.fill();
        }
    }
}

const linha = {
    w: 12,
    h: espaco.h,
    desenhar: function () {
        canvasCtx.fillStyle = "#fff"

        const x = espaco.w / 2 - this.w / 2
        const y = 0
        const w = this.w
        const h = this.h

        canvasCtx.fillRect(x, y, w, h)
    }
}

const naveEsquerda = {
    x: gapX,
    y: 200,
    w: espaco.w * 0.01,
    h: espaco.h * 0.25,

    desenhar: function () {
        canvasCtx.fillRect(this.x, this.y, this.w, this.h) //Eixo x,  eixo y, espessura, altura
    }
}

const naveDireita = {
    x: espaco.w - 15 - gapX,
    y: 200,
    w: espaco.w * 0.01,
    h: espaco.h * 0.25,

    desenhar: function () {
        canvasCtx.fillRect(this.x, this.y, this.w, this.h)
    }
}

const placar = {
    humano1: 0,
    humano2: 0,

    desenhar: function () {
        canvasCtx.font = "bold 72px Arial"
        canvasCtx.textAlign = "center"
        canvasCtx.textBaseline = "top"
        canvasCtx.fillStyle = "#fff"

        canvasCtx.fillText(this.humano1, espaco.w / 4, 50)
        canvasCtx.fillText(this.humano2, espaco.w / 4 + espaco.w / 2, 50) //1/4 do campo + metade para ir pro outro lado
    }

}

const bola = {
    x: espaco.w / 2,
    y: espaco.h / 2,
    r: Math.max(10, Math.min(espaco.w / 60, 20)), // Calcula o raio diretamente e limita a 20
    //Velocidade e direção aleatórias 
    speedX: 4 * (Math.random() > 0.5 ? 1 : -1), //Velocidade negativa ou positiva entre 3 e 5 do eixo X
    speedY: 4 * (Math.random() > 0.5 ? 1 : -1), //Velocidade negativa ou positiva entre 3 e 5 do eixo X (Ambos criados com chatgpt)
    maxSpeed: Math.max(10, 15 * (espaco.w / 1920)),

    _mover: function () {
        if (!jogoIniciado) return;
        this.x += this.speedX;
        this.y += this.speedY;

        // Rebote nas laterais (superior e inferior)
        if (this.y - this.r < 0 || this.y + this.r > espaco.h) {
            this.speedY *= -1; // Inverte a direção vertical

            // Incremento com limitação
            this.speedX = Math.min(Math.abs(this.speedX * 1.06), this.maxSpeed) * Math.sign(this.speedX); //Abs pega o valor absoluto 
            this.speedY = Math.min(Math.abs(this.speedY * 1.06), this.maxSpeed) * Math.sign(this.speedY); //Sign retorna só o sinal
        }

        // Rebote na nave esquerda
        if (
            this.x - this.r < naveEsquerda.x + naveEsquerda.w &&
            this.y + this.r >= naveEsquerda.y &&
            this.y - this.r <= naveEsquerda.y + naveEsquerda.h //Verificação para bater na nave
        ) {
            this.speedX *= -1;
            this.x = naveEsquerda.x + naveEsquerda.w + this.r;
        }

        // Rebote na nave direita
        if (
            this.x + this.r > naveDireita.x &&
            this.y + this.r >= naveDireita.y &&
            this.y - this.r <= naveDireita.y + naveDireita.h //Verificação para bater na nave
        ) {
            this.speedX *= -1;
            this.x = naveDireita.x - this.r;
        }

        // Verifica se a bola saiu pela esquerda
        if (this.x - this.r < 0) {
            placar.humano2 += 1; // Incrementa a pontuação do jogador 2
            this._reset(); // Reinicia a bola
        }

        // Verifica se a bola saiu pela sdireita
        if (this.x + this.r > espaco.w) {
            placar.humano1 += 1; // Incrementa a pontuação do jogador 1
            this._reset(); // Reinicia a bola
        }
    },

    _reset: function () {
        this.x = espaco.w / 2;
        this.y = espaco.h / 2;
        //Velocidade e direção aleatórias 
        this.speedX = 3 * (Math.random() > 0.5 ? 1 : -1); //Velocidade negativa ou positiva entre 3 e 5 do eixo X
        this.speedY = 3 * (Math.random() > 0.5 ? 1 : -1); //Velocidade negativa ou positiva entre 3 e 5 do eixo X (Ambos criados com chatgpt)
    },

    desenhar: function () {
        canvasCtx.fillStyle = "#fff";
        canvasCtx.beginPath();
        canvasCtx.arc(this.x, this.y, this.r, 0, Math.PI * 2);
        canvasCtx.fill();

        this._mover(); // Convenção colocar underline para funções internas
    },
};


//Para computador
const teclas = {
    "ArrowUp": false,
    "ArrowDown": false,
    "w": false,
    "s": false,
}

document.addEventListener("keydown", function (event) {
    if (!jogoIniciado) return;
    teclas[event.key] = true; // Marca a tecla como pressionada
});

document.addEventListener("keyup", function (event) {
    teclas[event.key] = false; // Marca a tecla como solta
});


// Para o celular
canvasEl.addEventListener("touchmove", function (event) {
    if (!jogoIniciado) return; // Apenas processa o movimento se o jogo estiver ativo
    moverNave(event); // Chama a função existente de toque
    event.preventDefault()
});

canvasEl.addEventListener("click", function () {
    alternarJogo(); // Alterna o estado do jogo ao tocar no canvas
});

function moverNave(event) {
    if (!jogoIniciado) return;
    // Evita o scroll
    event.preventDefault();

    const toques = event.touches;

    for (let i = 0; i < toques.length; i++) {
        const toque = toques[i];
        const toqueX = toque.clientX;
        const toqueY = toque.clientY; //Propriedade para pegar o toque do usuário

        // Controle da nave esquerda 
        if (toqueX < espaco.w / 2) {
            naveEsquerda.y = toqueY - naveEsquerda.h / 2;

            // Nave não sair da tela
            if (naveEsquerda.y < 0) naveEsquerda.y = 0;
            if (naveEsquerda.y + naveEsquerda.h > espaco.h)
                naveEsquerda.y = espaco.h - naveEsquerda.h;
        }

        // Controle da nave direita 
        if (toqueX >= espaco.w / 2) {
            naveDireita.y = toqueY - naveDireita.h / 2;

            // Para a nave não sair da tela
            if (naveDireita.y < 0) naveDireita.y = 0;
            if (naveDireita.y + naveDireita.h > espaco.h)
                naveDireita.y = espaco.h - naveDireita.h;
        }
    }
}

function verificarOrientacao() {
    const aviso = document.getElementById("aviso-orientacao");
    if (window.innerWidth < window.innerHeight) {
        aviso.style.display = "block"; // Mostra a mensagem
    } else {
        aviso.style.display = "none"; // Esconde a mensagem
        setup();
    }
}

// Quando a janela for redimensionada, verifica a orientação
window.addEventListener("resize", () => {
    verificarOrientacao();
    setup();
});

function atualizarPosicoes() {
    // Ajusta largura e altura das naves de acordo com a nova proporção
    naveEsquerda.w = espaco.w * 0.01;
    naveEsquerda.h = espaco.h * 0.25;
    naveDireita.w = espaco.w * 0.01;
    naveDireita.h = espaco.h * 0.25;

    // Ajusta as posições das naves 
    naveEsquerda.x = gapX;
    naveDireita.x = espaco.w - naveDireita.w - gapX;

    // Garante que as naves não saiam da tela
    naveEsquerda.y = Math.min(naveEsquerda.y, espaco.h - naveEsquerda.h);
    naveDireita.y = Math.min(naveDireita.y, espaco.h - naveDireita.h);

    bola.r = Math.max(10, Math.min(espaco.w / 60, 20));
    bola.x = espaco.w / 2
    bola.y = espaco.h / 2
}

// Cria a div de aviso de orientação logo que a página carregar (Criado com chatgpt)
document.addEventListener("DOMContentLoaded", function () {
    const avisoDiv = document.createElement("div");
    avisoDiv.id = "aviso-orientacao";
    avisoDiv.style.position = "absolute";
    avisoDiv.style.top = "70%";
    avisoDiv.style.left = "50%";
    avisoDiv.style.transform = "translate(-50%, -50%)";
    avisoDiv.style.fontSize = "24px";
    avisoDiv.style.fontWeight = "bold";
    avisoDiv.style.color = "#fff";
    avisoDiv.style.backgroundColor = "rgba(0, 0, 0, 0.7)";
    avisoDiv.style.padding = "10px";
    avisoDiv.style.borderRadius = "10px";
    avisoDiv.style.display = "none"; // Inicialmente escondido
    avisoDiv.innerText = "Por favor, gire seu dispositivo para jogar na horizontal.";
    document.body.appendChild(avisoDiv);

    verificarOrientacao(); // Verifica se a orientação está correta
});

function setup() {
    if (window.innerWidth > window.innerHeight) {
        canvasEl.width = window.innerWidth;
        canvasEl.height = window.innerHeight;
    } else {
        canvasEl.width = window.innerHeight;
        canvasEl.height = window.innerWidth;
    }

    espaco.w = canvasEl.width;
    espaco.h = canvasEl.height;
    espaco.criarEstrelas(); // Cria as estrelas apenas uma vez por partida

    atualizarPosicoes();
}



function desenhar() {

    if (jogoIniciado) {
        // Movimento das naves
        if (teclas["w"] && naveEsquerda.y > 0) {
            naveEsquerda.y -= 5;
        } else if (teclas["s"] && naveEsquerda.y + naveEsquerda.h < espaco.h) {
            naveEsquerda.y += 5;
        }

        if (teclas["ArrowUp"] && naveDireita.y > 0) {
            naveDireita.y -= 5;
        } else if (teclas["ArrowDown"] && naveDireita.y + naveDireita.h < espaco.h) {
            naveDireita.y += 5;
        }
    }

    //Plano de Fundo
    espaco.desenhar()

    //Linha do jogo
    linha.desenhar()

    //Criação das "naves"
    //Nave esquerda
    naveEsquerda.desenhar()

    //Nave direita
    naveDireita.desenhar()

    //Criando a Bola
    bola.desenhar()

    //Placar do jogo
    placar.desenhar()

}

window.animateFrame = (function () {
    return (
        window.requestAnimationFrame ||
        window.webkitRequestAnimationFrame ||
        window.mozRequestAnimationFrame ||
        window.oRequestAnimationFrame ||
        window.msRequestAnimationFrame ||
        function (callback) {
            return window.setTimeout(callback, 1000 / 60)
        }
    )
})()

function main() {
    animateFrame(main)
    desenhar()
}

setup()
main()
