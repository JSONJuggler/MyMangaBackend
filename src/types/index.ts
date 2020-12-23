export type SearchResult = {
  searchResultCoverUrlString: string;
  searchResultTitleString: string;
  searchResultLinkString: string;
  searchResultChapterCount: number;
  searchResultReadDirectionString: string;
  searchResultGenreString: string;
};

export type MangaChapter = {
  mangaChapterTitleString: string;
  mangaChapterLinkString: string;
  mangaChapterDateString: string;
};

export type MangaDetails = {
  mangaLinkString: string;
  mangaAuthorString: string;
  mangaArtistString: string;
  mangaSummaryString: string;
  mangaChapters: Array<MangaChapter>;
};

export type ChapterPage = {
  chapterImageSrc: string;
  chapterImageWidth: string;
  chapterImageHeight: string;
};
