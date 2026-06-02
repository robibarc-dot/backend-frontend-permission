export function normalizeRoleName(role) {
    if (!role) {
        return "";
    }

    if (typeof role === "string") {
        return role.toLowerCase();
    }

    if (typeof role === "object") {
        return (
            role.name ||
            role.slug ||
            role.title ||
            role.role ||
            ""
        )
            .toString()
            .toLowerCase();
    }

    return "";
}

export function extractRoleNames(user, roles = []) {
    const combinedRoles = [
        ...(Array.isArray(roles) ? roles : []),
        ...(Array.isArray(user?.roles) ? user.roles : []),
    ];

    return combinedRoles
        .map(normalizeRoleName)
        .filter(Boolean);
}

export function getPrimaryRole(user, roles = []) {
    const roleNames = extractRoleNames(user, roles);

    if (roleNames.includes("super-admin")) {
        return "super-admin";
    }

    if (roleNames.includes("admin")) {
        return "admin";
    }

    if (roleNames.includes("teacher")) {
        return "teacher";
    }

    if (roleNames.includes("student") || roleNames.includes("user")) {
        return "student";
    }

    return roleNames[0] || null;
}

export function getRoleHomePath(role) {
    if (!role) {
        return "/login";
    }

    if (role === "student") {
        return "/student";
    }

    return `/${role}`;
}

export function isStaffRole(role) {
    return role === "super-admin" || role === "admin" || role === "teacher";
}
