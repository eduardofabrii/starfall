let starX, starY, starSize;
let obstacles = [];
let starSpeed = 2;  // Velocidade fixa para a estrela
let obstacleSpeed = 2;  // Velocidade inicial dos obstáculos
let score = 0;
let gameOver = false;  // Nova variável para controlar o estado do jogo

function setup() {
    createCanvas(400, 600);
    starX = width / 2;
    starY = 50;
    starSize = 20;
}

function draw() {
    background(0);
    
    if (!gameOver) {
        // Movimenta a estrela para baixo
        starY += starSpeed;
        
        // Impede que a estrela ultrapasse a parte inferior da tela, parando antes da borda
        starY = constrain(starY, 0, height - starSize - 400);  // 10 é o espaço antes da borda
        
        // Aumenta a velocidade dos obstáculos com o tempo
        obstacleSpeed += 0.001;
        
        // Criar novos obstáculos a cada segundo
        if (frameCount % 60 === 0) {
            obstacles.push({x: random(width), y: height, size: random(30, 60)});
        }
        
        score++;
    }
    
    // Desenha a estrela
    fill(255, 204, 0);
    ellipse(starX, starY, starSize);
    
    // Atualiza e desenha os obstáculos
    for (let i = 0; i < obstacles.length; i++) {
        if (!gameOver) {
            obstacles[i].y -= obstacleSpeed;
        }
        fill(random(100, 255), random(100, 255), random(100, 255));  // Cores aleatórias para os planetas
        ellipse(obstacles[i].x, obstacles[i].y, obstacles[i].size);
        
        // Verifica se houve colisão
        if (!gameOver && dist(starX, starY, obstacles[i].x, obstacles[i].y) < starSize / 2 + obstacles[i].size / 2) {
            gameOver = true;  // Agora o jogo termina em vez de remover o obstáculo
        }
    }
    
    // Desenha a pontuação
    fill(255);
    textSize(16);
    text('Score: ' + score, 10, 20);
    
    // Mostra mensagem de Game Over
    if (gameOver) {
        textSize(32);
        textAlign(CENTER);
        fill(255, 0, 0);
        text('VOCÊ PERDEU!', width/2, height/2);
        textSize(16);
        text('Pressione R para reiniciar', width/2, height/2 + 30);
    }
}

function keyPressed() {
    if (!gameOver) {
        if (keyCode === LEFT_ARROW) starX -= 15;
        if (keyCode === RIGHT_ARROW) starX += 15;
        
        // Impede que a estrela saia da tela
        starX = constrain(starX, 0, width);
    } else if (key === 'r' || key === 'R') {
        // Reinicia o jogo
        gameOver = false;
        obstacles = [];
        score = 0;
        starX = width / 2;
        starY = 50;
        obstacleSpeed = 2;
    }
}
