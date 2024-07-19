import { UniqueIdentifier } from "@dnd-kit/core";
import { useSortable } from "@dnd-kit/sortable";
import { createContext, useContext } from "react";
import { CSS } from "@dnd-kit/utilities";

interface HeaderCellProps extends React.HTMLAttributes<HTMLTableCellElement> {
  id: string;
}

const TableHeaderCell: React.FC<HeaderCellProps> = (props) => {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({
    id: props.id,
  });
  const dndKitLessonStyle = {
    transform: CSS.Translate.toString(transform),
    transition,
    cursor: "move",
    opacity: isDragging ? 0.5 : undefined,
    border: isDragging ? "1px solid #fdfeff" : undefined,
  };
  const bgHeader = isDragging ? { backgroundColor: "gray", opacity: 0.5 } : {};
  return (
    <th
      {...props}
      ref={setNodeRef}
      style={{ ...dndKitLessonStyle, ...bgHeader }}
      {...attributes}
      {...listeners}
    />
  );
};
export default TableHeaderCell;
