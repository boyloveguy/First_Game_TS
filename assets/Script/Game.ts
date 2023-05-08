// Learn TypeScript:
//  - https://docs.cocos.com/creator/2.4/manual/en/scripting/typescript.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/2.4/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/2.4/manual/en/scripting/life-cycle-callbacks.html

const {ccclass, property} = cc._decorator;

@ccclass
export default class Game extends cc.Component {

    @property({type: cc.Label})
    scoreDisplay: cc.Label = null;

    @property({type: cc.Prefab})
    starPrefab: cc.Prefab = null;
    
    @property
    maxStarDuration: number = 0;

    @property
    minStarDuration: number = 0;

    @property({type: cc.Node})
    ground: cc.Node = null;

    @property({type: cc.Node})
    player: cc.Node = null;

    @property({type: cc.Node})
    popup: cc.Node = null;

    @property({type: cc.AudioClip})
    scoreAudio: cc.AudioClip = null;

    groundY: number = 0;
    score: number = 0;
    timer : number = 0;
    starDuration : number = 0;
    // popup : PopUp;

    onLoad() {
        // Obtain the anchor point of ground level on the y axis
        this.groundY = this.ground.y + this.ground.height/2; // "this.ground.top" may also work
        // Generate a new star

        // Initialize timer
        this.timer = 0;
        this.starDuration = 0;
        this.spawnNewStar();
        // Initialize scoring
        this.score = 0;
       // this.positionLimitPlayer()
        // this.tesst()
    }

    spawnNewStar() {
        // Generate a new node in the scene with a preset template
        let newStar = cc.instantiate(this.starPrefab);
        // Put the newly added node under the Canvas node
        this.node.addChild(newStar);
        // Set up a random position for the star
        newStar.setPosition(this.getNewStarPosition());
        // Save a reference of the Game object on the Star script component
        newStar.getComponent('Star').game = this;
        // Reset timer, randomly choose a value according the scale of star duration
        this.starDuration = this.minStarDuration + Math.random() * (this.maxStarDuration - this.minStarDuration);
        this.timer = 0;
    }

    getNewStarPosition() {
        let randX = 0;
        // According to the position of the ground level and the main character's jump height, randomly obtain an anchor point of the star on the y axis
        let randY = this.groundY + Math.random() * this.node.getChildByName('Player').getComponent('Player').jumpHeight + 50;
        // According to the width of the screen, randomly obtain an anchor point of star on the x axis
        let maxX = this.node.width/2;
        randX = (Math.random() - 0.5) * 2 * maxX;
        // Return to the anchor point of the star
        return cc.v2(randX, randY);
    }

    gainScore() {
        this.score += 1;
        // Update the words of the scoreDisplay Label
        this.node.getComponentInChildren(cc.Label).string = 'Score: ' + this.score.toString();
        cc.audioEngine.playEffect(this.scoreAudio, false);
    }

    // Position limit of player
    positionLimitPlayer(){
        let widthScene = this.node.width/2
        let clampedX = cc.misc.clampf(this.player.x, -widthScene, widthScene);
        this.player.setPosition(clampedX, this.player.y) 
        // cc.log(cc.winSize.width)
    }

    gameOver() {
        // Stop the jumping action of the Player node
        this.player.stopAllActions();
        this.player.active = false;
        // cc.instantiate(this.starPrefab).active = false;
        this.popup.getComponent('PopUp').gainScorePopUp(this.score);
        this.popup.active = true;
    }

     tesst(){
        cc.log(this.node.getChildByName('ground'))
     }

    update(dt) {
        // Update timer for each frame, when a new star is not generated after exceeding duration
        this.timer += dt;
        // Invoke the logic of game failure
        if (this.timer > this.starDuration) {
            this.gameOver();
            return;
        }
        let getRandX = this.player.x
        // cc.log(getRandX)
        this.positionLimitPlayer()
    }
    
    start () {

    }

    // update (dt) {}
}