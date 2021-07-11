const express = require("express");
const router = express.Router();

const {
  createVehicle,
  getVehicles,
  deleteVehicle,
} = require("../controllers/vehicleControllers");

router.get("/", getVehicles);
router.post("/", createVehicle);
router.delete("/:id", deleteVehicle);

module.exports = router;
