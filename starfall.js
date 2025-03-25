let cube;
let obstacles = [];
let score = 0;
let gameOver = false;
let jumpPower = -12;
let gravity = 0.6;
let groundHeight = 50;
let isJumping = false;
let gameSpeed = 5;
let backgroundElements = [];

function setup() {
    createCanvas(windowWidth, windowHeight);
    cube = {
        x: 150,
        y: height - groundHeight - 30,
        size: 30,
        velocity: 0,
        rotation: 0
    };
    
    // Criar alguns elementos de fundo
    for (let i = 0; i < 20; i++) {
        backgroundElements.push({
            x: random(width),
            y: random(height - groundHeight),
            size: random(5, 15)
        });
    }
    
    noStroke();
}

function draw() {
    background(0, 10, 30); // Fundo azul escuro
    
    // Desenhar elementos de fundo (estrelas)
    fill(255, 255, 255, 150);
    for (let star of backgroundElements) {
        circle(star.x, star.y, star.size);
        star.x -= gameSpeed * 0.2;
        if (star.x < 0) {
            star.x = width;
            star.y = random(height - groundHeight);
        }
    }
    
    // Desenhar chão
    fill(50, 50, 50);
    rect(0, height - groundHeight, width, groundHeight);
    
    // Linhas de grade no chão (estilo Geometry Dash)
    stroke(70, 70, 70);
    for (let i = 0; i < width; i += 50) {
        line(i, height - groundHeight, i, height);
    }
    for (let i = height - groundHeight; i < height; i += 10) {
        line(0, i, width, i);
    }
    noStroke();
    
    if (!gameOver) {
        // Aplicar gravidade
        cube.velocity += gravity;
        cube.y += cube.velocity;
        
        // Verificar colisão com o chão
        if (cube.y > height - groundHeight - cube.size) {
            cube.y = height - groundHeight - cube.size;
            cube.velocity = 0;
            isJumping = false;
            cube.rotation = 0;
        } else {
            // Verificar se o cubo está no ar (não está no chão nem em uma plataforma)
            let onPlatform = false;
            
            for (let obstacle of obstacles) {
                if (obstacle.type === 'box') {
                    if (cube.x < obstacle.x + obstacle.size && 
                        cube.x + cube.size > obstacle.x && 
                        abs(cube.y + cube.size - (obstacle.y - obstacle.height)) < 2 &&
                        cube.velocity >= 0) {
                        onPlatform = true;
                        break;
                    }
                }
            }
            
            if (!onPlatform) {
                // Rotacionar cubo ao pular (estilo Geometry Dash)
                cube.rotation += 0.1;
                isJumping = true;
            }
        }
        
        // Criar novos obstáculos
        if (frameCount % 60 === 0) {
            obstacles.push(createObstacle());
        }
        
        // Atualizar e desenhar obstáculos
        updateAndDrawObstacles();
        
        // Atualizar pontuação
        score++;
    }
    
    // Desenhar o cubo com rotação
    push();
    translate(cube.x + cube.size/2, cube.y + cube.size/2);
    rotate(cube.rotation);
    fill(50, 200, 255);
    rect(-cube.size/2, -cube.size/2, cube.size, cube.size);
    fill(100, 220, 255);
    triangle(
        -cube.size/2, -cube.size/2,
        cube.size/2, -cube.size/2,
        -cube.size/2, cube.size/2
    );
    pop();
    
    // Desenhar pontuação
    fill(255);
    textSize(32);
    text('Pontos: ' + Math.floor(score/10), 20, 40);
    
    // Tela de game over
    if (gameOver) {
        textSize(64);
        textAlign(CENTER);
        fill(255, 0, 0);
        text('FIM DE JOGO', width/2, height/2);
        textSize(32);
        text('Pressione R para reiniciar', width/2, height/2 + 40);
    }
}

function keyPressed() {
    let canJump = !isJumping;
    
    // Verificar se está em cima de uma plataforma
    for (let obstacle of obstacles) {
        if (obstacle.type === 'box') {
            if (cube.x < obstacle.x + obstacle.size && 
                cube.x + cube.size > obstacle.x && 
                abs(cube.y + cube.size - (obstacle.y - obstacle.height)) < 2 &&
                cube.velocity >= 0) {
                canJump = true;
                break;
            }
        }
    }
    
    if (!gameOver && (keyCode === 32 || keyCode === UP_ARROW) && canJump) {
        cube.velocity = jumpPower;
        isJumping = true;
    } else if (gameOver && (key === 'r' || key === 'R')) {
        gameOver = false;
        obstacles = [];
        score = 0;
        cube.y = height - groundHeight - cube.size;
        cube.velocity = 0;
        cube.rotation = 0;
        isJumping = false;
    }
}

