Prop Hell in SolidJS

## The Problem

Splitting components into their own files can lead to passing props into components just to pass them through to another component.

```tsx
// Hell
interface CellProps {
  appCell: number;
  appRow: number;
  appTable: number;
  index: number;
  rowIndex: number;
  tableIndex: number;
  hoverCell: (tableIndex: number, rowIndex: number, index: number) => void;
  hoverReset: () => void;
}

function Cell(props: CellProps) {
  const onPointerOver = () => props.hoverCell(props.tableIndex, props.rowIndex, props.index);
  const onPointerOut = () => props.hoverReset();
  const isPointerOver = () =>
    props.appTable === props.tableIndex &&
    props.appRow === props.rowIndex &&
    props.appCell === props.index;
}
```

```tsx
// Not so much
interface CellProps {
  index: number;
}

function Cell(props: CellProps) {
  const [app, { hoverCell, hoverReset }] = useApp();
  const [table] = useTable();
  const [row] = useRow();
  const onPointerOver = () => hoverCell(table.index, row.index, props.index);
  const onPointerOut = () => hoverReset();
  const isPointerOver = () =>
    app.table === table.index &&
    app.row === row.index &&
    app.cell === props.index;
}
```

## The Solution

Every component becomes a provider of its own props.

See [https://playground.solidjs.com/anonymous/d01fe654-be0d-405c-8bab-2ea72b87996a](https://playground.solidjs.com/anonymous/fd57cf0a-cc0a-477d-b8d7-6bd720fb2e39)
