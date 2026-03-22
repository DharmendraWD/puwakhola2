const { pool } = require("../db/dbConn");
const path = require("path");
const fs = require("fs");



const createHeroSection = async (req, res) => {
    // console.log(req.body)
  const {
    slogan,
    description,
    btn1Text,
    btn1Link,
    btn2Text,
    btn2Link,
    upperSlogan, 
    ImageBellowText,
    yearsOfExp,
    homesPowered,
    mw
  } = req.body || {};



  try {
    const [existingHeroSection] = await pool.query(
      "SELECT * FROM herosection WHERE id = 1"
    );

    const isUpdate = existingHeroSection.length > 0;

    // Validation
    if (
      !slogan ||
      !description ||
      !btn1Text ||
      !btn1Link ||
      !btn2Text ||
      !btn2Link ||
      !upperSlogan ||
      !ImageBellowText ||
      !yearsOfExp ||
      !homesPowered ||
      !mw
    ) {
      return res.status(400).json({
        success: false,
        message: "All fields are required",
      });
    }

    // UPDATE
    if (isUpdate) {
      const updateQuery = `
        UPDATE herosection SET
          slogan = ?,
          description = ?,
          btn1Text = ?,
          btn1Link = ?,
          btn2Text = ?,
          btn2Link = ?,
          upperSlogan = ?,
          ImageBellowText = ?,
          yearsOfExp = ?,
          homesPowered = ?,
          mw = ?
        WHERE id = 1
      `;

      const values = [
        slogan,
        description,
        btn1Text,
        btn1Link,
        btn2Text,
        btn2Link,
        upperSlogan,
        ImageBellowText,
        yearsOfExp,
        homesPowered,
        mw
      ];

      await pool.query(updateQuery, values);
    }

    // CREATE
    else {
      await pool.query(
        `INSERT INTO herosection 
        (slogan, description, btn1Text, btn1Link, btn2Text, btn2Link, upperSlogan, ImageBellowText, yearsOfExp, homesPowered, mw) 
        VALUES (?,?,?,?,?,?,?,?,?,?,?)`,
        [
          slogan,
          description,
          btn1Text,
          btn1Link,
          btn2Text,
          btn2Link,
          upperSlogan,
          ImageBellowText,
          yearsOfExp,
          homesPowered,
          mw,
        ]
      );
    }

    const [heroSection] = await pool.query(
      "SELECT * FROM herosection WHERE id = 1"
    );

    return res.status(200).json({
      success: true,
      message: "Hero section saved successfully",
      data: heroSection[0],
    });

  } catch (error) {
    console.error("Server Error:", error);

    return res.status(500).json({
      success: false,
      message: error.message || "Server error",
    });
  }
};

const createHeroImage = async (req, res) => {
  const { title } = req.body;
  const images = req.files || [];

  try {
    // Validation
    if (!title || images.length === 0) {
      // cleanup uploaded images
      images.forEach(file => {
        const imgPath = path.join("uploads", "herosectionimg", file.filename);
        if (fs.existsSync(imgPath)) fs.unlinkSync(imgPath);
      });

      return res.status(400).json({
        success: false,
        message: "Title and at least one image are required",
      });
    }

    // Count existing images
    const [existing] = await pool.query(
      "SELECT COUNT(*) AS total FROM heroimage"
    );

    const existingCount = existing[0].total;
    const newCount = images.length;

    // Max 6 images allowed
    if (existingCount + newCount > 4) {
      images.forEach(file => {
        const imgPath = path.join("uploads", "herosectionimg", file.filename);
        if (fs.existsSync(imgPath)) fs.unlinkSync(imgPath);
      });

      return res.status(400).json({
        success: false,
        message: `Gallery limit exceeded. Maximum 4 images allowed.`,
      });
    }

    // Insert images
    const values = images.map(file => [
      title,
      `uploads/herosectionimg/${file.filename}`,
    ]);

    await pool.query(
      "INSERT INTO heroimage (title, image) VALUES ?",
      [values]
    );

    const [heroimage] = await pool.query("SELECT * FROM heroimage");

    return res.status(201).json({
      success: true,
      message: "heroimage images uploaded successfully",
      data: heroimage,
    });

  } catch (error) {
    console.error("heroimage Error:", error);

    // Cleanup uploaded images on error
    images.forEach(file => {
      const imgPath = path.join("uploads", "herosectionimg", file.filename);
      if (fs.existsSync(imgPath)) fs.unlinkSync(imgPath);
    });

    return res.status(500).json({
      success: false,
      message: error.message || "Server error",
    });
  }
};
const getallHeroImage = async (req, res) => {
  try {
    const [rows] = await pool.query("SELECT * FROM heroimage");
    res.json(rows);
  } catch (error) {
    console.error("Server Error:", error);
    res.status(500).json({
      success: false,
      message: error.message || "Server error",
    });
  }
}
const deleteHeroImage = async (req, res) => {
  try {
    const { id } = req.params;
    const [result] = await pool.query("SELECT image FROM heroimage WHERE id = ?", [id]);
    if (result.length === 0) {
      return res.status(404).json({
        success: false,
        message: "Image not found",
      });
    }

    const imgPath = path.join(result[0].image);
    // console.log(imgPath)
    if (fs.existsSync(imgPath)) fs.unlinkSync(imgPath);

    await pool.query("DELETE FROM heroimage WHERE id = ?", [id]);

    const [heroimage] = await pool.query("SELECT * FROM heroimage");

    return res.json({
      success: true,
      data: heroimage,
      message: "Image deleted successfully",
    });
    
  } catch (error) {
    console.error("Server Error:", error);
    return res.status(500).json({
      success: false,
      message: error.message || "Server error",
    });
  }
}
// get all hero section data 
const getHeroSection = async (req, res) => {
    try {
        const [rows] = await pool.query("SELECT * FROM herosection WHERE id = 1");
        return res.status(200).json({
            success: true,
            message: "Hero section fetched successfully",
            data: rows,
        });
    } catch (error) {
        console.error("Server Error:", error);
        return res.status(500).json({
            success: false,
            message: error.message || "Server error",
        });
    }
}

