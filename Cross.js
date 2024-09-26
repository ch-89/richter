class Cross extends PIXI.Sprite {
    constructor() {
        super(app.loader.resources.cross.texture)

        this.anchor.set(.5)

        this.direction = richter.scale.x

        this.vr = .1 * this.direction
        this.ax = .2 * this.direction
        this.vx = 20 * this.direction

        this.targets = []
    }

    animate() {
        this.rotation += this.vr
        this.vx -= this.ax
        this.x += this.vx

        for(let enemy of enemies) {
            if(this.hit(enemy) && !this.targets.includes(enemy)) {
                enemy.hurt(1, this.vx > 0 ? 1 : -1)
    
                this.targets.push(enemy)
                setTimeout(() => this.targets.splice(this.targets.indexOf(enemy), 1), 1000)
            }
        }
    }
}

export default Cross