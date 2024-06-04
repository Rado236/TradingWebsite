import {DB} from "../core/db";
import {UserModel} from "./userModel";
import * as crypto from "crypto";
export class Wallet{
    id?:number;
    public_address:string;
    private_key:string;
    constructor(id:number, public_address:string, private_key:string) {
        this.id = id;
        this.public_address = public_address;
        this.private_key = private_key;
    }
}
export class WalletModel extends UserModel{
    private con
    constructor() {
        super();
        this.con = new DB().conn
    }
    async createWallet(){
        const pub = crypto.randomBytes(8).toString('hex').slice(0,16)
        const priv = crypto.randomBytes(16).toString("hex").slice(0,32)
        await this.con.execute("INSERT INTO wallets (public_address,private_key) VALUE(?,?)",[pub,priv])
    }
    async getWalletId(){
        const [id] = await this.con.execute("SELECT usr_id FROM wallets WHERE ")
    }
    async getWalletDetails(public_address:string){
        const [rows]=await this.con.execute("SELECT * FROM wallet_contents JOIN prices ON wallet_contents.crypto_id = prices.crypto_id WHERE public_address = ?",[public_address])
        return rows;
    }
}
