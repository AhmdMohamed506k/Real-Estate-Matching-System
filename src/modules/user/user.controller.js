
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import {AsyncHandler} from "../../Middleware/AsyncHandler/AsyncHandler.js"
import { customAlphabet, nanoid } from "nanoid";
import { Usermodel } from "../../../DB/Models/User.model.js";

import { sendEmail } from "../../services/SendEmail/SendEmail.js";
import redisClient from "./../../untils/redisClient/RedisClient.js";


///======================For-Brokers========================================


// Register ==> For new Users
export const Register = AsyncHandler(async (req, res, next) => {
  

  const {name, email, password, phoneNumber } = req.body;
   
  console.log(req.body);
  
  //Check If Email Is Available
  const userExist = await Usermodel.findOne({ email });
  if (userExist) { return next(new Error("Email already Exist" , 409 ));}



  //Check If Phone Already Exist or Not
  const PhoneExist = await Usermodel.findOne({ phoneNumber });
  if (PhoneExist) {return next(new Error("Phone already Exist already Exist please change it",409 ));}



  //Password Encryption For security
  const hashPass = await bcrypt.hash(password, 12); 


  // Creating new User
  const NewUser = await Usermodel.create({name, email, password: hashPass, phoneNumber, role: 'Broker'});
  if (NewUser) {
    res.status(200).json({msg: "Registered successfully", NewUser });
  } else {
    next(new Error("Sorry an Error happened",400 ));
  }


});

// Login  ===> For Registered Users
export const Login = AsyncHandler(async (req, res, next) => {
  const { email, password } = req.body;
     
  
  //Check If User Is Available
  const user = await Usermodel.findOne({email});


  //Check If Password is correct or not
  if (!user ||  !(await bcrypt.compare(password, user.password))) {
    next(new Error("Sorry wrong Email or Password",401 ));
  }


  //Generating user Token
  const token = jwt.sign({ userId: user._id,  email: user.email, }, process.env.tokenKey, { expiresIn: "7d" } );



  // change user Status to online
  await Usermodel.findOneAndUpdate({ _id:user._id },{ status: "online" },{ new: true });
  res.status(200).json({ msg: "done",UserToken:token });
});

// ForgetPassWord ==> For users who are forgetting their password
export const ForgetPassWord = AsyncHandler(async (req, res, next) => {


  const { email } = req.body;
  
  // Check if Email is Exist or not
  const UserExist = await Usermodel.findOne({ email });
  if (!UserExist) { return next(new Error("Sorry User Not Exist" , 401 ));}


  // Generating New OTP  
  const generateOTP = customAlphabet("0123456789ASERDC", 8);
  const OTP = generateOTP();


  
  UserExist.ForgetPassCode = OTP;
  await UserExist.save();

  await sendEmail(email,"Rest your password",`<h1> your code is ${OTP} </h1>`);
  res.status(200).json({ msg: "Code Sent successfully please Check your Email" });
});

// CheckResetCode ==> to Check the OTP
export const CheckResetCode = AsyncHandler(async (req, res, next) => {


  const { Code } = req.body;


  // Check OTP in User Data
  const UserExist = await Usermodel.findOne({ ForgetPassCode: Code });
  if (!UserExist) {return next(new Error("Sorry User Not Exist"),401);}



  if (UserExist.ForgetPassCode !== Code) {
    return next(new Error("Invalid Code"),400 );
  }

  UserExist.ForgetPassCode = "";
  await UserExist.save();

  res.status(200).json({ msg: "Code is valid" });
});

// CheckResetCode ==> to change old user password
export const ResetPassword = AsyncHandler(async (req, res, next) => {
  const { email, newPassword } = req.body;

  if (!email || !newPassword) {
    return next(new Error("All fields are required",400));
  }
   
  //Check if User exist
  const useExist = await Usermodel.findOne({ email });
  if (!useExist) {return next(new Error("User not found"),401);}



  // Hashing new user password
  const hashedPassword = await bcrypt.hash(newPassword, 12);
  
  // Apply password changes
  useExist.password = hashedPassword;
  await useExist.save();

  res.status(200).json({ msg: "Password changed successfully" });
});

//getMyProfile ==> to Get Broker Profile With his Offers and Requests
export const getMyProfile = AsyncHandler(async (req, res, next) => {
  const UserProfileCashKey = `profile:${req.user._id}`;
  
 
  const cachedProfile = await redisClient.get(UserProfileCashKey);
  if (cachedProfile) {
    return res.status(200).json({ status: "success", data: JSON.parse(cachedProfile), source: "cache" });
  }

  
  const user = await Usermodel.findById(req.user._id).populate('myOffers').populate('myRequests').select('-password');
  if (!user) return next(new Error("User not found", 404));

  await redisClient.set(UserProfileCashKey, JSON.stringify(user), 'EX', 600);

  res.status(200).json({ status: "success", data: user, source: "database" });
});

// updateProfile ==> To update user Personal Info
export const updateProfile = AsyncHandler(async (req, res, next) => {
  const { name, phoneNumber } = req.body;


  await redisClient.del(`profile:${req.user._id}`);
  const updatedUser = await Usermodel.findByIdAndUpdate( req.user.id,{ name, phoneNumber },{ new: true, runValidators: true }).select('-password');

  res.status(200).json({ msg: "Profile updated!", data: updatedUser });
});

// DeleteProfile ==> To Delete user Personal If he want to delete it
export const DeleteProfile = AsyncHandler(async (req, res, next) => {

  await redisClient.del(`profile:${req.user._id}`);
  const DeletedUser = await Usermodel.findOneAndDelete({_id:req.user._id} )

  res.status(200).json({ msg: "User Deleted Successfully :(" });
});










//==========================For-Admins===============================================

// Function for Super Admin that allows him to change any other user role
export const ChangeUserRole = AsyncHandler(async (req, res, next) => {

  const { userId, newRole } = req.body; 

  const roles = ['Admin', 'Manager', 'Broker'];
  if (!roles.includes(newRole)) {return next(new Error("Invalid role type", 400));}
  await redisClient.del(`profile:${userId}`);
  const updatedUser = await Usermodel.findByIdAndUpdate(userId, { role: newRole }, { new: true });

  if (!updatedUser) return next(new Error("User not found", 404));

  res.status(200).json({ msg: `User role updated to ${newRole}`, user: updatedUser.name });
});