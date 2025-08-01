Prop Hell

## The Problem

Splitting components into their own files can lead to passing props into components just to pass them through to another component.

```tsx
// Hell
interface CellProps {
  tableIndex: number;
  rowIndex: number;
  index: number;
  hoverCell: (tableIndex: number, rowIndex: number, index: number) => void;
  hoverReset: () => void;
}

function Cell(props: CellProps) {
  const onPointerOver = () => props.hoverCell(props.tableIndex, props.rowIndex, props.index);
  const onPointerOut = () => props.hoverReset();
}
```

```tsx
// Not so much
interface CellProps {
  index: number;
}

function Cell(props: CellProps) {
  const [, { hoverCell, hoverReset }] = useApp();
  const [table] = useTable();
  const [row] = useRow();
  const onPointerOver = () => hoverCell(table.index, row.index, props.index);
  const onPointerOut = () => hoverReset();
}
```

## The Solution

Every component becomes a provider of its own props.

See https://playground.solidjs.com/anonymous/d01fe654-be0d-405c-8bab-2ea72b87996a
