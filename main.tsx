/**
 * README.md
 *
 * ## The Problem
 *
 * Splitting components into their own files can lead to passing props into components just to pass them through to another component.
 *
 * ```tsx
 * // Hell
 * interface CellProps {
 *   tableIndex: number;
 *   rowIndex: number;
 *   index: number;
 *   hoverCell: (tableIndex: number, rowIndex: number, index: number) => void;
 *   hoverReset: () => void;
 * }
 *
 * function Cell(props: CellProps) {
 *   const onPointerOver = () => props.hoverCell(props.tableIndex, props.rowIndex, props.index);
 *   const onPointerOut = () => props.hoverReset();
 * }
 * ```
 *
 * ```tsx
 * // Not so much
 * interface CellProps {
 *   index: number;
 * }
 *
 * function Cell(props: CellProps) {
 *   const [, { hoverCell, hoverReset }] = useApp();
 *   const [table] = useTable();
 *   const [row] = useRow();
 *   const onPointerOver = () => hoverCell(table.index, row.index, props.index);
 *   const onPointerOut = () => hoverReset();
 * }
 * ```
 *
 * ## The Solution
 *
 * Every component becomes a provider of its own props.
 *
 * See below:
 */

import { render } from "solid-js/web";
import { createContext, useContext, For } from "solid-js";
import { createStore, produce } from "solid-js/store";

// Data

import data from "./data";

interface TableSchema {
  name: string;
  rows: RowSchema[];
}

interface RowSchema {
  name: string;
  cells: CellSchema[];
}

interface CellSchema {
  name: string;
}

// App

interface AppContextState {
  table: number;
  row: number;
  cell: number;
}

interface AppContextActions {
  hoverCell: (table: number, row: number, index: number) => void;
  hoverReset: () => void;
}

const AppContext = createContext<[AppContextState, AppContextActions]>();
const useApp = () => useContext(AppContext)!;

function App() {
  // AppProps to provide
  const [app, setApp] = createStore({ table: -1, row: -1, cell: -1 });
  const [tables] = createStore<TableSchema[]>([...data]);
  const actions = {
    hoverCell(table: number, row: number, cell: number) {
      setApp(
        produce((app) => {
          app.table = table;
          app.row = row;
          app.cell = cell;
        }),
      );
    },
    hoverReset() {
      setApp(
        produce((app) => {
          app.table = -1;
          app.row = -1;
          app.cell = -1;
        }),
      );
    },
  };

  return (
    <AppContext.Provider value={[app, actions]}>
      <For each={tables}>
        {(table, index) => <Table index={index()} {...table} />}
      </For>
    </AppContext.Provider>
  );
}

// Table

interface TableProps {
  index: number;
}

const TableContext = createContext<[TableProps & TableSchema]>();
const useTable = () => useContext(TableContext)!;

function Table(props: TableProps & TableSchema) {
  return (
    <TableContext.Provider value={[props]}>
      <div
        style={{
          border: "1px solid black",
          display: "grid",
          gap: "0.5rem",
          "grid-template-columns": "repeat(3, 1fr)",
          margin: "0.5rem",
          padding: "0.5rem",
        }}
      >
        <For each={props.rows}>
          {(row, index) => <Row index={index()} {...row} />}
        </For>
      </div>
    </TableContext.Provider>
  );
}

// Row

interface RowProps {
  index: number;
}

const RowContext = createContext<[RowProps & RowSchema]>();
const useRow = () => useContext(RowContext)!;

function Row(props: RowProps & RowSchema) {
  return (
    <RowContext.Provider value={[props]}>
      <For each={props.cells}>
        {(cell, index) => <Cell index={index()} {...cell} />}
      </For>
    </RowContext.Provider>
  );
}

// Cell

interface CellProps {
  index: number;
}

function Cell(props: CellProps & CellSchema) {
  const [app, { hoverCell, hoverReset }] = useApp();
  const [table] = useTable();
  const [row] = useRow();
  const onPointerOver = () => hoverCell(table.index, row.index, props.index);
  const onPointerOut = () => hoverReset();
  const background = () =>
    app.table === table.index &&
    app.row === row.index &&
    app.cell === props.index
      ? "skyblue"
      : "none";
  return (
    <div
      onPointerOver={onPointerOver}
      onPointerOut={onPointerOut}
      style={{
        border: "1px solid black",
        padding: "0.5rem",
        background: background(),
      }}
    >
      <div>Table: {table.name}</div>
      <div>Row: {row.name}</div>
      <div>Cell: {props.name}</div>
    </div>
  );
}

render(() => <App />, document.getElementById("app")!);
