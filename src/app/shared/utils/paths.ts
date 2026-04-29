// Protected
export const dashboardRoute = "dashboard"

export const dashboardUsersRoute = "/" + dashboardRoute + "/users"
export const dashboardEditUserRoute = (userId: string | number) => dashboardUsersRoute + "/user-edit/" + userId;
export const dashboardCreateUserRoute =  "/" + dashboardUsersRoute + "user-new"

export const dashboardGroupsRoute =  "/" + dashboardRoute + "groups"
export const dashboardNewGroupRoute = dashboardGroupsRoute + "/new"
export const dashboardEditGroupRoute = (id: string) => dashboardGroupsRoute + `/edit/${id}`
export const dashboardListGroupsRoute =  "/" + dashboardGroupsRoute + "/list"

export const dashboardAnimeRoute = dashboardRoute + "anime"

// Auth
export const authRoute = "auth"
export const signIn = "sign-in"
export const signUp = "sign-up"
export const signUpRoute = "/" + authRoute + "/" + signUp
export const signInRoute = "/" + authRoute + "/" + signIn

// Account
export const profileRoute = "profile"

export const chatPageRoute = "chat"

// Public
export const animeRoute = "anime"
export const topAnimeRoute = "top"
export const randomAnime = "random"
export const randomAnimeRoute = animeRoute + "/" + randomAnime

export const searchAnime = "search"
export const searchAnimeRoute = animeRoute + "/" + searchAnime

// External
export const cenaureRoute = "https://cenaure.xyz"
export const jikanRoute = "https://jikan.moe"
export const websiteRepoRoute = "https://github.com/Cenaure/anidream"
export const serverRepoRoute = "https://github.com/Cenaure/rust-server"

// Other
export const notFoundRoute = "not-found"
