const canvas = document.querySelector('canvas')
const ctx = canvas.getContext('2d')
    /*Pode ser escrito dessa forma:
    const canvas = document.querySelector('canvas'),
        ctx = canvas.getContext('2d')*/
gapX = 10
const mouse = {x: 0, y: 0}

const field = {
    w: window.innerWidth,
    h: window.innerHeight,
    draw: function () { // desenho do campo
        ctx.fillStyle = "#286047";
        ctx.fillRect(0, 0, this.w, this.h)
  }
}

const line = {
    w: 15,
    h: field.h,
    draw: function() {
        ctx.fillStyle = "#ffff" // desenho linha central
        ctx.fillRect(field.w / 2 - this.w / 2, 0, this.w, this.h)
    }
}

const leftPaddle = {
    x: gapX,
    y: 0,
    w: line.w,
    h: 200,
    _move: function() {
        this.y = mouse.y - this.h / 2
    },
    draw: function() {
        ctx.fillStyle = "#ffff" // desenho raquete esquerda
        ctx.fillRect(this.x, this.y, this.w, this.h)

        this._move()
    }
}

const rightPaddle = {
    x: field.w - line.w - gapX,
    y: 250,
    w: line.w,
    h: 200,
    speed: 3,
    _move: function() {
        if (this.y + this.h / 2 < ball.y + ball.r) {
            this.y += this.speed
        } else {
            this.y -= this.speed
        }
    },
    speedUp: function() {
        this.speed += 3
    },
    draw: function() {// desenho raquete direita
        ctx.fillStyle = "#ffff" 
        ctx.fillRect(this.x, this.y, this.w, this.h)

        this._move()
    }
}

const score = {
  human: 0,
  computer: 0,
  increaseHuman: function () {
    this.human++
  },
  increaseComputer: function () {
    this.computer++
  },
  draw: function () {
    // desenho do placar
    ctx.font = "bold 72px Arial";
    ctx.textAlign = "center";
    ctx.textBaseline = "top";
    ctx.fillStyle = "#01341d";
    ctx.fillText(this.human, field.w / 4, 25);
    ctx.fillText(this.computer, field.w / 4 + field.w / 2, 25);
  },
};

const ball = {
    x: 320,
    y: 350,
    r: 20,
    speed: 5,
    directionX: 1,
    directionY: 1,
    _calcPosition: function() {
        // verificar se o jogador 1 pontuou (x > largura do campo)
        if (this.x > field.w - this.r - rightPaddle.w - gapX) {
            // verifica se a raquete direita está na posição y da bola
            if (this.y + this.r > rightPaddle.y &&
                this.y - this.r < rightPaddle.y + rightPaddle.h
            ) {
                // rebate a bola invertendo o sinal de X
                this._reverseX()
            } else {
                // jogador 1 pontua
                score.increaseHuman()
                this._pointUp()
            }
        }
        // verificar se o jogador 2 pontuou (x < 0)
        if (this.x < this.r + leftPaddle.w + gapX) {
            // verifica se a raque te esquerda esta na posição y da bola
            if (this.y + this.r > leftPaddle.y && 
                this.y - this.r < leftPaddle.y + leftPaddle.h
            ) {
            // rebate a bola invertendo o sinal de X
            this._reverseX()
            } else {
                // jogador 2 pontua
                score.increaseComputer();
                this._pointUp();
            }
        }

        // verifica as laterais superior e inferior do campo
        if ((this.y -this.r < 0 && this.directionY <0) ||
            (this.y > field.h - this.r && this.directionY > 0)
        ) {
        // rebate a bola inveetendo oo sinal do eixo Y
            this._reverseY()
        }
    },
    _reverseX: function() {
        // 1 * -1 = -1
        // -1 * -1 = 1
        this.directionX = this.directionX * -1
        // this.directionX *= -1
    },
    _reverseY: function() {
        // 1 * -1 = -1
        // -1 * -1 = 1
        this.directionY = this.directionY * -1
        // this.directionY *= -1
    },
    _speedUp: function() {
        this.speed +=2
    },
    _pointUp: function() {
        this._speedUp()
        rightPaddle.speedUp

        this.x = field.w / 2
        this.y = field.h / 2
        // Voltar a bola para o centro do campo(inicio) depois de pontuar na partida
    },
    _move: function() {
        this.x += this.directionX * this.speed
        this.y += this.directionY * this.speed
    },
    draw: function() {
        ctx.fillStyle = "#ffff" // desenho da bolinha
        ctx.beginPath()
        ctx.arc(this.x, this.y, this.r, 0, 2 * Math.PI, false)
        ctx.fill()

        this._calcPosition()
        this._move()
    }
}

function setup() {
    canvas.width = field.w
    canvas.height = field.h
    ctx.width = field.w
    ctx.height = field.h
    /*Pode ser escrito dessa forma:
    canvas.width = ctx.width = field.w
    canvas.height = ctx.height = field.h*/
}

function draw() {
    field.draw()
    line.draw()
    leftPaddle.draw()
    rightPaddle.draw()
    score.draw()
    ball.draw()
}

setup()
draw()

window.animationFrame = (function() {
    return (
        window.requestAnimationFrame ||
        window.webkitRequestAnimationFrame ||
        window.mozRequesteAnimationFrame ||
        window.oRequesteAnimationFrame ||
        window.msRequesteAnimationFrame ||
        function (callback) {
            return window.setTimeout(callback, 1000 /60)
        }
    )
})()

function main() {
    animationFrame(main)
    draw()
}

setup()
main()

canvas.addEventListener('mousemove', function (e) {
    mouse.x = e.pageX
    mouse.y = e.pageY
})