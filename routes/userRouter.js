const express = require('express');
const router = express.Router();
const {
  getRegisterPage,
  getLoginPage,
  loginUser,
  getDashboardPage,
  registerUser,
  logout,
  removeUser,
  updateUser
} = require("../controllers/userController")


router.get('/register', getRegisterPage);
router.post("/register",registerUser);

router.get('/login', getLoginPage);
router.post('/login', loginUser);

router.get("/logout", logout);


router.get('/dashboard', getDashboardPage);

router.get('/removeUser',removeUser);

router.get('/updateUser',updateUser);


module.exports = router;