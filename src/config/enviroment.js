import { config } from "dotenv";

const SetConfigPath = async () => {
  if (process.env.NODE_ENV === "prod") return config();

  const configFile = `./.env.${process.env.NODE_ENV}`;

  config({ path: configFile });
};

export default SetConfigPath;
