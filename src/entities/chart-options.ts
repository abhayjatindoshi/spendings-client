export class ChartOptions {
    type: string;
    month: string;
    year: string;

    constructor(values: Object = {}){
        Object.assign(this, values);
    }
}
