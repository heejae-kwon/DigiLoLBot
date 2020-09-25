import path from "path";
import dotenv from "dotenv";

if (process.env.NODE_ENV === "production") {
  dotenv.config({ path: path.join(__dirname, "../.env.production") });
} else if (process.env.NODE_ENV === "develop") {
  dotenv.config({ path: path.join(__dirname, "../.env.develop") });
} else {
  throw new Error("process.env.NODE_ENV를 설정하지 않았습니다!");
}

export default {
  prefix: "dlb",
  token: process.env.TOKEN,
  server: process.env.SERVER,
};
