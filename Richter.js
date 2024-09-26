import Axe from "./Axe.js"
import Cross from "./Cross.js"
import Health from "./Health.js"
import HolyWater from "./HolyWater.js"

const keys = {}
addEventListener("keydown", e => keys[e.code] = true)
addEventListener("keyup", e => keys[e.code] = false)

let idle, whip, walk, jump, crouch, toss, hurt

class Richter extends PIXI.AnimatedSprite {
    constructor() {
        super(app.loader.resources.richter.spritesheet.animations.idle)

        idle = app.loader.resources.richter.spritesheet.animations.idle
        whip = app.loader.resources.richter.spritesheet.animations.whip
        walk = app.loader.resources.richter.spritesheet.animations.walk
        jump = app.loader.resources.richter.spritesheet.animations.jump
        crouch = app.loader.resources.richter.spritesheet.animations.crouch
        toss = app.loader.resources.richter.spritesheet.animations.throw
        hurt = app.loader.resources.richter.spritesheet.animations.hurt

        this.x = 200
        this.y = app.screen.height / 2

        this.updateAnchor = true

        this.animationSpeed = 1/10
        this.play()

        this.vx = 7
        this.vy = 0

        this.jumping = false
        this.ready = true
        this.crouching = false
        this.delay = false

        this.life = 20
        this.maxLife = this.life

        this.health = new Health(20, 20, 200, 20, this.life, this.maxLife)

        this.whipHitbox = new PIXI.Rectangle(0, 0, 192, 20)

        this.bodyHitboxes = [
            { x: 36, width: 92 },
            { x: 48, width: 124 },
            { x: 80, width: 96 },
            { x: 64, width: 92 },
            { x: 0, width: 136 },
            { x: 0, width: 136 },
            { x: 0, width: 136 },
        ]

        this.bodyHitbox = new PIXI.Graphics()
        this.addChild(this.bodyHitbox)
    }

    animate() {
        this.vy += .5
        this.y += this.vy

        if(this.y > app.screen.height) {
            this.y = app.screen.height
            this.jumping = false

            if(this.textures == hurt) this.reset()
        }
        if(this.x < 0) {
            this.x = 0
        }
        else if(this.x > app.screen.width) {
            this.x = app.screen.width
        }

        if(this.textures == hurt) {
            this.x -= 5 * this.scale.x
            return
        }


        if(keys.ArrowLeft && (this.ready || this.jumping)) {
            this.x -= this.vx
            
            if(this.ready) this.scale.x = -1
        }
        if(keys.ArrowRight && (this.ready || this.jumping)) {
            this.x += this.vx
            
            if(this.ready) this.scale.x = 1
        }
        if(keys.ArrowUp && !this.jumping && this.ready) this.jump()
        if(keys.ArrowDown && !this.crouching) this.crouch()
        if(keys.KeyA && this.ready) this.whip()
        if(keys.KeyS && this.ready) this.throw(new Axe)
        if(keys.KeyC && this.ready) this.throw(new Cross)
        if(keys.KeyH && this.ready) this.throw(new HolyWater)

        if(keys.ArrowLeft || keys.ArrowRight) {
            if(this.textures == idle) {
                this.textures = walk
                this.animationSpeed = 1/6
                this.play()
            }
        }
        else {
            if(this.textures == walk) {
                this.textures = idle
                this.animationSpeed = 1/10
                this.play()
            }
        }
    }

    jump() {
        this.vy = -15
        this.jumping = true

        this.textures = jump
        this.play()
        this.loop = false
        this.animationSpeed = 1/8
        this.onComplete = this.reset
    }

    crouch() {
        this.crouching = true

        this.textures = crouch
        this.play()
        this.loop = false
        this.animationSpeed = 1/6
    }

    whip() {
        this.onFrameChange = frame => {
            this.bodyHitbox.clear()

            let { x, width } = this.bodyHitboxes[frame]

            this.bodyHitbox
                .beginFill(0xAA0000, .25)
                .drawRect(-this.width * this.anchor.x + x, -this.height, width, this.height)
                .endFill()

            if(frame == this.totalFrames - 1) {
                if(this.scale.x > 0) this.whipHitbox.x = this.x + 48
                else this.whipHitbox.x = this.x - this.whipHitbox.width - 48
                
                this.whipHitbox.y = this.y + 32 - this.height

                for(let enemy of enemies) {
                    if(this.rectanglesIntersect(this.whipHitbox, enemy.getBounds())) {
                        enemy.hurt(1, this.scale.x)
                    }   
                }

                this.onFrameChange = null
            }
        }

        this.textures = whip
        this.play()
        this.animationSpeed = 1/4
        this.loop = false
        this.ready = false
        this.x += 16 * this.scale.x

        this.onComplete = () => {
            this.x -= 16 * this.scale.x
            this.reset()

            this.bodyHitbox.clear()
        }
    }

    throw(subweapon) {
        this.ready = false

        this.x += 16 * this.scale.x

        this.textures = toss
        this.play()
        this.loop = false
        this.animationSpeed = 1/4

        this.onFrameChange = frame => {
            if(frame == this.totalFrames - 3) {
                subweapon.x = this.x
                subweapon.y = this.y - this.height / 2
                this.parent.addChild(subweapon)

                this.onFrameChange = null
            }
        }

        this.onComplete = () => {
            this.x -= 16 * this.scale.x
            this.reset()
        }
    }

    reset() {
        this.ready = true
        this.onComplete = null
        this.loop = true
        this.animationSpeed = 1/10
        this.textures = idle
        this.play()
    }

    hurt(damage) {
        if(this.delay) return

        this.vy = -7
        this.life -= damage

        if(this.life <= 0) {
            this.life = 0
            this.destroy()
        }

        this.health.update(this.life, this.maxLife)

        
        this.onComplete = null
        this.onFrameChange = null
        this.bodyHitbox.clear()
        this.textures = hurt
        this.play()

        this.delay = true
        setTimeout(() => this.delay = false, 1000)
    }

    rectanglesIntersect(bounds1, bounds2) {
        return bounds1.x + bounds1.width > bounds2.x &&
            bounds1.x < bounds2.x + bounds2.width &&
            bounds1.y + bounds1.height > bounds2.y &&
            bounds1.y < bounds2.y + bounds2.height;
    }

    hitTest(enemy) {
        let rect = this.textures == whip ? this.bodyHitbox.getBounds() : this.getBounds()
            
        return this.rectanglesIntersect(rect, enemy.getBounds())
    }
}

export default Richter