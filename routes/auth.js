// const express = require("express");
// const upload = require('../config/multer');
// const { signup, login } = require("../controller/authController");
// const verifyToken = require("../middleware/verifyToken");
// const pptxgen = require("pptxgenjs");
// const  OpenAIApi = require("openai");
// const router = express.Router();

// const User = require("../models/User"); 

// router.post('/signup', upload.single('image'), signup);
// const openai = new OpenAIApi({key:process.env.OPENAI_API_KEY})


// router.post("/login", login);


// router.get("/me", verifyToken, async (req, res) => {
//   try {
//     console.log("Decoded user:", req.user); // Debugging
//     const user = await User.findById(req.user.userId).select("name email profession image");
//     console.log(user); 
//     if (!user) {
//       return res.status(404).json({ message: "User not found" });
//     }
//     res.json(user);
//   } catch (error) {
//     console.error("Error in /me route:", error); // Debugging
//     res.status(500).json({ message: "Server error" });
//   }
// });

// // Route to update name and/or profession
// router.put("/update", verifyToken, async (req, res) => {
//   try {
//     const { name, profession } = req.body;

//     // Validation: Check if both fields are not empty (either name or profession can be updated)
//     if (!name && !profession) {
//       return res.status(400).json({ message: "At least one of 'name' or 'profession' is required" });
//     }

//     // Update user data (name and/or profession)
//     const updateData = {};
//     if (name) updateData.name = name;
//     if (profession) updateData.profession = profession;

//     const user = await User.findByIdAndUpdate(
//       req.user.userId, // Use the user ID from the verified token
//       updateData,
//       { new: true } // Return the updated user object
//     );

//     if (!user) {
//       return res.status(404).json({ message: "User not found" });
//     }

//     res.json({
//       message: "User updated successfully",
//       name: user.name,
//       profession: user.profession,
//     });
//   } catch (error) {
//     console.error("Error updating user:", error);
//     res.status(500).json({ message: "Server error" });
//   }
// });

// router.post("/generate-ppt", async (req, res) => {
//   const { topic, points } = req.body;

//   try {
//     // Validate input
//     if (!topic || !points || points.length === 0) {
//       return res.status(400).json({ message: "Topic and points are required" });
//     }

//     // Generate content using OpenAI
//     const openaiResponse = await openai.createChatCompletion({
//       model: "gpt-3.5-turbo",
//       messages: [
//         { role: "system", content: "You are an assistant creating PPT slides." },
//         {
//           role: "user",
//           content: `Generate slide content for a presentation on the topic: "${topic}". Points: ${points.join(
//             ", "
//           )}. Provide concise bullet points for each slide.`,
//         },
//       ],
//     });

//     const generatedContent = openaiResponse.data.choices[0].message.content;

//     // Parse the generated content into slides
//     const slides = generatedContent.split("\n\n").map((slideContent) => slideContent.split("\n"));

//     // Create a new PPT
//     const pptx = new pptxgen();

//     // Add a title slide
//     pptx.addSlide().addText(topic, { x: 1, y: 1, fontSize: 32, bold: true });

//     // Add content slides
//     slides.forEach((slide, index) => {
//       const slideContent = slide.filter((line) => line.trim());
//       const pptSlide = pptx.addSlide();
//       pptSlide.addText(`Slide ${index + 1}`, { x: 0.5, y: 0.5, fontSize: 24 });
//       slideContent.forEach((line, idx) => {
//         pptSlide.addText(line, { x: 0.5, y: 1.5 + idx * 0.5, fontSize: 18 });
//       });
//     });

//     // Save the PPT to a buffer
//     const buffer = await pptx.write("arraybuffer");

//     // Send the buffer as a response
//     res.setHeader("Content-Disposition", `attachment; filename=${topic}.pptx`);
//     res.setHeader("Content-Type", "application/vnd.openxmlformats-officedocument.presentationml.presentation");
//     res.send(Buffer.from(buffer));
//   } catch (error) {
//     console.error("Error generating PPT:", error.message);
//     res.status(500).json({ message: "Failed to generate PPT" });
//   }
// });


