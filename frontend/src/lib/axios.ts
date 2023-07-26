import {
  PUBLIC_PASSMAN_HAS_HTTPS,
  PUBLIC_PASSMAN_SERVER_BASE_URL,
} from "$env/static/public";
import axios from "axios";

const useHttps = PUBLIC_PASSMAN_HAS_HTTPS === "true";
const passmanAxios = axios.create({
  baseURL: (useHttps ? "https://" : "http://") + PUBLIC_PASSMAN_SERVER_BASE_URL,
  headers: {
    "Content-Type": "application/json",
    Accept: "application/json",
  },
});

export { passmanAxios };
