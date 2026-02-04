const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const userService = require("../services/user.services");


exports.registration = async (req, res, next) => {
  try {
    const { s_fullname, s_email, s_role, s_password } = req.body;

    if (!s_fullname || !s_email || !s_role || !s_password) {
      return res.status(400).json({
        success: false,
        message: "All Fields are Required",
      });
    }

    const existingUser = await userService.getUserByEmail(s_email);
    if (existingUser) {
      return res.status(409).json({
        success: false,
        message: "User Already Registered",
      });
    }

    const hashedPassword = await bcrypt.hash(s_password, 10);

    const userId = await userService.insertUser({
      s_fullname,
      s_email,
      s_role,
      s_password: hashedPassword,
    });

    const token = jwt.sign(
      { id: userId, s_fullname, s_role },
      process.env.JWT_SECRET,
      { expiresIn: "1d" }
    );

    res.cookie("token", token, {
      httpOnly: true,
      secure: false,
      sameSite: "strict",
      maxAge: 24 * 60 * 60 * 1000,
    });

    res.status(201).json({
      success: true,
      message: "User registered successfully",
      data: { userId },
    });
  } catch (error) {
    next(error);
  }
};


exports.login = async (req, res, next) => {
  try {
    const { s_email, s_password } = req.body;

    if (!s_email || !s_password) {
      return res.status(400).json({
        success: false,
        message: "Email and password are required",
      });
    }

    const user = await userService.getUserByEmail(s_email);

    if (!user) {
      return res.status(400).json({
        success: false,
        message: "Invalid email or password",
      });
    }

    const isMatch = await bcrypt.compare(s_password, user.s_password);
    if (!isMatch) {
      return res.status(400).json({
        success: false,
        message: "Invalid email or password",
      });
    }

    const token = jwt.sign(
      {
        id: user.n_eid,
        fullName: user.s_fullname,
        role: user.s_role.toLowerCase(),
      },
      process.env.JWT_SECRET,
      { expiresIn: "1d" }
    );

    res.cookie("token", token, {
      httpOnly: true,
      secure: false,
      sameSite: "strict",
      maxAge: 24 * 60 * 60 * 1000,
    });

    res.status(200).json({
      success: true,
      message: "Login successful",
      user: {
        id: user.n_eid,
        fullName: user.s_fullname,
        email: user.s_email,
        role: user.s_role.toLowerCase(),
      },
    });
  } catch (error) {
    next(error);
  }
};


exports.getAllUser = async (req, res, next) => {
  try {
    const users = await userService.getAllUsers();
    res.status(200).json({
      success: true,
      message: "Fetched all users",
      data: users,
    });
  } catch (error) {
    next(error);
  }
};

exports.getAssignedUsers = async (req, res, next) => {
  try {
    const { adminId } = req.query;

    if (!adminId) {
      return res.status(400).json({
        success: false,
        message: "Admin ID is required",
      });
    }

    const users = await userService.getAssignedUsersByAdmin(adminId);

    res.status(200).json({
      success: true,
      data: users,
    });
  } catch (error) {
    next(error);
  }
};

