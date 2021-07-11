const User = require("../models/User");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

exports.register = async (req, res) => {
  let { username, email, password, confirmPassword } = req.body;

  if (username.trim() === "")
    return res.status(400).json({
      status: "fail",
      message: "Username cannot be empty",
    });

  if (email.trim() === "")
    return res.status(400).json({
      status: "fail",
      message: "Email cannot be empty",
    });

  if (password.trim() === "")
    return res.status(400).json({
      status: "fail",
      message: "Password cannot be empty",
    });

  if (password !== confirmPassword)
    return res.status(400).json({
      status: "fail",
      message: "Passwords must match",
    });

  if (
    await User.findOne({
      email,
    })
  ) {
    return res.status(400).json({
      status: "fail",
      message: "User with the email already exists",
    });
  }

  const salt = bcrypt.genSaltSync(10);
  const hash = bcrypt.hashSync(password, salt);

  const user = new User({
    name: username,
    email,
    password: hash,
    createdAt: new Date().toISOString(),
  });

  const result = await user.save();

  const token = jwt.sign(
    {
      id: result._id,
      email: result.email,
      username: result.username,
    },
    process.env.SECRET_KEY,
    { expiresIn: "1hr" }
  );

  res.status(201).json({
    status: "success",
    token,
    user: result,
  });
};

exports.login = async (req, res) => {
  const { username, password } = req.body;

  const user = await User.findOne({
    name: username,
  });

  if (!user)
    return res.status(404).json({
      status: "fail",
      message: "User not found, enter correct username",
    });

  const isCorrectPassword = bcrypt.compareSync(password, user.password);

  if (isCorrectPassword) {
    // return res.status(404).json({
    //   status: "fail",
    //   message: "Incorrect password",
    // });

    const token = jwt.sign(
      {
        id: user._id,
        email: user.email,
        username: user.username,
      },
      process.env.SECRET_KEY,
      { expiresIn: "1hr" }
    );

    return res.status(200).json({
      status: "success",
      token,
      user,
    });
  }
};
