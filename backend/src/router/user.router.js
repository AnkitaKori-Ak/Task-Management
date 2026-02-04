
const express = require('express');
const userController = require("../controller/user.controller");
const { verifyToken } = require("../middleware/authmiddleware.js");


const router=express.Router();

router.post("/login", userController.login);
router.post("/signup", userController.registration);
router.get("/users", userController.getAllUser);
router.get("/assigned-users",verifyToken, userController.getAssignedUsers);


module.exports=router;