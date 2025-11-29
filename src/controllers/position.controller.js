const PositionService = require("../services/position.service");

const getPositions = async (req, res) => {
  const positions = await PositionService.getAll();
  res.status(200).json({ positions });
};

module.exports = { getPositions };
