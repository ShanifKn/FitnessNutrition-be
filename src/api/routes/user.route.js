import { tryCatch } from "../../utils/index.js";

const UserRouter = (app) => {
  // @route   GET /
  // @des     For health check
  // @access  Public
  app.get(
    "",
    tryCatch(async (req, res) => {
      return res.status(200).json("Running");
    })
  );
};

export default UserRouter;
