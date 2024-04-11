import React from 'react';
import { Box, BoxProps, Button, Typography } from '@mui/material';
import { If, Then } from 'react-if';

type Props = BoxProps & {
  retryHandler?(): void;
  label?: string;
  isLoading?: boolean;
  subActionHandler?(): void;
  subActionBtnLabel?: string;
  buttonLabel?: string;
  hideIcon?: boolean;
  h?: string;
};

function ErrorPlaceholder({
  retryHandler,
  h,
  label,
  isLoading,
  subActionHandler,
  subActionBtnLabel,
  buttonLabel,
  hideIcon,
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
      <Box
        gap={2}
        display="flex"
        flexDirection="column"
        alignItems="center"
        justifyItems="center"
        className="w-full"
      >
        <Typography variant="h2" fontWeight="500" fontSize="16px">
          {label ?? 'An unexpected error occured'}
        </Typography>

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

export default ErrorPlaceholder;
