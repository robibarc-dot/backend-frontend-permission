import { apiSlice } from '@/redux/apiSlice';

/**
 * RTK Query API slice for Practice Test management.
 * Maps to the Laravel backend routes defined in PracticeTestController.
 */

export interface PracticeTest {
	id: number;
    title: string;
    duration_mins: number;
    category: string;
    type: string;
    slug: string;
	created_at?: string;
	updated_at?: string;

}

export const practiceTestApi = apiSlice.injectEndpoints({
	endpoints: (builder) => ({
		getPracticeTests: builder.query<PracticeTest[], void>({
			query: () => 'practice-test',
			providesTags: (result) =>
				result
					? [
						...result.map(({ id }) => ({ type: 'PracticeTest' as const, id })),
						{ type: 'PracticeTest', id: 'LIST' },
					  ]
					: [{ type: 'PracticeTest', id: 'LIST' }],
		}),

		getPracticeTestCreateMetadata: builder.query<any, void>({
			query: () => 'practice-test/create',
		}),

		getPracticeTest: builder.query<PracticeTest, number | string>({
			query: (id) => `practice-test/show/${id}`,
			providesTags: (result, error, id) => [{ type: 'PracticeTest', id }],
		}),

		createPracticeTest: builder.mutation<PracticeTest, Partial<PracticeTest>>({
			query: (body) => ({
				url: 'practice-test/store',
				method: 'POST',
				body,
			}),
			invalidatesTags: [{ type: 'PracticeTest', id: 'LIST' }],
		}),

		updatePracticeTest: builder.mutation<PracticeTest, { id: number | string; body: Partial<PracticeTest> }>({
			query: ({ id, body }) => ({
				url: `practice-test/update/${id}`,
				method: 'PUT',
				body,
			}),
			invalidatesTags: (result, error, { id }) => [{ type: 'PracticeTest', id }, { type: 'PracticeTest', id: 'LIST' }],
		}),

		deletePracticeTest: builder.mutation<{ success: boolean }, number | string>({
			query: (id) => ({
				url: `practice-test/destroy/${id}`,
				method: 'DELETE',
			}),
			invalidatesTags: (result, error, id) => [{ type: 'PracticeTest', id }, { type: 'PracticeTest', id: 'LIST' }],
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
