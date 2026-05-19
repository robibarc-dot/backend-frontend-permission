import { apiSlice } from '@/redux/apiSlice';

const unwrapData = (response) => response?.data ?? response;

export const questionApi = apiSlice.injectEndpoints({
    endpoints: (builder) => ({
        getQuestions: builder.query({
            query: (params) => ({
                url: 'question',
                params: params || {},
            }),
            transformResponse: unwrapData,
            providesTags: (result) =>
                result
                    ? [
                        ...result.map(({ id }) => ({ type: 'Question', id })),
                        { type: 'Question', id: 'LIST' },
                      ]
                    : [{ type: 'Question', id: 'LIST' }],
        }),

        getQuestion: builder.query({
            query: (id) => `question/show/${id}`,
            transformResponse: unwrapData,
            providesTags: (result, error, id) => [{ type: 'Question', id }],
        }),

        createQuestion: builder.mutation({
            query: (body) => ({
                url: 'question/store',
                method: 'POST',
                body,
            }),
            transformResponse: unwrapData,
            invalidatesTags: [{ type: 'Question', id: 'LIST' }],
        }),

        updateQuestion: builder.mutation({
            query: ({ id, body }) => ({
                url: `question/update/${id}`,
                method: 'PUT',
                body,
            }),
            transformResponse: unwrapData,
            invalidatesTags: (result, error, { id }) => [
                { type: 'Question', id },
                { type: 'Question', id: 'LIST' },
            ],
        }),

        deleteQuestion: builder.mutation({
            query: (id) => ({
                url: `question/destroy/${id}`,
                method: 'DELETE',
            }),
            invalidatesTags: (result, error, id) => [
                { type: 'Question', id },
                { type: 'Question', id: 'LIST' },
            ],
        }),
    }),
    overrideExisting: false,
});

export const {
    useGetQuestionsQuery,
    useGetQuestionQuery,
    useCreateQuestionMutation,
    useUpdateQuestionMutation,
    useDeleteQuestionMutation,
} = questionApi;
