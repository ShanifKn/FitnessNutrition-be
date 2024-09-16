import { connect } from "mongoose";
import { DB_URL } from "../config/index.js";
import { logger } from "../utils/index.js";

const DatabaseConnection = async () => {
  try {
    await connect(DB_URL);

    logger.info("Database connected");
  } catch (error) {
    logger.error("MongoDbErrorFitnessUser " + error);
  }
};

export default DatabaseConnection;
