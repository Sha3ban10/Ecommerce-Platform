import { AsyncErrorHandling } from "../../Utils/asyncHandler.js";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import { customAlphabet } from "nanoid";
import { User } from "../../../DB/model/User.model.js";
import { transporter } from "../../Services/SendEmail.js";
import { AppError } from "../../Utils/ErrorClass.js";

// ==================================signUp================================
export const signUp = AsyncErrorHandling(async (req, res, next) => {
  const { name, email, password, age, phone, address } = req.body;

  const userExist = await User.findOne({ email: email.toLowerCase() });
  if (userExist) {
    return next(new AppError("User Already Exists", 400));
  }

  const hashedPassword = await bcrypt.hash(password, 10);
  const token = jwt.sign({ email }, process.env.JWT_SECRET, {
    expiresIn: "1h",
  });
  const reftoken = jwt.sign({ email }, process.env.JWT_SECRET2);
  await transporter.sendMail({
    to: email, // list of receivers
    subject: "Click here to verify your email", // Subject line
    html: `<a href="${req.protocol}://${req.hostname}:3000/user/verify/${token}">send email</a> <br>
     <a href="${req.protocol}://${req.hostname}:3000/user/refresh/${reftoken}">click here to resend email</a>`, // html body
  });
  const result = await User.create({
    name,
    email,
    password: hashedPassword,
    age,
    phone,
    address,
  });
  res.status(201).json({
    message: "User Created Successfully. Please verify your email.",
    result,
  });
});
// ==================================verifyMail================================
export const verifyMail = AsyncErrorHandling(async (req, res, next) => {
  const { token } = req.params;
  const user = jwt.verify(
    token,
    process.env.JWT_SECRET,
    async (err, decoded) => {
      if (err) {
        return next(new AppError("Invalid Token or expired", 400));
      }
      const result = await User.findOneAndUpdate(
        { email: decoded.email, confermedEmail: false },
        { confermedEmail: true },
        { new: true }
      );
      result
        ? res
            .status(200)
            .json({ message: "User Verified Successfully", result })
        : next(new AppError("User Already Verified", 400));
    }
  );
});
// ==================================refreshMail================================
export const refreshMail = AsyncErrorHandling(async (req, res, next) => {
  const { reftoken } = req.params;
  const user = jwt.verify(
    reftoken,
    process.env.JWT_SECRET2,
    async (err, decoded) => {
      if (err) {
        next(new AppError("Invalid Token", 400));
      }
      const token = jwt.sign({ email: decoded.email }, process.env.JWT_SECRET, {
        expiresIn: "1h",
      });

      await transporter.sendMail({
        to: decoded.email, // list of receivers
        subject: "Click here to verify your email", // Subject line
        html: `<a href="${req.protocol}://${req.hostname}:3000/user/verify/${token}">send email</a>`, // html body
      });
      res.status(200).json({ message: "mail sent" });
    }
  );
});
// ==================================forgetPassword================================
export const forgetPassword = AsyncErrorHandling(async (req, res, next) => {
  const { email } = req.body;

  const user = await User.findOne({ email: email.toLowerCase() });
  if (!user) {
    return next(new AppError("User Not Found", 400));
  }
  const numericAlphabet = "0123456789";
  const generateNumericCode = customAlphabet(numericAlphabet, 5);
  const Code = generateNumericCode();
  await User.findOneAndUpdate(
    { email: email.toLowerCase() },
    { forgetCode: Code },
    { new: true }
  );

  await transporter.sendMail({
    to: email, // list of receivers
    subject: "To reset your password", // Subject line
    html: `<h1> Your Code is :${Code}</h1>`, // html body
  });
  res.status(200).json("Code sent");
});
// ==================================resetPassword================================
export const resetPassword = AsyncErrorHandling(async (req, res, next) => {
  const { email, forgetCode, password } = req.body;

  const user = await User.findOne({ email: email.toLowerCase() });
  if (!user) {
    return next(new AppError("User Not Found", 400));
  }

  if (user.forgetCode !== forgetCode || forgetCode === null) {
    return next(new AppError("Invalid Code", 400));
  }
  const hashedPassword = await bcrypt.hash(password, 10);
  await User.findOneAndUpdate(
    { email: email.toLowerCase() },
    {
      password: hashedPassword,
      forgetCode: null,
      passwordChangedAt: Date.now(),
    },
    { new: true }
  );
  res.status(200).json("password Changed Successfully");
});

// ==================================signIn================================
export const signIn = AsyncErrorHandling(async (req, res, next) => {
  const { email, password } = req.body;
  const user = await User.findOne({ email: email.toLowerCase() });
  if (!user || !(await bcrypt.compare(password, user.password))) {
    return next(new AppError("User Not Found or Invalid Password ", 400));
  }
  const login = await User.findOneAndUpdate(
    { email: email.toLowerCase() },
    { isLogged: true },
    { new: true }
  );

  const token = jwt.sign({ email }, process.env.JWT_SECRET);
  res.status(200).json({ message: "Logged In  Successfully", token });
});

// ==================================logout================================
const logout = AsyncErrorHandling(async (req, res, next) => {
  const { email } = req.body;
  const user = await User.findOne({ email: email.toLowerCase() });
  if (!user) {
    return next(new AppError("User Not Found", 400));
  }
  await User.findOneAndUpdate(
    { email: email.toLowerCase() },
    { isLogged: false },
    { new: true }
  );
  res.status(200).json({ message: "Logged Out  Successfully" });
});

// ==================================makeAdmin================================
export const makeAdmin = AsyncErrorHandling(async (req, res, next) => {
  const { email } = req.body;
  const user = await User.findOne({ email: email.toLowerCase() });
  if (!user) {
    return next(new AppError("User Not Found", 400));
  }
  if (user.role === "admin") {
    return next(new AppError("User Already Admin", 400));
  }
  if (user.confermedEmail === false) {
    return next(new AppError("User Not Confermed", 400));
  }
  await User.findOneAndUpdate(
    { email: email.toLowerCase() },
    { role: "admin" }
  );
  res.status(200).json({ message: "User Made Admin Successfully" });
});
