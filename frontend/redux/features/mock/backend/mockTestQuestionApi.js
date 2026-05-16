import { apiSlice } from '@/redux/apiSlice';

const unwrapData = (response) => response?.data ?? response;

export const mockTestQuestionApi = apiSlice.injectEndpoints({
    endpoints: (builder) => ({
        getMockTestQuestions: builder.query({
            query: (params) => ({
                url: 'mock-test-question',
                params: params || {},
            }),
            transformResponse: unwrapData,
            providesTags: (result) =>
                result
                    ? [
                        ...result.map(({ id }) => ({ type: 'MockTestQuestion', id })),
                        { type: 'MockTestQuestion', id: 'LIST' },
                      ]
                    : [{ type: 'MockTestQuestion', id: 'LIST' }],
        }),

        getMockTestQuestionCreateMetadata: builder.query({
            query: () => 'mock-test-question/create',
            transformResponse: unwrapData,
        }),

        getMockTestQuestion: builder.query({
            query: (id) => `mock-test-question/show/${id}`,
            transformResponse: unwrapData,
            providesTags: (result, error, id) => [{ type: 'MockTestQuestion', id }],
        }),

        createMockTestQuestion: builder.mutation({
            query: (body) => ({
                url: 'mock-test-question/store',
                method: 'POST',
                body,
            }),
            transformResponse: unwrapData,
            invalidatesTags: [{ type: 'MockTestQuestion', id: 'LIST' }],
        }),

        updateMockTestQuestion: builder.mutation({
            query: ({ id, body }) => ({
                url: `mock-test-question/update/${id}`,
                method: 'PUT',
                body,
            }),
            transformResponse: unwrapData,
            invalidatesTags: (result, error, { id }) => [
                { type: 'MockTestQuestion', id },
                { type: 'MockTestQuestion', id: 'LIST' },
            ],
        }),

        deleteMockTestQuestion: builder.mutation({
            query: (id) => ({
                url: `mock-test-question/destroy/${id}`,
                method: 'DELETE',
            }),
            invalidatesTags: (result, error, id) => [
                { type: 'MockTestQuestion', id },
                { type: 'MockTestQuestion', id: 'LIST' },
            ],
        }),
    }),
    overrideExisting: false,
});

export const {
    useGetMockTestQuestionsQuery,
    useGetMockTestQuestionCreateMetadataQuery,
    useGetMockTestQuestionQuery,
    useCreateMockTestQuestionMutation,
    useUpdateMockTestQuestionMutation,
    useDeleteMockTestQuestionMutation,
} = mockTestQuestionApi;
