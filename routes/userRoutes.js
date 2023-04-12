import express from "express";
import { getMyProfile, login,logout,register,changePassword, updateProfile, updateProfilePicture, forgetPassword, resetPassword, addToPlaylist, removeFromPlaylist } from "../controllers/userController.js";
import { isAuthenticated } from "../middlewares/Auth.js";

const router = express.Router();

router.route("/register").post(register);
router.route("/login").post(login);
router.route("/logout").get(logout);
router.route("/me").get(isAuthenticated,getMyProfile);
router.route("/changepassword").put(isAuthenticated,changePassword);
router.route("/updateprofile").put(isAuthenticated,updateProfile);
router.route("/updateprofilepicture").put(isAuthenticated,updateProfilePicture);
router.route("/forgetpassword").post(forgetPassword);
router.route("/resetpassword/:token").post(resetPassword);
router.route("/addtoplaylist").post(isAuthenticated,addToPlaylist);
router.route("/removefromplaylist").delete(isAuthenticated,removeFromPlaylist);




export default router;