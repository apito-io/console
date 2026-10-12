import { jsx as _jsx } from "react/jsx-runtime";
import { createContext, useContext } from "react";
import { arrayMove, SortableContext, verticalListSortingStrategy, } from "@dnd-kit/sortable";
const ModelDndContext = createContext(undefined);
export const useModelDnd = () => {
    const context = useContext(ModelDndContext);
    if (!context) {
        throw new Error("useModelDnd must be used within a ModelDndProvider");
    }
    return context;
};
/** App-level shim — ModelPage owns its DndContext to avoid nested global drag contexts. */
export const ModelDndProvider = ({ children, }) => {
    const contextValue = {
        isDragging: false,
        activeId: null,
        reorderFields: (fields, activeId, overId) => {
            const activeIndex = fields.findIndex((field) => field.id === activeId);
            const overIndex = fields.findIndex((field) => field.id === overId);
            if (activeIndex === -1 || overIndex === -1) {
                return fields;
            }
            const reorderedFields = arrayMove(fields, activeIndex, overIndex);
            return reorderedFields.map((field, index) => ({
                ...field,
                serial: index + 1,
            }));
        },
        reorderRelations: (relations, activeId, overId) => {
            const activeIndex = relations.findIndex((relation) => relation.id === activeId);
            const overIndex = relations.findIndex((relation) => relation.id === overId);
            if (activeIndex === -1 || overIndex === -1) {
                return relations;
            }
            return arrayMove(relations, activeIndex, overIndex);
        },
    };
    return (_jsx(ModelDndContext.Provider, { value: contextValue, children: children }));
};
export const SortableFieldContainer = ({ fields, children, }) => {
    const fieldIds = fields.map((field) => field.id);
    return (_jsx(SortableContext, { items: fieldIds, strategy: verticalListSortingStrategy, children: children }));
};
export const SortableRelationContainer = ({ relations, children }) => {
    const relationIds = relations.map((relation) => `relation:${relation.id ?? relation.known_as ?? ""}`);
    return (_jsx(SortableContext, { items: relationIds, strategy: verticalListSortingStrategy, children: children }));
};
