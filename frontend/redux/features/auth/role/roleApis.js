import { apiSlice } from '@/redux/apiSlice';

/**
 * RTK Query API slice for Role management.
 * Maps to the Laravel backend routes defined in RoleController.
 */
export const roleApis = apiSlice.injectEndpoints({
    endpoints: (builder) => ({
        getRolesMeta: builder.query({
            query: () => '/backend/roles/meta',
        }),

        getRoles: builder.query({
            query: () => '/backend/roles',
            providesTags: (result) =>
                result?.roles
                    ? [
                        ...result.roles.map(({ id }) => ({ type: 'Role', id })),
                        { type: 'Role', id: 'LIST' },
                      ]
                    : [{ type: 'Role', id: 'LIST' }],
        }),

        getRole: builder.query({
            query: (id) => `/backend/roles/${id}`,
            providesTags: (result, error, id) => [{ type: 'Role', id }],
        }),

        createRole: builder.mutation({
            query: (body) => ({
                url: '/backend/roles',
                method: 'POST',
                body,
            }),
            invalidatesTags: [{ type: 'Role', id: 'LIST' }],
        }),

        updateRole: builder.mutation({
            query: ({ id, body }) => ({
                url: `/backend/roles/${id}`,
                method: 'PUT',
                body,
            }),
            invalidatesTags: (result, error, { id }) => [{ type: 'Role', id }, { type: 'Role', id: 'LIST' }],
        }),
    }),
    overrideExisting: false,
});

export const {
    useGetRolesMetaQuery,
    useGetRolesQuery,
    useGetRoleQuery,
    useCreateRoleMutation,
    useUpdateRoleMutation,
} = roleApis;