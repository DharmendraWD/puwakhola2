const express = require("express");
const {createHeroSection, getHeroSection, deleteHeroSectionImage, createAboutUs, createAboutUsImage, createMissionImage, createMission, getAboutUs, getAboutUsImage, getMission, getMissionImage, createTeam, getAllTeam, deleteTeam, createGallery, deleteGalleryImage, getGallery, createBlog, getallBlog, deleteBlog, editBlog, getAllClientMessage, deleteClientMessage, createClientMessage, createFaq, getAllFaqs, updateFaq, deleteFaq, other, getAllOther, createHeroImage, getallHeroImage, deleteHeroImage, deleteAboutUsImage, getMissionImages, deleteMissionImage, getBlogById, createProject, deleteProject, getallProject, updateProject} = require("../controllers/contents.controller");
const upload = require("../middlewares/imageUpload");
const {isAuthenticated} = require("../middlewares/isAuthenticated");

// const upload = require("../middleware/upload");
// const { protect } = require("../middleware/auth");

const router = express.Router();

    // HERO SECTION 
  router.put(
  "/herosection",
  isAuthenticated,
  upload.none(), 
  createHeroSection
);

router.get("/herosection", getHeroSection);
// router.delete("/herosection/:imageName", isAuthenticated, deleteHeroSectionImage);
router.post("/herosectionimg", upload.array("images"), isAuthenticated, createHeroImage);
router.get("/herosectionimg", getallHeroImage);
router.delete("/herosectionimg/:id", isAuthenticated, deleteHeroImage);
 // HERO SECTION END


//  ABOUT US SECTION 
router.put("/aboutus", isAuthenticated,  upload.none(), createAboutUs);
router.get("/aboutus", getAboutUs);
router.post("/aboutusimg",
     upload.fields([
    { name: "firstCardImage", maxCount: 1 },
    { name: "fullImage", maxCount: 1 }
  ]), isAuthenticated, createAboutUsImage);
  router.get("/aboutusimg", getAboutUsImage);
router.delete("/aboutusimg/:imageType", isAuthenticated, deleteAboutUsImage);
//  ABOUT US SECTION END

// MISSION SECTION
router.put("/mission", upload.none(), isAuthenticated, createMission);
router.get("/mission", getMission); 
router.put("/missionimg", 
  upload.fields([
    { name: "img1", maxCount: 1 },
    { name: "img2", maxCount: 1 }
  ]), 
  isAuthenticated, 
  createMissionImage
);

router.get("/missionimg", getMissionImages);
router.delete("/missionimg/:imageType", isAuthenticated, deleteMissionImage);
// MISSION SECTION END

// TEAM SECTION 
router.post("/team", upload.single("dp"), createTeam);
router.get("/team", getAllTeam);
router.delete("/team/:id", deleteTeam);
// TEAM SECTION ENDED 

// GALLERY SECTION 
router.post("/gallery", upload.array("image"),isAuthenticated, createGallery);
router.get("/gallery", getGallery);
router.delete("/gallery/:imageName", isAuthenticated, deleteGalleryImage);
// GALLERY SECTION END

// BLOG SECTION 
router.get("/blogs", getallBlog);
router.post("/blogs", upload.single("coverImage"),isAuthenticated, createBlog);
router.delete("/blogs/:id", isAuthenticated, deleteBlog)
router.put(
  "/blogs/:id",
  isAuthenticated,
  upload.single("coverImage"),
  editBlog
);
router.get("/blogs/:id", getBlogById);
// BLOG SECTION END

// CLIENT MESSAGE SECTION 
router.get("/clientmessage", getAllClientMessage);
router.delete("/clientmessage/:id", isAuthenticated, deleteClientMessage);
router.post("/clientmessage", createClientMessage);
// CLIENT MESSAGE SECTION END

// FAQS SECTION 
router.post("/faqs",isAuthenticated, createFaq);
router.get("/faqs", getAllFaqs);
router.put("/faqs/:id", isAuthenticated, updateFaq);
router.delete("/faqs/:id", isAuthenticated, deleteFaq);
// FAQS SECTION END

// OTHER SECTION 
router.get("/other", getAllOther);
router.put("/other", isAuthenticated, other);
// OTHER SECTION END

// PROJECT 
router.post("/projects",  upload.none(), isAuthenticated, createProject);
router.delete("/projects/:id" , isAuthenticated, deleteProject);
router.put("/updateproject/:id", isAuthenticated, updateProject);
router.get("/projects", getallProject);
// PROJECT END


module.exports = router;
