var canvas=document.getElementById('canvas');
var ctx=canvas.getContext('2d');
var FPS=30;
var shipSize=20;
var turnSpeed=360;
var shipThrust=5;
var friction=0.3;
var maxThrust=8;
var astrSpeed = 150;
var astr;
var astrSize = 50;
var addAstr = 10;
var astrVert = 10;
var astrMax = 200;
var astrJag = 0.4;
var shots=[];
var bullet_width = 2.5;
var bullet_speed = 600;
var bullet_life = 10000;
var dead = false;
var score = 0;
var heighScore = 0;
var sb = 10;
var mouse_x = 0
var mouse_y = 0
function sound(src) {
  this.sound = document.createElement("audio");
  this.sound.src = src;
  this.sound.setAttribute("preload", "auto");
  this.sound.setAttribute("controls", "none");
  this.sound.style.display = "none";
  document.body.appendChild(this.sound);
  this.play = function(){
    this.sound.play();
  }
  this.stop = function(){
    this.sound.currentTime = 0;
    this.sound.pause()
  }
}

var shotLast = false
function reset() {
    if (dead === true) {
    dead = false;
    ship={
        x: canvas.width / 2,
        y: canvas.height / 2,
        r: shipSize / 2,
        a: 90 / 180 * Math.PI, // convert to radians
        rot: 0,
        thrusting: false,
        thrust: {
            x: 0,
            y: 0,
            t: 0 // limit maxThrust
        }
    };
    score = 0;
    astrs = [];
    createAstr();
    shots = [];
    }
}
function displayText(text, font, x, y) {
    ctx.font = font;
    ctx.fillText(text, x, y);
}
//set up asteroids
canvas.addEventListener("mousedown", function(event) {
    mouse_x = event.pageX - 250;
    mouse_y = event.pageY - 100;
}, false);
var astrs = [];
function createAstr() {
    astr = {};
        astr = {
            x: (Math.random() - 0.5) * (canvas.width * 100000000),
            y: (Math.random() - 0.5) * (canvas.height * 100000000),
            xs: Math.random() * astrSpeed / FPS * (Math.random() < 0.5 ? 1 : -1),
            ys: Math.random() * astrSpeed / FPS * (Math.random() < 0.5 ? 1 : -1),
            r: astrSize / 2,
            vert: Math.floor((Math.random() * (astrVert)) + (astrVert / 2)),
            a: Math.random() * Math.PI * 2,
            offs: []
        };
    for (i = 0; i < astr.vert; i++) {
        astr.offs.push(Math.random() * astrJag *2 + 1 - astrJag);
    }
    astrs.push([astr.x, astr.y, astr.xs, astr.ys, astr.r, astr.a, astr.vert, astr.offs, astrSize]);
}
function splitAstr(x, y, size) {
    for (var f = 0; f < 2; f++) {
        astr = {
            x: x,
            y: y,
            xs: Math.random() * astrSpeed / FPS * (Math.random() < 0.5 ? 1 : -1),
            ys: Math.random() * astrSpeed / FPS * (Math.random() < 0.5 ? 1 : -1),
            r: (size / 2) / 2,
            vert: Math.floor((Math.random() * (astrVert)) + (astrVert / 2)),
            a: Math.random() * Math.PI * 2,
            offs: []
        };
        for (i = 0; i < astr.vert; i++) {
            astr.offs.push(Math.random() * astrJag *2 + 1 - astrJag);
        }
        astrs.push([astr.x, astr.y, astr.xs, astr.ys, astr.r, astr.a, astr.vert, astr.offs, size / 2]);
    }
}
setInterval(update, 1000/FPS);
setInterval(createAstr, 10000);

document.addEventListener('keydown', keyDown);
document.addEventListener('keyup', keyUp);

