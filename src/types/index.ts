export type SearchResult = {
  searchResultCoverUrlString: string;
  searchResultTitleString: string;
  searchResultLinkString: string;
  searchResultChapterCount: number;
  searchResultTypeString: string;
  searchResultGenreString: string;
};

export type MangaChapter = {
  mangaChapterTitleString: string;
  mangaChapterLinkString: string;
  mangaChapterNumber: number;
  mangaChapterDateString: string;
};

export type MangaDetails = {
  mangaTitleString: string;
  mangaCoverUrlString: string;
  mangaLinkString: string;
  mangaAuthorString: string;
  mangaArtistString: string;
  mangaSummaryString: string;
  mangaChapters: Array<MangaChapter>;
};

export type ChapterPage = {
  chapterImageUrl: string;
  imageWidth: string;
  imageHeight: string;
};
