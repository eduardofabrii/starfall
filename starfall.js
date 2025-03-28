// Configurações do jogo
const GRAVIDADE = 0.6;
const FORCA_PULO = -12;
const ALTURA_CHAO = 50;
const VELOCIDADE_JOGO = 5;
const QTD_ESTRELAS = 20;
const INTERVALO_OBSTACULOS = 60; // frames
const PONTOS_POR_PULO = 10; // Pontos ganhos a cada pulo
const TECLA_FULLSCREEN = 70; // Tecla 'F' para fullscreen

// Estado do jogo
let pontuacao = 0;
let fimDeJogo = false;
let tempoJogo = 0; // Tempo em segundos
let ultimoSegundo = 0; // Para contar os segundos

// Objetos do jogo
let cubo;
let obstaculos = [];
let estrelas = [];
let estaPulando = false;

function setup() {
    createCanvas(windowWidth, windowHeight);
    
    // Remover bordas e margens do corpo da página e do canvas
    document.body.style.margin = '0';
    document.body.style.padding = '0';
    document.body.style.overflow = 'hidden';
    
    // Estilizar o canvas para ocupar toda a tela sem bordas
    let canvasElement = document.querySelector('canvas');
    if (canvasElement) {
        canvasElement.style.display = 'block';
        canvasElement.style.position = 'absolute';
    }
    
    // Inicializar o jogador
    cubo = {
        x: 150,
        y: height - ALTURA_CHAO - 30,
        tamanho: 30,
        velocidade: 0,
        rotacao: 0
    };
    
    criarEstrelas();
    noStroke();
    
    // Inicializar o tempo
    tempoJogo = 0;
    ultimoSegundo = 0;
}

function criarEstrelas() {
    for (let i = 0; i < QTD_ESTRELAS; i++) {
        estrelas.push({
            x: random(width),
            y: random(height - ALTURA_CHAO),
            tamanho: random(5, 15)
        });
    }
}

function draw() {
    desenharCenario();
    
    if (!fimDeJogo) {
        atualizarJogo();
    }
    
    desenharCubo();
    mostrarInformacoes();
}

function atualizarJogo() {
    atualizarCubo();
    
    // Gerar novo obstáculo periodicamente
    if (frameCount % INTERVALO_OBSTACULOS === 0) {
        obstaculos.push(criarObstaculo());
    }
    
    atualizarEDesenharObstaculos();
    
    // Atualizar o tempo de jogo (a cada segundo)
    let segundoAtual = Math.floor(millis() / 1000);
    if (segundoAtual > ultimoSegundo) {
        tempoJogo++;
        ultimoSegundo = segundoAtual;
    }
}

function desenharCenario() {
    // Fundo
    background(0, 10, 30);
    
    // Estrelas
    fill(255, 255, 255, 150);
    for (let estrela of estrelas) {
        circle(estrela.x, estrela.y, estrela.tamanho);
        estrela.x -= VELOCIDADE_JOGO * 0.2;
        
        // Reposicionar estrelas que saíram da tela
        if (estrela.x < 0) {
            estrela.x = width;
            estrela.y = random(height - ALTURA_CHAO);
        }
    }
    
    // Chão
    fill(50, 50, 50);
    rect(0, height - ALTURA_CHAO, width, ALTURA_CHAO);
    
    // Linhas decorativas no chão
    stroke(70, 70, 70);
    for (let i = 0; i < width; i += 50) {
        line(i, height - ALTURA_CHAO, i, height);
    }
    for (let i = height - ALTURA_CHAO; i < height; i += 10) {
        line(0, i, width, i);
    }
    noStroke();
}

function atualizarCubo() {
    // Aplicar gravidade
    cubo.velocidade += GRAVIDADE;
    cubo.y += cubo.velocidade;
    
    // Verificar colisão com o chão
    if (cubo.y > height - ALTURA_CHAO - cubo.tamanho) {
        aterrarNoChao();
    } else {
        verificarAterragemEmPlataforma();
    }
}

function aterrarNoChao() {
    cubo.y = height - ALTURA_CHAO - cubo.tamanho;
    cubo.velocidade = 0;
    estaPulando = false;
    cubo.rotacao = 0;
}

function verificarAterragemEmPlataforma() {
    let sobrePlataforma = false;
    
    // Verificar se está sobre alguma plataforma (caixa)
    for (let obstaculo of obstaculos) {
        if (obstaculo.tipo === 'caixa' && estaSobrePlataforma(cubo, obstaculo)) {
            sobrePlataforma = true;
            break;
        }
    }
    
    // Se estiver no ar, continuar rotacionando
    if (!sobrePlataforma) {
        cubo.rotacao += 0.1;
        estaPulando = true;
    }
}

function estaSobrePlataforma(cubo, plataforma) {
    // Verifica se o cubo está diretamente em cima da plataforma
    return cubo.x + cubo.tamanho > plataforma.x && 
           cubo.x < plataforma.x + plataforma.tamanho && 
           Math.abs(cubo.y + cubo.tamanho - (plataforma.y - plataforma.altura)) <= 2 &&
           cubo.velocidade >= 0;
}

