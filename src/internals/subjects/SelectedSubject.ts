import { Subject, Subscriber, Subscription } from "rxjs";

export class SelectedSubject<T> extends Subject<T>{
    
    private lastKnownData : T;
    public wasSetBefore : boolean = false;
    private onNext : () => void;

    constructor(data? : T, onNext? : () => void){
        super();
        this.onNext = onNext;
        if(data){
            this.next(data);
        }
    }

    public next(data : T) : void{
        if(this.wasSetBefore){
            if(this.lastKnownData != data){
                this.lastKnownData = data;
                super.next(data);
                this.onNext();
            }
        } else {
            this.wasSetBefore = true;
            this.lastKnownData = data;
            super.next(data);
        }
    }

    _subscribe(subscriber : Subscriber<T>) : Subscription {
        const subscription = super._subscribe(subscriber);
        if(subscription && !subscription.closed && this.lastKnownData){
            subscriber.next(this.lastKnownData);
        }
        return subscription;
    }

}