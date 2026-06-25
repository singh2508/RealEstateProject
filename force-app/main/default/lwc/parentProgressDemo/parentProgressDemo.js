import { LightningElement } from 'lwc';

export default class ParentProgressDemo extends LightningElement {
    handleStartClick(event){
        this.refs.child.start(); //it will invoke the child public method


    }
    handleStopClick(event){
        this.refs.child.stop()

    }
    handleResetClick(event){
        this.refs.child.reset()

    }
}