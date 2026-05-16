import { apiSlice } from '@/redux/apiSlice';

const unwrapData = (response) => response?.data ?? response;

export const mockTestApi = apiSlice.injectEndpoints({
    endpoints: (builder) => ({
        getMockTests: builder.query({
            query: () => 'mock-test',
            transformResponse: unwrapData,
            providesTags: (result) =>
                result
                    ? [
                        ...result.map(({ id }) => ({ type: 'MockTest', id })),
                        { type: 'MockTest', id: 'LIST' },
                      ]
                    : [{ type: 'MockTest', id: 'LIST' }],
        }),

        getMockTestCreateMetadata: builder.query({
            query: () => 'mock-test/create',
            transformResponse: unwrapData,
        }),

        getMockTest: builder.query({
            query: (id) => `mock-test/show/${id}`,
            transformResponse: unwrapData,
            providesTags: (result, error, id) => [{ type: 'MockTest', id }],
        }),

        createMockTest: builder.mutation({
            query: (body) => ({
                url: 'mock-test/store',
                method: 'POST',
                body,
            }),
            transformResponse: unwrapData,
            invalidatesTags: [{ type: 'MockTest', id: 'LIST' }],
        }),

        updateMockTest: builder.mutation({
            query: ({ id, body }) => ({
                url: `mock-test/update/${id}`,
                method: 'PUT',
                body,
            }),
            transformResponse: unwrapData,
            invalidatesTags: (result, error, { id }) => [
                { type: 'MockTest', id },
                { type: 'MockTest', id: 'LIST' },
            ],
        }),

        deleteMockTest: builder.mutation({
            query: (id) => ({
                url: `mock-test/destroy/${id}`,
                method: 'DELETE',
            }),
            invalidatesTags: (result, error, id) => [
                { type: 'MockTest', id },
                { type: 'MockTest', id: 'LIST' },
            ],
        }),
    }),
    overrideExisting: false,
});

export const {
    useGetMockTestsQuery,
    useGetMockTestCreateMetadataQuery,
    useGetMockTestQuery,
    useCreateMockTestMutation,
    useUpdateMockTestMutation,
    useDeleteMockTestMutation,
} = mockTestApi;