// ABOUT US SECTION
// create about us section 
const createAboutUs = async (req, res) => {
  const {
    heading,
    longPara,
    firstCardHeading,
    firstCardPara,
    secCardHeading,
    secCardPara,
    thirdCardHeading,
    thirdCardPara,
    fourthCardPara,
    fourthCardHeading,
  } = req.body;

//   const newImages = req.files?.map(file => file.filename) || [];

  try {
    //  Check existing row
    const [existingaboutus] = await pool.query(
      "SELECT * FROM aboutus WHERE id = 1"
    );

    const isUpdate = existingaboutus.length > 0;

    //  Validation
    if (
      !heading ||
      !longPara ||
      !firstCardHeading ||
      !firstCardPara ||
      !secCardHeading ||
      !secCardPara ||
      !thirdCardHeading ||
      !thirdCardPara ||
      !fourthCardPara ||
      !fourthCardHeading

    //   (!isUpdate && newImages.length < 2)
    ){
      return res.status(400).json({
        success: false,
        message: "All fields are required",
      });
    }


    //  CREATE
    if (!isUpdate) {
      await pool.query(
        `INSERT INTO aboutus
        (heading, longPara, firstCardHeading, firstCardPara, secCardHeading, secCardPara,
         thirdCardHeading, thirdCardPara, fourthCardPara, fourthCardHeading)
        VALUES (?,?,?,?,?,?,?,?,?)`,
        [
          heading,
          longPara,
          firstCardHeading,
          firstCardPara,
          secCardHeading,
          secCardPara,
          thirdCardHeading,
          thirdCardPara,
          fourthCardPara,
          fourthCardHeading
          
        ]
      );
    }

    //  UPDATE
    else {
      let updateQuery = `
        UPDATE aboutus SET
          heading = ?,
          longPara = ?,
          firstCardHeading = ?,
          firstCardPara = ?,
          secCardHeading = ?,
          secCardPara = ?,
          thirdCardHeading = ?,
          thirdCardPara = ?,
          fourthCardPara = ?,
          fourthCardHeading = ?
      `;

      let values = [
        heading,
        longPara,
        firstCardHeading,
        firstCardPara,
        secCardHeading,
        secCardPara,
        thirdCardHeading,
        thirdCardPara,
        fourthCardPara,
        fourthCardHeading,
      ];

      //  Update images ONLY if new images uploaded
    //   if (newImages.length > 0) {
    //     updateQuery += `, images = ?`;
    //     values.push(finalImagesJson);
    //   }

      updateQuery += ` WHERE id = 1`;

      await pool.query(updateQuery, values);

      //  Delete old images ONLY if replaced
    //   if (newImages.length > 0) {
    //     existingImages.forEach(img => {
    //       const imgPath = path.join("uploads", "aboutus", img);
    //       if (fs.existsSync(imgPath)) {
    //         fs.unlinkSync(imgPath);
    //       }
    //     });
    //   }
    }

    //  Fetch updated data
    const [aboutus] = await pool.query(
      "SELECT * FROM aboutus WHERE id = 1"
    );

    return res.status(200).json({
      success: true,
      message: "About Us section saved successfully",
      data: aboutus[0],
    });

  } catch (error) {
    console.error("Server Error:", error);

    //  Cleanup newly uploaded images on error
    // if (newImages.length > 0) {
    //   newImages.forEach(img => {
    //     const imgPath = path.join("uploads", "aboutus", img);
    //     if (fs.existsSync(imgPath)) fs.unlinkSync(imgPath);
    //   });
    // }

    return res.status(500).json({
      success: false,
      message: error.message || "Server error",
    });
  }
};
// get about us 
const getAboutUs = async (req, res) => {
  try {
    const [rows] = await pool.query("SELECT * FROM aboutus WHERE id = 1");
    return res.status(200).json({
      success: true,
      message: "About Us section fetched successfully",
      data: rows,
    });
  } catch (error) {
    console.error("Server Error:", error);
    return res.status(500).json({
      success: false,
      message: error.message || "Server error",
    });
  }
};
// create image section for about us section
const createAboutUsImage = async (req, res) => {
  try {
    const uploadedFiles = {};
    let filesToCleanup = [];

    // Check which file(s) were uploaded
    if (req.files?.firstCardImage?.[0]) {
      uploadedFiles.firstCardImage = req.files.firstCardImage[0].filename;
      filesToCleanup.push({ field: 'firstCardImage', filename: uploadedFiles.firstCardImage });
    }

    if (req.files?.fullImage?.[0]) {
      uploadedFiles.fullImage = req.files.fullImage[0].filename;
      filesToCleanup.push({ field: 'fullImage', filename: uploadedFiles.fullImage });
    }

    // Check if at least one file was uploaded
    if (Object.keys(uploadedFiles).length === 0) {
      return res.status(400).json({
        success: false,
        message: "At least one image (firstCardImage or fullImage) is required",
      });
    }

    // Fetch existing record
    const [existing] = await pool.query("SELECT * FROM aboutusimage WHERE id = 1");

    // Delete old files that are being replaced
    if (existing.length > 0) {
      if (uploadedFiles.firstCardImage && existing[0].firstCardImage) {
        const oldPath = path.join("uploads/aboutusimg", existing[0].firstCardImage);
        if (fs.existsSync(oldPath)) fs.unlinkSync(oldPath);
      }

      if (uploadedFiles.fullImage && existing[0].fullImage) {
        const oldPath = path.join("uploads/aboutusimg", existing[0].fullImage);
        if (fs.existsSync(oldPath)) fs.unlinkSync(oldPath);
      }

      // Update only the fields that were uploaded
      const updateFields = [];
      const updateValues = [];

      if (uploadedFiles.firstCardImage) {
        updateFields.push("firstCardImage = ?");
        updateValues.push(uploadedFiles.firstCardImage);
      }

      if (uploadedFiles.fullImage) {
        updateFields.push("fullImage = ?");
        updateValues.push(uploadedFiles.fullImage);
      }

      updateValues.push(1); // WHERE id = 1

      await pool.query(
        `UPDATE aboutusimage SET ${updateFields.join(", ")} WHERE id = ?`,
        updateValues
      );
    } else {
      // Insert new record with only uploaded fields
      await pool.query(
        "INSERT INTO aboutusimage (id, firstCardImage, fullImage) VALUES (1, ?, ?)",
        [
          uploadedFiles.firstCardImage || null,
          uploadedFiles.fullImage || null
        ]
      );
    }

    // Fetch updated record
    const [data] = await pool.query("SELECT * FROM aboutusimage WHERE id = 1");

    return res.status(200).json({
      success: true,
      message: "About Us image(s) saved successfully",
      data: data[0],
    });
  } catch (error) {
    console.error("Server Error:", error);

    // Cleanup newly uploaded files on error
    if (req.files?.firstCardImage?.[0]) {
      const firstPath = path.join("uploads/aboutusimg", req.files.firstCardImage[0].filename);
      if (fs.existsSync(firstPath)) fs.unlinkSync(firstPath);
    }
    if (req.files?.fullImage?.[0]) {
      const fullPath = path.join("uploads/aboutusimg", req.files.fullImage[0].filename);
      if (fs.existsSync(fullPath)) fs.unlinkSync(fullPath);
    }

    return res.status(500).json({
      success: false,
      message: error.message || "Server error",
    });
  }
};

