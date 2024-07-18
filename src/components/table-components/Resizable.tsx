import React, { useState, useCallback } from "react";
import { Button, Table } from "antd";
import { Resizable, ResizeCallbackData } from "react-resizable";
interface ResizableTitleProps {
  onResize: (
    e: React.SyntheticEvent<Element>,
    data: ResizeCallbackData
  ) => void;
  width: number;
  [key: string]: any;
}

const ResizableTitle: React.FC<ResizableTitleProps> = (props) => {
  const { onResize, width, ...restProps } = props;

  if (!width) {
    return <th {...restProps} />;
  }

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
      onResize={onResize}
      draggableOpts={{ enableUserSelectHack: false }}
    >
      <th {...restProps} />
    </Resizable>
  );
};

export default ResizableTitle;
