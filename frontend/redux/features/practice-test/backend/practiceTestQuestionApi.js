import { apiSlice } from '@/redux/apiSlice';

const unwrapData = (response) => response?.data ?? response;

export const practiceTestQuestionApi = apiSlice.injectEndpoints({
    endpoints: (builder) => ({
        getPracticeTestQuestions: builder.query({
            query: (params) => ({
                url: 'practice-test-question',
                params: params || {},
            }),
            transformResponse: unwrapData,
            providesTags: (result) =>
                result
                    ? [
                        ...result.map(({ id }) => ({ type: 'PracticeTestQuestion', id })),
                        { type: 'PracticeTestQuestion', id: 'LIST' },
                      ]
                    : [{ type: 'PracticeTestQuestion', id: 'LIST' }],
        }),

        getPracticeTestQuestionCreateMetadata: builder.query({
            query: () => 'practice-test-question/create',
            transformResponse: unwrapData,
        }),

        getPracticeTestQuestion: builder.query({
            query: (id) => `practice-test-question/show/${id}`,
            transformResponse: unwrapData,
            providesTags: (result, error, id) => [{ type: 'PracticeTestQuestion', id }],
        }),

        createPracticeTestQuestion: builder.mutation({
            query: (body) => ({
                url: 'practice-test-question/store',
                method: 'POST',
                body,
            }),
            transformResponse: unwrapData,
            invalidatesTags: [{ type: 'PracticeTestQuestion', id: 'LIST' }],
        }),

        updatePracticeTestQuestion: builder.mutation({
            query: ({ id, body }) => ({
                url: `practice-test-question/update/${id}`,
                method: 'PUT',
                body,
            }),
            transformResponse: unwrapData,
            invalidatesTags: (result, error, { id }) => [
                { type: 'PracticeTestQuestion', id },
                { type: 'PracticeTestQuestion', id: 'LIST' },
            ],
        }),

        deletePracticeTestQuestion: builder.mutation({
            query: (id) => ({
                url: `practice-test-question/destroy/${id}`,
                method: 'DELETE',
            }),
            invalidatesTags: (result, error, id) => [
                { type: 'PracticeTestQuestion', id },
                { type: 'PracticeTestQuestion', id: 'LIST' },
            ],
        }),
    }),
    overrideExisting: false,
});

export const {
    useGetPracticeTestQuestionsQuery,
    useGetPracticeTestQuestionCreateMetadataQuery,
    useGetPracticeTestQuestionQuery,
    useCreatePracticeTestQuestionMutation,
    useUpdatePracticeTestQuestionMutation,
    useDeletePracticeTestQuestionMutation,
} = practiceTestQuestionApi;
