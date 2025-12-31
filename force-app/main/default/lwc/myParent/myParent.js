import { LightningElement } from 'lwc';

export default class MyParent extends LightningElement {
    count = 0;
    message = 'This is my Message';
    increment(){
        this.count += 1;
    }

    handleMyEvent(event){
  console.log('child said:', event.detail);
}
}