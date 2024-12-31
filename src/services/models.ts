import  api from "./api";
import { ModelData } from "@/lib/types/models";

// Define types for request and response
interface ModelMetrics {
    mse?: number;
    rmse?: number;
    mae?: number;
    r2_score?: number;
    accuracy?: number;
    precision?: number;
    recall?: number;
    f1_score?: number;
    confusion_matrix?: number[][];
    classification_report?: string;
}

interface TrainModelResponse {
    model_path: string;
    metrics: ModelMetrics;
    feature_names: string[];
    is_regression: boolean;
}

// Define parameters interface for the function
interface TrainModelParams {
    projectId: string | number;
    selectedModel: string;
    targetColumn: string;
    parameters?: Record<string, any>;
    testSize?: number;
    scaleFeatures?: boolean;
}

export const trainModel = async ({
    projectId,
    selectedModel,
    targetColumn,
    parameters,
    testSize = 0.2,
    scaleFeatures = true
}: TrainModelParams): Promise<TrainModelResponse> => {
    try {
        // Convert parameters to query string format
        const queryParams = new URLSearchParams({
            project_id: typeof projectId === 'string' ? projectId : projectId.toString(),
            algorithm: selectedModel,
            target_column: targetColumn,
            test_size: testSize.toString(),
            scale_features: scaleFeatures.toString()
        });

        // Add hyperparameters if they exist
        if (parameters) {
            queryParams.append('hyperparameters', JSON.stringify(parameters));
        }

        const response = await api.post<TrainModelResponse>(
            `/ml/train?${queryParams.toString()}`
        );
        
        if (response.status !== 200) {
            throw new Error('Failed to train model');
        }

        return response.data;
    } catch (error) {
        if (error instanceof Error) {
            console.error('Error training model:', error.message);
        } else {
            console.error('Unknown error training model:', error);
        }
        throw error;
    }
};


// get the lates model by project id
export const getModel = async (projectId: string | number): Promise<ModelData> => {
    try {
        const response = await api.get<ModelData>(`/models/latest/project/${projectId}`);
        return response.data;
    } catch (error) {
        if (error instanceof Error) {
            console.error('Error fetching model:', error.message);
        } else {
            console.error('Unknown error fetching model:', error);
        }
        throw error;
    }
};

// download the model pkl file by model id 
export const downloadModel = async (modelId: string | number): Promise<void> => {
    try {
        const response = await api.get(`/models/download/${modelId}`, { responseType: 'blob' });
        const url = window.URL.createObjectURL(new Blob([response.data]));
        const link = document.createElement('a');
        link.href = url;
        link.setAttribute('download', `model_${modelId}.pkl`);
        document.body.appendChild(link);
        link.click();
        link.remove();
    } catch (error) {
        if (error instanceof Error) {
            console.error('Error downloading model:', error.message);
        } else {
            console.error('Unknown error downloading model:', error);
        }
        throw error;
    }
};
