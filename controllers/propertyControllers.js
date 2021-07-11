const Property = require("../models/Property");
const jwt = require("jsonwebtoken");

const { cloudinary } = require("../utils/cloudinary");

exports.getProperties = async (req, res) => {
  const properties = await Property.find();

  if (!properties) {
    return res.status(404).json({
      status: "fail",
      message: "Properties not found",
    });
  }

  return res.status(200).json({
    status: "success",
    properties,
  });
};

exports.createProperty = async (req, res) => {
  let user = checkAuth(req, res);
  const reqBody = { ...req.body };

  try {
    // res_promises will be an array of promises
    let res_promises = reqBody.photos.map(
      (file) =>
        new Promise((resolve, reject) => {
          cloudinary.uploader.upload(file, function (error, result) {
            if (error) reject(error);
            else resolve(result.public_id);
          });
        })
    );
    // Promise.all will fire when all promises are resolved
    let newProperty = null;
    Promise.all(res_promises)
      .then((result) => {
        photos = [...result];
        console.log(photos);
        newProperty = new Property({
          ...reqBody,
          photos,
          user: user.id,
        });

        newProperty.save().then((result) => {
          console.log(result);
          Property.populate(newProperty, {
            path: "user",
          }).then((property) => {
            return res.status(200).json({
              status: "success",
              property,
            });
          });
        });
      })
      .catch((error) => {
        console.log(error);
      });
  } catch (err) {
    res.status(500).json({
      status: "fail",
      message: "Internal server error",
    });
  }
};

exports.getImages = async (req, res) => {
  const { resources } = await cloudinary.search
    .expression("folder:miral")
    .sort_by("public_id", "desc")
    .max_results("30")
    .exec();

  const public_ids = resources.map((file) => file.public_id);
};

exports.deleteProperty = async (req, res) => {
  const user = checkAuth(req, res);

  if (user) {
    let id = req.params.id;

    const property = await Property.findById(id);

    await property.delete();

    return res.json({
      status: "success",
      message: "property deleted",
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
