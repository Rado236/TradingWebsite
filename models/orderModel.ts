export class OrderModel{
    crypto_name:string;
    amount:number;
    public_address:string;
}
export class TransactionModel{
    crypto_name:string;
    amount:number;
    public_address_reciever:string;
    public_address_sender:string;
    date:Date;
}