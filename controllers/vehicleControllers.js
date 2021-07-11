const Vehicle = require("../models/Vehicle");
const jwt = require("jsonwebtoken");

const { cloudinary } = require("../utils/cloudinary");

exports.getVehicles = async (req, res) => {
  try {
    const vehicles = await Vehicle.find();

    if (vehicles) {
      return res.status(200).json({
        status: "success",
        vehicles,
      });
    } else {
      return res.status(404).json({
        status: "fail",
        message: "Vehicles not found",
      });
    }
  } catch (err) {
    res.status(500).json({
      status: "fail",
      message: "Internal Server Error",
    });
  }
};

exports.createVehicle = async (req, res) => {
  const user = checkAuth(req, res);
  try {
    const uploadedPhotos = req.body.photos.map((photo) => {
      return new Promise((resolve, reject) => {
        cloudinary.uploader.upload(photo, (error, result) => {
          if (error) {
            reject(err);
          } else {
            resolve(result.public_id);
          }
        });
      });
    });

    let public_ids = await Promise.all(uploadedPhotos);
    // console.log(public_ids);

    const newVehicle = new Vehicle({
      ...req.body,
      user: user.id,
      photos: [...public_ids],
      createdAt: new Date().toISOString(),
    });

    newVehicle.save().then((result) => {
      Vehicle.populate(result, {
        path: "user",
      }).then((vehicle) => {
        return res.status(200).json({
          status: "success",
          vehicle,
        });
      });
    });

    // await newVehicle.save();

    // return res.status(201).json({
    //   status: "success",
    //   vehicle: newVehicle,
    // });
  } catch (err) {
    res.status(500).json({
      status: "fail",
      message: "Internal Server Error",
    });
  }
};

exports.deleteVehicle = async (req, res) => {
  const user = checkAuth(req, res);

  if (user) {
    let id = req.params.id;

    const vehicle = await Vehicle.findById(id);

    await vehicle.delete();

    return res.json({
      status: "success",
      message: "vehicle deleted",
    });
  }
};

const checkAuth = (req, res) => {
  let authHeader = req.headers.authorization;
  if (authHeader) {
    let token = authHeader.split("Bearer ")[1];
    if (token) {
      try {
        user = jwt.verify(token, process.env.SECRET_KEY);
        return user;
      } catch (err) {
        return res.status(401).json({
          status: "fail",
          message: "Invalid/expired 'Bearer [token]",
        });
      }
    } else {
      return res.status(401).json({
        status: "fail",
        message: "Authentication token must be 'Bearer [token]",
      });
    }
  } else {
    return res.status(401).json({
      status: "fail",
      message: "Authorization header must be provided",
    });
  }
};
