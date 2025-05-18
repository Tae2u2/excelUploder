import React, { useMemo, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { ArrowDownNarrowWide, Download, Table2 } from "lucide-react";

import { Dropdown } from "./Dropdown";
import { commaizeNumber } from "../utils/number";
import { configTable, configTableAll } from "../../slice/reducer";

interface TableContainerProps {
  columns: TableDataColumn[];
  data: { [key: string]: any }[];
  visibleRows?: string[];
  configKey?: string;
  tableClassName?: string;
  divClassName?: string;
  thClassName?: string;
  trClassName?: string;
  tableClass?: string;
  tdClassName?: string;
  theadClassName?: string;
  tbodyClassName?: string;
  isPerPageData?: boolean;
  perPageData?: number;
  isPagination?: boolean;
  PaginationClassName?: string;
  pageDataClassName?: string;
  totalCount?: number;
  onClickRow?: (row: any) => void;
  onDoubleClickRow?: (row: any) => void;
  highlightRow?: (row: any) => void;
  onClickExcel?: () => void;
  children?: React.ReactNode;
  spaceHeight?: string;
  isHiddenPerPage?: boolean;
  initFilterList?: string[];
  isHiddenTotalCount?: boolean;
  isMobile?: boolean;
  mobileTdDivClassName?: string;
  isFilterable?: boolean;
}

const TableContainer = ({
  columns,
  data,
  visibleRows,
  configKey,
  divClassName = "overflow-x-auto scroll-design overflow-y-hidden",
  tableClassName = "w-full whitespace-nowrap",
  theadClassName = "ltr:text-left rtl:text-right bg-slate-100 dark:bg-zinc-600",
  thClassName = "px-3.5 py-2.5 font-semibold border-b border-slate-200 dark:border-zinc-500 text-center",
  tdClassName = "px-3.5 py-3 border-y border-slate-200 dark:border-zinc-500",
  pageDataClassName = "flex items-center gap-y-4 gap-x-2 mb-2",
  PaginationClassName = "flex flex-col items-center gap-4 mt-4 md:flex-row ",
  trClassName = "",
  tbodyClassName = "",
  isPerPageData,
  isPagination,
  perPageData = 10,
  totalCount,
  onClickRow,
  spaceHeight = "h-[38px]",
  // isHiddenPerPage = false,
  isHiddenTotalCount = false,
  onDoubleClickRow,
  highlightRow,
  initFilterList = [],
  onClickExcel,
  // onClickSelect,
  // onClickSelectAll,
  isFilterable = false,
  isMobile = false,
  mobileTdDivClassName,
  children,
}: TableContainerProps) => {
  const dispatch = useDispatch<any>();

  const [filters, setFilters] = useState<{ [key: string]: any[] }>({});
  const [filterDropdowns, setFilterDropdowns] = useState<{
    [key: string]: boolean;
  }>({});

  const selectConfigTableState = useSelector(
    (state: any) => state.Config.table
  );

  const table = useMemo(() => {
    const baseProps = { columns, data, filters };

    if (configKey) {
      return new TableContainerState({
        ...baseProps,
        visibleRows: selectConfigTableState[configKey] || [],
        dispatch,
        configKey,
      });
    }

    return new TableContainerState(baseProps);
  }, [columns, data, filters, dispatch, configKey]);

  //웹환경에서도 마우스로 테이블 화면 이동이 가능하게 하는 코드
  const tableRef = useRef<HTMLDivElement>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [startX, setStartX] = useState(0);
  const [scrollLeft, setScrollLeft] = useState(0);
  const [startY, setStartY] = useState(0);
  const [scrollTop, setScrollTop] = useState(0);

  const handleMouseDown = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!tableRef.current) return;

    setIsDragging(true);
    setStartX(e.pageX - tableRef.current.offsetLeft);
    setScrollLeft(tableRef.current.scrollLeft);
    setStartY(e.pageY - tableRef.current.offsetTop);
    setScrollTop(tableRef.current.scrollTop);
  };

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!isDragging || !tableRef.current) return;

    e.preventDefault();
    const x = e.pageX - tableRef.current.offsetLeft;
    const y = e.pageY - tableRef.current.offsetTop;
    const walkX = (x - startX) * -1; // 이동 거리
    const walkY = (y - startY) * -1;

    tableRef.current.scrollLeft = scrollLeft + walkX;
    tableRef.current.scrollTop = scrollTop + walkY;
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  //필터링 관련코드
  const handleFilterChange = (columnId: string, selectedOptions: any) => {
    setFilters((prevFilters) => ({
      ...prevFilters,
      [columnId]: selectedOptions,
    }));
  };
  const toggleFilterOption = (columnId: string, value: any) => {
    setFilters((prevFilters) => {
      const currentFilters = prevFilters[columnId] || [];
      if (currentFilters.includes(value)) {
        return {
          ...prevFilters,
          [columnId]: currentFilters.filter((v: any) => v !== value),
        };
      } else {
        return {
          ...prevFilters,
          [columnId]: [...currentFilters, value],
        };
      }
    });
  };

  const toggleFilterDropdown = (columnId: string) => {
    if (columnId !== "index") {
      setFilterDropdowns((prevDropdowns) => ({
        [columnId]: !prevDropdowns[columnId],
      }));
    }
  };

  interface SortState {
    sortId: string;
    sortType: "asc" | "desc" | "";
  }

  const [sortState, setSortState] = useState<SortState>({
    sortId: "",
    sortType: "",
  });

  const toggleSort = (header: { id: string; header: string }) => {
    const sortTypeList: SortState["sortType"][] = ["asc", "desc", ""];
    setSortState((prevState) => {
      const nextSortIndex =
        (sortTypeList.indexOf(prevState.sortType) + 1) % sortTypeList.length;
      const newSortType =
        prevState.sortId === header.id ? sortTypeList[nextSortIndex] : "asc";
      const newSortId = newSortType === "" ? "" : header.id;

      return { sortId: newSortId, sortType: newSortType };
    });
  };

  const DEFAULT_PAGE = 1;
  const DEFAULT_PAGE_SIZE = perPageData;

  const [filterSearch, setFilterSearch] = useState("");
  const onChangeFilterSearch = (e: any) => {
    setFilterSearch(e.target.value);
  };

  return (
    <React.Fragment>
      <div className={`${pageDataClassName} relative`}>
        {totalCount != undefined && (
          <ResultInfo
            totalCount={commaizeNumber(totalCount)}
            isHiddenTotalCount={isHiddenTotalCount}
          />
        )}
        {children}
        {onClickExcel && (
          <button
            type="button"
            className="button-basic-green"
            onClick={onClickExcel}
          >
            {isMobile ? null : <Download className="inline-block size-4" />}
            <span className="hidden align-middle sm:inline-block">Excel</span>
          </button>
        )}
        {configKey && (
          <TableColumnVisibility
            table={table}
            columns={visibleRows}
            setColumns={visibleRows}
          />
        )}
      </div>

      <div
        ref={tableRef}
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onMouseLeave={handleMouseUp}
        className={divClassName}
      >
        {isMobile ? (
          <table className={tableClassName}>
            <tbody className={tbodyClassName}>
              {table.getVisibleRows().map((row, rowIndex) => (
                <TableRow
                  key={`row-${rowIndex}`}
                  row={row}
                  rowIndex={rowIndex}
                  tdClassName={tdClassName}
                  trClassName={trClassName}
                  onClickRow={onClickRow}
                  onDoubleClickRow={onDoubleClickRow}
                  highlightRow={highlightRow}
                  isMobile={isMobile}
                  mobileTdDivClassName={mobileTdDivClassName}
                />
              ))}
            </tbody>
          </table>
        ) : (
          <table className={tableClassName}>
            <TableHeader
              headers={table.getVisibleHeaders()}
              sortState={sortState}
              initFilterList={initFilterList}
              toggleSort={toggleSort}
              theadClassName={theadClassName}
              thClassName={thClassName}
              trClassName={trClassName}
              handleFilterChange={handleFilterChange}
              filters={filters}
              isFilterable={isFilterable}
              data={data}
              toggleFilterOption={toggleFilterOption}
              toggleFilterDropdown={toggleFilterDropdown}
              filterDropdowns={filterDropdowns}
              filterSearch={filterSearch}
              onChangeFilterSearch={onChangeFilterSearch}
            />
            <tbody className={tbodyClassName}>
              {table.getVisibleRows().map((row, rowIndex) => (
                <TableRow
                  key={`row-${rowIndex}`}
                  row={row}
                  rowIndex={rowIndex}
                  tdClassName={tdClassName}
                  trClassName={trClassName}
                  onClickRow={onClickRow}
                  onDoubleClickRow={onDoubleClickRow}
                  highlightRow={highlightRow}
                />
              ))}
            </tbody>
          </table>
        )}
      </div>
    </React.Fragment>
  );
};

