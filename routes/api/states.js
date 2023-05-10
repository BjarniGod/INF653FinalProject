// const express = require("express");
// const router = express();
// const stateController = require("../../controllers/controller");

// router
//   .route("/")
//   .get(stateController.getStates)
//   .get(stateController.getStateByCode)
//   .get(stateController.getFunFact)
//   .get(stateController.getCapital)
//   .get(stateController.getNickname)
//   .get(stateController.getPopulation)
//   .get(stateController.getAdmission)
//   .post(stateController.createFunFact)
//   .put(stateController.updateFunFact)
//   .delete(stateController.deleteFunFact);

// // router.route("/:id").get(stateController.GetEmployee);

// module.exports = router;


const express = require("express");
const router = express.Router();
const {
  getStates,
  getStateByCode,
  getFunFact,
  getCapital,
  getNickname,
  getPopulation,
  getAdmission,
  createFunFact,
  updateFunFact,
  deleteFunFact,
} = require("../../controllers/controller");

router.get("/", getStates);
router.get("/:state", getStateByCode);
router.get("/:state/funfact", getFunFact);
router.get("/:state/capital", getCapital);
router.get("/:state/nickname", getNickname);
router.get("/:state/population", getPopulation);
router.get("/:state/admission", getAdmission);
router.post("/:state/funfact", createFunFact);
router.patch("/:state/funfact", updateFunFact);
router.delete("/:state/funfact", deleteFunFact);

module.exports = router;
