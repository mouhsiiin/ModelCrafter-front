import api from "./api";


export const craftData = async (file: any): Promise<JSON> => {
    const response = await api.post("/auto/train", {
      method: 'POST',
      body: file
      });
    return response.data;
};