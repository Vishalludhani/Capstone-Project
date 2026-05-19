import exp from 'express'
import { authenticate } from '../services/authService.js'
import { UserTypeModel } from '../models/UserModel.js'
import { ArticleModel } from '../models/ArticalModel.js'
import bcrypt from 'bcryptjs'
import {verifyToken} from '../middlewares/verifyToken.js'
export const commonRoute=exp.Router()

// Get public articles for home page
commonRoute.get('/public-articles', async (req, res) => {
    try {
        let articles = await ArticleModel.find({ isArticleActive: true })
            .populate({ path: "author", select: "firstName email" })
            .populate({ path: "comments.user", select: "firstName email" })
            .sort({ updatedAt: -1 })
            .limit(10);
        res.status(200).json({ message: "Public articles", payload: articles });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
})

//login
commonRoute.post("/login",async(req,res)=>{
    //get user credentials
    let userCred=req.body
    // call authenticate service
    let {token,user} = await authenticate(userCred)
    //save token as httpOnly Cookie
    res.cookie("token",token,{
        httpOnly:true,
        sameSite:"lax",
        secure:false
    })
    res.status(200).json({message:"Login successful",payload:user})
})



//logout
commonRoute.get('/logout',(req,res)=>{
    res.clearCookie('token',{
        httpOnly:true,
        secure:true,
        sameSite:'lax'
    })

    res.status(200).json({message:"Logged Out Successfully"})
})



commonRoute.put('/change-password',async(req,res)=>{
    let {email,oldp,newp}=req.body
    let user=await UserTypeModel.findOne({email:email})
    console.log(user.password)
    let authorizedUser = await bcrypt.compare(oldp,user.password)
    if(!authorizedUser){
        return res.status(404).json({message:"Invlid password, check again"})
    }
    let hashedpassword= await bcrypt.hash(newp,10)
    let updatedUser=await UserTypeModel.findByIdAndUpdate(user._id,{
        $set : {password:hashedpassword}},
        {new:true}
    )
    return res.status(201).json({message:"Password Updated Successfully"})
})



commonRoute.get('/check-auth',verifyToken("USER","AUTHOR","ADMIN"),(req,res)=>{
    return res.status(200).json({message:"Authenticated",payload:req.user})
})