function drawSpike(x, y, size) {
    triangle(
        x, y,
        x + size, y,
        x + size/2, y - size
    );
}

function drawBox(x, y, width, height) {
    // Desenhar caixa com efeito 3D simples
    fill(80, 200, 80); // Verde para indicar plataforma segura
    rect(x, y - height, width, height);
    
    // Topo da caixa (mais claro)
    fill(100, 220, 100);
    rect(x, y - height, width, 10);
    
    // Lateral da caixa (mais escura)
    fill(60, 180, 60);
    rect(x + width - 10, y - height, 10, height);
}

function createObstacle() {
    // Escolher aleatoriamente entre espinho e caixa
    let type = random() > 0.5 ? 'spike' : 'box';
    
    return {
        x: width,
        y: height - groundHeight,
        size: random(30, 50),
        type: type,
        height: type === 'box' ? random(30, 80) : 0 // Altura para caixas
    };
}

function updateAndDrawObstacles() {
    for (let i = obstacles.length - 1; i >= 0; i--) {
        obstacles[i].x -= gameSpeed;
        
        // Desenhar com base no tipo
        if (obstacles[i].type === 'spike') {
            // Obstáculo espinho (estilo Geometry Dash)
            fill(255, 70, 70);
            drawSpike(obstacles[i].x, obstacles[i].y, obstacles[i].size);
        } else {
            // Caixas para pular em cima
            fill(80, 200, 80); // Mudando para verde para indicar que são "seguras"
            drawBox(obstacles[i].x, obstacles[i].y, obstacles[i].size, obstacles[i].height);
        }
        
        // Remover obstáculos fora da tela
        if (obstacles[i].x < -obstacles[i].size) {
            obstacles.splice(i, 1);
            continue;
        }
        
        // Verificar colisão
        let collisionResult = collides(cube, obstacles[i]);
        
        if (collisionResult === 'spike-collision') {
            gameOver = true;
        } else if (collisionResult === 'box-top-collision') {
            // Se colidir com o topo da caixa, posicionar o cubo em cima dela
            cube.y = obstacles[i].y - obstacles[i].height - cube.size;
            cube.velocity = 0;
            isJumping = false;
            cube.rotation = 0;
        } else if (collisionResult === 'box-side-collision') {
            // Se colidir com o lado da caixa, tratar como obstáculo normal
            gameOver = true;
        }
    }
}

function collides(cube, obstacle) {
    let cubeRight = cube.x + cube.size;
    let cubeBottom = cube.y + cube.size;
    
    if (obstacle.type === 'spike') {
        // Verificação básica de colisão entre cubo e espinho triangular
        
        // Primeiro verifica sobreposição retangular simples
        if (cube.x < obstacle.x + obstacle.size && 
            cubeRight > obstacle.x && 
            cubeBottom > obstacle.y - obstacle.size) {
            
            // Verifica se o cubo está suficientemente dentro do espinho
            let spikeTop = obstacle.y - obstacle.size;
            let spikeCenter = obstacle.x + obstacle.size/2;
            
            // Calcula colisão triangular aproximada
            if (cubeBottom > spikeTop + abs(cube.x + cube.size/2 - spikeCenter) * obstacle.size / (obstacle.size/2)) {
                return 'spike-collision';
            }
        }
    } else {
        // Colisão com caixa - verificar se está aterrissando em cima ou colidindo lateralmente
        if (cube.x < obstacle.x + obstacle.size && 
            cubeRight > obstacle.x && 
            cube.y < obstacle.y - obstacle.height &&
            cubeBottom > obstacle.y - obstacle.height &&
            cube.velocity >= 0) {
            // Colisão com o topo da caixa (aterrissagem)
            return 'box-top-collision';
        } else if (cube.x < obstacle.x + obstacle.size && 
                  cubeRight > obstacle.x && 
                  cube.y < obstacle.y && 
                  cubeBottom > obstacle.y - obstacle.height) {
            // Colisão lateral com a caixa
            return 'box-side-collision';
        }
    }
    return false;
}

function windowResized() {
    resizeCanvas(windowWidth, windowHeight);
    cube.y = height - groundHeight - cube.size;
}
