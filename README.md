# AniDream
## Kontrolný zoznam požiadaviek

> **Poznámka:** Tento projekt pracuje s **anime** namiesto filmov. Ekvivalenty sú nasledovné:
> - `Film` → `Anime`
> - `FilmEdit` → `AnimeEdit`
> - Režiséri → Producers
> - Postavy → Characters
---
**Signálne formuláre použité v projekte:**

!TODO not implemented yet
1. **AnimeEdit** - hlavný komponent na pridanie aj úpravu anime (ekvivalent FilmEdit)  
   → [`src/app/anime/anime-edit/anime-edit.component.ts`](src/app/anime/anime-edit/anime-edit.component.ts)
2. **SignIn** 
   → [`src/app/core/auth/pages/sign-in/sign-in.component.ts`](src/app/core/auth/pages/sign-in/sign-in.component.ts)
3. **SignUp**
   → [`src/app/core/auth/pages/sign-up/sign-up.component.ts`](src/app/core/auth/pages/sign-up/sign-up.component.ts)
4. **UserEdit**
   → [`src/app/features/dashboard/users/user-edit/user-edit.component.ts`](src/app/features/dashboard/users/pages/user-edit/user-edit.component.ts)
5. **GroupEdit**
   → [`src/app/features/dashboard/groups/components/group-edit/group-edit.component.ts`](src/app/features/dashboard/groups/components/group-edit/group-edit.component.ts)

---
- V projekte **neboli použité** template-driven ani reaktívne formuláre - výlučne signálne formuláre
- Direktívy `*ngIf` a `*ngFor` **neboli použité** nikde v projekte - nahradené `@if`, `@for`

---

# AniDream

A full-stack anime discovery app built with **Angular** (frontend) and **Rust + Actix Web** (backend), pulling live data from the [Jikan API](https://jikan.moe/) (unofficial MyAnimeList REST API) and caching results in **MongoDB**.

## Tech Stack

| Layer | Technology                          |
|---|-------------------------------------|
| Frontend | Angular 21, Tailwind CSS, SpartanUi |
| Backend | Rust, Actix Web                     |
| Database | MongoDB                             |
| External API | Jikan v4 (MyAnimeList)              |

## Features

- Browse top-rated anime
- Get random anime
- Look for any anime from Jikan API
- View detailed anime info – synopsis, score, ranking, genres, characters, staff
- Add and edit anime entries via `AnimeEdit` component
- Results cached in MongoDB to reduce external API calls
- really awesome design :)
