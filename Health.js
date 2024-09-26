class Health {
    constructor(x, y, width, height, life, maxLife) {
        // Store the initial dimensions
        this.width = width;
        this.height = height;

        // Create a container to hold the health bar elements
        this.container = new PIXI.Container();

        // Create the background bar (the full health bar)
        this.background = new PIXI.Graphics();
        this.background.beginFill(0xAA0000);  // Red background
        this.background.drawRect(0, 0, width, height);
        this.background.endFill();
        this.container.addChild(this.background);

        // Create the foreground bar (the remaining health)
        this.foreground = new PIXI.Graphics();
        this.foreground.beginFill(0x00AA00);  // Green foreground
        this.foreground.drawRect(0, 0, width, height);
        this.foreground.endFill();
        this.container.addChild(this.foreground);

        // Position the health bar at the given coordinates
        this.container.x = x;
        this.container.y = y;

        this.text = new PIXI.Text(`${life}/${maxLife}`, {
            fontSize: 20,               // Font size in pixels
            fill: 0xffffff,             // Text color (white)
            stroke: 0x000000,           // Stroke color (optional)
            strokeThickness: 5          // Stroke thickness (optional)
        })
        this.text.y = height
        this.container.addChild(this.text)

        // Add the health bar to the stage or another container
        app.stage.addChild(this.container);  // Replace `app.stage` with your actual stage or container
    }

    // Method to update the health (0 to 1 scale)
    update(life, maxLife) {
        this.foreground.scale.x = life / maxLife
        this.text.text = `${life}/${maxLife}`
    }
}

export default Health