export default TableContainer;

interface TableDataColumn {
  header: any;
  accessorKey: string;
  enableSorting?: boolean;
  enableFiltering?: boolean;
  size?: number;
  cell?: (cell: {
    original: any;
    data?: string | number | any;
  }) => React.ReactNode;
}

interface TableCell {
  id: string;
  data: string | number | any;
  column: TableDataColumn[];
  original: TableContainerProps["data"][0];
}
class TableContainerState {
  columns: TableDataColumn[];
  data: TableContainerProps["data"];
  visibleRows?: string[] = [];
  dispatch?: any;
  configKey?: string;
  filters?: { [key: string]: any };

  constructor({
    columns,
    data,
    visibleRows,
    dispatch,
    configKey,
    filters,
  }: {
    columns: TableDataColumn[];
    data: TableContainerProps["data"];
    visibleRows?: string[];
    dispatch?: any;
    configKey?: string;
    filters?: { [key: string]: any };
  }) {
    this.columns = columns;
    this.data = data;
    this.visibleRows = visibleRows
      ? visibleRows
      : columns.map((col) => col.accessorKey);
    // this.visibleRows = visibleRows;
    this.dispatch = dispatch;
    this.configKey = configKey;
    this.filters = filters;
  }

  getHeaders() {
    return this.columns.map(
      ({
        header,
        accessorKey,
        size = "100%",
        enableSorting = true,
        enableFiltering = true,
      }) => {
        return {
          title: header,
          id: accessorKey,
          size,
          enableSorting,
          enableFiltering,
        };
      }
    );
  }

