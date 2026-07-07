import { LightningElement } from 'lwc';
import enrollmentTempalte from './enrollmentTemplate.html';
import alumni from './alumniTemplate.html';

export default class RenderDemo extends LightningElement {
    chosenTemplate;
   /* render()
    {
        return this.chosenTemplate==='New Enrollment'? enrollmentTemplate:
            this.chosenTemplate==='Alumni'?alumniTemplate:;  
    }*/

    handleClick(event){
        this.chosenTemplate=event.target.label;

    }

}