import { apiSlice } from '@/redux/apiSlice';

const unwrapData = (response) => response?.data ?? response;

export const practiceTestApi = apiSlice.injectEndpoints({
    endpoints: (builder) => ({
        getPracticeTests: builder.query({
            query: () => 'practice-test',
            transformResponse: unwrapData,
            providesTags: (result) =>
                result
                    ? [
                        ...result.map(({ id }) => ({ type: 'PracticeTest', id })),
                        { type: 'PracticeTest', id: 'LIST' },
                      ]
                    : [{ type: 'PracticeTest', id: 'LIST' }],
        }),

        getPracticeTestCreateMetadata: builder.query({
            query: () => 'practice-test/create',
            transformResponse: unwrapData,
        }),

        getPracticeTest: builder.query({
            query: (id) => `practice-test/show/${id}`,
            transformResponse: unwrapData,
            providesTags: (result, error, id) => [{ type: 'PracticeTest', id }],
        }),

        createPracticeTest: builder.mutation({
            query: (body) => ({
                url: 'practice-test/store',
                method: 'POST',
                body,
            }),
            transformResponse: unwrapData,
            invalidatesTags: [{ type: 'PracticeTest', id: 'LIST' }],
        }),

        updatePracticeTest: builder.mutation({
            query: ({ id, body }) => ({
                url: `practice-test/update/${id}`,
                method: 'PUT',
                body,
            }),
            transformResponse: unwrapData,
            invalidatesTags: (result, error, { id }) => [
                { type: 'PracticeTest', id },
                { type: 'PracticeTest', id: 'LIST' },
            ],
        }),

        deletePracticeTest: builder.mutation({
            query: (id) => ({
                url: `practice-test/destroy/${id}`,
                method: 'DELETE',
            }),
            invalidatesTags: (result, error, id) => [
                { type: 'PracticeTest', id },
                { type: 'PracticeTest', id: 'LIST' },
            ],
        }),
    }),
    overrideExisting: false,
});

export const {
    useGetPracticeTestsQuery,
    useGetPracticeTestCreateMetadataQuery,
    useGetPracticeTestQuery,
    useCreatePracticeTestMutation,
    useUpdatePracticeTestMutation,
    useDeletePracticeTestMutation,
} = practiceTestApi;
