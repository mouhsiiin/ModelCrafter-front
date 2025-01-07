import api from "./api";
import { Dataset } from '@/lib/types/dataset';


// get the project dataset by id if it exists
export const getProjectDatasets = async (projectId: string | undefined): Promise<Dataset[]> => {
    if (!projectId) {
        return [];
    }
    const response = await api.get<Dataset[]>(`/datasets/project/${projectId}`);
    return response.data;
};

export const getUsersDatasets = async (): Promise<Dataset[]> => {
    const response = await api.get<Dataset[]>('/datasets/mydatasets');
    return response.data;
}


// get the dataset by id
export const getDataset = async (datasetId: string): Promise<Dataset> => {
    const response = await api.get<Dataset>(`/datasets/${datasetId}`);
    return response.data;
};

export const downloadDataset = async (datasetId: string): Promise<File> => {
    const response = await api.get(`/datasets/${datasetId}/download`, {
        responseType: 'blob',
    });

    // Extract the content disposition header to get the filename
    const contentDisposition = response.headers['content-disposition'];
    let filename = 'dataset.csv'; // Default filename

    if (contentDisposition) {
        const matches = contentDisposition.match(/filename="(.+)"/);
        if (matches && matches[1]) {
            filename = matches[1]; // Extract filename from the header
        }
    }

    // Create the blob from the response data
    const blob = new Blob([response.data], { type: response.headers['content-type'] });

    // Return a new File with the correct filename
    return new File([blob], filename);
};

// get all datasets
export const getDatasets = async (): Promise<Dataset[]> => {
    const response = await api.get<Dataset[]>('/datasets');
    return response.data;
};


// delete the dataset by id
export const deleteDataset = async (datasetId: string): Promise<void> => {
    await api.delete(`/datasets/${datasetId}`);
};

// Create a new dataset
export const createDataset = async (projectId: string, file: File): Promise<Dataset> => {
    const formData = new FormData();
    formData.append('file', file); // Append file
    const response = await api.post<Dataset>('/datasets/upload', formData, {
        params: { project_id: projectId },
        headers: { 'Content-Type': 'multipart/form-data' }, // Explicitly set header
    });
    return response.data;
};

  