function desenharCubo() {
    push();
    translate(cubo.x + cubo.tamanho/2, cubo.y + cubo.tamanho/2);
    rotate(cubo.rotacao);
    
    // Corpo do cubo
    fill(50, 200, 255);
    rect(-cubo.tamanho/2, -cubo.tamanho/2, cubo.tamanho, cubo.tamanho);
    
    // Detalhe do cubo
    fill(100, 220, 255);
    triangle(
        -cubo.tamanho/2, -cubo.tamanho/2,
        cubo.tamanho/2, -cubo.tamanho/2,
        -cubo.tamanho/2, cubo.tamanho/2
    );
    pop();
}

function mostrarInformacoes() {
    // Pontuação
    fill(255);
    textSize(32);
    text('Pontos: ' + pontuacao, 20, 40);
    
    // Tempo de jogo
    text('Tempo: ' + formatarTempo(tempoJogo), 20, 80);
    
    // Informação sobre fullscreen
    textSize(16);
    text('Pressione F para tela cheia', 20, height - 60);
    
    // Tela de fim de jogo
    if (fimDeJogo) {
        textAlign(CENTER);
        fill(255, 0, 0);
        textSize(64);
        text('FIM DE JOGO', width/2, height/2);
        textSize(32);
        text('Pressione R para reiniciar', width/2, height/2 + 40);
        text('Tempo de jogo: ' + formatarTempo(tempoJogo), width/2, height/2 + 80);
        textAlign(LEFT);
    }
}

// Função para formatar o tempo em mm:ss
function formatarTempo(segundos) {
    let minutos = Math.floor(segundos / 60);
    let segundosRestantes = segundos % 60;
    
    // Adicionar zero à esquerda se necessário
    let minutosStr = minutos < 10 ? '0' + minutos : minutos;
    let segundosStr = segundosRestantes < 10 ? '0' + segundosRestantes : segundosRestantes;
    
    return minutosStr + ':' + segundosStr;
}

function keyPressed() {
    // Tecla para alternar modo de tela cheia
    if (keyCode === TECLA_FULLSCREEN) {
        toggleFullscreen();
        return;
    }
    
    if (fimDeJogo) {
        if (key === 'r' || key === 'R') {
            reiniciarJogo();
        }
        return;
    }
    
    // Pular (espaço ou seta para cima)
    if ((keyCode === 32 || keyCode === UP_ARROW) && podeJogarPular()) {
        cubo.velocidade = FORCA_PULO;
        estaPulando = true;
        // Aumentar a pontuação quando o jogador pula
        pontuacao += PONTOS_POR_PULO;
    }
}

// Função para alternar entre modo tela cheia e modo normal
function toggleFullscreen() {
    let fs = fullscreen();
    fullscreen(!fs);
    
    // Ajustar o canvas quando o modo de exibição mudar
    setTimeout(() => {
        // Reajustar o canvas para garantir que ele preencha toda a tela
        resizeCanvas(windowWidth, windowHeight);
        
        // Forçar o HTML e o body a não ter margens ou barras de rolagem
        document.documentElement.style.margin = '0';
        document.documentElement.style.padding = '0';
        document.documentElement.style.overflow = 'hidden';
        document.body.style.margin = '0';
        document.body.style.padding = '0';
        document.body.style.overflow = 'hidden';
        
        // Reposicionar o jogador
        cubo.y = height - ALTURA_CHAO - cubo.tamanho;
    }, 100);
}

function podeJogarPular() {
    // Pode pular se estiver no chão
    if (!estaPulando) return true;
    
    // Ou se estiver em cima de uma plataforma
    for (let obstaculo of obstaculos) {
        if (obstaculo.tipo === 'caixa' && estaSobrePlataforma(cubo, obstaculo)) {
            return true;
        }
    }
    
    return false;
}

function reiniciarJogo() {
    fimDeJogo = false;
    obstaculos = [];
    pontuacao = 0;
    tempoJogo = 0;
    ultimoSegundo = Math.floor(millis() / 1000);
    cubo.y = height - ALTURA_CHAO - cubo.tamanho;
    cubo.velocidade = 0;
    cubo.rotacao = 0;
    estaPulando = false;
}

function criarObstaculo() {
    let tipo = random() > 0.5 ? 'espinho' : 'caixa';
    
    return {
        x: width,
        y: height - ALTURA_CHAO,
        tamanho: random(30, 50),
        tipo: tipo,
        altura: tipo === 'caixa' ? random(30, 80) : 0
    };
}

function atualizarEDesenharObstaculos() {
    for (let i = obstaculos.length - 1; i >= 0; i--) {
        let obstaculo = obstaculos[i];
        obstaculo.x -= VELOCIDADE_JOGO;
        
        // Desenhar obstáculo
        if (obstaculo.tipo === 'espinho') {
            desenharEspinho(obstaculo);
        } else {
            desenharCaixa(obstaculo);
        }
        
        // Remover obstáculos fora da tela
        if (obstaculo.x < -obstaculo.tamanho) {
            obstaculos.splice(i, 1);
            continue;
        }
        
        // Verificar colisão
        tratarColisao(obstaculo);
    }
}

