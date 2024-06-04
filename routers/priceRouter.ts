import {Router} from "express";
import {buyOrder, deposit, getCryptos, getPrice, getWalletDetails, sellOrder} from "../controllers/priceController";

export const priceRouter = Router()

priceRouter.get("/price/:crypto_name",getPrice)
priceRouter.get("/cryptos",getCryptos)
priceRouter.post("/deposit",deposit)
priceRouter.get("/getWallet",getWalletDetails)
priceRouter.put("/buy",buyOrder)
priceRouter.put("/sell",sellOrder)
