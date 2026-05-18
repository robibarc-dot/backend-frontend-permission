import { apiSlice } from '@/redux/apiSlice';

const unwrapData = (response) => response?.data ?? response;

export const questionGroupApi = apiSlice.injectEndpoints({
    endpoints: (builder) => ({
        getQuestionGroups: builder.query({
            query: (params) => ({
                url: 'question-group',
                params: params || {},
            }),
            transformResponse: unwrapData,
            providesTags: (result) =>
                result
                    ? [
                        ...result.map(({ id }) => ({ type: 'QuestionGroup', id })),
                        { type: 'QuestionGroup', id: 'LIST' },
                      ]
                    : [{ type: 'QuestionGroup', id: 'LIST' }],
        }),

        getQuestionGroup: builder.query({
            query: (id) => `question-group/show/${id}`,
            transformResponse: unwrapData,
            providesTags: (result, error, id) => [{ type: 'QuestionGroup', id }],
        }),

        createQuestionGroup: builder.mutation({
            query: (body) => ({
                url: 'question-group/store',
                method: 'POST',
                body,
            }),
            transformResponse: unwrapData,
            invalidatesTags: [{ type: 'QuestionGroup', id: 'LIST' }],
        }),

        updateQuestionGroup: builder.mutation({
            query: ({ id, body }) => ({
                url: `question-group/update/${id}`,
                method: 'PUT',
                body,
            }),
            transformResponse: unwrapData,
            invalidatesTags: (result, error, { id }) => [
                { type: 'QuestionGroup', id },
                { type: 'QuestionGroup', id: 'LIST' },
            ],
        }),

        deleteQuestionGroup: builder.mutation({
            query: (id) => ({
                url: `question-group/destroy/${id}`,
                method: 'DELETE',
            }),
            invalidatesTags: (result, error, id) => [
                { type: 'QuestionGroup', id },
                { type: 'QuestionGroup', id: 'LIST' },
            ],
        }),
    }),
    overrideExisting: false,
});

export const {
    useGetQuestionGroupsQuery,
    useGetQuestionGroupQuery,
    useCreateQuestionGroupMutation,
    useUpdateQuestionGroupMutation,
    useDeleteQuestionGroupMutation,
} = questionGroupApi;