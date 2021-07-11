const express = require("express");
const router = express.Router();

const {
  createProperty,
  getProperties,
  deleteProperty,
} = require("../controllers/propertyControllers");

router.get("/", getProperties);
router.post("/", createProperty);
router.delete("/:id", deleteProperty);

module.exports = router;
