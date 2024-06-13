import { DB } from "../core/db";
import {DepositModel} from "./depositModel";
import {OrderModel, TransactionModel} from "./orderModel";
import {log} from "util";

export class PriceModell {
    private conn
    constructor() {
        this.conn = new DB().conn
    }

    async getPrice(crypto_name:string){
        const price = await this.conn.query("SELECT value_usdt FROM prices WHERE crypto_name=?",[crypto_name]);
        return price;
    }
    async getCryptos(){
        const [rows] = await this.conn.query("SELECT * FROM prices");
        return rows;
    }
    async deposit(depositModel:DepositModel) {
        const conn = await this.conn.getConnection();
        try {
            await conn.beginTransaction(); // start transaction
            const [usdt] = await conn.query("SELECT amount FROM wallet_contents WHERE crypto_id=? AND public_address=?", [4, depositModel.public_address]);

            if (usdt.length != 0) { //already have usdt in the account
                await conn.execute("UPDATE wallet_contents SET amount = amount+? WHERE public_address=? AND crypto_id=?", [depositModel.deposit_amount, depositModel.public_address, 4]);
            } else {
                await conn.execute("INSERT INTO wallet_contents (public_address,crypto_id,amount) VALUES (?, ?, ?)", [depositModel.public_address, 4, depositModel.deposit_amount]);
            }

            await conn.commit(); // commit transaction
        } catch (err) {
            await conn.rollback(); // rollback transaction on error
            throw err;
        } finally {
            conn.release(); // release connection
        }
    }
    async buyOrder(order:OrderModel){
        const conn = await this.conn.getConnection();
        try {
            await conn.beginTransaction();
            //from this query we get the price of the crypto and its id
            const [crypto_chosen] = await this.conn.query("SELECT value_usdt,crypto_id FROM prices WHERE crypto_name = ?",[order.crypto_name])
            //calculating the needed amount of USDT to make the order
            const needed_funds = order.amount*crypto_chosen[0]["value_usdt"]
            //assigning the crypto id to a variable
            const crypto_id = crypto_chosen[0]["crypto_id"]
            //this query will give us the amount of USDT that the user has
            const [balance_usdt] = await this.conn.query("SELECT amount FROM wallet_contents WHERE public_address =? AND crypto_id = ?",[order.public_address,4])
            if(balance_usdt.length === 0){
                //if the user doesn't even have USDT
                return false
            }
            if(balance_usdt[0]["amount"] >= needed_funds){
                //You can make the buy order
                const [crypto_owned] = await this.conn.query("SELECT amount FROM wallet_contents WHERE public_address =? AND crypto_id = ?",[order.public_address,crypto_id])
                if(crypto_owned.length!=0){
                    //adding crypto
                    await this.conn.execute("UPDATE wallet_contents SET amount = amount+? WHERE public_address=? AND crypto_id=?", [order.amount, order.public_address, crypto_id])

                }
                else{
                    //inserting a new row if the user is buying the crypto for the first time
                    await this.conn.execute("INSERT INTO wallet_contents (public_address,crypto_id,amount) VALUES (?, ?, ?)",[order.public_address,crypto_id,order.amount])
                }
                //Removing USDT
                await this.conn.execute("UPDATE wallet_contents SET amount = amount-? WHERE public_address=? AND crypto_id=?",[needed_funds,order.public_address,4])
                return true
            }
            else{
                //Not enough funds
                return false
            }
        }catch (err) {
            await conn.rollback(); // rollback transaction on error
            throw err;
        } finally {
            conn.release(); // release connection
        }
    }
    async sellOrder(order:OrderModel){
        const conn = await this.conn.getConnection();
        try {
            //getting the id and the value in USD of the chosen cryptocurrency
            const [chosen_crypto] = await this.conn.query("SELECT crypto_id,value_usdt FROM prices WHERE crypto_name=?",[order.crypto_name])
            //assinging the id to a variable
            const crypto_id = chosen_crypto[0]["crypto_id"]
            //checking what amount of the currency does the user have
            const [crypto_owned] = await this.conn.query("SELECT amount FROM wallet_contents WHERE public_address =? AND crypto_id = ?",[order.public_address,crypto_id])

            if(crypto_owned[0]["amount"] >= order.amount){//checking if the user has more or equal to the amount they want to sell
                //Selling process begins
                //updating the cryptocurrency row with its new and lowered value
                await this.conn.execute("UPDATE wallet_contents SET amount = amount-? WHERE public_address=? AND crypto_id=?",[order.amount,order.public_address,crypto_id])
                //calculating the increase of USDT
                const increase_amount:number = order.amount*chosen_crypto[0]["value_usdt"];
                //updating the USDT of the user with the calculated price
                await this.conn.execute("UPDATE wallet_contents SET amount = amount+? WHERE public_address=? AND crypto_id=?",[increase_amount,order.public_address,4])
                return true;
            }
            else{
                return false;
            }
        }catch (err) {
            await conn.rollback(); // rollback transaction on error
            throw err;
        } finally {
            conn.release(); // release connection
        }

    }

