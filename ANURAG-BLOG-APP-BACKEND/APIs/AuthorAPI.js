import exp from 'express'
import { register, authenticate } from '../services/authService.js'
import { ArticleModel } from '../models/ArticalModel.js'
import { UserTypeModel } from '../models/UserModel.js'
import { checkAuthor } from '../middlewares/checkAuthor.js'
import { verifyToken } from '../middlewares/verifyToken.js'
import { uploadToCloudinary } from '../config/cloudinaryUpload.js'
import { upload } from '../config/multer.js'
import cloudinary from '../config/cloudinary.js'
export const authorRoute = exp.Router()

//Regist Author()
authorRoute.post('/users', upload.single('profileImageUrl'), async (req, res, next) => {
  let cloudinaryResult
  try {
    //get user object from req
    let authorObj = req.body

    //  Step 1: upload image to cloudinary from memoryStorage (if exists)
    if (req.file) {
      cloudinaryResult = await uploadToCloudinary(req.file.buffer);
    }

    // Convert role to uppercase to match enum values
    const role = authorObj.role?.toUpperCase() === 'AUTHOR' ? 'AUTHOR' : 'USER'

    // Step 2: call existing register()
    const newAuthorObj = await register({
      ...authorObj,
      role: "AUTHOR",
      profileImageUrl: cloudinaryResult?.secure_url,
    });
    //send response
    res.status(201).json({ message: "Author created", payload: newAuthorObj })
  } catch (err) {
    if (cloudinaryResult?.public_id) {
      await cloudinary.uploader.destroy(cloudinaryResult.public_id);
    }
    next(err); // send to your error middleware
  }
})
//Create Article
authorRoute.post('/articles', verifyToken("AUTHOR"), async (req, res) => {
  try {
    // Author id comes from the verified JWT — never trust the client to supply it
    const authorId = req.user.userId
    const { title, category, content } = req.body

    const articleDoc = new ArticleModel({ title, category, content, author: authorId })
    const published = await articleDoc.save()

    // Populate author info so the response matches what the dashboard expects
    await published.populate({ path: 'author', select: 'firstName email' })

    res.status(201).json({ message: "Article published", payload: published })
  } catch (err) {
    res.status(500).json({ message: err.message })
  }
})
//Read articles of author
authorRoute.get("/articles", verifyToken("AUTHOR"), async (req, res) => {
  //get author id
  //check for the author
  // let authorizedAuthor= await UserTypeModel.findById(aid)
  // if(!authorizedAuthor || authorizedAuthor.role!="AUTHOR"){
  //     res.status(401).json({message:"author is invalid"})
  // }
  //read articles of this author
  let articles = await ArticleModel.find({ isArticleActive: true ,}).populate({ path: "author", select: "firstName email" })
  //send response
  res.status(201).json({ message: "Articles are", payload: articles })
})
//Edit Article
authorRoute.put('/articles', verifyToken("AUTHOR"), async (req, res) => {
  //get the modified article
  let { author, articleid, title, content, category } = req.body
  //find article
  let oldarticle = await ArticleModel.findOne({ _id: articleid, author: author })
  if (!oldarticle) {
    res.status(404).json({ message: "article does not exist" })
  }
  // if(author!=oldarticle.author){
  //     res.status(404).json({message:"Wrong Author"})
  // }
  //update the article
  let updatedArticle = await ArticleModel.findByIdAndUpdate(articleid, {
    $set: { title, category, content }
  }, { new: true })
  //send res(updated article)
  return res.status(201).json({ message: "Article Modified", payload: updatedArticle })
})
//Delete(Soft Delete) Article
authorRoute.patch('/article-delete', verifyToken("AUTHOR"), async (req, res) => {
  try {

    const { articleid } = req.body;

    const authorid = req.user.userId; // correct

    const updatedArticle = await ArticleModel.findOneAndUpdate(
      { _id: articleid, author: authorid },
      { $set: { isArticleActive: false } },
      { new: true }
    );

    if (!updatedArticle) {
      return res.status(404).json({
        message: "Article not found or unauthorized"
      });
    }

    res.status(200).json({
      message: "Article deleted successfully",
      payload: updatedArticle
    });

  } catch (err) {
    res.status(500).json({ message: err.message });
  }
})