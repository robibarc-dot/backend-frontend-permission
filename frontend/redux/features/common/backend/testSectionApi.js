import { apiSlice } from '@/redux/apiSlice';

const unwrapData = (response) => response?.data ?? response;

export const testSectionApi = apiSlice.injectEndpoints({
    endpoints: (builder) => ({
        getTestSections: builder.query({
            query: (params) => ({
                url: 'test-section',
                params: params || {},
            }),
            transformResponse: unwrapData,
            providesTags: (result) =>
                result
                    ? [
                        ...result.map(({ id }) => ({ type: 'TestSection', id })),
                        { type: 'TestSection', id: 'LIST' },
                      ]
                    : [{ type: 'TestSection', id: 'LIST' }],
        }),

        getTestSection: builder.query({
            query: (id) => `test-section/show/${id}`,
            transformResponse: unwrapData,
            providesTags: (result, error, id) => [{ type: 'TestSection', id }],
        }),

        createTestSection: builder.mutation({
            query: (body) => ({
                url: 'test-section/store',
                method: 'POST',
                body,
            }),
            transformResponse: unwrapData,
            invalidatesTags: [{ type: 'TestSection', id: 'LIST' }],
        }),

        updateTestSection: builder.mutation({
            query: ({ id, body }) => ({
                url: `test-section/update/${id}`,
                method: 'PUT',
                body,
            }),
            transformResponse: unwrapData,
            invalidatesTags: (result, error, { id }) => [
                { type: 'TestSection', id },
                { type: 'TestSection', id: 'LIST' },
            ],
        }),

        deleteTestSection: builder.mutation({
            query: (id) => ({
                url: `test-section/destroy/${id}`,
                method: 'DELETE',
            }),
            invalidatesTags: (result, error, id) => [
                { type: 'TestSection', id },
                { type: 'TestSection', id: 'LIST' },
            ],
        }),
    }),
    overrideExisting: false,
});

export const {
    useGetTestSectionsQuery,
    useGetTestSectionQuery,
    useCreateTestSectionMutation,
    useUpdateTestSectionMutation,
    useDeleteTestSectionMutation,
} = testSectionApi;
