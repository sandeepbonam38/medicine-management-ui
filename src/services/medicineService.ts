import axiosClient from "../api/axiosClient";
import { Medicine } from "../models/Medicine"; 

export const getMedicines = async (): Promise<Medicine[]> => {
  try {
    const { data } = await axiosClient.get<Medicine[]>("/medicines");

    if (!Array.isArray(data)) return [];

    return data;
  } catch (error) {
    console.error("Error fetching medicines:", error);
    return [];
  }
};