import {DB} from "../core/db";
import {log} from "util";
import {UserData,loginData,updateUser} from "./userDataModel";
import * as crypto from "crypto";
import {login} from "../controllers/userController";
export class User{
    id?:number;
    username:string;
    password:string;
    public_address?:string;
    email:string;
    constructor(username:string, password:string,wallet_id:string, email:string,public_address:string) {
        this.username = username;
        this.password = password;
        this.public_address = wallet_id;
        this.email = email;
        this.public_address=public_address;
    }
}
export class UserModel{
    private conn
    constructor() {
        this.conn = new DB().conn
    }
    async getUsers(){
        const [rows] = await this.conn.query("SELECT * FROM users");
        return rows;
    }
    async getUser(username:string){
        const [row] = await this.conn.query("SELECT * FROM users WHERE username = ?", [username])
        return row
    }
    async deleteUser(public_address:string){
        await this.conn.query("DELETE users,wallets,wallet_contents FROM users LEFT JOIN wallets ON users.public_address=wallets.public_address LEFT JOIN wallet_contents ON wallets.public_address=wallet_contents.public_address WHERE users.public_address = ?",[public_address])
    }
    async insertUser(newusr:User){
        let flag = true;
        let check, pub:string = "", priv:string = "";
        
        while (flag){
            priv = crypto.randomBytes(16).toString("hex").slice(0,32);
            pub = crypto.randomBytes(8).toString("hex").slice(0,16);
            [check] = await this.conn.query("SELECT * FROM wallets WHERE public_address = ? OR private_key = ?",[pub,priv])
            if(check.length == 0)
            {
                flag = false
            }

        }
        const newusrParams = [
            newusr.username,
            newusr.password,
            pub,
            newusr.email
        ]
        await this.conn.execute("INSERT INTO wallets (public_address,private_key) VALUE(?,?)",[pub,priv])
        await this.conn.execute("INSERT INTO users (username,password,public_address,email) VALUE(?,?,?,?)",newusrParams);


    }
    async updateUser(public_address:string, user:UserData){
        const userDataInput = Object.entries(user)//creates an array in which each element is the key and the value of
        // the element in the class like so [[key:value],[key,value]]
        let parameters = "";
        let values = []
        for(let i = 0; i<userDataInput.length; i++){//going through each key and value pair in the array
            parameters+=`${userDataInput[i][0]} = ?`;// the string will hold each key, an equal element and question mark
            // example username = ?
            // this will hold the sql query
            parameters+= (i +1 != userDataInput.length) ? ", " : " ";
            // if this is not the last element -> add a comma
            values.push(userDataInput[i][1]);
            //this array hold the values
        }
        values.push(public_address)// at the end of the for loop we add the id to the valye array since the query
        // will need the user id in the last place
        await this.conn.execute(`UPDATE users SET ${parameters} WHERE public_address = ?`,values);
    }
           
    async login(loginD:loginData){
        const loginCredentials = [
            loginD.username,
            loginD.password
        ]
        const [result]  = await this.conn.query("SELECT * FROM users WHERE username = ? AND password =?",loginCredentials)
        if(result.length != 0){
            return "User exists"
        }
        else{
            return "Wrong credentials"
        }
    }
}
