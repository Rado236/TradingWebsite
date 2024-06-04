const mysql = require("mysql2")

export class DB{
    public conn;
    constructor() {
        this.conn = mysql.createPool({//built-in mysql property that lets you create a connection if you specify the correct properties
            host:"localhost",
            user:"root",
            database:"kiopektrader"
        }).promise()
    }
}