// Controller
const deleteAboutUsImage = async (req, res) => {
  try {
    const { imageType } = req.params; // Get from URL parameter

    // Validate imageType
    if (!['firstCardImage', 'fullImage'].includes(imageType)) {
      return res.status(400).json({
        success: false,
        message: "Invalid imageType. Must be 'firstCardImage' or 'fullImage'",
      });
    }

    // Fetch existing record
    const [existing] = await pool.query("SELECT * FROM aboutusimage WHERE id = 1");

    if (existing.length === 0) {
      return res.status(404).json({
        success: false,
        message: "About Us image record not found",
      });
    }

    const imageToDelete = existing[0][imageType];

    if (!imageToDelete) {
      return res.status(404).json({
        success: false,
        message: `${imageType} not found or already deleted`,
      });
    }

    // Delete the file
    const imagePath = path.join("uploads/aboutusimg", imageToDelete);
    if (fs.existsSync(imagePath)) {
      fs.unlinkSync(imagePath);
    }

    // Set column to NULL
    await pool.query(
      `UPDATE aboutusimage SET ${imageType} = NULL WHERE id = 1`
    );

    return res.status(200).json({
      success: true,
      message: `${imageType} deleted successfully`,
    });

  } catch (error) {
    console.error("Server Error:", error);
    return res.status(500).json({
      success: false,
      message: error.message || "Server error",
    });
  }
};

// get aboutsu image
const getAboutUsImage = async (req, res) => {
  try {
    const [rows] = await pool.query("SELECT * FROM aboutusimage WHERE id = 1");
    return res.status(200).json({
      success: true,
      message: "About Us images fetched successfully",
      data: rows,
    });
  } catch (error) {
    console.error("Server Error:", error);
    return res.status(500).json({
      success: false,
      message: error.message || "Server error",
    });
  }
}
// ABOUT US SECTION END 

// MISSION SECTION 
/* ============================
   CREATE/UPDATE MISSION TEXT
============================ */
const createMission = async (req, res) => {
  const {
    heading,
    shortpara,
    firstCardHeading,
    firstCardPara,
    secCardHeading,
    secCardPara,
    thirdCardHeading,
    thirdCardPara,
  } = req.body;

  try {
    // Check existing mission row
    const [existingMission] = await pool.query(
      "SELECT * FROM mission WHERE id = 1"
    );

    const isUpdate = existingMission.length > 0;

    // Validation
    if (
      !heading ||
      !shortpara ||
      !firstCardHeading ||
      !firstCardPara ||
      !secCardHeading ||
      !secCardPara ||
      !thirdCardHeading ||
      !thirdCardPara
    ) {
      return res.status(400).json({
        success: false,
        message: "All fields are required",
      });
    }

    // CREATE
    if (!isUpdate) {
      await pool.query(
        `INSERT INTO mission
        (heading, shortpara, firstCardHeading, firstCardPara,
         secCardHeading, secCardPara, thirdCardHeading, thirdCardPara)
        VALUES (?,?,?,?,?,?,?,?)`,
        [
          heading,
          shortpara,
          firstCardHeading,
          firstCardPara,
          secCardHeading,
          secCardPara,
          thirdCardHeading,
          thirdCardPara,
        ]
      );
    }
    // UPDATE
    else {
      await pool.query(
        `UPDATE mission SET
          heading = ?,
          shortpara = ?,
          firstCardHeading = ?,
          firstCardPara = ?,
          secCardHeading = ?,
          secCardPara = ?,
          thirdCardHeading = ?,
          thirdCardPara = ?
        WHERE id = 1`,
        [
          heading,
          shortpara,
          firstCardHeading,
          firstCardPara,
          secCardHeading,
          secCardPara,
          thirdCardHeading,
          thirdCardPara,
        ]
      );
    }

    // Fetch updated data
    const [mission] = await pool.query(
      "SELECT * FROM mission WHERE id = 1"
    );

    return res.status(200).json({
      success: true,
      message: "Mission section saved successfully",
      data: mission[0],
    });

  } catch (error) {
    console.error("Server Error:", error);
    return res.status(500).json({
      success: false,
      message: error.message || "Server error",
    });
  }
};

