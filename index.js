const DIFFICULTY_LEVELS = {
    easy: 200,
    normal: 400,
    hard: 600,
}

class Vector {
    constructor(x = 0, y = 0) {
        this.x = x
        this.y = y
    }

    get len() {
        return Math.sqrt(this.x * this.x + this.y * this.y)
    }

    set len(value) {
        const fact = value / this.len
        this.x *= fact
        this.y *= fact
    }
}

class Rectangle {
    constructor(w, h) {
        this.position = new Vector
        this.size = new Vector(w, h)
    }

    get left() {
        return this.position.x - this.size.x / 2
    }

    get right() {
        return this.position.x + this.size.x / 2
    }

    get top() {
        return this.position.y - this.size.y / 2
    }

    get bottom() {
        return this.position.y + this.size.y / 2
    }

    setPosition(x = window.innerWidth / 2, y = window.innerHeight / 2) {
        this.position.x = x
        this.position.y = y
    }
}

class Ball extends Rectangle {
    constructor() {
        super(10, 10)
        this.vel = new Vector
    }

    setVelocity(velocity = 0) {
        this.vel.x = velocity
        this.vel.y = velocity
    }
}

class Player extends Rectangle {
    constructor() {
        super(20, 100)
        this.score = 0
    }
}

class Pong {
    constructor(canvas) {
        this._canvas = canvas
        this._context = canvas.getContext('2d')

        this.players = [new Player, new Player]
        this.ball = new Ball

        this.reset()
        this.updateAnimationFrame();
    }

    updateAnimationFrame() {
        let lastTime = null

        const callback = (millis) => {
            if (lastTime)
                this.updatePosition((millis - lastTime) / 1000);
            lastTime = millis;
            requestAnimationFrame(callback);
        };

        callback();
    }

    collide(player, ball) {
        if (player.left < ball.right && player.right > ball.left &&
            player.top < ball.bottom && player.bottom > ball.top) {

            ball.vel.x = -ball.vel.x
            ball.vel.y += 300 * (Math.random() - 0.5)
            ball.vel.len *= 1.05
        }
    }

    drawRectangleElement(rect) {
        this._context.fillStyle = 'white'
        this._context.fillRect(rect.left, rect.top, rect.size.x, rect.size.y)
    }

    drawAll() {
        // Draw background
        this._context.fillStyle = 'black'
        this._context.fillRect(0, 0, this._canvas.width, this._canvas.height)

        this.drawRectangleElement(this.ball)

        for (let player of this.players) this.drawRectangleElement(player)
    }

    reset() {
        this._canvas.width = window.innerWidth
        this._canvas.height = window.innerHeight

        this.players[0].setPosition(40)
        this.players[1].setPosition(this._canvas.width - 40)

        this.ball.setVelocity()
        this.ball.setPosition()
    }

    start() {
        if (this.ball.vel.x == 0 && this.ball.vel.y == 0) {
            this.ball.vel.x = 300 * (Math.random() < 0.5 ? 1 : -1)
            this.ball.vel.y = 300 * (Math.random() * 2 - 1)
            this.ball.vel.len = DIFFICULTY_LEVELS.easy
        }
    }

    updatePosition(dt) {
        this.ball.position.x += this.ball.vel.x * dt
        this.ball.position.y += this.ball.vel.y * dt

        if (this.ball.left < 0 || this.ball.right > this._canvas.width) {
            const playerId = (this.ball.vel.x < 0) ? 1 : 0
            this.players[playerId].score++
            this.reset()
        }

        if (this.ball.top < 0 || this.ball.bottom > this._canvas.height) {
            this.ball.vel.y = -this.ball.vel.y
        }
        // user player
        this.players[1].position.y = this.ball.position.y
        for (let player of this.players) this.collide(player, this.ball)

        this.drawAll()
    }
}

const canvas = document.getElementById('pong')

const pong = new Pong(canvas)

// CPU player
canvas.addEventListener('mousemove', event => {
    pong.players[0].position.y = event.offsetY
})

canvas.addEventListener('click', () => {
    pong.start()
})

// Resize the canvas to fill the browser window dynamically
window.addEventListener('resize', () => {
    /**
     * Your drawings need to be inside this function otherwise they will be reset when
     * you resize the browser window and the canvas goes will be cleared.
     */
    pong.reset();
}, false);
