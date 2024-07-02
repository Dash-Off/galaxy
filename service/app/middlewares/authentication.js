import { Unauthorized, validateAdmin } from "../utility.js";

function authenticate(admin=false) {
  return (req, res, next) => {
    console.log("In auth")
    if(req.isAuthenticated()) {
      if(admin) {
        validateAdmin(req.user);
      }
      next();
    }
    else{
      Unauthorized("Unauthorized request !");
    }
  };
}


export default authenticate;