  getVisibleHeaders() {
    return this.getHeaders().filter((col) =>
      this.visibleRows?.includes(col.id)
    );
  }

  // getRows() {
  //   return this.data.map(dataRow =>
  //     this.columns.map(column => ({
  //       id: column.accessorKey,
  //       data: dataRow[column.accessorKey],
  //       column: this.columns,
  //       original: dataRow,
  //     }))
  //   );
  // }
  getRows() {
    return this.data
      .filter((dataRow) => {
        return Object.entries(this.filters || {}).every(
          ([columnId, filterValues]) =>
            filterValues.length === 0 ||
            filterValues.includes(dataRow[columnId]) ||
            filterValues.includes(null)
        );
      })
      .map((dataRow) =>
        this.columns.map((column) => ({
          id: column.accessorKey,
          data: dataRow[column.accessorKey],
          column: this.columns,
          original: dataRow,
        }))
      );
  }

  getVisibleRows() {
    return this.getRows().map(
      (row) =>
        row
          ?.filter((cell) => this.visibleRows?.includes(cell.id)) //
          ?.map((filteredCell) => this.getRenderedCell(filteredCell)) //
    );
  }

  private getRenderedCell(cell: TableCell) {
    const cellValue = cell.data;
    const customCell = cell.column.find(
      ({ accessorKey }) => accessorKey === cell.id
    )?.cell;
    const renderedCellData = customCell
      ? customCell({
          original: cell.original,
          data: cellValue,
        })
      : cellValue;

    return {
      id: cell.id,
      data: renderedCellData,
      original: [cell.original], // Update the type of 'original' property
    };
  }

  toggleColumnVisibility(accessorKey: string) {
    this.dispatch(
      configTable({ key: this.configKey, value: accessorKey } as any)
    );
    if (this.visibleRows?.includes(accessorKey)) {
      this.visibleRows = this.visibleRows?.filter((row) => row !== accessorKey);
    } else {
      this.visibleRows = [...(this.visibleRows || []), accessorKey];
    }
  }
  toggleColumnAllVisibility() {
    this.dispatch(
      configTableAll({
        key: this.configKey,
        value:
          this.visibleRows?.length === this.columns.length
            ? []
            : this.columns.map(({ accessorKey }) => accessorKey),
      } as any)
    );
    this.visibleRows =
      this.visibleRows?.length === this.columns.length
        ? []
        : this.columns.map(({ accessorKey }) => accessorKey);
  }
}

const ResultInfo = ({ totalCount, isHiddenTotalCount }: any) => {
  return (
    <div className={`grow ${isHiddenTotalCount && "hidden"}`}>
      <div className="text-slate-500 dark:text-zinc-200">
        <p>
          검색결과 <b>{totalCount}</b> 건
        </p>
      </div>
    </div>
  );
};

const PaginationInfo = ({ currentPage, totalCount, perPageData = 10 }: any) => {
  return (
    <div className="mb-4 grow md:mb-0">
      <div className="text-slate-500 dark:text-zinc-200 tracking-tighter">
        <b> {currentPage}</b> /{" "}
        <b> {Math.ceil(totalCount / (perPageData || 10))}</b>페이지
      </div>
    </div>
  );
};

