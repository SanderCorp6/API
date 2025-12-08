const HTTP_STATUS = require("../utils/httpStatus");
const PositionService = require("../services/position.service");

const getPositions = async (req, res) => {
  const positions = await PositionService.getAll();
  res.status(HTTP_STATUS.OK).json({ positions });
};

module.exports = { getPositions };
