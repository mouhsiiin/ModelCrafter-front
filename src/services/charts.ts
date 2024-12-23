import api from "./api";

// get base64 encoded chart image


export const getChartScatter = async (data: any): Promise<string> => {
    // dataset is x and y axis and optional hue axis as query params
    const response = await api.get<string>('/visualize/scatter', { params: data });
    return response.data;
};

export const getChartLine = async (data: {
    dataset_id: string,
    x_column: string,
    y_columns: string[]
  }): Promise<string> => {
      const params = new URLSearchParams();
      
      // Add dataset_id and x_column
      params.append('dataset_id', data.dataset_id.toString());
      params.append('x_column', data.x_column);
      
      // Add each y_column separately to create multiple y_columns parameters
      data.y_columns.forEach(column => {
          params.append('y_columns', column);
      });
  
      const response = await api.get<string>('/visualize/lineplot', { 
          params: params
      });
      return response.data;
  };

export const getChartBar = async (data: any): Promise<string> => {
    const response = await api.get<string>('/visualize/barplot', { params: data });
    return response.data;
};

export const getChartHistogram = async (data: any): Promise<string> => {
    const response = await api.get<string>('/visualize/histogram', { params: data });
    return response.data;
};

export const getChartBox = async (data: any): Promise<string> => {
    const response = await api.get<string>('/visualize/boxplot', { params: data });
    return response.data;
};

export const getChartHeatmap = async (data: any): Promise<string> => {
    const response = await api.get<string>('/visualize/heatmap', { params: data });
    return response.data;
};
