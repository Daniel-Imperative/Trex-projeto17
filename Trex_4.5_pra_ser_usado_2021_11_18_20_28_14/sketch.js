var JOGAR = 1;
var ENCERRAR = 0;
var estadoJogo = JOGAR;

var trex, trex_correndo, trex_colidiu;
var solo, soloinvisivel, imagemdosolo;

var nuvem, grupodenuvens, imagemdanuvem;
var grupodeobstaculos,
  obstaculo1,
  obstaculo2,
  obstaculo3,
  obstaculo4,
  obstaculo5,
  obstaculo6;

var gameover, gameoverImage, restart, restartImage;

var pontuacao;

var check
var morrer
var pular

function preload() {
  trex_correndo = loadAnimation("trex1.png", "trex3.png", "trex4.png");
  trex_colidiu = loadAnimation("trex_collided.png");

  imagemdosolo = loadImage("ground2.png");

  imagemdanuvem = loadImage("pixelCloud.png");

  obstaculo1 = loadImage("obstacle1.png");
  obstaculo2 = loadImage("obstacle2.png");
  obstaculo3 = loadImage("obstacle3.png");
  obstaculo4 = loadImage("obstacle4.png");
  obstaculo5 = loadImage("obstacle5.png");
  obstaculo6 = loadImage("obstacle6.png");

  gameoverImage = loadImage("gameOver-1.png");
  restartImage = loadImage("restart.png");
  
  pular = loadSound("jump.mp3")
  check = loadSound("checkPoint.mp3")
  morrer = loadSound("die.mp3")
}

function setup() {
  createCanvas(windowWidth,windowHeight);

  trex = createSprite(50, 180, 20, 50);
  trex.addAnimation("running", trex_correndo);
  trex.addAnimation("collided", trex_colidiu);
  trex.scale = 0.5;

  solo = createSprite(200, 180, 400, 20);
  solo.addImage("ground", imagemdosolo);
  solo.x = solo.width / 2;
  solo.velocityX = -4;

  soloinvisivel = createSprite(200, 190, 400, 10);
  soloinvisivel.visible = false;

  gameover = createSprite(300, 80, 0, 0);
  gameover.addImage(gameoverImage);
  gameover.scale = 0.5;
  gameover.visible = false;

  restart = createSprite(300, 125, 0, 0);
  restart.addImage(restartImage);
  restart.scale = 0.5;
  restart.visible = false;

  grupodeobstaculos = createGroup();
  grupodenuvens = createGroup();

  trex.debug = false;
  trex.setCollider("circle", /*4*/ 0, 0, 40);

  pontuacao = 0;
}

function draw() {
  background(255);
  text("Pontuação: " + pontuacao, 500, 50);

  if (estadoJogo === JOGAR) {
    pontuacao = pontuacao + Math.round(getFrameRate() / 60);
    if (pontuacao % 100 === 0 && pontuacao!==0){
      check.play();
    }
    solo.velocityX = -(4 + 3 * pontuacao/200)
    if (touches.length > 0 || keyDown("space") && trex.y >= 160) {
      trex.velocityY = -13;
      pular.play();
      touches = [];
    }
    trex.velocityY = trex.velocityY + 0.8;

    gerarNuvens();

    gerarObstaculos();

    if (solo.x < 0) {
      solo.x = solo.width / 2;
    }
    if (trex.isTouching(grupodeobstaculos)) {
      estadoJogo = ENCERRAR;

      trex.changeAnimation("collided", trex_colidiu);
      morrer.play();
      //trex.y = trex.y -17
    }
  } else if (estadoJogo === ENCERRAR) {
    //parar o solo
    solo.velocityX = 0;

    trex.velocityY = 0;

    grupodeobstaculos.setVelocityXEach(0);

    grupodenuvens.setVelocityXEach(0);

    grupodeobstaculos.setLifetimeEach(-1);

    grupodenuvens.setLifetimeEach(-1);

    restart.visible = true;
    gameover.visible = true;
  }

  trex.collide(soloinvisivel);

  if (mousePressedOver(restart)) {
    reset();
  }

  drawSprites();
}

function gerarObstaculos() {
  if (frameCount % 60 === 0) {
    var obstaculo = createSprite(610, 165, 10, 40);
    obstaculo.velocityX = -6;

    //gerar obstáculos aleatórios
    var rand = Math.round(random(1, 6));
    switch (rand) {
      case 1:
        obstaculo.addImage(obstaculo1);
        break;
      case 2:
        obstaculo.addImage(obstaculo2);
        break;
      case 3:
        obstaculo.addImage(obstaculo3);
        break;
      case 4:
        obstaculo.addImage(obstaculo4);
        break;
      case 5:
        obstaculo.addImage(obstaculo5);
        break;
      case 6:
        obstaculo.addImage(obstaculo6);
        break;
      default:
        break;
    }

    //atribuir escala e tempo de duração ao obstáculo
    obstaculo.scale = 0.5;
    obstaculo.lifetime = 300;

    //adicionar cada obstáculo ao grupo
    grupodeobstaculos.add(obstaculo);
    obstaculo.velocityX = -(4 + 3 * pontuacao/200)
  }
}

function reset() {
  estadoJogo = JOGAR;
  gameover.visible = false;
  restart.visible = false;

  grupodeobstaculos.destroyEach();
  grupodenuvens.destroyEach();
  pontuacao = 0;

  trex.changeAnimation("running", trex_correndo);
}

function gerarNuvens() {
  //escreva o código aqui para gerar as nuvens
  if (frameCount % 80 === 0) {
    nuvem = createSprite(600, 100, 40, 10);
    nuvem.y = Math.round(random(10, 60));
    nuvem.addImage(imagemdanuvem);
    nuvem.scale = 0.06;
    nuvem.velocityX = -3;

    //atribuir tempo de duração à variável
    nuvem.lifetime = 210;

    //ajustando a profundidade
    nuvem.depth = trex.depth;
    trex.depth = trex.depth + 1;

    //adicionando nuvem ao grupo
    grupodenuvens.add(nuvem);
    nuvem.velocityX = -(4 + 3 * pontuacao/200)
  }
}
