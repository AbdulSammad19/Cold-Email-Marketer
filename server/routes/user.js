const express = require("express");

const router = express.Router();

// import signup controller
const { requireSignin, adminMiddleware } = require("../controllers/auth");
const { read, update } = require("../controllers/user");

router.get("/user/:id", requireSignin, read);
router.put("/user/update", requireSignin, update);
router.put("/admin/update", requireSignin, adminMiddleware, update);

//   console.log("Error nay tung kiya hai");
// });

module.exports = router;
