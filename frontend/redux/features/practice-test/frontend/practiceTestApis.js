import { apiSlice } from "../../../apiSlice";

export const practiceTestApi = apiSlice.injectEndpoints({
    endpoints: (builder) => ({
        /**
         * Fetch a list of practice tests with optional filtering and pagination.
         * GET frontend/practice-tests
         */
        getPracticeTests: builder.query({
            query: (params) => ({
                url: 'frontend/practice-tests',
                params, // Supports category, type, search, module_id, per_page, paginate
            }),
            providesTags: (result) => {
                const tests = Array.isArray(result?.data)
                    ? result.data
                    : result?.data?.data || [];

                return tests.length
                    ? [
                          ...tests.map(({ id }) => ({ type: 'PracticeTest', id })),
                          { type: 'PracticeTest', id: 'LIST' },
                      ]
                    : [{ type: 'PracticeTest', id: 'LIST' }];
            },
        }),

        /**
         * Fetch a single practice test by ID or Slug.
         * GET frontend/practice-tests/{identifier}
         */
        getPracticeTest: builder.query({
            query: (identifier) => `frontend/practice-tests/${identifier}`,
            providesTags: (result, error, identifier) => [{ type: 'PracticeTest', id: identifier }],
        }),

        /**
         * Initialize a test attempt.
         * POST frontend/practice-tests/{identifier}/start
         */
        startPracticeTest: builder.mutation({
            query: ({ identifier, ...params }) => ({
                url: `frontend/practice-tests/${identifier}/start`,
                method: 'POST',
                params,
            }),
        }),

        /**
         * Get questions for a specific test.
         * GET frontend/practice-tests/{identifier}/questions
         */
        getPracticeTestQuestions: builder.query({
            query: ({ identifier, ...params }) => ({
                url: `frontend/practice-tests/${identifier}/questions`,
                params,
            }),
            providesTags: (result, error, { identifier }) => [{ type: 'PracticeTestQuestion', id: identifier }],
        }),

        /**
         * Submit test answers for scoring.
         * POST frontend/practice-tests/{identifier}/submit
         */
        submitPracticeTest: builder.mutation({
            query: ({ identifier, answers, ...params }) => ({
                url: `frontend/practice-tests/${identifier}/submit`,
                method: 'POST',
                body: { answers, ...params },
            }),
            invalidatesTags: (result, error, { identifier }) => [
                { type: 'PracticeTest', id: identifier },
                { type: 'PracticeTestQuestion', id: identifier },
                { type: 'PracticeTest', id: `${identifier}-results` },
            ],
        }),

        /**
         * Fetch the latest submission results for a practice test.
         * GET frontend/practice-tests/{identifier}/results
         */
        getPracticeTestResults: builder.query({
            query: ({ identifier, ...params }) => ({
                url: `frontend/practice-tests/${identifier}/results`,
                params,
            }),
            providesTags: (result, error, { identifier }) => [
                { type: 'PracticeTest', id: `${identifier}-results` },
            ],
        }),
    }),
    overrideExisting: false,
});

export const {
    useGetPracticeTestsQuery,
    useGetPracticeTestQuery,
    useStartPracticeTestMutation,
    useGetPracticeTestQuestionsQuery,
    useSubmitPracticeTestMutation,
    useGetPracticeTestResultsQuery,
} = practiceTestApi;