/* ============================
   GET MISSION TEXT
============================ */
const getMission = async (req, res) => {
  try {
    const [mission] = await pool.query("SELECT * FROM mission WHERE id = 1");
    
    return res.status(200).json({
      success: true,
      data: mission[0] || null,
    });
  } catch (error) {
    console.error("Server Error:", error);
    return res.status(500).json({
      success: false,
      message: error.message || "Server error",
    });
  }
};

/* ============================
   CREATE/UPDATE MISSION IMAGES
   (Upload single or both images)
============================ */
const createMissionImage = async (req, res) => {
  try {
    const uploadedFiles = {};

    // Check which file(s) were uploaded
    if (req.files?.img1?.[0]) {
      uploadedFiles.img1 = req.files.img1[0].filename;
    }

    if (req.files?.img2?.[0]) {
      uploadedFiles.img2 = req.files.img2[0].filename;
    }

    // Check if at least one file was uploaded
    if (Object.keys(uploadedFiles).length === 0) {
      return res.status(400).json({
        success: false,
        message: "At least one image (img1 or img2) is required",
      });
    }

    // Fetch existing record
    const [existing] = await pool.query("SELECT * FROM missionimage WHERE id = 1");

    // Delete old files that are being replaced
    if (existing.length > 0) {
      if (uploadedFiles.img1 && existing[0].img1) {
        const oldPath = path.join("uploads/missionimg", existing[0].img1);
        if (fs.existsSync(oldPath)) fs.unlinkSync(oldPath);
      }

      if (uploadedFiles.img2 && existing[0].img2) {
        const oldPath = path.join("uploads/missionimg", existing[0].img2);
        if (fs.existsSync(oldPath)) fs.unlinkSync(oldPath);
      }

      // Update only the fields that were uploaded
      const updateFields = [];
      const updateValues = [];

      if (uploadedFiles.img1) {
        updateFields.push("img1 = ?");
        updateValues.push(uploadedFiles.img1);
      }

      if (uploadedFiles.img2) {
        updateFields.push("img2 = ?");
        updateValues.push(uploadedFiles.img2);
      }

      updateValues.push(1); // WHERE id = 1

      await pool.query(
        `UPDATE missionimage SET ${updateFields.join(", ")} WHERE id = ?`,
        updateValues
      );
    } else {
      // Insert new record
      await pool.query(
        "INSERT INTO missionimage (id, img1, img2) VALUES (1, ?, ?)",
        [
          uploadedFiles.img1 || null,
          uploadedFiles.img2 || null
        ]
      );
    }

    // Fetch updated record
    const [data] = await pool.query("SELECT * FROM missionimage WHERE id = 1");

    return res.status(200).json({
      success: true,
      message: "Mission image(s) saved successfully",
      data: data[0],
    });
  } catch (error) {
    console.error("Server Error:", error);

    // Cleanup newly uploaded files on error
    if (req.files?.img1?.[0]) {
      const img1Path = path.join("uploads/missionimg", req.files.img1[0].filename);
      if (fs.existsSync(img1Path)) fs.unlinkSync(img1Path);
    }
    if (req.files?.img2?.[0]) {
      const img2Path = path.join("uploads/missionimg", req.files.img2[0].filename);
      if (fs.existsSync(img2Path)) fs.unlinkSync(img2Path);
    }

    return res.status(500).json({
      success: false,
      message: error.message || "Server error",
    });
  }
};

/* ============================
   GET MISSION IMAGES
============================ */
const getMissionImages = async (req, res) => {
  try {
    const [data] = await pool.query("SELECT * FROM missionimage WHERE id = 1");

    if (data.length === 0) {
      return res.status(404).json({
        success: false,
        message: "No images found",
      });
    }

    return res.status(200).json({
      success: true,
      data: data[0],
    });
  } catch (error) {
    console.error("Server Error:", error);
    return res.status(500).json({
      success: false,
      message: error.message || "Server error",
    });
  }
};

/* ============================
   DELETE MISSION IMAGE
   (Delete specific image by type)
============================ */
const deleteMissionImage = async (req, res) => {
  try {
    const { imageType } = req.params;

    // Validate imageType
    if (!['img1', 'img2'].includes(imageType)) {
      return res.status(400).json({
        success: false,
        message: "Invalid imageType. Must be 'img1' or 'img2'",
      });
    }

    // Fetch existing record
    const [existing] = await pool.query("SELECT * FROM missionimage WHERE id = 1");

    if (existing.length === 0) {
      return res.status(404).json({
        success: false,
        message: "Mission image record not found",
      });
    }

    const imageToDelete = existing[0][imageType];

    if (!imageToDelete) {
      return res.status(404).json({
        success: false,
        message: `${imageType} not found or already deleted`,
      });
    }

    // Delete the file
    const imagePath = path.join("uploads/missionimg", imageToDelete);
    if (fs.existsSync(imagePath)) {
      fs.unlinkSync(imagePath);
    }

    // Set column to NULL
    await pool.query(
      `UPDATE missionimage SET ${imageType} = NULL WHERE id = 1`
    );

    return res.status(200).json({
      success: true,
      message: `${imageType} deleted successfully`,
    });

  } catch (error) {
    console.error("Server Error:", error);
    return res.status(500).json({
      success: false,
      message: error.message || "Server error",
    });
  }
};

// MISSION SECTION END

