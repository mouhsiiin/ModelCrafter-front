export interface ModelData {
  id: number;
  algorithm_name: string;
  performance_metrics: PerformanceMetrics;
  model_path: string;
  dataset_id: number;
  feature_names: string[];
  target_column: string;
  created_at: string;
}


export interface PerformanceMetrics {
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

