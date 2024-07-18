import { TableColumnsType } from "antd";

export interface DataType {
  key: React.Key;
  name: string;
  age: number;
  address: string;
  children?: DataType[]; // Optional children key
  render?: (text: string) => React.ReactNode;
  width?: number;
  onHeaderCell?: (column: DataType) => {
    width: number;
    onResize: (
      e: React.SyntheticEvent<Element>,
      data: { size: { width: number } }
    ) => void;
  };
  [key: string]: any;
}

export const data: DataType[] = [];
for (let i = 0; i < 100; i++) {
  data.push({
    key: i,
    name: `Edward ${i}`,
    age: 32,
    address: `London Park no. ${i}`,
    children: [
      {
        key: `${i}-1`,
        name: `Edward ${i}-1`,
        age: 16,
        address: `London Park no. ${i} - Child 1`,
      },
      {
        key: `${i}-2`,
        name: `Edward ${i}-2`,
        age: 18,
        address: `London Park no. ${i} - Child 2`,
      },
    ],
  });
}