const TableColumnVisibility = ({ table }: any) => {
  return (
    <Dropdown className="relative flex items-center">
      <Dropdown.Trigger
        type="button"
        className="inline-flex justify-center relative items-center p-0 text-topbar-item transition-all size-[37.5px] duration-200 ease-linear bg-topbar rounded-md dropdown-toggle btn hover:bg-topbar-item-bg-hover hover:text-topbar-item-hover group-data-[topbar=dark]:bg-topbar-dark group-data-[topbar=dark]:hover:bg-topbar-item-bg-hover-dark group-data-[topbar=dark]:hover:text-topbar-item-hover-dark group-data-[topbar=brand]:bg-topbar-brand group-data-[topbar=brand]:hover:bg-topbar-item-bg-hover-brand group-data-[topbar=brand]:hover:text-topbar-item-hover-brand group-data-[topbar=dark]:dark:bg-zinc-700 group-data-[topbar=dark]:dark:hover:bg-zinc-600 group-data-[topbar=brand]:text-topbar-item-brand group-data-[topbar=dark]:dark:hover:text-zinc-50 group-data-[topbar=dark]:dark:text-zinc-200 group-data-[topbar=dark]:text-topbar-item-dark"
        id="tableEditDropdown"
        data-bs-toggle="dropdown"
      >
        <Table2
          data-tooltip-id="tableEditDropdown"
          className="inline-block size-5 stroke-1 group-data-[topbar=dark]:fill-topbar-item-bg-hover-dark group-data-[topbar=brand]:fill-topbar-item-bg-hover-brand"
        />
      </Dropdown.Trigger>
      <Dropdown.Content
        placement="right-end"
        className="absolute z-50 ltr:text-left rtl:text-right bg-white rounded-md shadow-md !top-4 dropdown-menu min-w-[12rem] lg:min-w-[12rem] dark:bg-zinc-600"
        aria-labelledby="tableEditDropdown"
      >
        <div className="p-4 pb-0">
          <h6 className="text-16">테이블 편집</h6>
        </div>
        <div className="flex flex-col gap-1 py-2">
          <div
            className="flex items-center gap-2 px-4 cursor-pointer hover:bg-slate-50 dark:hover:bg-zinc-500"
            onClick={(e) => {
              e.preventDefault();
              table.toggleColumnAllVisibility();
            }}
          >
            <input
              id="table_columns_all"
              className="checkbox-basic"
              type="checkbox"
              checked={table.getHeaders().length === table.visibleRows.length}
              onChange={() => {}}
            />
            <label htmlFor="table_columns_all" className="align-middle">
              전체 선택
            </label>
          </div>
          {table.getHeaders().map((header: any) => (
            <div
              className="flex items-center gap-2 px-4 cursor-pointer hover:bg-slate-50 dark:hover:bg-zinc-500"
              key={header.id}
              onClick={(e) => {
                e.preventDefault();
                table.toggleColumnVisibility(header.id);
              }}
            >
              <input
                id={header.id}
                className="checkbox-basic"
                type="checkbox"
                checked={table.visibleRows.includes(header.id)}
                onChange={() => {}}
              />
              <label htmlFor={header.id} className="align-middle">
                {header.title}
              </label>
            </div>
          ))}
        </div>
      </Dropdown.Content>
    </Dropdown>
  );
};

interface TableHeaderProps {
  headers: any[];
  sortState: { sortId: string; sortType: string };
  toggleSort: (header: { id: string; header: string }) => void;
  theadClassName: string;
  thClassName: string;
  trClassName: string;
  handleFilterChange?: (columnId: string, selectedOption: any) => void;
  filters?: { [key: string]: any };
  isFilterable?: boolean;
  toggleFilterOption: (columnId: string, value: any) => void;
  toggleFilterDropdown: (columnId: string) => void;
  filterDropdowns: { [key: string]: boolean };
  data: any;
  filterSearch: string;
  onChangeFilterSearch: (e: any) => void;
  initFilterList: string[];
}

