import { jsx as _jsx } from "react/jsx-runtime";
import React, { createContext, useContext } from "react";
// const initialState: ContentState = { // Commented out unused initialState
//   target: "",
//   single_page: false,
//   single_page_uuid: "",
//   has_connections: false,
//   enable_revision: false,
// };
export const ContentReducer = (state, action) => {
    switch (action.type) {
        case "SET_TARGET":
            return {
                ...state,
                target: action.payload.target,
                single_page: action.payload.single_page || false,
                single_page_uuid: action.payload.single_page_uuid || "",
                has_connections: action.payload.has_connections || false,
                enable_revision: action.payload.enable_revision || false,
            };
        default:
            return state;
    }
};
export const ContentContext = createContext(undefined);
export const useContentContext = () => {
    const context = useContext(ContentContext);
    if (context === undefined) {
        throw new Error("useContentContext must be used within a ContentProvider");
    }
    return context;
};
export const ContentProvider = ({ children, }) => {
    const [state, dispatch] = React.useReducer(ContentReducer, {
        target: "",
        single_page: false,
        single_page_uuid: "",
        has_connections: false,
        enable_revision: false,
    });
    return (_jsx(ContentContext.Provider, { value: { state, dispatch }, children: children }));
};
