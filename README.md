# Welcome!

Created by Beau Reescano - [Checkout my other stuff at webdeveloperbeau.com!](https://webdeveloperbeau.com)

[Live at manga-back.webdeveloperbeau.com](https://www.mangareader.net/)

[Need to report something broken? Do that here!](https://github.com/JSONJuggler/MyMangaBackend/issues)

This is a RESTful api built using Typescript and Puppeteer for searching manga on [mangareader.net](https://www.mangareader.net/)

Source website used previously was [mangapanda.com](http://www.mangapanda.com/) but it seems to have been taken down.

### Endpoints

---

GET `/api/manga/search` - Get filtered search results for requested manga using query params

- returns json response: Array of objects of the **SearchResult** type

  ```typescript
  type SearchResult = {
    searchResultImageSrcString: string,
    searchResultTitleString: string,
    searchResultLinkString: string,
    searchResultChapterCountString: string,
    searchResultReadDirectionString: string,
    searchResultGenreString: string,
  };
  ```

- `https://manga-back.webdeveloperbeau.com/api/manga/search?w=blade&rd=0&genre=0000000000000000000000000000000000000&order=0&status=0`

  ```json
  [
    {
      "searchResultImageSrcString": "s4.mangareader.net/cover/break-blade/break-blade-r0.jpg",
      "searchResultTitleString": "Break Blade",
      "searchResultLinkString": "https://www.mangareader.net/break-blade",
      "searchResultChapterCountString": "100 Chapters Published. (Ongoing)",
      "searchResultReadDirectionString": "Manga (Read Right to Left)",
      "searchResultGenreString": "Shounen"
    },
    {
      "searchResultImageSrcString": "s4.mangareader.net/cover/xblade/xblade-r0.jpg",
      "searchResultTitleString": "XBlade",
      "searchResultLinkString": "https://www.mangareader.net/xblade",
      "searchResultChapterCountString": "49 Chapters Published. (Ongoing)",
      "searchResultReadDirectionString": "Manga (Read Right to Left)",
      "searchResultGenreString": "Action, Seinen"
    },
    {
      "searchResultImageSrcString": "s4.mangareader.net/cover/blade-of-the-immortal/blade-of-the-immortal-r0.jpg",
      "searchResultTitleString": "Blade of the Immortal",
      "searchResultLinkString": "https://www.mangareader.net/blade-of-the-immortal",
      "searchResultChapterCountString": "163 Chapters Published. (Ongoing)",
      "searchResultReadDirectionString": "Manga (Read Right to Left)",
      "searchResultGenreString": "Historical, Horror, Supernatural"
    },
    ...
    ..
    .
  ]
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

- returns json response: Object of the **MangaDetails** type

  ```typescript
  type MangaDetails = {
    mangaImageSrcString: string,
    mangaLinkString: string,
    mangaAuthorString: string,
    mangaArtistString: string,
    mangaSummaryString: string,
    mangaChapters: Array<{
      mangaChapterTitleString: string,
      mangaChapterLinkString: string,
      mangaChapterDateString: string,
    }>
  };
  ```

- `https://manga-back.webdeveloperbeau.com/api/manga/details?requestUrl=https://www.mangareader.net/the-breaker-new-waves`

  ```json
  {
    "mangaLinkString": "https://www.mangareader.net/the-breaker-new-waves",
    "mangaAuthorString": "JEON Geuk-jin (Story), PARK Jin-Hwan (Art)",
    "mangaArtistString": "",
    "mangaSummaryString": "Continuation of The Breaker with new allies and enemies.",
    "mangaChapters": [
      {
        "mangaChapterTitleString": "The Breaker: New Waves 1",
        "mangaChapterLinkString": "https://www.mangareader.net/the-breaker-new-waves/1",
        "mangaChapterDateString": "11/23/2010"
      },
      {
        "mangaChapterTitleString": "The Breaker: New Waves 2",
        "mangaChapterLinkString": "https://www.mangareader.net/the-breaker-new-waves/2",
        "mangaChapterDateString": "11/23/2010"
      },
      ...
      ..
      .
    ]
  }
  ```

- paramters

  - **requestUrl** _`string required`_ - The mangareader link of the requested manga

---

GET `/api/manga/pages` - Get all pages/images of a specific manga

- returns json response: Array of objects of the **ChapterPage** type

  ```typescript
  type ChapterPage = {
    chapterImageSrcString: string,
    chapterImageWidth: number,
    chapterImageHeight: number,
  };
  ```

- `https://manga-back.webdeveloperbeau.com/api/manga/pages?chapterLandingUrl=https://www.mangareader.net/the-breaker-new-waves/1`

  ```json
  [
    .
    ..
    ...
    {
      "chapterImageSrcString": "https://i2.imggur.net/the-breaker-new-waves/1/the-breaker-new-waves-1528451.jpg",
      "chapterImageHeight": 535,
      "chapterImageWidth": 800
    },
    {
      "chapterImageSrcString": "data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZlcnNpb249IjEuMCIgd2lkdGg9IjY0IiBoZWlnaHQ9IjY0IiB2aWV3Qm94PSIwIDAgMTI4IDEyOCI+PGc+PHBhdGggZmlsbD0iIzIyNDRhYiIgZD0iTTY0IDEyOGE2NCA2NCAwIDExNjQtNjQgNjQgNjQgMCAwMS02NCA2NHpNNjQgM2E2MSA2MSAwIDEwNjEgNjFBNjEgNjEgMCAwMDY0IDN6Ii8+PHBhdGggZmlsbD0iIzIyNDRhYiIgZD0iTTY0IDEyOGE2NCA2NCAwIDExNjQtNjQgNjQgNjQgMCAwMS02NCA2NHpNNjQgM0E2MSA2MSAwIDAwMyA3MmMyLTMgNC02IDgtNiA2LTEgMTIgMiAxMyA4IDQgMTEgMSAyMyAxNSAzNSAyMCAxNiA0MSAxMyA1MyA5QTYxIDYxIDAgMDA2NCAzeiIvPjxhbmltYXRlVHJhbnNmb3JtIGF0dHJpYnV0ZU5hbWU9InRyYW5zZm9ybSIgdHlwZT0icm90YXRlIiBmcm9tPSIwIDY0IDY0IiB0bz0iMzYwIDY0IDY0IiBkdXI9IjE4MDBtcyIgcmVwZWF0Q291bnQ9ImluZGVmaW5pdGUiLz48L2c+PC9zdmc+",
      "chapterImageHeight": 534,
      "chapterImageWidth": 800
    },
    ...
    ..
    .
  ]
  ```

- parameters

  - **chapterLandingUrl** _`string required`_ - The mangareader link of the requested chapter

---
