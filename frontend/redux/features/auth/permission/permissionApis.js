import { apiSlice } from '@/redux/apiSlice';

/**
 * RTK Query API slice for Permission management.
 * Maps to the Laravel backend routes defined in PermissionController.
 */
export const permissionApis = apiSlice.injectEndpoints({
    endpoints: (builder) => ({
        getPermissionsMeta: builder.query({
            query: () => '/backend/permissions/meta',
        }),

        getPermissions: builder.query({
            query: () => '/backend/permissions',
            providesTags: (result) =>
                result?.permissions
                    ? [
                        ...result.permissions.map(({ id }) => ({ type: 'Permission', id })),
                        { type: 'Permission', id: 'LIST' },
                      ]
                    : [{ type: 'Permission', id: 'LIST' }],
        }),

        getPermission: builder.query({
            query: (id) => `/backend/permissions/${id}`,
            providesTags: (result, error, id) => [{ type: 'Permission', id }],
        }),

        createPermission: builder.mutation({
            query: (body) => ({
                url: '/backend/permissions',
                method: 'POST',
                body,
            }),
            invalidatesTags: [{ type: 'Permission', id: 'LIST' }],
        }),

        updatePermission: builder.mutation({
            query: ({ id, body }) => ({
                url: `/backend/permissions/${id}`,
                method: 'PUT',
                body,
            }),
            invalidatesTags: (result, error, { id }) => [{ type: 'Permission', id }, { type: 'Permission', id: 'LIST' }],
        }),
    }),
    overrideExisting: false,
});

export const {
    useGetPermissionsMetaQuery,
    useGetPermissionsQuery,
    useGetPermissionQuery,
    useCreatePermissionMutation,
    useUpdatePermissionMutation,
} = permissionApis;