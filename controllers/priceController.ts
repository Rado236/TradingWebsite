import {Request, Response} from "express";
import { PriceModell } from "../models/priceModell";
import {DepositModel} from "../models/depositModel";
import { WalletModel } from "../models/WalletModel";
import {OrderModel} from "../models/orderModel";

export const getPrice = async (req:Request, res:Response)=>{
    const crypto_name = req.params.crypto_name
    const priceModel = new PriceModell();
    const price = await priceModel.getPrice(crypto_name);
    res.send(price);
}
export const getCryptos = async (req:Request, res:Response)=>{
    const cryptos = await new PriceModell().getCryptos()
    res.send(cryptos);
}
export const deposit = async (req:Request,res:Response)=>{
    const inputData:DepositModel = req.body
    const dep = new PriceModell().deposit(inputData)
    res.send({
        "message":"Successful deposit"
    })
}
export const getWalletDetails= async(req:Request,res:Response)=>{
    const public_address= req.query.public_address;
    if (typeof public_address !== 'string') {
        res.status(400).send('public_address parameter must be a string');
        return;
      }
    const walletRes = await new WalletModel().getWalletDetails(public_address)
    res.send(walletRes);
}
    
export const buyOrder = async(req:Request,res:Response)=> {
    const inputData:OrderModel = req.body
    const buy:boolean = await new PriceModell().buyOrder(inputData)
    if(buy){
        res.send({
            "message":"Successful transaction",
            "status":"success"
        })
    }
    else{
        res.send({
            "message":"Not successful transaction",
            "status":"failure"
        })
    }
}
export const sellOrder = async(req:Request, res:Response)=>{
    const inputData:OrderModel = req.body;

    const sell:boolean = await new PriceModell().sellOrder(inputData);
    if(sell){
        res.send({
            "status":"success"
        })
    }
    else{
        res.send({
            "status":"failure"
        })
    }
}
