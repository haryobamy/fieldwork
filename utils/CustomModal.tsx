import React, { FC, useEffect } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  IconButton,
  FormControl,
  FormLabel,
  TextField,
  Button,
  MenuItem,
} from '@mui/material';
import { styles } from '@/styles/styles';
import CloseIcon from '@mui/icons-material/close';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as Yup from 'yup';
import {
  useCreateContactMutation,
  useUpdateContactMutation,
} from '@/redux/contact/contactApi';
import { useAppDispatch } from '@/redux/store';
import toast from 'react-hot-toast';

const ContactSchema = Yup.object().shape({
  email: Yup.string().email('Invalid email').required('Email is required'),
  name: Yup.string().required('Name is required'),
  phone: Yup.string().required('Phone is required'),
  job_title: Yup.string().required('Job Title is required'),
  department: Yup.string().required('Department is required'),
});

type Props = {
  open: boolean;
  onClose: () => void;
  selectedContact: TContact | null;
};

const CustomModal: FC<Props> = ({ open, onClose, selectedContact }: Props) => {
  const [createContact, { isLoading, error, data, isSuccess }] =
    useCreateContactMutation();
  const [
    updateContact,
    { isLoading: updateLoading, error: updateError, isSuccess: updateSuccess },
  ] = useUpdateContactMutation();
  const {
    handleSubmit,
    register,
    setValue,
    formState: { errors },
  } = useForm<TContact>({
    defaultValues: {
      name: '',
      job_title: '',
      department: '',
      email: '',
      phone: '',
    },
    //@ts-ignore
    resolver: yupResolver(ContactSchema),
  });

  const onSubmit = async (value: TContact) => {
    if (value.id === '') {
      await createContact(value);
    } else {
      await updateContact(value);
    }
  };

  useEffect(() => {
    if (selectedContact !== null) {
      setValue('department', selectedContact.department);
      setValue('email', selectedContact.email);
      setValue('job_title', selectedContact.job_title);
      setValue('name', selectedContact.name);
      setValue('phone', selectedContact.phone);
      setValue('id', selectedContact.id);
    }
  }, [setValue, selectedContact]);

  useEffect(() => {
    if (isSuccess) {
      //const message = data?.message || 'Contact created successful';
      //toast.success(message);
      //console.log(message);
      console.log(data);
      onClose();
    }
    if (updateSuccess) {
      console.log(data);
      onClose();
    }
    if (error) {
      if ('data' in error) {
        const errorData = error as any;
        toast.error(errorData?.data?.message);
        console.log(errorData);
      }
    }

    if (updateError) {
      if ('data' in updateError) {
        const errorData = updateError as any;
        toast.error(errorData?.data?.message);
        console.log(errorData);
      }
    }
  }, [isSuccess, error, updateError, updateSuccess]);

  return (
    <Dialog
      open={open}
      onClose={() => onClose()}
      arial-labelledby="modal-modal-title"
      aria-describedby="modal-modal-description"
    >
      <DialogTitle>
        <div className="flex bg-red-500  items-center justify-between">
          <h1 className={`${styles.title} text-center`}>
            {selectedContact !== null ? 'Edit' : 'Add'} Contact
          </h1>
          <IconButton onClick={onClose}>
            <CloseIcon />
          </IconButton>
        </div>
      </DialogTitle>

      <DialogContent
        sx={{
          width: '400px',
          height: '100%',
        }}
      >
        <form
          onSubmit={handleSubmit(onSubmit)}
          className="w-full grid grid-cols-1 gap-4 "
        >
          <FormControl fullWidth>
            <FormLabel htmlFor="name">Name</FormLabel>
            <TextField
              id="name"
              {...register('name')}
              error={Boolean(errors?.name?.message)}
              helperText={errors.name?.message}
            />
          </FormControl>
          <FormControl fullWidth>
            <FormLabel htmlFor="job">Job Title</FormLabel>
            <TextField
              id="job"
              {...register('job_title')}
              error={Boolean(errors?.job_title?.message)}
              helperText={errors.job_title?.message}
            />
          </FormControl>
          <FormControl fullWidth>
            <FormLabel htmlFor="phone">Phone </FormLabel>
            <TextField
              id="phone"
              {...register('phone')}
              error={Boolean(errors?.phone?.message)}
              helperText={errors.phone?.message}
            />
          </FormControl>

          <FormControl fullWidth>
            <FormLabel htmlFor="email">Email</FormLabel>
            <TextField
              id="email"
              type="email"
              {...register('email')}
              error={Boolean(errors?.email?.message)}
              helperText={errors.email?.message}
            />
          </FormControl>
          <FormControl fullWidth>
            <FormLabel htmlFor="department">Department</FormLabel>
            <TextField
              id="department"
              select
              {...register('department')}
              error={Boolean(errors?.department?.message)}
              helperText={errors.department?.message}
            >
              <MenuItem value="new">New</MenuItem>
              <MenuItem value="pending">Pending</MenuItem>
              <MenuItem value="failed">Failed</MenuItem>
            </TextField>
          </FormControl>

          <Button
            type="submit"
            variant="contained"
            className={`${styles.button} mt-10`}
          >
            {selectedContact !== null ? 'Update' : 'Create'}
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default CustomModal;
