// Learn TypeScript:
//  - https://docs.cocos.com/creator/2.4/manual/en/scripting/typescript.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/2.4/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/2.4/manual/en/scripting/life-cycle-callbacks.html

const { ccclass, property } = cc._decorator;

@ccclass
export default class PopUp extends cc.Component {

    // LIFE-CYCLE CALLBACKS:
    @property({ type: cc.Label })
    scoreDisplayPopUp: cc.Label = null;

    score: number = 0;
    highestScore: number = 0;

    onLoad() {
        this.hidePopUp()
    }

    showPopUp() {
        this.node.active = true;
    }

    hidePopUp() {
        this.node.active = false;
    }

    gainScorePopUp(score) {
        let scorePoint = {
            highestScore: score
        };
        // cc.sys.localStorage.setItem('userData', JSON.stringify(scorePoint));
        var getScore = JSON.parse(cc.sys.localStorage.getItem('userData'));
        let highscore = 0;
        if (!getScore) {
            cc.sys.localStorage.setItem('userData', JSON.stringify(scorePoint));
            highscore = score;
        } else {
            if (getScore.highestScore < score) {
                cc.sys.localStorage.setItem('userData', JSON.stringify(scorePoint));
                highscore = score;
              //  this.node.getChildByName('highestScene').getComponent(cc.Label).string = 'Highest Score: ' + score.toString();
            } else {
                highscore =  getScore.highestScore;
                //this.node.getChildByName('highestScene').getComponent(cc.Label).string = 'Highest Score: ' + getScore.highestScore.toString();
            }
        }
        this.node.getChildByName('highestScene').getComponent(cc.Label).string = 'Highest Score: ' + highscore.toString();
        this.node.getChildByName('scorePopup').getComponent(cc.Label).string = 'Your Score: ' + score.toString();

    }
  
    

    directorScene() {
        cc.director.loadScene('game');
        this.hidePopUp();
    }

    start() {

    }

    // update (dt) {}
}