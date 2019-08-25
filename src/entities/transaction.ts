export class Transaction {
    id: number;
    type: string;
    amount: number;
    category: string;
    description: string;

    constructor(values: Object = {}){
        Object.assign(this, values);
    }
}
