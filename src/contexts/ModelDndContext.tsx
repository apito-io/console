import React, { createContext, useContext } from "react";
import type { ReactNode } from "react";
import type { UniqueIdentifier } from "@dnd-kit/core";
import {
  arrayMove,
  SortableContext,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import type {
  ModelField,
  ModelConnection,
} from "../types/model";

interface ModelDndContextType {
  isDragging: boolean;
  activeId: UniqueIdentifier | null;
  reorderFields: (
    fields: ModelField[],
    activeId: UniqueIdentifier,
    overId: UniqueIdentifier
  ) => ModelField[];
  reorderRelations: (
    relations: ModelConnection[],
    activeId: UniqueIdentifier,
    overId: UniqueIdentifier
  ) => ModelConnection[];
}

const ModelDndContext = createContext<ModelDndContextType | undefined>(
  undefined
);

export const useModelDnd = (): ModelDndContextType => {
  const context = useContext(ModelDndContext);
  if (!context) {
    throw new Error("useModelDnd must be used within a ModelDndProvider");
  }
  return context;
};

interface ModelDndProviderProps {
  children: ReactNode;
}

/** App-level shim — ModelPage owns its DndContext to avoid nested global drag contexts. */
export const ModelDndProvider: React.FC<ModelDndProviderProps> = ({
  children,
}) => {
  const contextValue: ModelDndContextType = {
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
      const activeIndex = relations.findIndex(
        (relation) => relation.id === activeId
      );
      const overIndex = relations.findIndex(
        (relation) => relation.id === overId
      );

      if (activeIndex === -1 || overIndex === -1) {
        return relations;
      }

      return arrayMove(relations, activeIndex, overIndex);
    },
  };

  return (
    <ModelDndContext.Provider value={contextValue}>
      {children}
    </ModelDndContext.Provider>
  );
};

interface SortableFieldContainerProps {
  fields: ModelField[];
  children: ReactNode;
}

export const SortableFieldContainer: React.FC<SortableFieldContainerProps> = ({
  fields,
  children,
}) => {
  const fieldIds = fields.map((field) => field.id);

  return (
    <SortableContext items={fieldIds} strategy={verticalListSortingStrategy}>
      {children}
    </SortableContext>
  );
};

interface SortableRelationContainerProps {
  relations: ModelConnection[];
  children: ReactNode;
}

export const SortableRelationContainer: React.FC<
  SortableRelationContainerProps
> = ({ relations, children }) => {
  const relationIds = relations.map(
    (relation) => `relation:${relation.id ?? relation.known_as ?? ""}`
  );

  return (
    <SortableContext items={relationIds} strategy={verticalListSortingStrategy}>
      {children}
    </SortableContext>
  );
};
