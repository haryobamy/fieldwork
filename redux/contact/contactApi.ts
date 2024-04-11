import { apiSlice } from '../api/apiSlice';

type PaginatedContactResponse = TPaginatedResult<TContact, 'paginatedItems'>;

export const contactApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    //get contacts

    getContacts: builder.query({
      query: () => ({
        url: 'contacts',
        method: 'GET',
      }),
      providesTags: ['Contacts'],

      async onQueryStarted(arg, { dispatch, queryFulfilled }) {
        try {
          const result = await queryFulfilled;
          console.log(result, '::from redux');
        } catch (error: any) {
          console.log(error);
        }
      },
    }),

    createContact: builder.mutation<unknown, TContact>({
      query: (data) => ({
        url: 'contacts',
        method: 'POST',
        body: data,
      }),
      invalidatesTags: ['Contacts'],
    }),

    updateContact: builder.mutation<unknown, TContact>({
      query: (data) => ({
        url: `contacts/${data.id}`,
        method: 'PUT',
        body: data,
      }),
      invalidatesTags: ['Contacts'],
    }),
  }),
});

export const {
  useGetContactsQuery,
  useLazyGetContactsQuery,
  useCreateContactMutation,
  useUpdateContactMutation,
} = contactApi;
