// Learn TypeScript:
//  - https://docs.cocos.com/creator/2.4/manual/en/scripting/typescript.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/2.4/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/2.4/manual/en/scripting/life-cycle-callbacks.html

import Game from "./Game";

const {ccclass, property} = cc._decorator;

@ccclass
export default class Star extends cc.Component {

    @property
    pickRadius: number = 0;

    game: Game;


    // LIFE-CYCLE CALLBACKS:

    getPlayerDistance() {
        // Determine the distance according to the position of the Player node
        let playerPos = this.game.player.getPosition();

        // Calculate the distance between two nodes according to their positions
        let dist = this.node.position.sub(cc.v3(playerPos)).mag();
        return dist;
    }

    onPicked() {
        // When the stars are being collected, invoke the interface in the Game script to generate a new star
        this.game.spawnNewStar();
        // Invoke the scoring method of the Game script
        this.game.gainScore();
        // Then destroy the current star's node
        this.node.destroy();
    }

    update(dt) {
        // Determine if the distance between the Star and main character is less than the collecting distance for each frame
        if (this.getPlayerDistance() < this.pickRadius) {
            // Invoke collecting behavior
           // cc.log('WIN', this.getPlayerDistance()  )
            this.onPicked();
            return;
        }

        // Update the transparency of the star according to the timer in the Game script
        var opacityRatio = 1 - this.game.timer/this.game.starDuration;
        var minOpacity = 50;
        this.node.opacity = minOpacity + Math.floor(opacityRatio * (255 - minOpacity));
    }

    start () {

    }

    // update (dt) {}
}