// TEAM SECTION 
// create team 
const createTeam = async (req, res) => {
  const { name, description, designation } = req.body;
  const dp = req.file ? req.file.filename : null;

  try {
    // Validation
    if (!name || !description || !dp || !designation) {
      // Remove uploaded image if validation fails
      if (dp) {
        const imagePath = path.join("uploads", "team", dp);
        if (fs.existsSync(imagePath)) fs.unlinkSync(imagePath);
      }

      return res.status(400).json({
        success: false,
        message: "Name, description, designation and display picture are required",
      });
    }

    // Insert into team table
    const [result] = await pool.query(
      `INSERT INTO team (name, dp, description, designation)
       VALUES (?, ?, ?, ?)`,
      [name, dp, description, designation]
    );

    // Fetch newly created record
    const [team] = await pool.query(
      "SELECT * FROM team WHERE id = ?",
      [result.insertId]
    );

    return res.status(201).json({
      success: true,
      message: "Team member created successfully",
      data: team[0],
    });

  } catch (error) {
    console.error("Server Error:", error);

    // Cleanup uploaded image on error
    if (dp) {
      const imagePath = path.join("uploads", "team", dp);
      if (fs.existsSync(imagePath)) fs.unlinkSync(imagePath);
    }

    return res.status(500).json({
      success: false,
      message: error.message || "Server error",
    });
  }
};
// get team 
const getAllTeam = async (req, res) => {
  try {
    const [rows] = await pool.query("SELECT * FROM team");
    return res.status(200).json({
      success: true,
      message: "Team members fetched successfully",
      data: rows,
    });
  } catch (error) {
    console.error("Server Error:", error);
    return res.status(500).json({
      success: false,
      message: error.message || "Server error",
    });
  }
}
// delete team with id 
const deleteTeam = async (req, res) => {
  try {
    const { id } = req.params;

    // 1 Get image name first
    const [rows] = await pool.query(
      "SELECT dp FROM team WHERE id = ?",
      [id]
    );

    if (rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: "Team member not found",
      });
    }

    const imageName = rows[0].dp;

    // 2 Delete database record
    const [result] = await pool.query(
      "DELETE FROM team WHERE id = ?",
      [id]
    );

    // 3Delete image file
    if (imageName) {
      const imagePath = path.join(
        process.cwd(),
        "uploads",
        "team",
        imageName
      );

      if (fs.existsSync(imagePath)) {
        fs.unlinkSync(imagePath);
      }
    }

    return res.status(200).json({
      success: true,
      message: "Team member and image deleted successfully",
    });

  } catch (error) {
    console.error("Server Error:", error);
    return res.status(500).json({
      success: false,
      message: error.message || "Server error",
    });
  }
};

// TEAM SECTION END

// GALLARY SECTION 
// create gallery 
const createGallery = async (req, res) => {
  const { title } = req.body;
  const images = req.files || [];

  try {
    // Validation
    if (!title || images.length === 0) {
      // cleanup uploaded images
      images.forEach(file => {
        const imgPath = path.join("uploads", "gallery", file.filename);
        if (fs.existsSync(imgPath)) fs.unlinkSync(imgPath);
      });

      return res.status(400).json({
        success: false,
        message: "Title and at least one image are required",
      });
    }

    // Count existing images
    const [existing] = await pool.query(
      "SELECT COUNT(*) AS total FROM gallery"
    );

    const existingCount = existing[0].total;
    const newCount = images.length;

    // Max 6 images allowed
    if (existingCount + newCount > 6) {
      images.forEach(file => {
        const imgPath = path.join("uploads", "gallery", file.filename);
        if (fs.existsSync(imgPath)) fs.unlinkSync(imgPath);
      });

      return res.status(400).json({
        success: false,
        message: `Gallery limit exceeded. Maximum 6 images allowed.`,
      });
    }

    // Insert images
    const values = images.map(file => [
      title,
      `uploads/gallery/${file.filename}`,
    ]);

    await pool.query(
      "INSERT INTO gallery (title, image) VALUES ?",
      [values]
    );

    const [gallery] = await pool.query("SELECT * FROM gallery");

    return res.status(201).json({
      success: true,
      message: "Gallery images uploaded successfully",
      data: gallery,
    });

  } catch (error) {
    console.error("Gallery Error:", error);

    // Cleanup uploaded images on error
    images.forEach(file => {
      const imgPath = path.join("uploads", "gallery", file.filename);
      if (fs.existsSync(imgPath)) fs.unlinkSync(imgPath);
    });

    return res.status(500).json({
      success: false,
      message: error.message || "Server error",
    });
  }
};
// delete gallary 
const deleteGalleryImage = async (req, res) => {
    try {
    const { imageName } = req.params;
    const [result] = await pool.query(
      "DELETE FROM gallery WHERE image = ?",
      [`uploads/gallery/${imageName}`]
    );

    const imgPath = path.join("uploads", "gallery", imageName);
    if (fs.existsSync(imgPath)) {
      fs.unlinkSync(imgPath);
    }

    if (result.affectedRows === 0) {
      return res.status(404).json({
        success: false,
        message: "Image not found",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Image deleted successfully",
      data: result,
    });
  } catch (error) {
    console.error("Server Error:", error);
    return res.status(500).json({
      success: false,
      message: error.message || "Server error",
    });
  }
}
// get gallary 
const getGallery = async (req, res) => {
  try {
    const [rows] = await pool.query("SELECT * FROM gallery");
    res.json(rows);
  } catch (error) {
    console.error("Server Error:", error);
    res.status(500).json({
      success: false,
      message: error.message || "Server error",
    });
  }
}
// GALLARY SECTION END 

// BLOG SECTION 
// create blogs 
const createBlog = async (req, res) => {
  const { title, content } = req.body;
  const coverImage = req.file ? req.file.filename : null;
  try {
    // Auth user (from JWT middleware)
    const user = req.user; // { id, name, email }
    if (!title || !content || !coverImage) {
      if (coverImage) {
        const imgPath = path.join("uploads", "blogs", coverImage);
        if (fs.existsSync(imgPath)) fs.unlinkSync(imgPath);
      }

      return res.status(400).json({
        success: false,
        message: "Title, content, and cover image are required",
      });
    }

    const [result] = await pool.query(
      `INSERT INTO blogs
       (title, content, cover_image, author_id, author_name)
       VALUES (?, ?, ?, ?, ?)`,
      [
        title,
        content,
        coverImage,
        user.userId,
        user.fullName,
      ]
    );

    const [blog] = await pool.query(
      "SELECT * FROM blogs WHERE id = ?",
      [result.insertId]
    );

    return res.status(201).json({
      success: true,
      message: "Blog created successfully",
      data: blog[0],
    });

  } catch (error) {
    console.error("Blog Error:", error);

    if (coverImage) {
      const imgPath = path.join("uploads", "blogs", coverImage);
      if (fs.existsSync(imgPath)) fs.unlinkSync(imgPath);
    }

    return res.status(500).json({
      success: false,
      message: error.message || "Server error",
    });
  }
};
// get all blog 
const getallBlog = async (req, res) => {
   try {
    const [rows] = await pool.query("SELECT * FROM blogs");
    res.json(rows);
  } catch (error) {
    console.error("Server Error:", error);
    res.status(500).json({
      success: false,
      message: error.message || "Server error",
    });
  }
}
// delete blog 
const deleteBlog = async (req, res) => {
  try {
    const { id } = req.params;

    // 1. Get blog first
    const [rows] = await pool.query(
      "SELECT cover_image FROM blogs WHERE id = ?",
      [id]
    );

    if (rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: "Blog not found",
      });
    }

    const coverImage = rows[0].cover_image; // cover_image is string

    // 2. Delete blog from DB
    await pool.query("DELETE FROM blogs WHERE id = ?", [id]);

    // 3. Delete image from server
    if (coverImage) {
      const imgPath = path.join("uploads", "blogs", coverImage);
      if (fs.existsSync(imgPath)) {
        fs.unlinkSync(imgPath);
      }
    }

    return res.json({
      success: true,
      message: "Blog deleted successfully",
    });

  } catch (error) {
    console.error("Server Error:", error);
    return res.status(500).json({
      success: false,
      message: error.message || "Server error",
    });
  }
};

