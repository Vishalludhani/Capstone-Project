import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";
import { UserTypeModel } from "../models/UserModel.js";
import { config } from "dotenv";

config();

// REGISTER
export const register = async (userObj) => {

    const userDoc = new UserTypeModel(userObj);

    // validate schema
    await userDoc.validate();

    // hash password
    userDoc.password = await bcrypt.hash(userDoc.password, 10);

    // save user
    const created = await userDoc.save();

    // remove password
    const newUserObj = created.toObject();
    delete newUserObj.password;

    return newUserObj;
};


// LOGIN
export const authenticate = async ({ email, password }) => {

    const userDoc = await UserTypeModel.findOne({ email });

    if (!userDoc) {
        const err = new Error("Invalid Email");
        err.status = 401;
        throw err;
    }

    // check if blocked
    if (!userDoc.isActive) {
        const err = new Error("User is Blocked");
        err.status = 403;
        throw err;
    }

    // compare password
    const isMatch = await bcrypt.compare(password, userDoc.password);

    if (!isMatch) {
        const err = new Error("Invalid Password");
        err.status = 401;
        throw err;
    }

    // generate token
    const token = jwt.sign(
        {
            userId: userDoc._id,
            role: userDoc.role,
            email: userDoc.email,
            profileImageUrl: userDoc.profileImageUrl,
        },
        process.env.JWT_SECRET,
        { expiresIn: "1h" }
    );

    const userObj = userDoc.toObject();
    delete userObj.password;

    return { token, user: userObj };
};