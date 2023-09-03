const nfts = require("../Model/nftSchema");

exports.nftPost = async (req, res) => {
  const { title, price, description, ipfsHash, ownerAddress, sellerAddress } =
    req.body;
  if (
    title ||
    price ||
    description ||
    ipfsHash ||
    ownerAddress ||
    sellerAddress ||
    active
  ) {
    res.status(400).json({ error: "All fields are required" });
  }

  try {
    // const preUser = await users.findOne({ walletAddress: walletAddress });
    const nftData = new nfts({
      title,
      price,
      description,
      ipfsHash,
      ownerAddress,
      sellerAddress,
    });
    await nftData.save();
    res.status(200).json(nftData);
  } catch (err) {
    res.status(400).json({ error: err });
    console.log("catch block error" + err);
  }
};

exports.getSingleNft = async (req, res) => {
  const { id } = req.params;
  try {
    const singleNft = await users.findOne({
      _id: id,
    });
    res.status(200).json(singleNft);
  } catch (error) {
    res.status(400).json({ error: error });
    console.log("catch block error" + error);
  }
};

exports.getOwnersNft = async (req, res) => {
  const { ownerAddress } = req.params;
  try {
    const ownersNfts = await users.findOne({
      ownerAddress: ownerAddress,
    });
    res.status(200).json(ownersNfts);
  } catch (error) {
    res.status(400).json({ error: error });
    console.log("catch block error" + error);
  }
};

exports.getAllNfts = async (req, res) => {
  const { sellerAddress } = req.params;
  try {
    const ownersNfts = await users.findOne({
      ownerAddress: ownerAddress,
    });
    res.status(200).json(ownersNfts);
  } catch (error) {
    res.status(400).json({ error: error });
    console.log("catch block error" + error);
  }
};