// module.exports = router;
const express = require("express");
const upload = require('../config/multer');
const { signup, login } = require("../controller/authController");
const verifyToken = require("../middleware/verifyToken");
const pptxgen = require("pptxgenjs");
const { OpenAI } = require("openai"); // Correct import
const router = express.Router();

const User = require("../models/User");

router.post('/signup', upload.single('image'), signup);

// Correct way to initialize OpenAI API with API key
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

router.post("/login", login);

router.get("/me", verifyToken, async (req, res) => {
  try {
    console.log("Decoded user:", req.user); // Debugging
    const user = await User.findById(req.user.userId).select("name email profession image");
    console.log(user);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    res.json(user);
  } catch (error) {
    console.error("Error in /me route:", error); // Debugging
    res.status(500).json({ message: "Server error" });
  }
});

// Route to update name and/or profession
router.put("/update", verifyToken, async (req, res) => {
  try {
    const { name, profession } = req.body;

    // Validation: Check if both fields are not empty (either name or profession can be updated)
    if (!name && !profession) {
      return res.status(400).json({ message: "At least one of 'name' or 'profession' is required" });
    }

    // Update user data (name and/or profession)
    const updateData = {};
    if (name) updateData.name = name;
    if (profession) updateData.profession = profession;

    const user = await User.findByIdAndUpdate(
      req.user.userId, // Use the user ID from the verified token
      updateData,
      { new: true } // Return the updated user object
    );

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    res.json({
      message: "User updated successfully",
      name: user.name,
      profession: user.profession,
    });
  } catch (error) {
    console.error("Error updating user:", error);
    res.status(500).json({ message: "Server error" });
  }
});

router.post("/generate-ppt", async (req, res) => {
  const { topic, points } = req.body;

  try {
    // Validate input
    if (!topic || !points || points.length === 0) {
      return res.status(400).json({ message: "Topic and points are required" });
    }

    // Generate content using OpenAI
    const openaiResponse = await openai.chat.completions.create({
      model: "gpt-3.5-turbo", // or use "gpt-4" if you have access
      messages: [
        { role: "system", content: "You are an assistant creating PPT slides." },
        {
          role: "user",
          content: `Generate slide content for a presentation on the topic: "${topic}". Points: ${points.join(
            ", "
          )}. Provide concise bullet points for each slide.`,
        },
      ],
    });

    const generatedContent = openaiResponse.choices[0].message.content;

    // Parse the generated content into slides
    const slides = generatedContent.split("\n\n").map((slideContent) => slideContent.split("\n"));

    // Create a new PPT
    const pptx = new pptxgen();

    // Add a title slide
    pptx.addSlide().addText(topic, { x: 1, y: 1, fontSize: 32, bold: true });

    // Add content slides
    slides.forEach((slide, index) => {
      const slideContent = slide.filter((line) => line.trim());
      const pptSlide = pptx.addSlide();
      pptSlide.addText(`Slide ${index + 1}`, { x: 0.5, y: 0.5, fontSize: 24 });
      slideContent.forEach((line, idx) => {
        pptSlide.addText(line, { x: 0.5, y: 1.5 + idx * 0.5, fontSize: 18 });
      });
    });

    // Save the PPT to a buffer
    const buffer = await pptx.write("arraybuffer");

    // Send the buffer as a response
    res.setHeader("Content-Disposition", `attachment; filename=${topic}.pptx`);
    res.setHeader("Content-Type", "application/vnd.openxmlformats-officedocument.presentationml.presentation");
    res.send(Buffer.from(buffer));

  } catch (error) {
    console.error("Error generating PPT:", error.message);
    res.status(500).json({ message: "Failed to generate PPT" });
  }
});

module.exports = router;