// get particual blog by id 
const getBlogById = async (req, res) => {
  try {
    const { id } = req.params;
    const [rows] = await pool.query("SELECT * FROM blogs WHERE id = ?", [id]);
    if (rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: "Blog not found",
      });
    }
    res.json(rows[0]);
  } catch (error) {
    console.error("Server Error:", error);
    res.status(500).json({
      success: false,
      message: error.message || "Server error",
    });
  }
}
// update blog 
const editBlog = async (req, res) => {
  try {
    const { id } = req.params;
    const { title, content } = req.body;
    const newImage = req.file ? req.file.filename : null;

    // Validation
    if (!title || !content) {
      if (newImage) {
        const imgPath = path.join("uploads", "blogs", newImage);
        if (fs.existsSync(imgPath)) fs.unlinkSync(imgPath);
      }

      return res.status(400).json({
        success: false,
        message: "Title and content are required",
      });
    }

    // Get existing blog
    const [rows] = await pool.query(
      "SELECT cover_image, author_id FROM blogs WHERE id = ?",
      [id]
    );

    if (rows.length === 0) {
      if (newImage) {
        const imgPath = path.join("uploads", "blogs", newImage);
        if (fs.existsSync(imgPath)) fs.unlinkSync(imgPath);
      }

      return res.status(404).json({
        success: false,
        message: "Blog not found",
      });
    }

    const blog = rows[0];


    // Build dynamic update query
    let query = `
      UPDATE blogs SET
        title = ?,
        content = ?
    `;
    const values = [title, content];

    if (newImage) {
      query += `, cover_image = ?`;
      values.push(newImage);
    }

    query += ` WHERE id = ?`;
    values.push(id);

    await pool.query(query, values);

    // Delete old image if replaced
    if (newImage && blog.cover_image) {
      const oldImgPath = path.join("uploads", "blogs", blog.cover_image);
      if (fs.existsSync(oldImgPath)) fs.unlinkSync(oldImgPath);
    }

    // Fetch updated blog
    const [updated] = await pool.query(
      "SELECT * FROM blogs WHERE id = ?",
      [id]
    );

    return res.json({
      success: true,
      message: "Blog updated successfully",
      data: updated[0],
    });

  } catch (error) {
    console.error("Edit Blog Error:", error);

    // Cleanup new image on failure
    if (req.file) {
      const imgPath = path.join("uploads", "blogs", req.file.filename);
      if (fs.existsSync(imgPath)) fs.unlinkSync(imgPath);
    }

    return res.status(500).json({
      success: false,
      message: error.message || "Server error",
    });
  }
};
// BLOG SECTION END

// CLIENT MESSAGE SECTION 
const createClientMessage = async (req, res) => {
  try {
    const { message, email, name } = req.body;

    if (!message || !email || !name) {
      return res.status(400).json({
        success: false,
        message: "All fields are required",
      });
    }

    await pool.query(
      "INSERT INTO clientmess (mess, email, name) VALUES (?, ?, ?)",
      [message, email, name]
    );

    return res.json({
      success: true,
      message: "Message sent successfully",
    });
  } catch (error) {
    console.error("Server Error:", error);
    return res.status(500).json(
      {
        success: false,
        message: error.message || "Server error",
      }
    )
  }
}
const deleteClientMessage = async (req, res) => {
  try {
    const { id } = req.params;
    await pool.query("DELETE FROM clientmess WHERE id = ?", [id]);
    return res.json({
      success: true,
      message: "Message deleted successfully",
    });
  } catch (error) {
    console.error("Server Error:", error);
    return res.status(500).json({
      success: false,
      message: error.message || "Server error",
    });
  }
}
const getAllClientMessage = async (req, res) => {
  try {
    const [rows] = await pool.query("SELECT * FROM clientmess");
    return res.json({
      success: true,
      message: "Messages fetched successfully",
      data: rows,
    });
  } catch (error) {
    console.error("Server Error:", error);
    return res.status(500).json({
      success: false,
      message: error.message || "Server error",
    });
  }
}
// CLIENT MESSAGE SECTION END


