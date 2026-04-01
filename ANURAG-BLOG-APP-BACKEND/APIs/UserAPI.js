import exp from 'express'
import { register } from '../services/authService.js'
import { verifyToken } from '../middlewares/verifyToken.js'
import { checkUser } from '../middlewares/checkUser.js'
import { ArticleModel } from '../models/ArticalModel.js'
import { uploadToCloudinary } from '../config/cloudinaryUpload.js'
import { upload } from '../config/multer.js'
import cloudinary from '../config/cloudinary.js'
import { UserTypeModel } from '../models/UserModel.js'

export const userRoute = exp.Router()


//Resgister user(Public Route)
userRoute.post('/users', upload.single('profileImageUrl'), async (req, res) => {
    let cloudinaryResult

    try {
        //get user object from req
        let userObj = req.body

        //  Step 1: upload image to cloudinary from memoryStorage (if exists)
        if (req.file) {
            cloudinaryResult = await uploadToCloudinary(req.file.buffer);
        }
        // Convert role to uppercase to match enum values
        const role = userObj.role?.toUpperCase() === 'AUTHOR' ? 'AUTHOR' : 'USER'

        // Step 2: call existing register()
        const newUserObj = await register({
            ...userObj,
            role: role,
            profileImageUrl: cloudinaryResult?.secure_url,
        });

        //send response
        res.status(201).json({ message: "User created", payload: newUserObj })
    } catch (err) {
        // Step 3: rollback 
        if (cloudinaryResult?.public_id) {
            await cloudinary.uploader.destroy(cloudinaryResult.public_id);
        }

        next(err); // send to your error middleware
    }
})


//Read all articles(Protected Route)
userRoute.get('/read-articles', verifyToken("USER"), async (req, res) => {
    //read all articles
    let articles = await ArticleModel.find({ isArticleActive: true }).populate({path: "comments.user",select:"email"})
    
    res.status(200).json({ message: "Articles are:", payload: articles })
})


//Add comment to an article(Protected Route)
userRoute.put('/comments', verifyToken("USER"), async (req, res) => {
    let { user, articleId, comment } = req.body
    if (user != req.user.userId) {
        return res.status(403).json({ message: "Forbidden" })
    }

    let commented_user = await UserTypeModel.findById(user)

    let articleWithComment = await ArticleModel.findByIdAndUpdate(articleId, {
        $push: { comments: { user, comment } }
    },
        { new: true, runValidators: true }
    ).populate({path: "comments.user",select:"email"})

    if (!articleWithComment) {
        return res.status(404).json({ message: "Article not found" })
    }
    res.status(200).json({ message: "comment added", payload: articleWithComment })
})

//GET ARTICLE BY ID
userRoute.get('/article/:articleId', verifyToken("USER"), async (req, res) => {
    let articleId = req.params.articleId
    let article = await ArticleModel.findById(articleId).populate({path: "comments.user",select:"email"})
    console.log(article)
    res.status(200).json({ message: "Article is: ", payload: article })
})