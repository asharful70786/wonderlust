const express = require("express");
const router = express.Router();
const wrapAsync = require("../utils/wrapAsync.js");
const { isloggedin, isOwner, validatelisting } = require("../middleware.js");
const listingController = require("../controllers/listings.js");

const multer  = require('multer');
const { storage } = require("../cloudconfig.js");
const upload = multer({ storage});

// "/"
router.route("/")
  .get(wrapAsync(listingController.index))
  .post(
    isloggedin,
    upload.single("listing[image]"),//multer  middleware
    validatelisting,
    wrapAsync(listingController.addListing)
  );

// "/new"
router.get("/new", isloggedin, listingController.renderNeweForm);

// "/:id"
router.route("/:id")
  .get(isloggedin, wrapAsync(listingController.showRoute))
  .put(
    isloggedin,
    isOwner,
    upload.single("listing[image]"),
    validatelisting,
    wrapAsync(listingController.updateRoute)
  )
  .delete(
    isloggedin,
    isOwner,
    wrapAsync(listingController.destroyRoute)
  );

// "/:id/edit"
router.get("/:id/edit", isloggedin, isOwner, wrapAsync(listingController.editRoute));

module.exports = router;
