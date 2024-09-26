import Flame from "./Flame.js"

class HolyWater extends PIXI.Sprite {
    constructor() {
        super(app.loader.resources.holywater.texture)

        this.anchor.set(.5)

        this.vy = -10
        this.vx = 10
    }

    animate() {
        this.rotation += .1

        this.vy += .5
        this.y += this.vy

        this.x += this.vx

        if(this.y > app.screen.height) {
            let flame = new Flame
            flame.x = this.x
            flame.y = app.screen.height
            this.parent.addChild(flame)

            this.destroy()
        }
    }
}

export default HolyWater