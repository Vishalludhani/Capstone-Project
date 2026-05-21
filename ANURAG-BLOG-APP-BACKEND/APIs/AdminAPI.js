import exp from 'express'
import { verifyToken } from '../middlewares/verifyToken.js'
import { checkAdmin } from '../middlewares/checkAdmin.js'
import { ArticleModel } from '../models/ArticalModel.js'
import { UserTypeModel } from '../models/UserModel.js'

export const adminRoute=exp.Router()

//Read all articles
adminRoute.get('/articles', verifyToken("ADMIN"), async (req, res) => {
    try {
        let articles = await ArticleModel.find()
            .populate({ path: "author", select: "firstName email" })
        res.status(200).json({ message: "Articles are:", payload: articles })
    } catch (err) {
        res.status(500).json({ message: err.message })
    }
})

//Get platform stats
adminRoute.get('/stats', verifyToken("ADMIN"), async (req, res) => {
    try {
        const totalUsers = await UserTypeModel.countDocuments({ role: 'USER' });
        const totalAuthors = await UserTypeModel.countDocuments({ role: 'AUTHOR' });
        const totalArticles = await ArticleModel.countDocuments();
        const activeArticles = await ArticleModel.countDocuments({ isArticleActive: true });

        res.status(200).json({
            message: "Platform stats",
            payload: { totalUsers, totalAuthors, totalArticles, activeArticles }
        });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
})

//Get all users (role=USER)
adminRoute.get('/users', verifyToken("ADMIN"), async (req, res) => {
    try {
        const users = await UserTypeModel.find({ role: 'USER' }, '-password')
        res.status(200).json({ message: "Users list", payload: users })
    } catch (err) {
        res.status(500).json({ message: err.message })
    }
})

//Get all authors (role=AUTHOR)
adminRoute.get('/authors', verifyToken("ADMIN"), async (req, res) => {
    try {
        const authors = await UserTypeModel.find({ role: 'AUTHOR' }, '-password')
        res.status(200).json({ message: "Authors list", payload: authors })
    } catch (err) {
        res.status(500).json({ message: err.message })
    }
})

//Block user
adminRoute.get('/block-user/:uid', verifyToken("ADMIN"), async(req,res)=>{
    let userId=req.params.uid
    let blockedUser=await UserTypeModel.findByIdAndUpdate(userId,{
        $set : {isActive:false}},
        {new:true}
    )
    return res.status(201).json({message:"User is Blocked",payload:blockedUser})
})

//Unblock user
adminRoute.get('/unblock-user/:uid', verifyToken("ADMIN"), async(req,res)=>{
    let userId=req.params.uid
    let unblockedUser=await UserTypeModel.findByIdAndUpdate(userId,{
        $set:{isActive:true}},
        {new:true}
    )
    return res.status(201).json({message:"User Unblocked",payload:unblockedUser})
})

//Disable article (soft delete)
adminRoute.patch('/article-disable/:articleid', verifyToken("ADMIN"), async (req, res) => {
    try {
        let articleId = req.params.articleid;
        let article = await ArticleModel.findByIdAndUpdate(articleId, {
            $set: { isArticleActive: false }
        }, { new: true });
        
        if (!article) {
            return res.status(404).json({ message: "Article not found" });
        }
        return res.status(200).json({ message: "Article disabled successfully", payload: article });
    } catch (err) {
        return res.status(500).json({ message: err.message });
    }
})
