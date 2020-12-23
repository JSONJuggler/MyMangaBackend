# Welcome!

Created by Beau Reescano - [Checkout my other stuff at webdeveloperbeau.com!](https://webdeveloperbeau.com)

[Live at manga-back.webdeveloperbeau.com](https://www.mangareader.net/)

This is a RESTful api built using Typescript and Puppeteer for searching manga on [mangareader.net](https://www.mangareader.net/)

Source website used previously was [mangapanda.com](http://www.mangapanda.com/) but it seems to have been taken down.

### Endpoints

---

GET `/api/manga/search` - Get filtered search results for requested manga using query params

- returns json response:

  ```typescript
  Array<{
    searchResultImageSrcString: string,
    searchResultTitleString: string,
    searchResultLinkString: string,
    searchResultChapterCount: number,
    searchResultReadDirectionString: string,
    searchResultGenreString: string,
  }>
  ```

- parameters:

  - **w** _`string optional`_ - Name of the manga to search

  - **rd** _`string optional`_ - Manga type corresponding to reading direction
    | manga type | parameter |
    | ------------------------------ | --------- |
    | Manga and Manhwa | 0 |
    | Manhwa (reading Left to Right) | 1 |
    | Manga (reading Right to Left) | 2 |

  - **status** _`string optional`_ - Manga status

    | manga status         | parameter |
    | -------------------- | --------- |
    | Ongoing and Complete | 0         |
    | Ongoing              | 1         |
    | Complete             | 2         |

  - **order** _`string optional`_ - Manga sort order

    | manga sort order | parameter |
    | ---------------- | --------- |
    | Similarity       | 0         |
    | Alphabetical     | 1         |
    | Popularity       | 2         |

  - **genre** _`string optional`_ - Manga genre(s) to filter by

    | filter action | parameter |
    | ------------- | --------- |
    | -             | 0         |
    | Include       | 1         |
    | Exclude       | 2         |

    <br/>

    | genre name    | genre string parameter index |
    | ------------- | ---------------------------- |
    | Action        | 0                            |
    | Adventure     | 1                            |
    | Comedy        | 2                            |
    | Demons        | 3                            |
    | Drama         | 4                            |
    | Ecchi         | 5                            |
    | Fantasy       | 6                            |
    | Gender Bender | 7                            |
    | Harem         | 8                            |
    | Historical    | 9                            |
    | Horror        | 10                           |
    | Josei         | 11                           |
    | Magic         | 12                           |
    | Martial Arts  | 13                           |
    | Mature        | 14                           |
    | Mecha         | 15                           |
    | Military      | 16                           |
    | Mystery       | 17                           |
    | One Shot      | 18                           |
    | Psychological | 19                           |
    | Romance       | 20                           |
    | School Life   | 21                           |
    | Sci-Fi        | 22                           |
    | Seinen        | 23                           |
    | Shoujo        | 24                           |
    | Shoujoai      | 25                           |
    | Shounen       | 26                           |
    | Shounenai     | 27                           |
    | Slice of Life | 28                           |
    | Smut          | 29                           |
    | Sports        | 30                           |
    | Super Power   | 31                           |
    | Supernatural  | 32                           |
    | Tragedy       | 33                           |
    | Vampire       | 34                           |
    | Yaoi          | 35                           |
    | Yuri          | 36                           |

> _Note: To form the genre query string that can be parsed by mangareader, you must concatonate parameters ordered alphabetically according to all 37 available genres in the genre names table._\
> \
> _A genre query parameter to filter out all genres EXCEPT the comedy drama: genre="0010000000000000000000000000000000000"_\
> \
> _A genre query parameter to filter out the drama and horror genres: genre="0000200000200000000000000000000000000"_

---

GET `/api/manga/details` - Get details of a manga

- returns json response:

  ```typescript
  {
    mangaLinkString: string,
    mangaAuthorString: string,
    mangaArtistString: string,
    mangaSummaryString: string,
    mangaChapters: Array<{
      mangaChapterTitleString: string,
      mangaChapterLinkString: string,
      mangaChapterDateString: string,
    }>
  }
  ```

- paramters

  - **requestUrl** _`string required`_ - The mangareader link of the requested manga

---

GET `/api/manga/pages` - Get all pages/images of a specific manga

- returns json response:

  ```typescript
  {
    chapterPages: Array<{
      chapterImageSrcString: string,
      chapterImageWidth: number,
      chapterImageHeight: number,
    }>
  }
  ```

- parameters

  - **chapterLandingUrl** _`string required`_ - The mangareader link of the requested chapter

---
