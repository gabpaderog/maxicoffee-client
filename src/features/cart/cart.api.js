import { axiosInstance } from "../../config/axios";

export const getDiscount = async() => {
  try {
    const resJson = await axiosInstance.get("/discounts")
    return resJson.data;
  } catch (error) {
    console.error("Error fetching discounts:", error);
    throw error; 
  }
}

export const postOrder = async(order) => {
  try {
    const resJson = await axiosInstance.post("/orders", order)
    return resJson.data;
  } catch (error) {
    console.error("Error posting order:", error);
    throw error; 
  }
}