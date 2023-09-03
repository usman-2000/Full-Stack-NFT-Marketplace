const express = require("express");
const router = express.Router();
const userController = require("../Controller/userController");
const nftController = require("../Controller/nftController");

router.post("/users/createuser", userController.userPost);
router.get("/users/getsingleuser/:walletAddress", userController.getSingleUser);

router.post("/nfts/createnft", nftController.nftPost);
router.get("/nfts/getsinglenft/:id", nftController.getSingleNft);
router.get("/nfts/getallnfts", nftController.getAllNfts);
router.get("/nfts/getownersnfts/:ownerAddress", nftController.getOwnersNft);
router.get("/nfts/getactivenfts/:active", nftController.getActiveNfts);
router.get("/nfts/getnftbytitle/:title", nftController.getNftsByTitle);

module.exports = router;
