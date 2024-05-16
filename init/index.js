const mongoose = require("mongoose");
let initData = require("./data.js");
const listing = require("../models/listings.js");

let MOngo_url = "mongodb://127.0.0.1:27017/land";

main()
  .then((res) => {
    console.log("connected successfully");
  })
  .catch((err) => {
    console.log(err);
  });

async function main() {
  await mongoose.connect(MOngo_url);
}

async function inidatabase() {
  await listing.deleteMany({});
  initData.data = initData.data.map((obj) => ({
    ...obj,
    owner: "66138ca3a88ca1846605ebb7",
  }));
  await listing.insertMany(initData.data);
  console.log("data was initialized");
}
inidatabase();
