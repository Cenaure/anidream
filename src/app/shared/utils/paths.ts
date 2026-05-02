// Segments (for routers)
export const Segment = {
  dashboard: "dashboard",
  auth: "auth",
  profile: "profile",

  signIn: "sign-in",
  signUp: "sign-up",

  users: "users",
  groups: "groups",
  anime: "anime",
  producers: "producers",

  top: "top",
  random: "random",
  search: "search",

  list: "list",
  new: "new",
  edit: "edit",
  notFound: "not-found"
} as const;


// Routes (for links)
export const Route = {
  // Dashboard
  // users
  dashboardUsers: "/" + Segment.dashboard + "/" + Segment.users,
  dashboardNewUser: () => Route.dashboardUsers + "/" + Segment.new,
  dashboardEditUser: (userId: string | number) => Route.dashboardUsers + "/" + Segment.edit + "/" + userId,
  // groups
  dashboardGroups: "/" + Segment.dashboard + "/" + Segment.groups,
  dashboardListGroups: "/" + Segment.dashboard + "/" + Segment.groups + "/" + Segment.list,
  dashboardNewGroup: () => Route.dashboardGroups + "/" + Segment.new,
  dashboardEditGroup: (groupId: string | number) => Route.dashboardGroups + "/" + Segment.edit + "/" + groupId,
  // anime
  dashboardAnime: "/" + Segment.dashboard + "/" + Segment.anime + "/" + Segment.list,
  dashboardNewAnime: () => Route.dashboardAnime + "/" + Segment.new,
  dashboardEditAnime: (animeMalId: string | number) => Route.dashboardAnime + "/" + Segment.edit + "/" + animeMalId,
  // producers
  dashboardProducers: "/" + Segment.dashboard + "/" + Segment.producers,
  dashboardEditProducer: (producerMalId: string | number) => Route.dashboardProducers + "/" + Segment.edit + "/" + producerMalId,


  // Auth
  signIn: "/" + Segment.auth + "/" + Segment.signIn,
  signUp: "/" + Segment.auth + "/" + Segment.signUp,

  // Account
  profile: "/" + Segment.profile,

  // Public
  anime: "/" + Segment.anime,
  randomAnime: () => Route.anime + "/" + Segment.random,
  searchAnime: () => Route.anime + "/" + Segment.search,
  topAnime: () => Route.anime + "/" + Segment.top,
  notFound: "/" + Segment.notFound,

  // External
  cenaureWebsite: "https://cenaure.xyz",
  jikanWebsite: "https://jikan.moe",
  websiteRepo: "https://github.com/Cenaure/anidream",
} as const;
