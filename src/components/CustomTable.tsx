import { Switch, Table, TableColumnProps, TableColumnsType } from "antd";
import React, { createContext, useCallback, useContext, useState } from "react";
import { DataType, data } from "../configs/data";
import type {
  DragEndEvent,
  DragOverEvent,
  UniqueIdentifier,
} from "@dnd-kit/core";
import {
  closestCenter,
  DndContext,
  DragOverlay,
  PointerSensor,
  useSensor,
  useSensors,
} from "@dnd-kit/core";
import { restrictToHorizontalAxis } from "@dnd-kit/modifiers";
import {
  arrayMove,
  horizontalListSortingStrategy,
  SortableContext,
  useSortable,
} from "@dnd-kit/sortable";
import { ResizeCallbackData } from "react-resizable";
import ResizableTitle from "./table-components/Resizable";
import TableBodyCell, {
  DragIndexContext,
  DragIndexState,
} from "./table-components/TableBodyCell";
import TableHeaderCell from "./table-components/TableHeaderCell";
const baseColumns: TableColumnsType<DataType> = [
  {
    title: "Full Name",
    width: 100,
    dataIndex: "name",
    key: "name",
    fixed: "left",
  },
  {
    title: "Age",
    width: 100,
    dataIndex: "age",
    key: "age",
    fixed: "left",
  },
  {
    title: "Column 1",
    dataIndex: "address",
    key: "1",
    width: 150,
  },
  {
    title: "Column 2",
    dataIndex: "address",
    key: "2",
    width: 150,
  },
  {
    title: "Column 3",
    dataIndex: "address",
    key: "3",
    width: 150,
  },
  {
    title: "Column 4",
    dataIndex: "address",
    key: "4",
    width: 150,
  },
  {
    title: "Column 5",
    dataIndex: "address",
    key: "5",
    width: 150,
  },
  {
    title: "Column 6",
    dataIndex: "address",
    key: "6",
    width: 150,
  },
  {
    title: "Column 7",
    dataIndex: "address",
    key: "7",
    width: 150,
  },
  { title: "Column 8", dataIndex: "address", key: "8" },
  {
    title: "Action",
    key: "operation",
    fixed: "right",
    width: 100,
    render: () => <a>action</a>,
  },
];

const CustomTable = () => {
  const [fixedTop, setFixedTop] = useState(false);
  const [columns, setColumns] = useState(() =>
    baseColumns.map((column, i) => ({
      ...column,
      key: `${i}`,
      onHeaderCell: () => ({ id: `${i}` }),
      onCell: () => ({ id: `${i}` }),
    }))
  );
  const [dragIndex, setDragIndex] = useState<DragIndexState>({
    active: -1,
    over: -1,
  });
  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        // https://docs.dndkit.com/api-documentation/sensors/pointer#activation-constraints
        distance: 1,
      },
    })
  );

  const onDragEnd = ({ active, over }: DragEndEvent) => {
    if (active.id !== over?.id) {
      setColumns((prevState) => {
        const activeIndex = prevState.findIndex((i) => i.key === active?.id);
        const overIndex = prevState.findIndex((i) => i.key === over?.id);
        return arrayMove(prevState, activeIndex, overIndex);
      });
    }
    setDragIndex({ active: -1, over: -1 });
  };

  const onDragOver = ({ active, over }: DragOverEvent) => {
    const activeIndex = columns.findIndex((i) => i.key === active.id);
    const overIndex = columns.findIndex((i) => i.key === over?.id);
    setDragIndex({
      active: active.id,
      over: over?.id,
      direction: overIndex > activeIndex ? "right" : "left",
    });
  };

  //resizing
  const handleResize = useCallback(
    (index: number) =>
      (e: React.SyntheticEvent<Element>, { size }: ResizeCallbackData) => {
        setColumns((prevColumns) => {
          const nextColumns = [...prevColumns];
          nextColumns[index] = {
            ...nextColumns[index],
            width: size.width,
          };
          return nextColumns;
        });
      },
    []
  );

  const components = {
    header: {
      cell: ResizableTitle,
    },
  };

  const modifiedColumns = columns.map((col, index) => ({
    ...col,
    onHeaderCell: (column: TableColumnProps<DataType>) => ({
      width: column.width,
      onResize: handleResize(index),
    }),
  }));
  return (
    <DndContext
      sensors={sensors}
      modifiers={[restrictToHorizontalAxis]}
      onDragEnd={onDragEnd}
      onDragOver={onDragOver}
      collisionDetection={closestCenter}
    >
      <SortableContext
        items={columns.map((i) => i.key)}
        strategy={horizontalListSortingStrategy}
      >
        <DragIndexContext.Provider value={dragIndex}>
          <Table
            components={{
              header: { cell: TableHeaderCell },
              body: { cell: TableBodyCell },
            }}
            columns={columns}
            dataSource={data}
            scroll={{ x: 1500 }}
            summary={() => (
              <Table.Summary fixed={fixedTop ? "top" : "bottom"}>
                <Table.Summary.Row>
                  <Table.Summary.Cell index={0} colSpan={2}>
                    <Switch
                      checkedChildren="Fixed Top"
                      unCheckedChildren="Fixed Top"
                      checked={fixedTop}
                      onChange={() => {
                        setFixedTop(!fixedTop);
                      }}
                    />
                  </Table.Summary.Cell>
                  <Table.Summary.Cell index={2} colSpan={8}>
                    Scroll Context
                  </Table.Summary.Cell>
                  <Table.Summary.Cell index={10}>Fix Right</Table.Summary.Cell>
                </Table.Summary.Row>
              </Table.Summary>
            )}
            // antd site header height
            sticky={{ offsetHeader: 64 }}
          />
        </DragIndexContext.Provider>
      </SortableContext>
      <DragOverlay>
        <th style={{ backgroundColor: "gray", padding: 16 }}>
          {
            columns[columns.findIndex((i) => i.key === dragIndex.active)]
              ?.title as React.ReactNode
          }
        </th>
      </DragOverlay>
    </DndContext>
  );
};

export default CustomTable;
