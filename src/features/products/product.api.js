import { axiosInstance } from "../../config/axios";

export const getProducts = async() => {
  try {
    const resJson = await axiosInstance.get("/products")
    return resJson.data;
  } catch (error) {
    console.error("Error fetching products:", error);
    throw error; 
  }
}

export const getAddonByCategory = async(categoryId) => {
  try {
    const resJson = await axiosInstance.get(`/categories/${categoryId}/addons`)
    return resJson.data;
  } catch (error) {
    console.error("Error fetching addons:", error);
    throw error; 
  }
}

export const getGlobalAddons = async() => {
  try {
    const resJson = await axiosInstance.get("/addons/global")
    return resJson.data;
  } catch (error) {
    console.error("Error fetching global addons:", error);
    throw error; 
  }
}