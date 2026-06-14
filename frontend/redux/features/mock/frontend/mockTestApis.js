import { apiSlice } from '@/redux/apiSlice';

export const mockTestApi = apiSlice.injectEndpoints({
    endpoints: (builder) => ({
        /**
         * Fetch a list of mock tests.
         * Maps to: GET /frontend/mock-tests
         */
        getMockTests: builder.query({
            query: (params) => ({
                url: 'frontend/mock-tests',
                params, // Supports search, pagination, and filters
            }),
            providesTags: (result) =>
                result?.data?.data
                    ? [...result.data.data.map(({ id }) => ({ type: 'MockTest', id })), { type: 'MockTest', id: 'LIST' }]
                    : [{ type: 'MockTest', id: 'LIST' }],
        }),

        /**
         * Fetch detailed info for a specific mock test.
         * Maps to: GET /frontend/mock-tests/{identifier}
         */
        getMockTest: builder.query({
            query: (identifier) => `frontend/mock-tests/${identifier}`,
            providesTags: (result, error, identifier) => [{ type: 'MockTest', id: identifier }],
        }),

        /**
         * Initialize a new mock test attempt.
         * Maps to: POST /frontend/mock-tests/{identifier}/start
         */
        startMockTest: builder.mutation({
            query: (identifier) => ({
                url: `frontend/mock-tests/${identifier}/start`,
                method: 'POST',
            }),
        }),

        /**
         * Fetch the question set for a specific mock test attempt.
         * Maps to: GET /frontend/mock-tests/{identifier}/questions
         */
        getMockTestQuestions: builder.query({
            query: ({ identifier, ...params }) => ({
                url: `frontend/mock-tests/${identifier}/questions`,
                params,
            }),
            providesTags: (result, error, { identifier }) => [{ type: 'MockTestQuestion', id: identifier }],
        }),

        /**
         * Submit answers for scoring and completion.
         * Maps to: POST /frontend/mock-tests/{identifier}/submit
         */
        submitMockTest: builder.mutation({
            query: ({ identifier, answers }) => ({
                url: `frontend/mock-tests/${identifier}/submit`,
                method: 'POST',
                body: { answers },
            }),
            invalidatesTags: (result, error, { identifier }) => [
                { type: 'MockTest', id: identifier },
                { type: 'MockTestQuestion', id: identifier }
            ],
        }),
    }),
    overrideExisting: false,
});

export const {
    useGetMockTestsQuery,
    useGetMockTestQuery,
    useStartMockTestMutation,
    useGetMockTestQuestionsQuery,
    useSubmitMockTestMutation,
} = mockTestApi;