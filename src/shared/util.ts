export const clientRoutes = [
    "/admin",
    "/dashboard",
    "/groups",
    "/login",
    "/register",
    "/users",
];

export const blacklists = {
    username: [
        "admin",
        "poopface",
        "root",
        "user",
    ],
    groupName: [
        "group",
        "my",
        "newgroup",
        "new",
        "manage",
        "myGroups",
    ],
    groupCustomUrl: [
        "group",
        "mygroup",
        "user",
        "myGroups",
        "new",
    ],
};

export const regex = {
    alphanumericDashUnderscore128: /[-_a-zA-Z0-9]{2,128}/g,
    alphanumericDashUnderscore256: /[-_a-zA-Z0-9]{2,256}/g
}
