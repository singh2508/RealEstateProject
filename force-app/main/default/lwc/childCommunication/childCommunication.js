import { LightningElement } from 'lwc';

export default class ChildCommunication extends LightningElement {

    name;    //property to hold the value

    handleClose(event){
        //create a custom Event
        const myEvent=new CustomEvent('close',{detail:this.name}); // 'close' is a custom event
        this.dispatchEvent(myEvent);


    }
    handleNameChange(event){
        this.name=event.target.value;

    }
}