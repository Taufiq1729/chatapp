const express = require("express");

const { registerUser, loginUser, findUser, getUsers, deleteUser } = require("../Controllers/userController");

const router = express.Router();


router.post("/register", registerUser);
router.post("/login", loginUser);
router.get("/find/:userId", findUser);
router.get("/", getUsers);
router.delete("/:userId", deleteUser);


module.exports = router;    // Important