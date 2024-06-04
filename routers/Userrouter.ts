import {Request, Response, Router} from "express";
import {delUser, getUser, makeUser, updateUser, welcomeMsg,login} from "../controllers/userController";
import {loginData} from "../models/userDataModel";
import {getCryptos, getPrice} from "../controllers/priceController";

export const userRouter = Router();

userRouter.get("/",welcomeMsg);

userRouter.get("/user/:username", getUser)
userRouter.post("/user/register",makeUser)
userRouter.delete("/user/:public_address",delUser)
userRouter.put("/user/update/:public_address",updateUser)
userRouter.post("/login",login)

