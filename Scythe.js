class Scythe extends PIXI.Sprite {
    constructor(death) {
        super(app.loader.resources.scythe.texture)

        this.anchor.set(.5)

        this.x = death.x
        this.y = death.y + death.height / 2

        enemies.push(this)

        this.moving = false
        
        this.timer = setTimeout(() => {
            this.moving = true

            let angle = Math.atan2(richter.y - richter.height / 2 - this.y, richter.x - this.x),
                speed = 10

            this.vx = Math.cos(angle) * speed
            this.vy = Math.sin(angle) * speed
        }, 1000)
    }

    animate() {
        this.rotation += .1

        if(this.moving) {
            this.x += this.vx
            this.y += this.vy
        }

        if(this.x < 0 || this.x > app.screen.width || this.y > app.screen.height) {
            this.destroy()
            return
        }
        
        
        if(richter.hitTest(this)) {
            this.destroy()
            richter.hurt(1)
        }
    }

    hurt() {
        this.destroy()
    }

    destroy() {
        clearTimeout(this.timer)
        enemies.splice(enemies.indexOf(this), 1)
        super.destroy()
    }
}

export default Scythe