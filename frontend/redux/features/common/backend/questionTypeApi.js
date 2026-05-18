import { apiSlice } from '@/redux/apiSlice';

const unwrapData = (response) => response?.data ?? response;

export const questionTypeApi = apiSlice.injectEndpoints({
    endpoints: (builder) => ({
        getQuestionTypes: builder.query({
            query: (params) => ({
                url: 'question-type',
                params: params || {},
            }),
            transformResponse: unwrapData,
            providesTags: (result) =>
                result
                    ? [
                        ...result.map(({ id }) => ({ type: 'QuestionType', id })),
                        { type: 'QuestionType', id: 'LIST' },
                      ]
                    : [{ type: 'QuestionType', id: 'LIST' }],
        }),

        getQuestionType: builder.query({
            query: (id) => `question-type/show/${id}`,
            transformResponse: unwrapData,
            providesTags: (result, error, id) => [{ type: 'QuestionType', id }],
        }),

        createQuestionType: builder.mutation({
            query: (body) => ({
                url: 'question-type/store',
                method: 'POST',
                body,
            }),
            transformResponse: unwrapData,
            invalidatesTags: [{ type: 'QuestionType', id: 'LIST' }],
        }),

        updateQuestionType: builder.mutation({
            query: ({ id, body }) => ({
                url: `question-type/update/${id}`,
                method: 'PUT',
                body,
            }),
            transformResponse: unwrapData,
            invalidatesTags: (result, error, { id }) => [
                { type: 'QuestionType', id },
                { type: 'QuestionType', id: 'LIST' },
            ],
        }),

        deleteQuestionType: builder.mutation({
            query: (id) => ({
                url: `question-type/destroy/${id}`,
                method: 'DELETE',
            }),
            invalidatesTags: (result, error, id) => [
                { type: 'QuestionType', id },
                { type: 'QuestionType', id: 'LIST' },
            ],
        }),
    }),
    overrideExisting: false,
});

export const {
    useGetQuestionTypesQuery,
    useGetQuestionTypeQuery,
    useCreateQuestionTypeMutation,
    useUpdateQuestionTypeMutation,
    useDeleteQuestionTypeMutation,
} = questionTypeApi;