    async sendCrypto(transactionModel:TransactionModel) {
        const conn = await this.conn.getConnection();
        try {
            await conn.beginTransaction(); // start transaction
            const [chosen_crypto] = await this.conn.query("SELECT crypto_id,value_usdt FROM prices WHERE crypto_name=?",[transactionModel.crypto_name])
            const crypto_id = chosen_crypto[0]["crypto_id"]
            const[crypto_reciever] = await this.conn.query("SELECT public_address FROM users WHERE public_address = ? ",[transactionModel.public_address_reciever])
            const [crypto_owned] = await this.conn.query("SELECT amount FROM wallet_contents WHERE public_address =? AND crypto_id = ?",[transactionModel.public_address_sender,crypto_id])
            const [crypto_owned_reciever] = await this.conn.query("SELECT amount FROM wallet_contents WHERE public_address =? AND crypto_id = ?",[transactionModel.public_address_reciever,crypto_id])
            transactionModel.date=new Date;
            if(crypto_reciever.length===0){
                await conn.rollback();
                return false;
            }
            if(crypto_owned.length === 0 ){
                await conn.rollback();
                return false;
            }
            if(crypto_owned[0]["amount"] >= transactionModel.amount){//checking if the user has more or equal to the amount they want to sell        
                await this.conn.execute("UPDATE wallet_contents SET amount = amount-? WHERE public_address=? AND crypto_id=?",[transactionModel.amount,transactionModel.public_address_sender,crypto_id])
                if (crypto_owned_reciever.length === 0) {
                    await this.conn.execute("INSERT INTO wallet_contents (public_address, crypto_id, amount) VALUES (?, ?, ?)", [transactionModel.public_address_reciever, crypto_id, transactionModel.amount]);
                    await this.conn.execute("INSERT INTO transactions (amount,crypto_id,public_address_sender,public_address_reciever,date) VALUES (?,?,?,?,?)",[transactionModel.amount,crypto_id,transactionModel.public_address_sender,transactionModel.public_address_reciever,transactionModel.date]);
                } else {
                    await this.conn.execute("UPDATE wallet_contents SET amount = amount + ? WHERE public_address = ? AND crypto_id = ?", [transactionModel.amount,transactionModel.public_address_reciever, crypto_id]);
                    await this.conn.execute("INSERT INTO transactions (amount,crypto_id,public_address_sender,public_address_reciever,date) VALUES (?,?,?,?,?)",[transactionModel.amount,crypto_id,transactionModel.public_address_sender,transactionModel.public_address_reciever,transactionModel.date]);
                }   
                return true;
                
            }
            else{
                return false;
            }

    
        } catch (err) {
            await conn.rollback(); // rollback transaction on error
            throw err;
        } finally {
            conn.release(); // release connection
        }
    }

}
