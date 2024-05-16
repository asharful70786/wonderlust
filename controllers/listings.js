const listing = require("../models/listings.js");

const mbxgeocoding = require('@mapbox/mapbox-sdk/services/geocoding');//service require
const mapToken = process.env.MAPBOX_API;

const geocodingClient = mbxgeocoding({ accessToken: mapToken }); //send req - which will give responce


module.exports.index = async (req, res) => {
  let alllisting = await listing.find({});
  res.render("./listings/index.ejs", { alllisting });
};

module.exports.renderNeweForm = (req, res) => {
  res.render("listings/addnew.ejs");
};

module.exports.addListing = async (req, res, next) => {

   let responce = await geocodingClient.forwardGeocode({
    query: req.body.listing.location,
    limit: 1
  })
    .send();
   

   

  let url = req.file.path;
  let filename = req.file.filename;
  const newlisting = new listing(req.body.listing);
  newlisting.owner = req.user._id;
  newlisting.image = { url, filename };
  let finatset = newlisting.geometry = responce.body.features[0].geometry;
  await newlisting.save();
  console.log(newlisting);
  req.flash("success", "new listing saved!");
  res.redirect("/listings");
};

module.exports.showRoute = async (req, res, next) => {
  try {
    let { id } = req.params;
    const information = await listing
      .findById(id)
      .populate({ path: "reviews", populate: { path: "author" } })
      .populate("owner");

    if (!information) {
      req.flash("error", "This item does not exist.");
      return res.redirect("/listings");
    }

    res.render("./listings/details.ejs", { data: information });
  } catch (err) {
    next(err);
  }
};

module.exports.editRoute = async (req, res) => {
  let { id } = req.params;
  let information = await listing.findById(id, {});
  if (!information) {
    req.flash("error", "this item is not exist invalid!");
    res.redirect("/listings");
  }
  res.render("./listings/edit.ejs", { data: information});
};

module.exports.updateRoute = async (req, res) => {
  let { id } = req.params;
  let newlisting = await listing.findByIdAndUpdate(id, { ...req.body.listing });

  if (req.file) { //if not any image not uploud 
    let url = req.file.path;
    let filename = req.file.filename;
    newlisting.image = { url, filename };
    await newlisting.save();
  }
  req.flash("success", "successfully updated!");
  if (!listing) {
    req.flash("error", "this item is not exist , invalid!");
  }
  res.redirect(`/listings/${id}`);
};

module.exports.destroyRoute = async (req, res) => {
  let { id } = req.params;
  let deleteditm = await listing.findByIdAndDelete(id);
  req.flash("success", "successfully deleted!");
  console.log(deleteditm);
  res.redirect("/listings");
};
