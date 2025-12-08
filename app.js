const express = require("express");
const cors = require("cors");
require("dotenv").config();

const authRouter = require("./src/routes/auth.routes");
const employeeRouter = require("./src/routes/employee.routes");
const vacationRouter = require("./src/routes/vacation.routes");
const departmentRouter = require("./src/routes/department.routes");
const positionRouter = require("./src/routes/position.routes");
const AppError = require("./src/utils/AppError");
const HTTP_STATUS = require("./src/utils/httpStatus");
const { globalErrorHandler } = require("./src/middleware/error.middleware");

const app = express();

app.use(cors());
app.use(express.json());

app.use("/auth", authRouter);
app.use("/employees", employeeRouter);
app.use("/vacations", vacationRouter);
app.use("/departments", departmentRouter);
app.use("/positions", positionRouter);

app.get("/", (req, res) => {
  res.send("Welcome to RRHH API");
});

app.use((req, res, next) => {
  next(new AppError(`Cannot find ${req.originalUrl} in this server.`, HTTP_STATUS.NOT_FOUND));
});
app.use(globalErrorHandler);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running -> http://localhost:${PORT}`);
});
