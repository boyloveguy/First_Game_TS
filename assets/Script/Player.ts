// Learn TypeScript:
//  - https://docs.cocos.com/creator/2.4/manual/en/scripting/typescript.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/2.4/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/2.4/manual/en/scripting/life-cycle-callbacks.html

import Game from "./Game";
const { ccclass, property } = cc._decorator;

@ccclass
export default class Player extends cc.Component {

  @property
  jumpHeight: number = 0;

  @property
  jumpDuration: number = 0;

  @property
  maxMoveSpeed: number = 0;

  @property
  accel: number = 0;

  @property({ type: cc.AudioClip })
  jumpAudio: cc.AudioClip = null;

  accLeft: boolean = false;
  accRight: boolean = false;
  xSpeed: number = 0;
  // widthScene: number = this.game.width/2;
  game: Game;


  onLoad() {
    // Initialize the jump action
    let jumpAction = this.runJumpAction();
    cc.tween(this.node).then(jumpAction).start()

    this.accLeft = false;
    this.accRight = false;
    // The main character's current horizontal velocity
    this.xSpeed = 0;

    // Initialize the keyboard input listening
    cc.systemEvent.on(cc.SystemEvent.EventType.KEY_DOWN, this.onKeyDown, this);
    cc.systemEvent.on(cc.SystemEvent.EventType.KEY_UP, this.onKeyUp, this);
  }

  onDestroy() {
    // Cancel keyboard input monitoring
    cc.systemEvent.off(cc.SystemEvent.EventType.KEY_DOWN, this.onKeyDown, this);
    cc.systemEvent.off(cc.SystemEvent.EventType.KEY_UP, this.onKeyUp, this);
  }

  runJumpAction() {
    //set jumup action for charactor
    let jumpUp = cc.tween().by(this.jumpDuration, { y: this.jumpHeight }, { easing: 'sineOut' });
    //set jumpdown acction for charactor
    let jumpDown = cc.tween().by(this.jumpDuration, { y: -this.jumpHeight }, { easing: 'sineIn' });

    let Tween = cc.tween().sequence(jumpUp, jumpDown).call(this.playJumpSound, this);

    return cc.tween().repeatForever(Tween)
  }

  playJumpSound() {
    // Invoke sound engine to play the sound
    cc.audioEngine.playEffect(this.jumpAudio, false);
  }

  onKeyDown(event: cc.Event.EventKeyboard) {
    // Set a flag when key pressed
    switch (event.keyCode) {
      case cc.macro.KEY.a:
        this.accLeft = true;
        break;
      case cc.macro.KEY.left:
        this.accLeft = true;
        break;
      case cc.macro.KEY.d:
        this.accRight = true;
        break;
      case cc.macro.KEY.right:
        this.accRight = true;
        break;
    }
  }


  onKeyUp(event: cc.Event.EventKeyboard) {
    // Set a flag when key pressed
    switch (event.keyCode) {
      case cc.macro.KEY.a:
        this.accLeft = false;
        break;
      case cc.macro.KEY.left:
        this.accLeft = false;
        break;
      case cc.macro.KEY.d:
        this.accRight = false;
        break;
      case cc.macro.KEY.right:
        this.accRight = false;
        break;
    }
  }

  update(dt) {
    // Update speed of each frame according to the current acceleration direction
    if (this.accLeft) {
      this.xSpeed -= this.accel * dt;
    } else if (this.accRight) {
      this.xSpeed += this.accel * dt;
    }
    // Restrict the movement speed of the main character to the maximum movement speed
    if (Math.abs(this.xSpeed) > this.maxMoveSpeed) {
      // If speed reach limit, use max speed with current direction
      this.xSpeed = this.maxMoveSpeed * this.xSpeed / Math.abs(this.xSpeed);
    }

    // Update the position of the main character according to the current speed
    this.node.x += this.xSpeed * dt;

  }



  start() { }

  // update (dt) {}
}
