import { LightningElement } from 'lwc';

export default class ParentCommunication extends LightningElement {
    name;
    showChild;
    handleClick(event){
        this.showChild=true;

    }
    handleChildClose(event){
       /* this.showChild=false;
        let childArray=event.detail
        childArray.forEach(item =>console.log(item)); // for whole data print
        console.log(childArray[2]); //for single data print 

     */
    this.name=event.detail;

    }
}