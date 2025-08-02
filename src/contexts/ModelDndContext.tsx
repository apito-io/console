import React, { createContext, useContext } from "react";
import type { ReactNode } from "react";
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
} from "@dnd-kit/core";
import type {
  DragEndEvent,
  DragStartEvent,
  DragOverEvent,
  UniqueIdentifier,
} from "@dnd-kit/core";
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import {
  restrictToVerticalAxis,
  restrictToWindowEdges,
} from "@dnd-kit/modifiers";
import type {
  ModelField,
  ModelConnection,
  SortableItemData,
} from "../types/model";

interface ModelDndContextType {
  isDragging: boolean;
  activeId: UniqueIdentifier | null;
  onDragStart: (event: DragStartEvent) => void;
  onDragOver: (event: DragOverEvent) => void;
  onDragEnd: (event: DragEndEvent) => void;
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
  onFieldMove?: (field: ModelField, fromIndex: number, toIndex: number) => void;
  onRelationMove?: (
    relation: ModelConnection,
    fromIndex: number,
    toIndex: number
  ) => void;
}

export const ModelDndProvider: React.FC<ModelDndProviderProps> = ({
  children,
  onFieldMove,
  onRelationMove,
}) => {
  const [activeId, setActiveId] = React.useState<UniqueIdentifier | null>(null);
  const [isDragging, setIsDragging] = React.useState(false);

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 8,
      },
    }),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  const onDragStart = React.useCallback((event: DragStartEvent) => {
    setActiveId(event.active.id);
    setIsDragging(true);
  }, []);

  const onDragOver = React.useCallback(() => {
    // Handle drag over logic if needed
  }, []);

  const onDragEnd = React.useCallback(
    (event: DragEndEvent) => {
      const { active, over } = event;

      setActiveId(null);
      setIsDragging(false);

      if (!over || active.id === over.id) {
        return;
      }

      const activeData = active.data.current as SortableItemData | undefined;
      const overData = over.data.current as SortableItemData | undefined;

      if (!activeData || !overData) {
        return;
      }

      // Handle field reordering
      if (activeData.type === "field" && overData.type === "field") {
        const activeField = activeData.item as ModelField;
        const overField = overData.item as ModelField;

        if (onFieldMove) {
          onFieldMove(activeField, activeField.serial, overField.serial);
        }
      }

      // Handle relation reordering
      if (activeData.type === "relation" && overData.type === "relation") {
        const activeRelation = activeData.item as ModelConnection;
        // Relations don't have serial numbers, so we handle them differently
        if (onRelationMove) {
          onRelationMove(activeRelation, 0, 0);
        }
      }
    },
    [onFieldMove, onRelationMove]
  );

  const reorderFields = React.useCallback(
    (
      fields: ModelField[],
      activeId: UniqueIdentifier,
      overId: UniqueIdentifier
    ): ModelField[] => {
      const activeIndex = fields.findIndex((field) => field.id === activeId);
      const overIndex = fields.findIndex((field) => field.id === overId);

      if (activeIndex === -1 || overIndex === -1) {
        return fields;
      }

      const reorderedFields = arrayMove(fields, activeIndex, overIndex);

      // Update serial numbers
      return reorderedFields.map((field, index) => ({
        ...field,
        serial: index + 1,
      }));
    },
    []
  );

  const reorderRelations = React.useCallback(
    (
      relations: ModelConnection[],
      activeId: UniqueIdentifier,
      overId: UniqueIdentifier
    ): ModelConnection[] => {
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
    []
  );

  const contextValue: ModelDndContextType = {
    isDragging,
    activeId,
    onDragStart,
    onDragOver,
    onDragEnd,
    reorderFields,
    reorderRelations,
  };

  return (
    <ModelDndContext.Provider value={contextValue}>
      <DndContext
        sensors={sensors}
        collisionDetection={closestCenter}
        onDragStart={onDragStart}
        onDragOver={onDragOver}
        onDragEnd={onDragEnd}
        modifiers={[restrictToVerticalAxis, restrictToWindowEdges]}
      >
        {children}
      </DndContext>
    </ModelDndContext.Provider>
  );
};

// Sortable container for fields
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

// Sortable container for relations
interface SortableRelationContainerProps {
  relations: ModelConnection[];
  children: ReactNode;
}

export const SortableRelationContainer: React.FC<
  SortableRelationContainerProps
> = ({ relations, children }) => {
  const relationIds = relations.map((relation) => relation.id);

  return (
    <SortableContext items={relationIds} strategy={verticalListSortingStrategy}>
      {children}
    </SortableContext>
  );
};
