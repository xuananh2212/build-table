// import React, { useState, useCallback } from "react";
// import { Button, Table } from "antd";
// import { Resizable, ResizeCallbackData } from "react-resizable";
// interface ResizableTitleProps {
//   onResize: (
//     e: React.SyntheticEvent<Element>,
//     data: ResizeCallbackData
//   ) => void;
//   width: number;
//   [key: string]: any;
// }

// const ResizableTitle: React.FC<ResizableTitleProps> = (props) => {
//   const { onResize, width, ...restProps } = props;

//   if (!width) {
//     return <th {...restProps} />;
//   }

//   return (
//     <Resizable
//       width={width}
//       height={0}
//       handle={
//         <span
//           className="react-resizable-handle"
//           onClick={(e) => {
//             e.stopPropagation();
//           }}
//         />
//       }
//       onResize={onResize}
//       draggableOpts={{ enableUserSelectHack: false }}
//     >
//       <th {...restProps} />
//     </Resizable>
//   );
// };

// export default ResizableTitle;

import React, { useState, useCallback, createContext, useContext } from "react";
import { Table } from "antd";
import { Resizable, ResizeCallbackData } from "react-resizable";
import { UniqueIdentifier } from "@dnd-kit/core";
import { useSortable } from "@dnd-kit/sortable";

// Context for managing drag index state
interface DragIndexState {
  active: UniqueIdentifier;
  over: UniqueIdentifier | undefined;
  direction?: "left" | "right";
}

const DragIndexContext = createContext<DragIndexState>({
  active: -1,
  over: -1,
});

// Helper function to apply drag styles
const dragActiveStyle = (dragState: DragIndexState, id: string) => {
  const { active, over, direction } = dragState;
  let style: React.CSSProperties = {};
  if (active && active === id) {
    style = { backgroundColor: "gray", opacity: 0.5 };
  } else if (over && id === over && active !== over) {
    style =
      direction === "right"
        ? { borderRight: "1px dashed gray" }
        : { borderLeft: "1px dashed gray" };
  }
  return style;
};

// Combined component
interface ResizableDraggableTitleProps {
  id: string;
  onResize: (
    e: React.SyntheticEvent<Element>,
    data: ResizeCallbackData
  ) => void;
  width: number;
  isResizing: boolean;
  setIsResizing: React.Dispatch<React.SetStateAction<boolean>>;
  [key: string]: any;
}

const ResizableDraggableTitle: React.FC<ResizableDraggableTitleProps> = (
  props
) => {
  const {
    onResize,
    width,
    id,
    style,
    isResizing,
    setIsResizing,
    ...restProps
  } = props;
  const dragState = useContext(DragIndexContext);
  const { attributes, listeners, setNodeRef, isDragging } = useSortable({
    id,
    disabled: isResizing,
  });

  const combinedStyle: React.CSSProperties = {
    ...style,
    cursor: "move",
    ...(isDragging
      ? { position: "relative", zIndex: 9999, userSelect: "none" }
      : {}),
    ...dragActiveStyle(dragState, id),
  };

  return (
    <Resizable
      width={width}
      height={0}
      handle={
        <span
          className="react-resizable-handle"
          onClick={(e) => {
            e.stopPropagation();
          }}
        />
      }
      onResizeStart={() => setIsResizing(true)}
      onResize={onResize}
      onResizeStop={() => setIsResizing(false)}
      draggableOpts={{ enableUserSelectHack: false }}
    >
      <th
        {...restProps}
        ref={setNodeRef}
        style={combinedStyle}
        {...attributes}
        {...listeners}
      />
    </Resizable>
  );
};

export default ResizableDraggableTitle;
