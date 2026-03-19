export const dashboardRoute = "/dashboard"

export const dashboardUsersRoute = dashboardRoute + "/users"
export const dashboardEditUserRoute = (userId: string | number) => dashboardUsersRoute + "/user-edit/" + userId;
export const dashboardCreateUserRoute = dashboardUsersRoute + "/user-new"

export const dashboardGroupsRoute = dashboardRoute + "/groups"
export const dashboardNewGroupRoute = dashboardUsersRoute + "/groups/new"
export const dashboardEditGroupRoute = (id: string) => dashboardUsersRoute + `/groups/edit/${id}`
export const dashboardListGroupsRoute = dashboardUsersRoute + "/groups/list"


export const authRoute = "/auth"
export const signUpRoute = authRoute + "/sign-up"
export const signInRoute = authRoute + "/sign-in"

