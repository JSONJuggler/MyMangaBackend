export type SearchResult = {
  searchResultImageSrcString: string;
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
  mangaCoverImageString: string;
  mangaLinkString: string;
  mangaAuthorString: string;
  mangaArtistString: string;
  mangaSummaryString: string;
  mangaChapters: Array<MangaChapter>;
};

export type ChapterPage = {
  chapterImageSrcString: string;
  chapterImageWidth: number;
  chapterImageHeight: number;
};
