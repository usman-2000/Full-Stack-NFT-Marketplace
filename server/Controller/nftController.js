const nfts = require("../Model/nftSchema");

exports.nftPost = async (req, res) => {
  const {
    title,
    price,
    description,
    ipfsHash,
    ownerAddress,
    contractAddress,
    sellerAddress,
    tokenId,
    active,
  } = req.body;
  if (
    !title ||
    !price ||
    !description ||
    !ipfsHash ||
    !ownerAddress ||
    !contractAddress ||
    !sellerAddress ||
    !tokenId ||
    !active
  ) {
    return res.status(400).json({ error: "All fields are required" });
  }

  try {
    // const preUser = await users.findOne({ walletAddress: walletAddress });
    const nftData = new nfts({
      title,
      price,
      description,
      ipfsHash,
      ownerAddress,
      contractAddress,
      sellerAddress,
      tokenId,
      active,
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
    const singleNft = await nfts.findOne({
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
    const ownersNfts = await nfts.find({
      ownerAddress: ownerAddress,
    });
    res.status(200).json(ownersNfts);
  } catch (error) {
    res.status(400).json({ error: error });
    console.log("catch block error" + error);
  }
};

exports.getAllNfts = async (req, res) => {
  try {
    const allNfts = await nfts.find();
    res.status(200).json(allNfts);
  } catch (error) {
    res.status(400).json({ error: error });
    console.log("catch block error" + error);
  }
};

exports.getActiveNfts = async (req, res) => {
  const { active } = req.params;
  try {
    const activeNfts = await nfts.find({ active: active });
    res.status(200).json(activeNfts);
  } catch (error) {
    res.status(400).json({ error: error });
    console.log("catch block error" + error);
  }
};

exports.getNftsByTitle = async (req, res) => {
  const { title } = req.params;

  try {
    const nftsByName = await nfts.find({ title: title.trim() });
    res.status(200).json(nftsByName);
  } catch (error) {
    res.status(400).json({ error: error });
    console.log("catch block error" + error);
  }
};

exports.updateNftDetails = async (req, res) => {
  const { id } = req.params;
  const { ownerAddress, active } = req.body;
  try {
    const updateNft = await nfts.findByIdAndUpdate(id, req.body, {
      new: true,
    });
    res.status(200).json(updateNft);
  } catch (error) {
    res.status(400).json({ error: error });
    console.log("catch block error" + error);
  }
};