// FAQS SECTION 
// CREATE FAQ
const createFaq = async (req, res) => {
  try {
    const { ques, ans } = req.body;

    if (!ques || !ans) {
      return res.status(400).json({
        success: false,
        message: "Question and answer are required",
      });
    }

    const [result] = await pool.query(
      "INSERT INTO faqs (ques, ans) VALUES (?, ?)",
      [ques, ans]
    );

    const [faq] = await pool.query(
      "SELECT * FROM faqs WHERE id = ?",
      [result.insertId]
    );

    res.status(201).json({
      success: true,
      message: "FAQ created successfully",
      data: faq[0],
    });
  } catch (error) {
    console.error("Create FAQ Error:", error);
    res.status(500).json({
      success: false,
      message: error.message || "Server error",
    });
  }
};

// GET ALL FAQS
const getAllFaqs = async (req, res) => {
  try {
    const [faqs] = await pool.query(
      "SELECT * FROM faqs ORDER BY id DESC"
    );

    res.json({
      success: true,
      data: faqs,
    });
  } catch (error) {
    console.error("Get FAQs Error:", error);
    res.status(500).json({
      success: false,
      message: error.message || "Server error",
    });
  }
};

// UPDATE FAQ
const updateFaq = async (req, res) => {
  try {
    const { id } = req.params;
    const { ques, ans } = req.body;

    if (!ques || !ans) {
      return res.status(400).json({
        success: false,
        message: "Question and answer are required",
      });
    }

    const [existing] = await pool.query(
      "SELECT * FROM faqs WHERE id = ?",
      [id]
    );

    if (existing.length === 0) {
      return res.status(404).json({
        success: false,
        message: "FAQ not found",
      });
    }

    await pool.query(
      "UPDATE faqs SET ques = ?, ans = ? WHERE id = ?",
      [ques, ans, id]
    );

    const [updated] = await pool.query(
      "SELECT * FROM faqs WHERE id = ?",
      [id]
    );

    res.json({
      success: true,
      message: "FAQ updated successfully",
      data: updated[0],
    });
  } catch (error) {
    console.error("Update FAQ Error:", error);
    res.status(500).json({
      success: false,
      message: error.message || "Server error",
    });
  }
};

// DELETE FAQ
const deleteFaq = async (req, res) => {
  try {
    const { id } = req.params;

    const [existing] = await pool.query(
      "SELECT * FROM faqs WHERE id = ?",
      [id]
    );

    if (existing.length === 0) {
      return res.status(404).json({
        success: false,
        message: "FAQ not found",
      });
    }

    await pool.query(
      "DELETE FROM faqs WHERE id = ?",
      [id]
    );

    res.json({
      success: true,
      message: "FAQ deleted successfully",
    });
  } catch (error) {
    console.error("Delete FAQ Error:", error);
    res.status(500).json({
      success: false,
      message: error.message || "Server error",
    });
  }
};
// FAQS SECRION ENED

// OTHER SECTION 
const other = async (req, res) => {
  try {
    const {
      a,
      b,
      c,
      d,
      developedby,
      copyright,
      location,
      mobNo2,
      mobNo,
      insta,
      address,
      yt,
      twitter,
      fb,
      email,
    } = req.body;

    // Basic validation (adjust if some fields are optional)
    if (
      !a ||
      !b ||
      !c ||
      !d ||
      !developedby ||
      !copyright ||
      !location ||
      !mobNo ||
      !address
    ) {
      return res.status(400).json({
        success: false,
        message: "Required fields are missing",
      });
    }

    // Check if row exists
    const [existing] = await pool.query(
      "SELECT id FROM other WHERE id = 1"
    );

    // CREATE
    if (existing.length === 0) {
      await pool.query(
        `INSERT INTO other
        (a, b, c, d, developedby, copyright, location,
         mobNo2, mobNo, insta, address, yt, twitter, fb, email)
        VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)`,
        [
          a,
          b,
          c,
          d,
          developedby,
          copyright,
          location,
          mobNo2 || null,
          mobNo,
          insta || null,
          address,
          yt || null,
          twitter || null,
          fb || null,
          email || null
        ]
      );
    }
    // UPDATE
    else {
      await pool.query(
        `UPDATE other SET
          a = ?,
          b = ?,
          c = ?,
          d = ?,
          developedby = ?,
          copyright = ?,
          location = ?,
          mobNo2 = ?,
          mobNo = ?,
          insta = ?,
          address = ?,
          yt = ?,
          twitter = ?,
          fb = ?,
          email = ?
        WHERE id = 1`,
        [
          a,
          b,
          c,
          d,
          developedby,
          copyright,
          location,
          mobNo2 || null,
          mobNo,
          insta || null,
          address,
          yt || null,
          twitter || null,
          fb || null,
          email || null
        ]
      );
    }

    // Fetch updated data
    const [other] = await pool.query(
      "SELECT * FROM other WHERE id = 1"
    );

    const updatedData = {
      id: other[0].id,
      a: other[0].a,
      b: other[0].b,
      c: other[0].c,
      d: other[0].d,
      developedby: other[0].developedby,
      copyright: other[0].copyright,
      location: other[0].location,
      mobNo2: other[0].mobNo2,
      mobNo: other[0].mobNo,
      insta: other[0].insta,
      address: other[0].address,
      yt: other[0].yt,
      twitter: other[0].twitter,
      fb: other[0].fb,
      email: other[0].email,
    };

    return res.json({
      success: true,
      message: "Applied successfully",
      data: updatedData,
    });

  } catch (error) {
    console.error("Other Controller Error:", error);
    return res.status(500).json({
      success: false,
      message: error.message || "Server error",
    });
  }
};

