export type SearchResult = {
  searchResultImageSrcString: string;
  searchResultTitleString: string;
  searchResultLinkString: string;
  searchResultChapterCountString: string;
  searchResultReadDirectionString: string;
  searchResultGenreString: string;
};

export type MangaChapter = {
  mangaChapterTitleString: string;
  mangaChapterLinkString: string;
  mangaChapterDateString: string;
};

export type MangaDetails = {
  mangaImageSrcString: string;
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
