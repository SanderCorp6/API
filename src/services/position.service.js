const Position = require("../models/position.model");

class PositionService {
  static async getAll() {
    const positions = await Position.getAll();
    return positions;
  }
}

module.exports = PositionService;
