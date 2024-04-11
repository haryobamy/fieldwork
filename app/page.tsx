'use client';
import Heading from '@/utils/Heading';
import React, { FC, useCallback, useEffect, useRef, useState } from 'react';
import { DataTable } from './components/DataTable';
import { ColumnDef, PaginationState } from '@tanstack/react-table';
import { useMemo } from 'react';
import {
  Box,
  Button,
  IconButton,
  Menu,
  MenuItem,
  Stack,
  Typography,
} from '@mui/material';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import AddIcon from '@mui/icons-material/Add';
import { useLazyGetContactsQuery } from '@/redux/contact/contactApi';
import CustomModal from '@/utils/CustomModal';

const getStatusColor = (status: string) => {
  const m: Record<string, string> = {
    new: '#72bf6a',
    pending: 'yellow',
    failed: 'red',
  };

  return m[status];
};

const Page: FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedContact, setSelectedContact] = useState<TContact | null>(null);
  const [getContacts, { isFetching, isError, data: result }] =
    useLazyGetContactsQuery();

  const isContactOpen = useMemo(
    () => selectedContact !== null,
    [selectedContact]
  );

  const closeContact = useCallback(() => {
    setSelectedContact(null);
    setIsOpen(false);
  }, []);

  useEffect(() => {
    getContacts({});
  }, []);

  const triggerRef = useRef<TQueryActionCreatorResult>();

  const getContact = useCallback(() => {
    if (triggerRef.current) {
      triggerRef.current.abort();
    }

    triggerRef.current = getContacts({});
  }, [getContacts]);

  const columns = useMemo<ColumnDef<TContact>[]>(
    () => [
      {
        header: 'Name',
        accessorKey: 'name',
      },
      {
        header: 'Job Title',
        accessorKey: 'job_title',
      },
      {
        header: 'phone',
        accessorKey: 'phone',
      },

      {
        header: 'Department',
        cell: (info) => info.getValue(),
        accessorFn: (contact) => (
          <Box
            bgcolor={getStatusColor(contact.department.toLowerCase())}
            className="flex rounded-md items-center justify-center w-[50%] "
          >
            <Typography textTransform="capitalize">
              {contact.department.toLowerCase()}
            </Typography>
          </Box>
        ),
      },
      {
        header: 'Action',
        cell: (info) => info.getValue(),
        accessorFn: (contact) => (
          <div>
            <IconButton
              id="contact-button"
              onClick={setSelectedContact.bind(null, contact)}
            >
              <MoreVertIcon />
            </IconButton>
          </div>
        ),
      },
    ],
    []
  );

  return (
    <main className="">
      <Heading
        title="Field work Assignment"
        description="Learn with us"
        keywords="Programming , MUI, Typescript,tailwind,eslint,redux"
      />

      <Box className="w-full px-20 py-10  min-h-screen relative   ">
        <CustomModal
          open={isOpen || isContactOpen}
          onClose={closeContact}
          selectedContact={selectedContact}
        />
        <Stack
          direction="row"
          alignItems="center"
          justifyContent="space-between"
        >
          <Box borderBottom={1} className="w-full flex gap-6">
            <Typography variant="body1" fontSize="20px">
              Contact
            </Typography>
            <Typography variant="body1" fontSize="20px">
              Location
            </Typography>
          </Box>
          <IconButton
            className="  bg-green-500   text-white hover:bg-green-500"
            onClick={() => setIsOpen(true)}
          >
            <AddIcon />
          </IconButton>
        </Stack>
        <DataTable
          data={result || []}
          isLoading={isFetching}
          isError={isError}
          columns={columns}
          fetchData={getContact}
          pageCount={1}
          totalItems={40}
          searchValue={''}
          onSearchChange={function (str: string): void {
            throw new Error('Function not implemented.');
          }}
        />
      </Box>
    </main>
  );
};

export default Page;
