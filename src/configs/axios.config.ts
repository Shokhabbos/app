import axios from "axios";
import { BASE_URL } from "@/constants/baseUrl";

export const customAxios = axios.create({
  baseURL: BASE_URL,
});
