const mongoose = require("mongoose");
const validator = require("validator");

const nftSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
  },
  price: {
    type: Number,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  ipfsHash: {
    type: String,
    required: true,
  },
  ownerAddress: {
    type: String,
    required: true,
  },
  sellerAddress: {
    type: String,
    required: true,
  },
});

const nfts = new mongoose.model("nfts", nftSchema);
module.exports(nfts);
