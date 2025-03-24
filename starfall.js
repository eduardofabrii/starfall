let starX, starY, starSize;
let obstacles = [];
let starSpeed = 2;  // Velocidade fixa para a estrela
let obstacleSpeed = 2;  // Velocidade inicial dos obstáculos
let score = 0;

function setup() {
  createCanvas(400, 600);
  starX = width / 2;
  starY = 50;
  starSize = 20;
}

function draw() {
  background(0);
  
  // Movimenta a estrela para baixo
  starY += starSpeed;
  
  // Impede que a estrela ultrapasse a parte inferior da tela, parando antes da borda
  starY = constrain(starY, 0, height - starSize - 400);  // 10 é o espaço antes da borda
  
  // Aumenta a velocidade dos obstáculos com o tempo
  obstacleSpeed += 0.001;
  
  // Desenha a estrela
  fill(255, 204, 0);
  ellipse(starX, starY, starSize);
  
  // Criar novos obstáculos a cada segundo
  if (frameCount % 60 === 0) {
    obstacles.push({x: random(width), y: height, size: random(30, 60)});
  }

  // Atualiza e desenha os obstáculos
  for (let i = 0; i < obstacles.length; i++) {
    obstacles[i].y -= obstacleSpeed;
    fill(random(100, 255), random(100, 255), random(100, 255));  // Cores aleatórias para os planetas
    ellipse(obstacles[i].x, obstacles[i].y, obstacles[i].size);
    
    // Verifica se houve colisão
    if (dist(starX, starY, obstacles[i].x, obstacles[i].y) < starSize / 2 + obstacles[i].size / 2) {
      obstacles.splice(i, 1);
    }
  }
  
  // Desenha a pontuação
  fill(255);
  textSize(16);
  text('Score: ' + score, 10, 20);
  
  score++;
}

function keyPressed() {
  if (keyCode === LEFT_ARROW) starX -= 15;
  if (keyCode === RIGHT_ARROW) starX += 15;
  
  // Impede que a estrela saia da tela
  starX = constrain(starX, 0, width);
}