function desenharEspinho(obstaculo) {
    fill(255, 70, 70);
    triangle(
        obstaculo.x, obstaculo.y,
        obstaculo.x + obstaculo.tamanho, obstaculo.y,
        obstaculo.x + obstaculo.tamanho/2, obstaculo.y - obstaculo.tamanho
    );
}

function desenharCaixa(obstaculo) {
    let x = obstaculo.x;
    let y = obstaculo.y;
    let largura = obstaculo.tamanho;
    let altura = obstaculo.altura;
    
    // Corpo da caixa
    fill(80, 200, 80);
    rect(x, y - altura, largura, altura);
    
    // Topo (mais claro)
    fill(100, 220, 100);
    rect(x, y - altura, largura, 10);
    
    // Lateral (mais escura)
    fill(60, 180, 60);
    rect(x + largura - 10, y - altura, 10, altura);
}

function tratarColisao(obstaculo) {
    let tipoColisao = verificarColisao(cubo, obstaculo);
    
    if (tipoColisao === 'colisao-espinho' || tipoColisao === 'colisao-lado-caixa') {
        fimDeJogo = true;
    } else if (tipoColisao === 'colisao-topo-caixa') {
        // Posicionar cubo em cima da caixa
        cubo.y = obstaculo.y - obstaculo.altura - cubo.tamanho;
        cubo.velocidade = 0;
        estaPulando = false;
        cubo.rotacao = 0;
    }
}

function verificarColisao(cubo, obstaculo) {
    let cuboDireita = cubo.x + cubo.tamanho;
    let cuboBaixo = cubo.y + cubo.tamanho;
    
    if (obstaculo.tipo === 'espinho') {
        return verificarColisaoEspinho(cubo, cuboDireita, cuboBaixo, obstaculo);
    } else {
        return verificarColisaoCaixa(cubo, cuboDireita, cuboBaixo, obstaculo);
    }
}

function verificarColisaoEspinho(cubo, cuboDireita, cuboBaixo, obstaculo) {
    let dentroAreaEspinho = cubo.x < obstaculo.x + obstaculo.tamanho && 
                            cuboDireita > obstaculo.x && 
                            cuboBaixo > obstaculo.y - obstaculo.tamanho;
    
    if (dentroAreaEspinho) {
        // Verificação mais precisa para a forma do triângulo
        let topoEspinho = obstaculo.y - obstaculo.tamanho;
        let centroEspinho = obstaculo.x + obstaculo.tamanho/2;
        let alturaRelativa = Math.abs(cubo.x + cubo.tamanho/2 - centroEspinho) * obstaculo.tamanho / (obstaculo.tamanho/2);
        
        if (cuboBaixo > topoEspinho + alturaRelativa) {
            return 'colisao-espinho';
        }
    }
    
    return false;
}

function verificarColisaoCaixa(cubo, cuboDireita, cuboBaixo, obstaculo) {
    // Definir a área da caixa
    let caixaEsquerda = obstaculo.x;
    let caixaDireita = obstaculo.x + obstaculo.tamanho;
    let caixaTopo = obstaculo.y - obstaculo.altura;
    let caixaBaixo = obstaculo.y;
    
    // Verificar se há sobreposição nas coordenadas x
    let sobreposicaoX = cubo.x < caixaDireita && cuboDireita > caixaEsquerda;
    
    if (!sobreposicaoX) return false; // Sem colisão
    
    // Verificar colisão com o topo (permitido pular em cima)
    // O cubo deve estar caindo (velocidade >= 0) e sua base deve estar próxima ao topo da caixa
    if (cubo.velocidade >= 0 && 
        cuboBaixo >= caixaTopo && 
        cuboBaixo <= caixaTopo + 10 && // Uma pequena margem para detecção
        cubo.y < caixaTopo) {
        return 'colisao-topo-caixa';
    }
    
    // Verificar colisão lateral (deve matar o jogador)
    // Há sobreposição em x e y ao mesmo tempo, mas não é uma colisão de topo
    if (cubo.y < caixaBaixo && cuboBaixo > caixaTopo) {
        return 'colisao-lado-caixa';
    }
    
    return false;
}

function windowResized() {
    // Ajustar as dimensões do canvas para corresponder à janela
    let targetWidth = windowWidth;
    let targetHeight = windowHeight;
    
    // Garantir que o canvas ocupe exatamente a tela inteira
    resizeCanvas(targetWidth, targetHeight);
    
    // Reposicionar o jogador
    cubo.y = height - ALTURA_CHAO - cubo.tamanho;
    
    // Reajustar qualquer elemento CSS para evitar barras de rolagem
    document.body.style.margin = '0';
    document.body.style.padding = '0';
    document.body.style.overflow = 'hidden';
}

// Função que será chamada quando o modo fullscreen mudar
document.addEventListener('fullscreenchange', function() {
    if (!document.fullscreenElement) {
        // Saiu do modo fullscreen
        resizeCanvas(windowWidth, windowHeight);
        cubo.y = height - ALTURA_CHAO - cubo.tamanho;
    }
});
