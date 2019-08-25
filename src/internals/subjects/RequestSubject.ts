import { Subject, Observable, Subscriber, Subscription } from "rxjs";

export class RequestSubject<T> extends Subject<T>{
    private dataFetcher : () => Observable<T>
    private lastKnownData : T;
    private isFirstSubscription : boolean = true;
    private dataFetcherSubscription : Subscription;
    private needsReload = false;

    constructor(dataFetcher : () => Observable<T>) {
        super();
        this.dataFetcher = dataFetcher;
    }

    _subscribe(subscriber : Subscriber<T>) : Subscription {
        if(this.isFirstSubscription){
            this.isFirstSubscription = false;
            this.fetchData();
        }

        
        const subscription = super._subscribe(subscriber);
        if(subscription && !subscription.closed && this.lastKnownData){
            if(!this.needsReload){
                subscriber.next(this.lastKnownData);
            } else {
                this.fetchData();
            }
        }
        
        return subscription;
    }

    next(data : T) : void{
        if(this.lastKnownData != data){
            this.lastKnownData = data;
            super.next(data);
        }
    }

    private fetchData() : void {
        this.dataFetcherSubscription = this.dataFetcher().subscribe(this.dataFetcherSubscriptionCallback.bind(this),(error) => this.error(error));
    }

    private dataFetcherSubscriptionCallback(data : T) : void{
        this.next(data);
        this.dataFetcherSubscription.unsubscribe();
    }

    complete() : void {
        if(this.dataFetcherSubscription){
            this.dataFetcherSubscription.unsubscribe();
        }
    }

    public reload() : void {
        this.needsReload = true;
        if(this.observers && this.observers.length > 0){
            for (let i = 0; i < this.observers.length; i++) {
                if(!this.observers[i].closed){
                    this.needsReload = false;
                    this.fetchData();
                }
            }
        }
    }
}