import React, { createContext, useContext, type Reducer } from "react";

export interface ContentState {
  target: string;
  single_page?: boolean;
  single_page_uuid?: string;
  has_connections?: boolean;
  is_tenant_model?: boolean;
  enable_revision?: boolean;
}

export interface ContentAction {
  type: "SET_TARGET";
  payload: {
    target: string;
    single_page?: boolean;
    single_page_uuid?: string;
    has_connections?: boolean;
    is_tenant_model?: boolean;
    is_common_model?: boolean;
    enable_revision?: boolean;
  };
}

export interface ContentContextType {
  state: ContentState;
  dispatch: React.Dispatch<ContentAction>;
}

// const initialState: ContentState = { // Commented out unused initialState
//   target: "",
//   single_page: false,
//   single_page_uuid: "",
//   has_connections: false,
//   is_tenant_model: false,
//   enable_revision: false,
// };

export const ContentReducer: Reducer<ContentState, ContentAction> = (
  state,
  action
) => {
  switch (action.type) {
    case "SET_TARGET":
      return {
        ...state,
        target: action.payload.target,
        single_page: action.payload.single_page || false,
        single_page_uuid: action.payload.single_page_uuid || "",
        has_connections: action.payload.has_connections || false,
        is_tenant_model: action.payload.is_tenant_model || false,
        is_common_model: action.payload.is_common_model || false,
        enable_revision: action.payload.enable_revision || false,
      };
    default:
      return state;
  }
};

export const ContentContext = createContext<ContentContextType | undefined>(
  undefined
);

export const useContentContext = () => {
  const context = useContext(ContentContext);
  if (context === undefined) {
    throw new Error("useContentContext must be used within a ContentProvider");
  }
  return context;
};

// ContentProvider component
interface ContentProviderProps {
  children: React.ReactNode;
}

export const ContentProvider: React.FC<ContentProviderProps> = ({
  children,
}) => {
  const [state, dispatch] = React.useReducer(ContentReducer, {
    target: "",
    single_page: false,
    single_page_uuid: "",
    has_connections: false,
    is_tenant_model: false,
    is_common_model: false,
    enable_revision: false,
  });

  return (
    <ContentContext.Provider value={{ state, dispatch }}>
      {children}
    </ContentContext.Provider>
  );
};
