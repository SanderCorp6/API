const HTTP_STATUS = require("../utils/httpStatus");
const OpeningService = require("../services/opening.service");

const createOpening = async (req, res) => {
  const openingData = req.body;
  const newOpening = await OpeningService.createOpening(openingData);

  res.status(HTTP_STATUS.CREATED).json({
    message: "Opening created successfully!",
    opening: newOpening,
  });
};

const getAllOpenings = async (req, res) => {
  const filters = req.query;
  const openings = await OpeningService.getAllOpenings(filters);

  res.status(HTTP_STATUS.OK).json({ openings });
};

const getOpeningById = async (req, res) => {
  const { id } = req.params;
  const opening = await OpeningService.getOpeningById(id);

  res.status(HTTP_STATUS.OK).json({ opening });
};

const updateOpening = async (req, res) => {
  const { id } = req.params;
  const updates = req.body;

  const updatedOpening = await OpeningService.updateOpening(id, updates);

  res.status(HTTP_STATUS.OK).json({
    message: "Opening updated successfully",
    opening: updatedOpening,
  });
};

const deleteOpening = async (req, res) => {
  const { id } = req.params;
  await OpeningService.deleteOpening(id);

  res.status(HTTP_STATUS.OK).json({
    message: "Opening deleted successfully",
  });
};

module.exports = {
  createOpening,
  getAllOpenings,
  getOpeningById,
  updateOpening,
  deleteOpening,
};
