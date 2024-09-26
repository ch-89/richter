class Axe extends PIXI.Sprite {
    constructor() {
        super(app.loader.resources.axe.texture)

        this.direction = richter.scale.x

        this.anchor.set(.5)
        this.scale.set(2 * this.direction, 2)

        this.vr = .1 * this.direction
        this.vx = 10 * this.direction
        this.vy = -20
        
        this.targets = []
    }

    animate() {
        this.rotation += this.vr
        
        this.x += this.vx
        
        this.vy += .5
        this.y += this.vy

        if(this.y > app.screen.height) {
            this.destroy()
            return
        }

        for(let enemy of enemies) {
            if(this.hit(enemy) && !this.targets.includes(enemy)) {
                enemy.hurt(1, this.direction)
    
                this.targets.push(enemy)
            }
        }
    }
}

export default Axe