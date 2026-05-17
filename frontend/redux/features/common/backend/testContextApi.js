import { apiSlice } from '@/redux/apiSlice';

const unwrapData = (response) => response?.data ?? response;

export const testContextApi = apiSlice.injectEndpoints({
    endpoints: (builder) => ({
        getTestContexts: builder.query({
            query: (params) => ({
                url: 'test-context',
                params: params || {},
            }),
            transformResponse: unwrapData,
            providesTags: (result) =>
                result
                    ? [
                        ...result.map(({ id }) => ({ type: 'TestContext', id })),
                        { type: 'TestContext', id: 'LIST' },
                      ]
                    : [{ type: 'TestContext', id: 'LIST' }],
        }),

        getTestContext: builder.query({
            query: (id) => `test-context/show/${id}`,
            transformResponse: unwrapData,
            providesTags: (result, error, id) => [{ type: 'TestContext', id }],
        }),

        createTestContext: builder.mutation({
            query: (body) => ({
                url: 'test-context/store',
                method: 'POST',
                body,
            }),
            transformResponse: unwrapData,
            invalidatesTags: [{ type: 'TestContext', id: 'LIST' }],
        }),

        updateTestContext: builder.mutation({
            query: ({ id, body }) => ({
                url: `test-context/update/${id}`,
                method: 'PUT',
                body,
            }),
            transformResponse: unwrapData,
            invalidatesTags: (result, error, { id }) => [
                { type: 'TestContext', id },
                { type: 'TestContext', id: 'LIST' },
            ],
        }),

        deleteTestContext: builder.mutation({
            query: (id) => ({
                url: `test-context/destroy/${id}`,
                method: 'DELETE',
            }),
            invalidatesTags: (result, error, id) => [
                { type: 'TestContext', id },
                { type: 'TestContext', id: 'LIST' },
            ],
        }),
    }),
    overrideExisting: false,
});

export const {
    useGetTestContextsQuery,
    useGetTestContextQuery,
    useCreateTestContextMutation,
    useUpdateTestContextMutation,
    useDeleteTestContextMutation,
} = testContextApi;
