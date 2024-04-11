'use client';
import React from 'react';
import { Box, BoxProps, Button, Typography } from '@mui/material';
import { If, Then } from 'react-if';

type Props = BoxProps & {
  retryHandler?(): void;
  label?: string;
  description?: string;
  buttonLabel?: string;
  isLoading?: boolean;
  hideIcon?: boolean;
  h?: string;
};

function NoData({
  hideIcon,
  h,
  buttonLabel,
  description,
  isLoading,
  retryHandler,
  label,
  ...rest
}: Props) {
  return (
    <Box
      minHeight={h ?? '250px'}
      display="flex"
      flexDirection="column"
      alignItems="center"
      justifyItems="center"
      className="w-full"
      {...rest}
    >
      no data sample
      <Box
        gap={2}
        display="flex"
        flexDirection="column"
        alignItems="center"
        justifyItems="center"
        className="w-full"
      >
        <Typography variant="h2">{label ?? 'Nothing to see here'}</Typography>
        <Typography variant="body1">{description}</Typography>

        <If condition={!!retryHandler}>
          <Then>
            <Button
              size="large"
              onClick={retryHandler}
              variant="contained"
              disabled={isLoading}
              className="text-green-500 "
            >
              {buttonLabel ?? 'Reload'}
            </Button>
          </Then>
        </If>
      </Box>
    </Box>
  );
}

export default NoData;