const TableHeader: React.FC<TableHeaderProps> = ({
  headers,
  sortState,
  toggleSort,
  theadClassName,
  thClassName,
  trClassName,
  handleFilterChange,
  initFilterList,
  filters,
  isFilterable,
  toggleFilterDropdown,
  filterDropdowns,
  toggleFilterOption,
  data,
  filterSearch,
  onChangeFilterSearch,
}) => (
  <thead className={theadClassName}>
    <tr className={trClassName}>
      {headers.map((header: any) => {
        if (header.id === "select") {
          return (
            <th
              key={header.id}
              className={`${thClassName}`}
              style={{ width: header.size }}
            >
              {/* <input id={`select-all`} type="checkbox" className="checkbox-basic" /> */}
              ✔︎
            </th>
          );
        }
        return (
          <th
            key={header.id}
            className={`${thClassName} ${header.enableSorting ? "cursor-pointer " : ""} relative`}
            style={{ width: header.size }}
            onClick={() => header.enableSorting && toggleSort(header)}
          >
            {header.title}{" "}
            {sortState.sortId === header.id &&
              ({ asc: " 🔼", desc: " 🔽" }[
                sortState.sortType as "asc" | "desc"
              ] ||
                null)}
            {initFilterList.find((item) => item === header.id) &&
              isFilterable &&
              handleFilterChange && (
                <button
                  className=" bg-white border p-[2px] rounded hover:border-green-500"
                  onClick={(e) => {
                    e.stopPropagation();
                    toggleFilterDropdown(header.id);
                  }}
                >
                  <ArrowDownNarrowWide size={22} strokeWidth={1} />
                </button>
              )}
            {filterDropdowns[header.id] && (
              <div
                className="filter-dropdown"
                onClick={(e) => e.stopPropagation()}
              >
                <input
                  type="text"
                  placeholder="검색"
                  value={filterSearch}
                  onChange={onChangeFilterSearch}
                />
                <div>
                  {Array.from(new Set(data.map((item: any) => item[header.id])))
                    .filter((value) => value !== undefined && value !== null)
                    .filter((value: any) =>
                      filterSearch !== "" ? value?.includes(filterSearch) : true
                    )
                    .map((value) => (
                      <div key={String(value)} className="filter-option">
                        <label>
                          <input
                            type="checkbox"
                            className="w-4 h-4 cursor-pointer"
                            checked={
                              filters?.[header.id]?.includes(value) || false
                            }
                            onChange={(e) => {
                              e.stopPropagation();
                              toggleFilterOption(header.id, value);
                            }}
                          />
                          {String(value)}
                        </label>
                      </div>
                    ))}
                </div>
              </div>
            )}
          </th>
        );
      })}
    </tr>
  </thead>
);

interface TableRowProps {
  row: any;
  rowIndex: number;
  tdClassName: string;
  trClassName: string;
  onClickRow?: (rowOriginal: any) => void;
  onDoubleClickRow?: (rowOriginal: any) => void;
  highlightRow?: (rowOriginal: any) => void;
  isMobile?: boolean;
  mobileTdDivClassName?: string;
}

const TableRow: React.FC<TableRowProps> = ({
  row,
  rowIndex,
  tdClassName,
  trClassName,
  onClickRow,
  onDoubleClickRow,
  highlightRow,
  isMobile,
  mobileTdDivClassName = "flex flex-wrap justify-start gap-1 items-center",
}) => {
  return (
    <>
      {isMobile ? (
        <tr
          className={`border-y border-slate-600 hover:bg-slate-50 dark:hover:bg-zinc-500 ${onClickRow || onDoubleClickRow ? "cursor-pointer" : ""}`}
          style={highlightRow && (highlightRow(row[0].original[0]) as any)}
          onClick={() => onClickRow && onClickRow(row[0].original[0])}
          onDoubleClick={() =>
            onDoubleClickRow && onDoubleClickRow(row[0].original[0])
          }
        >
          <td className="border-none py-2">
            <div className={`${mobileTdDivClassName}`}>
              {row.map((cell: any, index: any) => {
                if (cell.id === "index") {
                  return (
                    <td
                      key={`cell-${index}`}
                      className={`border-none text-center py-2`}
                    >
                      {index}
                    </td>
                  );
                }
                return (
                  <td key={`cell-${index}`} className={"border-none py-2"}>
                    {cell.data}
                  </td>
                );
              })}
            </div>
          </td>
        </tr>
      ) : (
        <tr
          className={`${trClassName} hover:bg-slate-50 dark:hover:bg-zinc-500 ${onClickRow || onDoubleClickRow ? "cursor-pointer" : ""}`}
          style={highlightRow && (highlightRow(row[0].original[0]) as any)}
          onClick={() => onClickRow && onClickRow(row[0].original[0])}
          onDoubleClick={() =>
            onDoubleClickRow && onDoubleClickRow(row[0].original[0])
          }
        >
          {row.map((cell: any, index: any) => {
            if (cell.id === "index") {
              return (
                <td
                  key={`cell-${index}`}
                  className={`${tdClassName} text-center`}
                >
                  {index}
                </td>
              );
            }
            return (
              <td key={`cell-${index}`} className={`${tdClassName}`}>
                {cell.data}
              </td>
            );
          })}
        </tr>
      )}
    </>
  );
};
