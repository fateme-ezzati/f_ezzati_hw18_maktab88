const User = require("../model/user");
const createError = require('http-errors');
const url = require('url');
const mongoose = require("mongoose")


const getRegisterPage = (req, res, next) => {
    if (req.session.user) return res.redirect("/user/dashboard");
    
    const { errorMessage = null } = req.query;

    res.render("pages/register", {errorMessage});
}

const registerUser = async (req, res, next) => {
    const newUser = new User({
        firstname: req.body.firstname,
        lastname: req.body.lastname,
        username: req.body.username,
        password: req.body.password,
        gender: req.body.gender,
        role: req.body.role
    });
    try {
        await newUser.save();

        res.redirect("/user/login");
    } catch (err) {
        console.log(err)
        res.redirect(url.format({
            pathname: "/user/register",
            query: {
                "errorMessage": "Server Error!"
            }
        }))
    }

}

const getLoginPage = (req, res, next) => {
    if (req.session.user) return res.redirect("/user/dashboard");

    const { errorMessage = null } = req.query;
    res.render("pages/login", {errorMessage});
}

const loginUser = async (req, res, next) => {
    try{
        const user = await User.findOne({username:req.body.username})
        if(!user) return res.redirect(`/user/login?errorMessage=User not found!`)

        const isMatch = await user.validatePassword(req.body.password);
        if (!isMatch) return res.redirect(`/user/login?errorMessage=User not found2!`);

        req.session.user = user._id;
        res.redirect("/user/dashboard");

    }catch(err){
        console.log(err)
        res.redirect(url.format({
            pathname:"/user/login",
            query: {
               "errorMessage": "Server Error!"
             }
        }))

    }
}

const getDashboardPage = async (req, res, next) => {

    if (!req.session.user) return res.redirect("/user/login");
    try{
        const user =  await User.findOne({_id:req.session.user})
        if(!user) return res.redirect(`/user/login?errorMessage=User not found!`)

        res.render("pages/dashboard", {user: user});

    }catch(err){
        console.log(err)
        res.redirect(url.format({
            pathname:"/user/login",
            query: {
               "errorMessage": "Server Error!"
             }
        }))

    }
    
};

const logout = (req, res, next) => {
    req.session.destroy();

    res.redirect("/user/login");
};



const removeUser = async(req,res,next) =>{
    try{
        console.log(req.session.user)
        const userId = new mongoose.Types.ObjectId(req.session.user)

        const user =  await User.deleteOne({_id: userId});
        // const user =  await User.findByIdAndDelete( userId);
        const errorMessage = 'user removed successfully!'
        res.render("pages/register", {errorMessage});

    }catch(err){
        console.log(err)
        res.redirect(url.format({
            pathname:"/user/login",
            query: {
               "errorMessage": "Server Error!"
             }
        }))

    }
}

const updateUser = async(req,res,next)=>{

    try{

        const fields = {}
        if(req.body.firstname) fields.firstname = req.body.firstname;
        if(req.body.firstname) fields.firstname = req.body.firstname;
        if(req.body.lastname) fields.lastname = req.body.lastname;
        if(req.body.username) fields.username = req.body.username;
        if(req.body.password) fields.password = req.body.password;
        if(req.body.gender) fields.gender = req.body.gender;
        if(req.body.role) fields.role = req.body.role;
      
        console.log(fields)
        const userId = new mongoose.Types.ObjectId(req.session.user)
        
      
        const user =  await User.updateOne({_id:userId},fields,{new :true});

        req.session.user = user._id;
        const errorMessage = 'user updated successfully!'
        res.render("pages/dashboard", {errorMessage});


    }catch(err){
        console.log(err)
        res.redirect(url.format({
            pathname:"/user/login",
            query: {
               "errorMessage": "Server Error!"
             }
        }))

    }

}




module.exports = {
    getRegisterPage,
    registerUser,
    getLoginPage,
    loginUser,
    getDashboardPage,
    logout,
    removeUser,
    updateUser
};