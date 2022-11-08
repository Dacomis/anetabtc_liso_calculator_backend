const { config } = require("dotenv");

config();

if (!process.env.PORT) {
  process.env.PORT = 3001;
}

if (!process.env.BLOCK_FROST_API_KEY) {
  throw new Error("No good api key");
}

function get(name) {
  return process.env[name];
}

exports.get = get;
