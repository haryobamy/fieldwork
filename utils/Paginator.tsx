import React, { useMemo } from 'react';
import { Pagination } from 'react-headless-pagination';
import { If, Then } from 'react-if';
import {
  StackProps,
  useMediaQuery,
  Stack,
  Typography,
  Tooltip,
  Button,
  Box,
} from '@mui/material';
import { isValidNumber } from './utils';

type Props = {
  page: number;
  pageSize: number;
  setPage(page: number): void;
  toFirstPage(): void;
  toLastPage(): void;
  setPageSize(pageSize: number): void;
  totalPages: number;
  totalItems: number;
  canNext?: boolean;
  canPrev?: boolean;
  hidePageStat?: boolean;
} & Omit<StackProps, 'children'>;

function Paginator({
  page,
  setPage,
  totalPages,
  totalItems,
  toFirstPage,
  toLastPage,
  canPrev,
  canNext,
  pageSize,
  setPageSize,
  hidePageStat,
  ...containerProps
}: Props) {
  const pageInfo = useMemo(() => {
    const parsedPage = isValidNumber(page) ? page : 0;
    const parsedPageSize = isValidNumber(pageSize) ? pageSize : 0;
    const parsedTotalItems = isValidNumber(totalItems) ? totalItems : 0;

    const startIndex = parsedPage * parsedPageSize + 1;
    const stopIndex = (parsedPage + 1) * parsedPageSize;
    const stopIndexToDisplay =
      stopIndex > parsedTotalItems ? parsedTotalItems : stopIndex;

    return `Showing ${startIndex}-${stopIndexToDisplay} of ${parsedTotalItems} ${
      parsedTotalItems === 1 ? 'Entry' : 'Entries'
    }`;
  }, [page, pageSize, totalItems]);

  return (
    //const truncableDisplay = useMediaQuery({ base: 'none', lg: 'flex' });${truncableDisplay}
    <>
      <style>
        {`
            .paginator__truncable {
              display:flex ;
              justify-content: center;
              align-items: center;
              border-color: #061624;
              border-width: 1px;
              color: #2F2B43;
              border-radius: 10px;
              cursor: default;
              height: 49px;
              width: 45px;
            }
          `}
      </style>

      <Stack
        direction="row"
        rowGap="4"
        columnGap="6"
        justifyContent="space-between"
        className="w-full px-3"
        {...containerProps}
      >
        <If condition={!hidePageStat}>
          <Then>
            <Typography color="#061624">{pageInfo}</Typography>
          </Then>
        </If>

        <Pagination
          currentPage={page}
          setCurrentPage={setPage}
          totalPages={totalPages}
          middlePagesSiblingCount={2}
          edgePageCount={2}
          truncableClassName="paginator__truncable"
        >
          <Stack direction="row" gap={2} flexWrap="wrap" className="w-full">
            <Pagination.PrevButton className="border-none dark:bg-white  bg-white">
              <Tooltip title="Previous Page">
                <Button
                  disabled={!canPrev}
                  variant="contained"
                  className="text-sm bg-green-500   rounded-md   text-[#5239d4]"
                >
                  Previous
                </Button>
              </Tooltip>
            </Pagination.PrevButton>

            <Box
              component="nav"
              display="flex"
              flexDirection="row"
              justifyContent="center"
              alignItems="center"
              flexWrap="wrap"
            >
              <Box
                component="ul"
                display={{ base: 'none', lg: 'flex' }}
                flexDirection="row"
                justifyContent="center"
                alignItems="center"
                gap="2"
                className="list-none"
              >
                <Pagination.PageButton
                  activeClassName="active-page"
                  inactiveClassName=""
                />
              </Box>
            </Box>

            <Pagination.NextButton className="border-none dark:bg-white  bg-white">
              <Button
                disabled={!canNext}
                className="text-sm bg-green-500   rounded-md   text-[#5239d4]"
              >
                Next
              </Button>
            </Pagination.NextButton>
          </Stack>
        </Pagination>
      </Stack>
    </>
  );
}

export default Paginator;