shootSound = new sound('sounds/fire.wav')
thrustSound = new sound('sounds/thrust.wav')
bigSound = new sound('sounds/bigExplosion.wav')
mediumSound = new sound('sounds/mediumExplosion.wav')
smallSound = new sound('sounds/smallExplosion.wav')
beatOne = new sound('sounds/beat1.wav')
beatTwo = new sound('sounds/beat2.wav')
extraShip = new sound('sounds/extraShip.wav')
function sleep(milliseconds) {
  const date = Date.now();
  let currentDate = null;
  do {
    currentDate = Date.now();
  } while (currentDate - date < milliseconds);
}
function playSounds() {
    if (paused === false) {
        beatOne.play()
    }
}
function playSoundsTwo() {
    if (paused === false) {
        beatTwo.play()
    }
}
setInterval(playSounds, 2000)
sleep(1000)
setInterval(playSoundsTwo, 2000)
function keyDown(event) {
    switch(event.keyCode) {
        case 37: // left arrow
            ship.rot = turnSpeed / 180 * Math.PI / FPS;
            break;
        case 38: // up arrow
            ship.thrusting = true;
            thrustSound.play()
            break;
        case 39: // right arrow
            ship.rot = -turnSpeed / 180 * Math.PI / FPS;
            break;
        case 32: // space
            if (shotLast===false) {
            shootSound.stop()
            shootSound.play()
            shotLast=true
            shots.push({
            a: ship.a,
            x: ship.x,
            y: ship.y,
            life: 0
            });
            }
            break;
        case 27:
            if (paused === false) {
                paused = true
            } else {
                paused = false
            }
            ctx.fillStyle = "rgba(0, 0, 0, 0.4)";
            ctx.fillRect(0, 0, canvas.width, canvas.height);
    }
}
function keyUp(event) {
    switch(event.keyCode) {
        case 37: // left arrow
            ship.rot = 0;
            break;
        case 38: // up arrow
            ship.thrusting = false;
            break;
        case 39: // right arrow
            ship.rot = 0;
            break;
        case 32:
            shotLast = false
    }
}
function getTextWidth(text, font) {
    // re-use canvas object for better performance
    var canvas = getTextWidth.canvas || (getTextWidth.canvas = document.createElement("canvas"));
    var context = canvas.getContext("2d");
    context.font = font;
    var metrics = context.measureText(text);
    return metrics.width;
}
var ship={
    x: canvas.width / 2,
    y: canvas.height / 2,
    r: shipSize / 2,
    a: 90 / 180 * Math.PI, // convert to radians
    rot: 0,
    thrusting: false,
    thrust: {
        x: 0,
        y: 0,
        t: 0 // limit maxThrust
    }
};
function drawShip(angle, x, y) {
    ctx.lineWidth = shipSize / 20;
    ctx.beginPath();
    ctx.moveTo(
        x + 4 / 3 * ship.r * Math.cos(angle),
        y - 4 / 3 * ship.r * Math.sin(angle)
    );
    ctx.lineTo(
        x - 2 / 3 * ship.r * (Math.cos(angle) + Math.sin(angle)),
        y + 2 / 3 * ship.r * (Math.sin(angle) - Math.cos(angle))
    );
    ctx.lineTo(
        x - 2 / 3 * ship.r * (Math.cos(angle) - Math.sin(angle)),
        y + 2 / 3 * ship.r * (Math.sin(angle) + Math.cos(angle))
    );
    ctx.closePath();
    ctx.stroke();
}
createAstr();
var lives = 3
var paused = false
function update() {
    if (ship.thrusting === false) {
        thrustSound.stop()
    }
    if (dead == false && paused === false) {
    //draw space
    ctx.fillStyle='black';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    //draw scores
    for (var i = 0; i < lives; i++) {
        drawShip(4.71239 / 3, (i + 1) * (ship.r * 2), canvas.height - ship.r)
    }
    ctx.font = "20px Arial";
    ctx.fillStyle = "white";
    ctx.textAlign = "left";
    ctx.fillText("Score: " + score.toString(), 30, 30);
    
    
    ctx.font = "20px Arial";
    ctx.fillStyle = "white";
    ctx.textAlign = "right";
    ctx.fillText("Heigh Score: " + heighScore.toString(), canvas.width - 30, 30);
    
    //thrust the ship
    if (ship.thrusting) {
        ship.thrust.x += (shipThrust * Math.cos(ship.a) / FPS) * (ship.thrust.t / (maxThrust));
        ship.thrust.y -= (shipThrust * Math.sin(ship.a) / FPS) * (ship.thrust.t / (maxThrust));
        //draw thruster
        ctx.strokeStyle='white';
        //ctx.fillStyle='red'
        ctx.lineWidth = shipSize / 20;
        ctx.beginPath();
       ctx.moveTo(
            ship.x - 1.2 * ship.r * (Math.cos(ship.a) + 0.2 * Math.sin(ship.a)),
            ship.y + 1.2 * ship.r * (Math.sin(ship.a) - 0.2 * Math.cos(ship.a))
        );
        ctx.lineTo(
            ship.x - (4 + ship.thrust.t) / 3 * ship.r * Math.cos(ship.a),
            ship.y + (4 + ship.thrust.t) / 3 * ship.r * Math.sin(ship.a)
        );
        ctx.lineTo(
            ship.x - 1.2 * ship.r * (Math.cos(ship.a) - 0.2 * Math.sin(ship.a)),
            ship.y + 1.2 * ship.r * (Math.sin(ship.a) + 0.2 * Math.cos(ship.a))
        );
        ctx.closePath();
        //ctx.fill()
        ctx.stroke();
        if (ship.thrust.t < maxThrust) {
            ship.thrust.t += 1;
        }
    } else if (ship.thrust.t > 0) {
        ship.thrust.x += (shipThrust * Math.cos(ship.a) / FPS) * (ship.thrust.t / (maxThrust));
        ship.thrust.y -= (shipThrust * Math.sin(ship.a) / FPS) * (ship.thrust.t / (maxThrust));
        ctx.strokeStyle='white';
        //ctx.fillStyle='red'
        ctx.lineWidth = shipSize / 20;
        ctx.beginPath();
       ctx.moveTo(
            ship.x - 1.2 * ship.r * (Math.cos(ship.a) + 0.2 * Math.sin(ship.a)),
            ship.y + 1.2 * ship.r * (Math.sin(ship.a) - 0.2 * Math.cos(ship.a))
        );
        ctx.lineTo(
            ship.x - (4 + ship.thrust.t) / 3 * ship.r * Math.cos(ship.a),
            ship.y + (4 + ship.thrust.t) / 3 * ship.r * Math.sin(ship.a)
        );
        ctx.lineTo(
            ship.x - 1.2 * ship.r * (Math.cos(ship.a) - 0.2 * Math.sin(ship.a)),
            ship.y + 1.2 * ship.r * (Math.sin(ship.a) + 0.2 * Math.cos(ship.a))
        );
        ctx.closePath();
        //ctx.fill()
        ctx.stroke();
        ship.thrust.t -= 1;
    }
    ship.thrust.x -= friction * ship.thrust.x / FPS;
    ship.thrust.y -= friction * ship.thrust.y / FPS;
    //draw ship
    ctx.strokeStyle='white';
    ctx.lineWidth = shipSize / 20;
    ctx.beginPath();
    ctx.moveTo(
        ship.x + 4 / 3 * ship.r * Math.cos(ship.a),
        ship.y - 4 / 3 * ship.r * Math.sin(ship.a)
    );
    ctx.lineTo(
        ship.x - 2 / 3 * ship.r * (Math.cos(ship.a) + Math.sin(ship.a)),
        ship.y + 2 / 3 * ship.r * (Math.sin(ship.a) - Math.cos(ship.a))
    );
    ctx.lineTo(
        ship.x - 2 / 3 * ship.r * (Math.cos(ship.a) - Math.sin(ship.a)),
        ship.y + 2 / 3 * ship.r * (Math.sin(ship.a) + Math.cos(ship.a))
    );
    ctx.closePath();
    ctx.stroke();
    //draw asteroids
    ctx.stokeStyle = 'slategrey';
    for (var i = 0; i < astrs.length; i++) {
        ctx.beginPath();
        ctx.moveTo(
            astrs[i][0] + astrs[i][4] * astrs[i][7][0] * Math.cos(astrs[i][5]),
            astrs[i][1] + astrs[i][4] * astrs[i][7][0] * Math.sin(astrs[i][5])
        );
        for (var j = 1; j < astrs[i][6]; j++) {
            ctx.lineTo(
                astrs[i][0] + astrs[i][4] * astrs[i][7][j] * Math.cos(astrs[i][5] + j * Math.PI * 2 / astrs[i][6]),
                astrs[i][1] + astrs[i][4] * astrs[i][7][j] * Math.sin(astrs[i][5] + j * Math.PI * 2 / astrs[i][6])
            );
        }
        ctx.closePath();
        ctx.stroke();
    }
    for (var i = 0; i < astrs.length; i++) {
        astrs[i][0] += astrs[i][2]
        astrs[i][1] += astrs[i][3]
        if (astrs[i][0] < 0 - astrs[i][4]) {
            astrs[i][0] = canvas.width + astrs[i][4]
        } else if (astrs[i][0] > canvas.width + astrs[i][4]) {
            astrs[i][0] = 0 - astrs[i][4]
        }
        if (astrs[i][1] < 0 - astrs[i][4]) {
            astrs[i][1] = canvas.height + astrs[i][4]
        } else if (astrs[i][1] > canvas.height + astrs[i][4]) {
            astrs[i][1] = 0 - astrs[i][4]
        }
        if (((Math.abs(ship.x - astrs[i][0]) ** 2) + (Math.abs(ship.y - astrs[i][1]) ** 2)) ** 0.5 < ship.r + astrs[i][8]) {
        if (lives < 1) {
            dead = true
            lives = 3
        } else {
            extraShip.stop()
            extraShip.play()
            lives -= 1
            astrs.splice[i, 1]
            ship.x = canvas.width / 2
            ship.y = canvas.height / 2
            ship.thrust.x = 0
            ship.thrust.y = 0
            ship.a = 90 / 180 * Math.PI
            astrs = []
        }
        }
    }
    //handle edge of screen
    if (ship.x < 0 - ship.r) {
        ship.x = canvas.width + ship.r;
    } else if (ship.x > canvas.width + ship.r) {
        ship.x = 0 - ship.r;
    }
    if (ship.y < 0 - ship.r) {
        ship.y = canvas.height + ship.r;
    } else if (ship.y > canvas.height + ship.r) {
        ship.y = 0 - ship.r;
    }
    ctx.fillStyle='white'
    for (var i = 0; i < shots.length; i++) {
        ctx.fillRect(shots[i].x - (bullet_width / 2), shots[i].y - (bullet_width / 2), bullet_width, bullet_width)
    }
    for (var i = 0; i < shots.length; i++) {
        shots[i].x += (bullet_speed * Math.cos(shots[i].a) / FPS)
        shots[i].y -= (bullet_speed * Math.sin(shots[i].a) / FPS)
        if (shots[i].x <= 0 - bullet_width) {
            shots[i].x = canvas.width - bullet_width
        }
        if (shots[i].x >= canvas.width) {
            shots[i].x = 0
        }
        if (shots[i].y <= -bullet_width) {
            shots[i].y = canvas.height - bullet_width
        }
        if (shots[i].y >=canvas.height) {
            shots[i].y = 0
        }
    }
    sub_count = 0
    for (var i = 0; i < shots.length; i++) {
        shots[i - sub_count].life += bullet_speed
        if (shots[i - sub_count].life >= bullet_life) {
            shots.splice(i - sub_count, 1)
            sub_count += 1
        }
    }
    for (var i = 0; i < astrs.length; i++) {
        for (var m = 0; m < shots.length; m++) {
            x_diff = Math.abs(astrs[i][0] - shots[m].x)
            y_diff = Math.abs(astrs[i][1] - shots[m].y)
            diff = ((x_diff ** 2) + (y_diff ** 2)) ** 0.5
            if (astrs[i][8] >= diff) {
                if (astrs[i][8] > 20) {
                    splitAstr(astrs[i][0], astrs[i][1], astrs[i][8])
                }
                if (astrs[i][8] == 50) {
                    bigSound.stop()
                    bigSound.play()
                } else if (astrs[i][8] == 25) {
                    mediumSound.stop()
                    mediumSound.play()
                } else {
                    smallSound.stop()
                    smallSound.play()
                }
                shots.splice(m, 1)
                astrs.splice(i, 1)
                score += sb
            }
        }
    }
    //move the ship
    ship.x += ship.thrust.x;
    ship.y += ship.thrust.y;
    //rotate the ship
    ship.a += ship.rot;
    if (score > heighScore) {
        heighScore = score
    }
    if (astrs.length < 1) {
        createAstr()
    }
    } else if (paused===true) {
        ctx.beginPath()
        ctx.strokeStyle = "white"
        ctx.rect(-16.5 + (canvas.width / 2) - getTextWidth("Resume", "40px Arial") / 2, (canvas.height / 2) - 20, getTextWidth("Resume", "40px Arial") + 33, 50)
        ctx.stroke()
        ctx.fillStyle = 'silver'
        displayText("Resume", "40px Arial", (canvas.width / 2) + (getTextWidth("Resume", "40px Arial") / 2), canvas.height / 2 + 20)
        if (mouse_x > (-16.5 + (canvas.width / 2) - getTextWidth("Resume", "40px Arial") / 2) + (getTextWidth("Resume", "40px Arial") / 2) && mouse_x < (-16.5 + (canvas.width / 2) - getTextWidth("Resume", "40px Arial") / 2) + getTextWidth("Resume", "40px Arial") + 33 + (getTextWidth("Resume", "40px Arial") / 2)) {
            paused = false
            mouse_x = 0
            mouse_y = 0
        }
    }
    else {
        ctx.fillStyle = 'black'
        ctx.fillRect(0, 0, canvas.width, canvas.height)
        ctx.font = "90px Comic Sans MS";
        ctx.fillStyle = "red";
        ctx.textAlign = "center";
        ctx.fillText("YOU LOSE", canvas.width/2, canvas.height/2)
        ctx.font = "20px Arial"
        ctx.fillStyle = "white"
        ctx.textAlign = "right"
        ctx.fillText("SCORE: " + score.toString(), canvas.width/2 - 20, canvas.height/2 + 50)
        ctx.textAlign = "left"
        ctx.fillText("HEIGH SCORE: " + heighScore.toString(), canvas.width/2 + 20, canvas.height/2 + 50)
        ctx.fillRect(canvas.width/2 - 50, (canvas.height/2 + 90) - 10, 100, 20)
        ctx.fillStyle = "black"
        ctx.textAlign = "center"
        ctx.fillText("RESET", canvas.width/2, (canvas.height/2 + 100) - 2)
        
        
    }
}