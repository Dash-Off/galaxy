import Models from '../models/index.js';
import passport from 'passport';
import validators from "../validators/index.js";
import { InternalServerError, Unauthorized, ValidationError, validateSchema } from '../utility.js';
import { setError, setResponse } from './response-handler.js';

export const register = async (req, response) => { 
  // Get details 
  try {
  let userData = {};
  try {
    userData = validators.auth.registerUserSchema.validateSync(req.body);
  } catch (e) {
    ValidationError(e.errors[0], {others: e.errors});
  }

  Models.User.register({
    username: userData.email,
    name: userData.name,
    gender: userData.gender,
    email: userData.email
  },
  userData.password, async function (err, user) {
    console.log("User data added")
    if (err) { 
      console.log("Inner catch", err);
      setError(ValidationError(err.message || "User already exists with given data", {}, false), response);
    } 
    else {
      const userInfo = await getUserResponse(user);
      setResponse({message: "User registered successfully !", user: userInfo}, response);
    } 
  })
  } catch(e) {
    console.log(e);
    setError(e, response);
  }
};


export const logout = (req, response, next) => {
  req.logout(function(err) {
    if (err) { return next(InternalServerError("Failed to logout please try again", {}, false)); }
    setResponse({message: "Logout successful !"}, response);
  });
}


export const login = (req, res, next) =>  {
  try {
  
  const userToBeChecked = new Models.User({ 
    username: req.body.username, 
    password: req.body.password, 
  }); 
  
  req.login(userToBeChecked, function (err) { 
    if (err) {
      console.log("Failed to authenticate user", err);
      Unauthorized("Failed to authenticate user");
    } else { 
      passport.authenticate("local")( 
        req, res, function () { 
          Models.User.find({username: req.user.username}).then(
            () => {
              // Login is successful
              setResponse({message: "Login Successful !"}, res);
            }
          ).catch((err) => {
            console.log("Invalid credentials", err);
            Unauthorized("Invalid credentials provided !", {}, false);
          })
          
      }); 
    } 
  }); 
} catch(e) {
  console.log(e);
  setError(e, res);
}
};


export const userinfo = async (req, res, next) =>  {
  const userResponse = await getUserResponse(req.user);
  setResponse(userResponse, res);
};

const getUserResponse = async (user) => {
  return {
    name: user.name,
    username: user.username,
    email: user.email,
    gender: user.gender,
  }
}


export const updateUser = async (request, response) => {
  try {
    const requestBody = {...request.body}
    const userData = validateSchema(validators.auth.updateUserSchema, requestBody);
    if(userData.password) {
      request.user.setPassword(userData.password);
    }
    if(userData.name) {
      request.user.name = userData.name;
    }
    const updatedUser = await request.user.save();
    
    const userResponse = await getUserResponse(updatedUser);
    setResponse({
      message: "Profile updated !",
      user: userResponse
    }, response)
  } catch (e) {
    console.log(e);
    setError(e, response);
  }
};

