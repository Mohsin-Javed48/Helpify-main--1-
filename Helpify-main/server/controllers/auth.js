const { User } = require("../models");
const { generateHash, compare } = require("../helper/hash");
const { generateToken, verifyToken } = require("../helper/jwt");
const { resetPasswordEmail } = require("../email/resetPassword");
const { sendMail } = require("../helper/mail");

const signUp = async (req, res, next) => {
  try {
    const { firstName, lastName, email, password } = req.body;
    console.log(firstName, lastName, email, password);

    if (!firstName || !lastName || !email || !password) {
      const error = new Error();
      error.message = "All fields are required";
      error.status = 400;
      throw error;
    }

    const existingUser = await User.findOne({ where: { email } });
    if (existingUser) {
      const error = new Error();
      error.message = "User with this email already exists";
      error.status = 400;
      throw error;
    }

    const hashedPassword = await generateHash(password);

    const newUser = await User.create({
      firstName,
      lastName,
      email,
      password: hashedPassword,
      roleId: 3, // Assign Provider role
    });

    res
      .status(201)
      .json({ message: "User registered successfully", user: newUser });
  } catch (error) {
    console.error(error);
    next(error);
  }
};

const loginController = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ where: { email } });
    if (!user) {
      const error = new Error("User not found");
      error.status = 404;
      throw error;
    }

    // Check if user is suspended
    if (user.status === "suspended") {
      const error = new Error(
        "Your account has been suspended due to some issue. Please contact support for assistance."
      );
      error.status = 403;
      throw error;
    }

    const isPasswordValid = await compare(password, user.password);
    if (!isPasswordValid) {
      const error = new Error("Invalid password");
      error.status = 400;
      throw error;
    }

    const token = generateToken(user.toJSON());
    const refreshToken = generateToken(user.toJSON(), "1yr");

    res.status(200).json({
      user: {
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
        roleId: user.roleId,
        status: user.status, // Include status in response
      },
      message: "Login successful",
      token: { token, refreshToken },
    });
  } catch (error) {
    console.error("Error during login:", error);
    next(error);
  }
};

const me = (req, res, next) => {
  try {
    if (!req.user) {
      const error = new Error("User not authenticated");
      error.status = 401;
      throw error;
    }

    const AboutUser = {
      firstName: req.user.firstName,
      lastName: req.user.lastName,
      email: req.user.email,
      roleId: req.user.roleId,
    };
    res.status(200).json({ message: "this is me", user: AboutUser });
  } catch (error) {
    next(error);
  }
};

const getRefreshToken = async (req, res, next) => {
  try {
    // Check for refresh token in various places
    const refreshToken =
      req.body.refreshToken ||
      req.headers.refreshtoken ||
      req.cookies?.refreshToken ||
      (req.headers.authorization &&
      req.headers.authorization.startsWith("Bearer ")
        ? req.headers.authorization.split(" ")[1]
        : null);

    if (!refreshToken) {
      const error = new Error("Refresh token is required");
      error.status = 400;
      throw error;
    }

    console.log("Refresh token received:", refreshToken);
    const tokenData = await verifyToken(refreshToken);
    console.log("Token data:", tokenData);

    const user = await User.findByPk(tokenData.id);

    if (!user) {
      const error = new Error("Invalid refresh token or user not found");
      error.status = 400;
      throw error;
    }

    // Use the imported generateToken function
    const newToken = generateToken(user.toJSON());
    const newRefreshToken = generateToken(user.toJSON(), "1yr");

    return res.status(200).json({
      token: newToken,
      refreshToken: newRefreshToken,
      user: {
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
        roleId: user.roleId,
      },
    });
  } catch (err) {
    console.error("Error refreshing token:", err);
    if (err.name === "TokenExpiredError") {
      return res
        .status(401)
        .json({ message: "Refresh token has expired. Please login again." });
    }
    return next(err);
  }
};

const forgotPassword = async (req, res, next) => {
  try {
    const email = req.body?.email;

    const user = await User.findOne({ where: { email } });

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const resetToken = generateToken({ email }, "1h");
    await user.update({ forgetToken: resetToken });
    const resetUrl = `${req?.headers?.origin}/auth/forget/${resetToken}`;

    user.forgetToken = resetToken;
    await user.save();

    await sendMail({
      from: `Support Helpify`,
      to: email,
      subject: "Reset Your Password",
      html: resetPasswordEmail(user.firstName, resetUrl),
      attachments: [
        {
          filename: "logo.png",
          path: "", //shoiuld be path of logo
          cid: "logo",
        },
      ],
    });

    return res
      .status(200)
      .send({ message: "Reset passwrod URL is send to Your mail" });
  } catch (error) {
    return next(error);
  }
};

const setPassword = async (req, res, next) => {
  try {
    const passwordToken = req.body.token;

    const newPassword = req.body?.newPassword;

    const tokenData = await verifyToken(passwordToken);

    const user = await User.findOne({ where: { email: tokenData.email } });
    console.log(user);
    console.log(passwordToken);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    if (user?.forgetToken !== passwordToken) {
      const error = new Error("invalid_token");
      error.statusCode = 409;
      throw error;
    }
    const pass = await generateHash(newPassword);
    user.password = pass;
    user.forgetToken = null;

    await user.save();

    return res.status(200).send({ message: "Password reset Sucessfully" });
  } catch (error) {
    if (error.name === "TokenExpiredError") {
      return res.status(400).json({ message: "token_expired" });
    }
    return next(error);
  }
};

module.exports = {
  signUp,
  loginController,
  me,
  getRefreshToken,
  forgotPassword,
  setPassword,
};
