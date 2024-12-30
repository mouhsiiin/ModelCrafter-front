import api from "./api";


export const getChartBar = async (file: any): Promise<JSON> => {
    const response = await api.post("/auto/train", file, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
    return response.data;
};