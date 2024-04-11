import { Loader } from '@/utils/Loader';
import React from 'react';
import { Box } from '@mui/material';
import {
  ReactNode,
  useState,
  useMemo,
  useCallback,
  useImperativeHandle,
  forwardRef,
} from 'react';

import { DateRange } from 'react-day-picker';

import { add, format } from 'date-fns';

import {
  ColumnDef,
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  PaginationState,
  RowSelectionState,
  OnChangeFn,
  Row,
  useReactTable,
} from '@tanstack/react-table';
import NoData from '@/utils/NoData';
import ErrorPlaceholder from '@/utils/ErrorPlaceholder';
import {
  TableContainer,
  TableContainerProps,
  Table,
  TableHead,
  TableRow,
  TableBody,
  TableCell,
} from '@mui/material';
import Paginator from '@/utils/Paginator';

type Props<T = any> = {
  title?: string;
  data: T[];
  pageCount: number;
  totalItems: number;
  columns: ColumnDef<T>[];
  handleRowClick?(data: T): unknown;
  isLoading?: boolean;
  isFetching?: boolean;
  isError?: boolean;
  fetchData(p: PaginationState & TDateRangeFilter): void;
  rowSelection?: Record<string, boolean>;
  setRowSelection?: OnChangeFn<RowSelectionState>;
  enableRowSelection?: boolean | ((row: Row<T>) => boolean);
  onExport?(): void;
  isExporting?: boolean;
  searchValue: string;
  onSearchChange(str: string): void;
} & Omit<TableContainerProps, 'children'>;

type TControlledTableRef = {
  resetPagination(): void;
};

export const DataTable = forwardRef<TControlledTableRef, Props>(function (
  {
    columns,
    data,
    handleRowClick,
    isError,
    isLoading,
    isFetching,
    fetchData,
    pageCount,
    rowSelection,
    setRowSelection,
    enableRowSelection,
    onExport,
    isExporting,
    title,
    totalItems,
    searchValue,
    onSearchChange,
    ...rest
  },
  ref
) {
  const [{ pageIndex, pageSize }, setPagination] = useState<PaginationState>({
    pageIndex: 0,
    pageSize: 10, //  default query size
  });
  const [selectedRange] = useState<DateRange>();

  useImperativeHandle(ref, () => ({
    resetPagination() {
      setPagination((p) => ({ ...p, pageIndex: 0 }));
    },
  }));

  const pagination = useMemo(
    () => ({
      pageIndex,
      pageSize,
    }),
    [pageIndex, pageSize]
  );

  const doFetch = useCallback(() => {
    const startDate = selectedRange?.from
      ? format(add(selectedRange.from, { days: -1 }), 'yyyy-MM-dd')
      : '';

    const endDate = selectedRange?.to
      ? format(add(selectedRange.to, { days: 1 }), 'yyyy-MM-dd')
      : '';

    fetchData({
      pageIndex,
      pageSize,
      startDate,
      endDate,
    });
  }, [fetchData, pageIndex, pageSize, selectedRange?.from, selectedRange?.to]);

  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    debugTable: process.env.NODE_ENV === 'development',
  });

  let content = (
    <>
      <TableContainer className="w-full pb-[10px] bg-white " {...rest}>
        <Table className="w-full">
          <TableHead className="bg-[#F9F9F9]">
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => (
                  <TableCell
                    colSpan={header.colSpan}
                    key={header.id}
                    color="#F9F9F9"
                    className="text-sm capitalize pb-[21px] pt-[25px] font-[500] border-none"
                  >
                    {header.isPlaceholder
                      ? null
                      : flexRender(
                          header.column.columnDef.header,
                          header.getContext()
                        )}
                  </TableCell>
                ))}
              </TableRow>
            ))}
          </TableHead>
          <TableBody>
            {table.getRowModel().rows.map((row) => (
              <TableRow
                key={row.id}
                onClick={() => {
                  if (handleRowClick) {
                    handleRowClick(row.original);
                  }
                }}
                className={`${
                  handleRowClick
                    ? 'cursor-pointer hover:bg-gray-100'
                    : 'cursor-default'
                }  `}
              >
                {row.getVisibleCells().map((cell) => (
                  <TableCell
                    key={cell.id}
                    className='text-[14px] font-thin leading-[150%]  border-b-[#E9E5E5] border-b-1 border-t-0 border-l-0 border-r-0  border-solid tracking-["0.14px"]'
                  >
                    {flexRender(cell.column.columnDef.cell, cell.getContext())}
                  </TableCell>
                ))}
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </>
  );

  if (!data.length) {
    content = (
      <NoData
        h="400px"
        py="24"
        label={isFetching ? '' : 'No Data'}
        retryHandler={doFetch}
        isLoading={isFetching}
        bgcolor="#fffa"
      />
    );
  }

  if (isError && !isLoading) {
    content = (
      <ErrorPlaceholder
        h="400px"
        py="24"
        retryHandler={doFetch}
        label={isFetching ? '' : undefined}
        isLoading={isFetching}
        bgcolor="#fff"
      />
    );
  }

  if (isLoading) {
    content = (
      <Box className="w-full py-24 h-[400px] bg-white">
        <Loader />
      </Box>
    );
  }

  return (
    <Box className="w-full space-x-0">
      {content}

      <Box className="w-full mt-[40px]">
        <Paginator
          page={pageIndex}
          pageSize={pageSize}
          totalPages={pageCount}
          totalItems={totalItems}
          setPage={table.setPageIndex}
          setPageSize={table.setPageSize}
          toFirstPage={() => table.setPageIndex(0)}
          toLastPage={() => table.setPageIndex(table.getPageCount() - 1)}
          canNext={table.getCanNextPage()}
          canPrev={table.getCanPreviousPage()}
        />
      </Box>
    </Box>
  );
});

DataTable.displayName = 'DataTable';
