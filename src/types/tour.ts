export interface TourStep {
    id: string;
    title: string;
    description: string;
    target: string;
    placement?: 'top' | 'bottom' | 'left' | 'right' | 'topLeft' | 'topRight' | 'bottomLeft' | 'bottomRight' | 'leftTop' | 'leftBottom' | 'rightTop' | 'rightBottom';
    nextButtonProps?: {
        children?: React.ReactNode;
    };
    prevButtonProps?: {
        children?: React.ReactNode;
    };
}

export interface TourProgress {
    currentStep: number;
    totalSteps: number;
    completedSteps: string[];
    isCompleted: boolean;
}

export interface ProjectCompletionStatus {
    hasModel: boolean;
    modelHasFields: boolean;
    modelHasContent: boolean;
    hasRunQuery: boolean;
}

export interface TourContextType {
    isTourActive: boolean;
    isTourModalVisible: boolean;
    tourProgress: TourProgress;
    projectStatus: ProjectCompletionStatus;
    startTour: () => void;
    endTour: () => void;
    closeTourModal: () => void;
    showTourModal: () => void;
    nextStep: () => void;
    prevStep: () => void;
    skipTour: () => void;
    checkProjectStatus: () => Promise<void>;
    shouldShowTour: boolean;
}
