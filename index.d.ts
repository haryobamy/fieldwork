type HeadProps = {
  title: string;
  description: string;
  keywords: string;
};

type TDateRangeFilter = Partial<Record<'startDate' | 'endDate', string>>;
type TSearchFilter = Partial<Record<'search', string>>;

type TQueryActionCreatorResult = QueryActionCreatorResult<
  QueryDefinition<
    unknown,
    BaseQueryFn<string | FetchArgs, unknown, FetchBaseQueryError>,
    TApiTag,
    unknown,
    'api'
  >
>;

type TContact = {
  id: string;
  name: string;
  job_title: string;
  department: string;
  email: string;
  phone: string;
};

type TPaginationMeta = {
  pageSize: number;
  totalItems: number;
  totalPages: number;
  currentPage: number;
};

type TPaginatedResult<T = unknown, K extends string> = {
  [k in K]: T[];
} & {
  meta: TPaginationMeta;
};

type TPagination = {
  page: number;
  per_page: number;
};
