// src/types/preprocessing.ts

// Core enums for preprocessing options
export enum MissingValuesHandling {
    REMOVE = "remove",
    MEAN = "mean",
    MEDIAN = "median",
    MODE = "mode",
    CONSTANT = "constant",
    INTERPOLATE = "interpolate",
    KNN = "knn",
  }
  
  export enum ScalingMethod {
    NONE = "none",
    MINMAX = "minmax",
    STANDARD = "standard",
    ROBUST = "robust",
    NORMALIZER = "normalizer",
    QUANTILE = "quantile",
    POWER = "power",
  }
  
  export enum DimensionalityReduction {
    NONE = "none",
    PCA = "pca",
    TSNE = "tsne",
    UMAP = "umap",
    LDA = "lda",
    TRUNCATEDSVD = "truncatedsvd",
  }
  
  export enum OutlierDetection {
    NONE = "none",
    ZSCORE = "zscore",
    IQR = "iqr",
    ISOLATION = "isolation",
    LOF = "lof",
  }
  
  export enum SamplingMethod {
    NONE = "none",
    RANDOM = "random",
    SYSTEMATIC = "systematic",
    STRATIFIED = "stratified",
    CLUSTER = "cluster",
  }
  
  export enum ValidationMethod {
    NONE = "none",
    KFOLD = "kfold",
    STRATIFIED = "stratified",
    TIMESERIES = "timeseries",
  }
  
  export enum DataSplitRatio {
    SEVENTY_THIRTY = "70-30",
    EIGHTY_TWENTY = "80-20",
    NINETY_TEN = "90-10",
    CUSTOM = "custom",
  }
  
  // Data structures
  export interface DatasetStats {
    rows: number;
    columns: number;
    missingValues: number;
    duplicates: number;
  }
  
  export interface PreprocessingOptions {
    missing_values_handling: MissingValuesHandling | "";
    constant_value: string;
    handling_duplicates: boolean;
    scaling_method: ScalingMethod | "";
    dimensionality_reduction: DimensionalityReduction | "";
    n_components: number;
    outlier_detection: OutlierDetection | "";
    outlier_threshold: number;
    sampling_method: SamplingMethod | "";
    sampling_ratio: number;
    data_split: DataSplitRatio | "";
    custom_split_ratio: number;
    validation_method: ValidationMethod | "";
    feature_engineering: string[];
    time_series_handling: string;
    text_preprocessing: string[];
  }
  
  // Component props
  export interface DataPreparationSectionProps {
    datasetStats?: DatasetStats;
    onPreprocessingChange?: (options: PreprocessingOptions) => void;
  }