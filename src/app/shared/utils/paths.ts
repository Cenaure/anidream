export const dashboardRoute = "/dashboard"
export const dashboardUsersRoute = dashboardRoute + "/users"
export const dashboardEditUserRoute = (userId: string | number) => dashboardUsersRoute + "/user-edit/" + userId;
export const dashboardCreateUserRoute = dashboardUsersRoute + "/user-new"
export const dashboardGroupsRoute = dashboardUsersRoute + "/groups"
export const dashboardEditGroupRoute = (id: string) => dashboardUsersRoute + `/groups/${id}`
export const dashboardListGroupsRoute = dashboardUsersRoute + "/groups/"

export const authRoute = "/auth"
export const signUpRoute = authRoute + "/sign-up"
export const signInRoute = authRoute + "/sign-in"

