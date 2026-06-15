import { apiSlice } from "../../../apiSlice";

export const commonApi = apiSlice.injectEndpoints({
    endpoints: (builder) => ({
        /**
         * Fetch a list of modules for the frontend.
         * GET frontend/get-modules
         */
        getModules: builder.query({
            query: (params) => ({
                url: 'frontend/get-modules',
                params, // Supports optional filtering or pagination params
            }),
            providesTags: (result) => {
                const modules = Array.isArray(result?.data)
                    ? result.data
                    : result?.data?.data || [];

                return modules.length
                    ? [
                          ...modules.map(({ id }) => ({ type: 'Module', id })),
                          { type: 'Module', id: 'LIST' },
                      ]
                    : [{ type: 'Module', id: 'LIST' }];
            },
        }),
    }),
    overrideExisting: false,
});

export const {
    useGetModulesQuery,
} = commonApi;