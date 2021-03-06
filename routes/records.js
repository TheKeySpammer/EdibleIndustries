var express = require("express");
const middleware = require("../modules/middleware");
const utility = require("../modules/utility");
var router = express.Router();

/* GET home page. */
router.get("/", middleware.auth.loggedIn(), function (req, res, next) {
  if (!utility.misc.checkPermission(req, res)) return;

  var data = {
    dependencies: [
      "lib/anime.min.js",
      "lib/nepali-date-converter.umd.js",
      "lib/chart.min.js",
      "analytics/analytics.js",
    ],
  };
  var flash_message = req.flash("flash_message");
  var flash_color = req.flash("flash_color");
  if (flash_message.length !== 0 && flash_color.length !== 0) {
    data.flash_message = flash_message;
    data.flash_color = flash_color;
  }

  res.render("reports/index", data);
});

module.exports = router;
