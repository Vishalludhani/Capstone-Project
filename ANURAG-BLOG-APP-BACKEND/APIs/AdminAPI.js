import exp from 'express'
import { verifyToken } from '../middlewares/verifyToken.js'
import { checkAdmin } from '../middlewares/checkAdmin.js'
import { ArticleModel } from '../models/ArticalModel.js'
import { UserTypeModel } from '../models/UserModel.js'

export const adminRoute=exp.Router()

//Read all articles
adminRoute.get('/read-articles/:userid',verifyToken,checkAdmin,async(req,res)=>{
    //get userid
    //let aid=req.params.userid;
    //check if role user or author
    //read all articles
    let articles=await ArticleModel.find()
    res.status(200).json({message:"Articles are:",payload:articles})
})

//Get all users (role=USER)
adminRoute.get('/users', async (req, res) => {
    try {
        const users = await UserTypeModel.find({ role: 'USER' }, '-password')
        res.status(200).json({ message: "Users list", payload: users })
    } catch (err) {
        res.status(500).json({ message: err.message })
    }
})

//Get all authors (role=AUTHOR)
adminRoute.get('/authors', async (req, res) => {
    try {
        const authors = await UserTypeModel.find({ role: 'AUTHOR' }, '-password')
        res.status(200).json({ message: "Authors list", payload: authors })
    } catch (err) {
        res.status(500).json({ message: err.message })
    }
})

//Block user
adminRoute.get('/block-user/:uid',async(req,res)=>{
    let userId=req.params.uid
    let blockedUser=await UserTypeModel.findByIdAndUpdate(userId,{
        $set : {isActive:false}},
        {new:true}
    )
    return res.status(201).json({message:"User is Blocked",payload:blockedUser})
})

//Unblock user
adminRoute.get('/unblock-user/:uid',async(req,res)=>{
    let userId=req.params.uid
    let unblockedUser=await UserTypeModel.findByIdAndUpdate(userId,{
        $set:{isActive:true}},
        {new:true}
    )
    return res.status(201).json({message:"User Unblocked",payload:unblockedUser})
})
