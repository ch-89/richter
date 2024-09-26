class Flame extends PIXI.AnimatedSprite {
    constructor() {
        super(app.loader.resources.flame.spritesheet.animations.flame)

        this.animationSpeed = 1/8
        this.play()

        this.loop = false
        this.onComplete = this.destroy

    }

    animate() {}
}

export default Flame