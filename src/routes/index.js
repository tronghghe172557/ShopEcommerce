const express = require("express");

const router = express.Router();

// ở đâu phải router.use
router.use('/v1/api', require('./access/index'))
// router.get("/", (req, res) => {
//   const strCompress = "Hello Trong";

//   return res.status(200).json({
//     message: `Wellcome Trong`,
//     metadata: strCompress.repeat(10000),
//   });
// });

module.exports = router;