const getAllOther = async (req, res) => {
 try {
    const [other] = await pool.query(
      "SELECT * FROM other"
    );

    res.json({
      success: true,
      data: other,
    });
  } catch (error) {
    console.error("Get other Error:", error);
    res.status(500).json({
      success: false,
      message: error.message || "Server error",
    });
  }
}
// OTHER SECTION END  

// PROJECT 
const createProject = async (req, res) => {
  // console.log(req.body)
  try {
    
    const {
      title,
      para,
      statusState,
      capacity,
      Coordinates,
      altitudeRange,
      location,
      commissionedDate,
      NetHead,
      DesignDischarge,
      AnnualEnergy,
    } = req.body;


    const sanitizedData = {
      title: title.trim(),
      para: para ? para.trim() : null,
      statusState: statusState ? statusState.trim() : null,
      capacity: capacity ? capacity.trim() : null,
      Coordinates: Coordinates ? Coordinates.trim() : null,
      altitudeRange: altitudeRange ? altitudeRange.trim() : null,
      location: location ? location.trim() : null,
      commissionedDate: commissionedDate ? commissionedDate.trim() : null,
      NetHead: NetHead ? NetHead.trim() : null,
      DesignDischarge: DesignDischarge ? DesignDischarge.trim() : null,
      AnnualEnergy: AnnualEnergy ? AnnualEnergy.trim() : null
    };

    const query = `
      INSERT INTO projects 
      (title, para, statusState, capacity, Coordinates, altitudeRange, location, commissionedDate, NetHead, DesignDischarge, AnnualEnergy)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `;

    const [result] = await pool.query(query, [
      sanitizedData.title,
      sanitizedData.para,
      sanitizedData.statusState,
      sanitizedData.capacity,
      sanitizedData.Coordinates,
      sanitizedData.altitudeRange,
      sanitizedData.location,
      sanitizedData.commissionedDate,
      sanitizedData.NetHead,
      sanitizedData.DesignDischarge,
      sanitizedData.AnnualEnergy
    ]);

    res.status(201).json({
      success: true,
      message: 'Record created successfully',
      data: {
        id: result.insertId,
        title: sanitizedData.title,
        para: sanitizedData.para,
        statusState: sanitizedData.statusState,
        capacity: sanitizedData.capacity,
        Coordinates: sanitizedData.Coordinates,
        altitudeRange: sanitizedData.altitudeRange,
        location: sanitizedData.location,
        commissionedDate: sanitizedData.commissionedDate,
        NetHead: sanitizedData.NetHead,
        DesignDischarge: sanitizedData.DesignDischarge,
        AnnualEnergy: sanitizedData.AnnualEnergy
      }
    });
  } catch (error) {
    console.error('Error in create:', error);
    
    if (error.code === 'ER_DUP_ENTRY') {
      return res.status(409).json({
        success: false,
        message: 'Duplicate entry'
      });
    }

    res.status(500).json({
      success: false,
      message: 'Internal server error',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};

const updateProject = async (req, res) => {
  console.log(req?.body, "req body")
  const { id } = req.params;
  const { title, para, statusState, capacity, Coordinates, altitudeRange, location, commissionedDate, NetHead, DesignDischarge, AnnualEnergy } = req?.body;
  try {
    // Validate ID
    if (!id || isNaN(id)) {
      return res.status(400).json({ success: false, message: "Invalid ID parameter" });
    }

    // Check if project exists first
    const [existing] = await pool.query('SELECT * FROM projects WHERE id = ?', [id]);
    if (existing.length === 0) {
      return res.status(404).json({ success: false, message: "Project not found" });
    }

    const query = `
      UPDATE projects SET 
        title=?, para=?, statusState=?, capacity=?, Coordinates=?, altitudeRange=?, 
        location=?, commissionedDate=?, NetHead=?, DesignDischarge=?, AnnualEnergy=?
      WHERE id=?
    `;

    const [result] = await pool.query(query, [
      title, para, statusState, capacity, Coordinates, altitudeRange,
      location, commissionedDate, NetHead, DesignDischarge, AnnualEnergy, id
    ]);

    // Check if update actually affected any rows
    if (result.affectedRows === 0) {
      return res.status(400).json({ success: false, message: "Update failed, no rows changed" });
    }

    // Return the updated record
    const [updated] = await pool.query('SELECT * FROM projects WHERE id = ?', [id]);

    res.json({ success: true, message: "Project updated successfully", data: updated[0] });

  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: "Internal server error" });
  }
};
const deleteProject = async (req, res) => {
  try {
    const { id } = req.params;

    if (!id || isNaN(id)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid ID parameter'
      });
    }

    // Check if record exists
    const [existing] = await pool.query('SELECT * FROM projects WHERE id = ?', [id]);
    
    if (existing.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'Record not found'
      });
    }

    await pool.query('DELETE FROM projects WHERE id = ?', [id]);

    res.status(200).json({
      success: true,
      message: 'Record deleted successfully',
      data: {
        id: parseInt(id)
      }
    });
  } catch (error) {
    console.error('Error in delete:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};

const getallProject = async (req, res) => {
  try {
    const [rows] = await pool.query('SELECT * FROM projects');
    res.json(rows);
  } catch (error) {
    console.error('Error in getall:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
}
// PROJECT END 




module.exports = { createHeroSection, getHeroSection, createAboutUs, createAboutUsImage, createMissionImage, createMission, getAboutUs, getAboutUsImage, getMission, createTeam, getAllTeam, deleteTeam, createGallery, deleteGalleryImage, getGallery,createBlog, getallBlog, deleteBlog, editBlog, getAllClientMessage, deleteClientMessage, createClientMessage,   createFaq,
  getAllFaqs,
  updateFaq,
  deleteFaq,other, getAllOther, createHeroImage, getallHeroImage, deleteHeroImage, deleteAboutUsImage, getMissionImages, deleteMissionImage, getBlogById,
createProject, deleteProject, getallProject, updateProject };
