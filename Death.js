import Health from "./Health.js"
import Scythe from "./Scythe.js"

class Death extends PIXI.AnimatedSprite {
    constructor() {
        super(app.loader.resources.death.spritesheet.animations.idle)

        this.x = app.screen.width / 2
        this.y = app.screen.height - this.height
        
        this.updateAnchor = true

        this.animationSpeed = 1/10
        this.play()

        this.life = 30
        this.maxLife = this.life

        this.health = new Health(app.screen.width - 200 - 20, 20, 200, 20, this.life, this.maxLife)

        this.vx = 0
        this.vy = 0

        this.target = new PIXI.Point

        this.destination()

        setInterval(() => this.parent.addChild(new Scythe(this)), 3000)

        this.colorMatrix = new PIXI.filters.ColorMatrixFilter()
        this.colorMatrix.brightness(2, false)
    }

    destination() {
        this.target.x = Math.random() * app.screen.width
        this.target.y = Math.random() * app.screen.height
    }
    
    animate() {
        let dx = this.target.x - this.x,
            dy = this.target.y - this.y,
            angle = Math.atan2(dy, dx),
            distance = Math.sqrt(dx * dx + dy * dy)

        this.vx += Math.cos(angle) * .1
        this.vy += Math.sin(angle) * .1

        let speed = Math.sqrt(this.vx * this.vx + this.vy * this.vy)

        if(speed > 5) {
            this.vx *= 5 / speed
            this.vy *= 5 / speed
        }

        this.x += this.vx
        this.y += this.vy

        if(distance < 300) this.destination()

        this.border()
        
        if(richter.hitTest(this)) {
            richter.hurt(1)
        }
    }

    border() {

        if(this.x - this.width / 2 < 0) {
            this.vx *= -1
            this.x = this.width / 2
        }
        else if(this.x + this.width / 2 > app.screen.width) {
            this.vx *= -1
            this.x = app.screen.width - this.width / 2
        }
        if(this.y < 0) {
            this.vy *= -1
            this.y = 0
        }
        else if(this.y + this.height > app.screen.height) {
            this.vy *= -1
            this.y = app.screen.height - this.height
        }
    }

    hurt(damage, direction) {
        this.life -= damage
        this.vx += 15 * direction

        if(this.life <= 0) {
            this.life = 0
            this.destroy()
        }
        else {
            this.flash()
        }

        this.health.update(this.life, this.maxLife)
    }

    flash() {
        this.filters = [this.colorMatrix]
        
        setTimeout(() => this.filters = null, 100)
    }
}

export default Death