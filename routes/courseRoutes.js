import express from "express";
import { addLectures, createCourse, getAllCourses, getCourseLectures } from "../controllers/courseControllers.js";
import singleUpload from "../middlewares/multer.js";
import { authorizeAdmin, isAuthenticated } from "../middlewares/Auth.js";

const router = express.Router();

router.route("/courses").get(getAllCourses);
router.route("/createcourse").post(isAuthenticated,authorizeAdmin,singleUpload,createCourse);

router.route("/course/:id").get(isAuthenticated,authorizeAdmin,singleUpload,getCourseLectures);
router.route("/course/:id").post(isAuthenticated,authorizeAdmin,singleUpload,addLectures);


export default router;