const hello = async (req, res) => {
  return res.status(200).json({ msg: "Welcome to Helpify API" });
};

module.exports = {
  hello,
};
