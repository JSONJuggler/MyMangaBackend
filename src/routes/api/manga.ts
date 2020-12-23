import express, { Request, Response, NextFunction, Router } from 'express';
import puppeteer, {
  Page,
  Browser,
  ConsoleMessage,
  ElementHandle,
  JSHandle
} from 'puppeteer';
import isURL from 'validator/lib/isURL';
import isInt from 'validator/lib/isInt';
import {
  ChapterPage,
  MangaChapter,
  MangaDetails,
  SearchResult
} from '../../types';

// create router
const router: Router = express.Router();

// @route GET api/manga/search
// @description Route to search manga (test)
// @access Public
router.get(
  '/search',
  async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const searchRequest: any = req.query;
      const { w, rd, status, order, genre } = searchRequest;
      if (rd) {
        if (!isInt(rd, { min: 0, max: 2 })) {
          res.status(400).send({
            status: 'Error - Bad Request',
            code: 400,
            message:
              'Unable to process request. Please provide  valid query parameters. Refer to docs: https://manga-back.webdeveloperbeau.com/'
          });
          return;
        }
      }
      if (status) {
        if (!isInt(status, { min: 0, max: 2 })) {
          res.status(400).send({
            status: 'Error - Bad Request',
            code: 400,
            message:
              'Unable to process request. Please provide  valid query parameters. Refer to docs: https://manga-back.webdeveloperbeau.com/'
          });
          return;
        }
      }
      if (order) {
        if (!isInt(order, { min: 0, max: 2 })) {
          res.status(400).send({
            status: 'Error - Bad Request',
            code: 400,
            message:
              'Unable to process request. Please provide  valid query parameters. Refer to docs: https://manga-back.webdeveloperbeau.com/'
          });
          return;
        }
      }
      if (genre) {
        for (let i = 0; i < genre.length; i++) {
          if (!genre[i] || !isInt(genre[i], { min: 0, max: 2 })) {
            res.status(400).send({
              status: 'Error - Bad Request',
              code: 400,
              message:
                'Unable to process request. Please provide  valid query parameters. Refer to docs: https://manga-back.webdeveloperbeau.com/'
            });
            return;
          }
        }
      }

      const browser: Browser = await puppeteer.launch({
        args: ['--no-sandbox', '--disable-setuid-sandbox']
      });

      const page: Page = await browser.newPage();

      if (w) {
        await page.goto(
          'http://www.mangareader.net/search/?w=' +
            w.trim().replace(' ', '+') +
            '&rd=' +
            rd +
            '&status=' +
            status +
            '&order=' +
            order +
            '&genre=' +
            genre,
          { waitUntil: 'domcontentloaded', timeout: 10000 }
        );
      } else {
        await page.goto(
          'http://www.mangareader.net/search/?rd=' +
            rd +
            '&status=' +
            status +
            '&order=' +
            order +
            '&genre=' +
            genre,
          {
            waitUntil: 'domcontentloaded',
            timeout: 10000
          }
        );
      }

      const searchResultElementHandles: Array<ElementHandle> = await page.$$(
        'div#ares > div.d54'
      );

      const searchResultMapping: Array<
        Promise<SearchResult>
      > = searchResultElementHandles.map(
        async (
          searchResultElementHandle: ElementHandle
        ): Promise<SearchResult> => {
          const searchResultTitleElement: JSHandle<Element> | null = await searchResultElementHandle.$(
            'div.d57 > a'
          );
          const searchResultChapterCountElement: JSHandle<Element> | null = await searchResultElementHandle.$(
            'div.d58'
          );
          const searchResultReadDirectionElement: JSHandle<Element> | null = await searchResultElementHandle.$(
            'div.d59'
          );
          const searchResultGenreElement: JSHandle<Element> | null = await searchResultElementHandle.$(
            'div.d60'
          );
          const searchResultTitleHandle:
            | JSHandle
            | undefined = await searchResultTitleElement?.getProperty(
            'innerText'
          );
          const searchResultLinkHandle:
            | JSHandle
            | undefined = await searchResultTitleElement?.getProperty('href');
          const searchResultChapterCountHandle:
            | JSHandle
            | undefined = await searchResultChapterCountElement?.getProperty(
            'innerText'
          );
          const searchResultReadDirectionHandle:
            | JSHandle
            | undefined = await searchResultReadDirectionElement?.getProperty(
            'innerText'
          );
          const searchResultGenreHandle:
            | JSHandle
            | undefined = await searchResultGenreElement?.getProperty(
            'innerText'
          );

          const searchResultImageSrc:
            | string
            | null = await searchResultElementHandle.$eval(
            'table > tbody > tr > td:nth-child(2) > div.d56',
            el => el.getAttribute('style')
          );

          const parsedSearchResultImageSrc = searchResultImageSrc?.slice(
            25,
            -3
          );
          const searchResultImageSrcString: string = (await parsedSearchResultImageSrc) as string;
          const searchResultTitleString: string = (await searchResultTitleHandle?.jsonValue()) as string;
          const searchResultLinkString: string = (await searchResultLinkHandle?.jsonValue()) as string;
          const searchResultChapterCountString: string = (await searchResultChapterCountHandle?.jsonValue()) as string;
          const searchResultReadDirectionString: string = (await searchResultReadDirectionHandle?.jsonValue()) as string;
          const searchResultGenreString: string = (await searchResultGenreHandle?.jsonValue()) as string;

          return {
            searchResultImageSrcString,
            searchResultTitleString,
            searchResultLinkString,
            searchResultChapterCountString,
            searchResultReadDirectionString,
            searchResultGenreString
          };
        }
      );

      const searchResults: Array<SearchResult> = await Promise.all(
        searchResultMapping
      );

      await browser.close();

      res.send(searchResults);
    } catch (err) {
      console.error(err);
      res.status(400).send({
        status: 'Error - Bad Request',
        code: 400,
        message:
          'Unable to process request. Either mangareader.net has been updated or there is an invalid query parameter. Please provide valid query parameters or report something broken here:https://github.com/JSONJuggler/MyMangaBackend/issues. Refer to docs: https://manga-back.webdeveloperbeau.com/'
      });
      return;
    }
  }
);

// @route GET api/manga/details
// @description Route to get manga details
// @access Public
router.get(
  '/details',
  async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const { requestUrl }: any = req.query;

      if (!requestUrl || !isURL(requestUrl)) {
        res.status(400).send({
          status: 'Error - Bad Request',
          code: 400,
          message:
            'Unable to process request. Please provide a valid link to a mangareader.net manga. Refer to docs: https://manga-back.webdeveloperbeau.com/'
        });
        return;
      }

      const browser: Browser = await puppeteer.launch({
        args: ['--no-sandbox', '--disable-setuid-sandbox']
      });

      const page: Page = await browser.newPage();

      await page.goto(requestUrl, {
        waitUntil: 'domcontentloaded',
        timeout: 10000
      });

      const mangaImageSrcElement: JSHandle<Element> | null = await page.$(
        'div#d38 > img'
      );
      const mangaAuthorElement: JSHandle<Element> | null = await page.$(
        'div.d39  tbody  tr:nth-child(5)  td:nth-child(2)'
      );
      const mangaArtistElement: JSHandle<Element> | null = await page.$(
        'div.d39 table tbody tr:nth-child(6) td:nth-child(2)'
      );
      const mangaSummaryElement: JSHandle<Element> | null = await page.$(
        'div.d46 > p'
      );

      const mangaImageSrcHandle:
        | JSHandle
        | undefined = await mangaImageSrcElement?.getProperty('src');
      const mangaAuthorHandle:
        | JSHandle
        | undefined = await mangaAuthorElement?.getProperty('innerText');
      const mangaArtistHandle:
        | JSHandle
        | undefined = await mangaArtistElement?.getProperty('innerText');
      const mangaSummaryHandle:
        | JSHandle
        | undefined = await mangaSummaryElement?.getProperty('innerText');

      const mangaChaptersElementHandles: Array<ElementHandle> = await page.$$(
        'tr.d49 ~ tr'
      );

      const mangaChaptersMapping: Array<
        Promise<MangaChapter>
      > = mangaChaptersElementHandles.map(
        async (
          mangaChapterElementHandle: ElementHandle
        ): Promise<MangaChapter> => {
          const mangaChapterTitleElement: JSHandle<Element> | null = await mangaChapterElementHandle.$(
            'a'
          );
          const mangaChapterDateElement: JSHandle<Element> | null = await mangaChapterElementHandle.$(
            'td:nth-child(2)'
          );
          const mangaChapterTitleHandle:
            | JSHandle
            | undefined = await mangaChapterTitleElement?.getProperty(
            'innerText'
          );
          const mangaChapterLinkHandle:
            | JSHandle
            | undefined = await mangaChapterTitleElement?.getProperty('href');
          const mangaChapterDateHandle:
            | JSHandle
            | undefined = await mangaChapterDateElement?.getProperty(
            'innerText'
          );

          const mangaChapterTitleString: string = (await mangaChapterTitleHandle?.jsonValue()) as string;
          const mangaChapterLinkString: string = (await mangaChapterLinkHandle?.jsonValue()) as string;
          const mangaChapterDateString: string = (await mangaChapterDateHandle?.jsonValue()) as string;

          return {
            mangaChapterTitleString,
            mangaChapterLinkString,
            mangaChapterDateString
          };
        }
      );

      const mangaLinkString: string = requestUrl;
      const mangaImageSrcString: string = (await mangaImageSrcHandle?.jsonValue()) as string;
      const mangaAuthorString: string = (await mangaAuthorHandle?.jsonValue()) as string;
      const mangaArtistString: string = (await mangaArtistHandle?.jsonValue()) as string;
      const mangaSummaryString: string = (await mangaSummaryHandle?.jsonValue()) as string;
      const mangaChapters: Array<MangaChapter> = await Promise.all(
        mangaChaptersMapping
      );

      const mangaDetails: MangaDetails = {
        mangaImageSrcString,
        mangaLinkString,
        mangaAuthorString,
        mangaArtistString,
        mangaSummaryString,
        mangaChapters
      };

      await browser.close();

      res.send(mangaDetails);
    } catch (err) {
      console.error(err);
      res.status(400).send({
        status: 'Error - Bad Request',
        code: 400,
        message:
          'Unable to process request. Either mangareader.net has been updated or this is not a valid link. Please provide a valid link to a mangareader.net manga or report something broken here:https://github.com/JSONJuggler/MyMangaBackend/issues. Refer to docs: https://manga-back.webdeveloperbeau.com/'
      });
    }
  }
);

// @route GET api/manga/pages
// @description Route to get manga pages
// @access Public
router.get(
  '/pages',
  async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const { chapterLandingUrl }: any = req.query;

      if (!chapterLandingUrl || !isURL(chapterLandingUrl)) {
        res.status(400).send({
          status: 'Error - Bad Request',
          code: 400,
          message:
            'Unable to process request. Please provide a valid link to a mangareader.net manga chapter. Refer to docs: https://manga-back.webdeveloperbeau.com/'
        });
        return;
      }

      const browser: Browser = await puppeteer.launch({
        args: ['--no-sandbox', '--disable-setuid-sandbox']
      });

      const page: Page = await browser.newPage();

      await page.setUserAgent(
        'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_6) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/86.0.4240.75 Safari/537.36'
      );

      await page.goto(chapterLandingUrl, {
        waitUntil: 'domcontentloaded',
        timeout: 10000
      });

      await page.click('div#swsc');
      await page.waitForSelector('div#in');

      const chapterPagesElementHandles: Array<ElementHandle> = await page.$$(
        'div#in > div ~ div'
      );

      const chapterPagesMapping: Array<
        Promise<ChapterPage>
      > = chapterPagesElementHandles.map(
        async (chapterPageElement: ElementHandle): Promise<ChapterPage> => {
          const chapterImageSrcElement: JSHandle<Element> | null = await chapterPageElement.$(
            'img'
          );
          const chapterImageSrcHandle:
            | JSHandle
            | undefined = await chapterImageSrcElement?.getProperty('src');

          const chapterWidthHandle:
            | JSHandle
            | undefined = await chapterImageSrcElement?.getProperty('width');

          const chapterHeightHandle:
            | JSHandle
            | undefined = await chapterImageSrcElement?.getProperty('height');

          const chapterImageSrcString: string = (await chapterImageSrcHandle?.jsonValue()) as string;
          const chapterImageHeight: number = (await chapterHeightHandle?.jsonValue()) as number;
          const chapterImageWidth: number = (await chapterWidthHandle?.jsonValue()) as number;

          return {
            chapterImageSrcString,
            chapterImageHeight,
            chapterImageWidth
          };
        }
      );

      const chapterPages = await Promise.all(chapterPagesMapping);

      const result = chapterPages;
      await browser.close();

      res.send(result);
    } catch (err) {
      console.error(err);
      res.status(400).send({
        status: 'Error - Bad Request',
        code: 400,
        message:
          'Unable to process request. Either mangareader.net has been updated or this is not a valid link. Please provide a valid link to a mangareader.net manga chapter or report something broken here:https://github.com/JSONJuggler/MyMangaBackend/issues. Refer to docs: https://manga-back.webdeveloperbeau.com/'
      });
    }
  }
);

// @route GET api/manga/pages
// @description Route to get manga pages
// @access Public
router.get(
  '/page',
  async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      res.send('deprecated');
    } catch (err) {
      console.log(err);
    }
    // const { pageUrl }: any = req.query;

    // const browser: Browser = await puppeteer.launch({
    //   args: ["--no-sandbox", "--disable-setuid-sandbox"],
    // });

    // const page: Page = await browser.newPage();

    // await page.setUserAgent(
    //   "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_6) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/86.0.4240.75 Safari/537.36"
    // );

    // // page.on("console", (msg: ConsoleMessage): void =>
    // //   console.log("PAGE LOG:", msg.text())
    // // );

    // // console.log(chapterLandingUrl)
    // try {
    //   await page.goto("http://www.mangareader.net" + pageUrl, {
    //     waitUntil: "domcontentloaded",
    //     timeout: 10000,
    //   });
    // } catch (e) {
    //   await page.reload({ waitUntil: "domcontentloaded", timeout: 10000 });
    // }

    // // manually added this type to the Page interface
    // // await page.waitForTimeout(3000)

    // try {
    //   const chapterImageElement: ElementHandle | null = await page.$("img#ci");

    //   const chapterImageHandle:
    //     | ElementHandle<Element>
    //     | undefined = await chapterImageElement?.getProperty("src");

    //   const widthHandle:
    //     | ElementHandle<Element>
    //     | undefined = await chapterImageElement?.getProperty("width");

    //   const heightHandle:
    //     | ElementHandle<Element>
    //     | undefined = await chapterImageElement?.getProperty("height");

    //   const imageWidth = await widthHandle?.jsonValue();

    //   const imageHeight = await heightHandle?.jsonValue();

    //   const chapterImageUrl: any = await chapterImageHandle?.jsonValue();

    //   // console.log("scrape of " + chapter + "success")
    //   await browser.close();
    //   res.send({ chapterImageUrl, imageWidth, imageHeight });
    // } catch (e) {
    //   await page.reload({ waitUntil: "load", timeout: 10000 });
    //   // console.log(e)
    //   // console.log("page reloaded")

    //   const chapterImageElement: ElementHandle | null = await page.$("img#ci");

    //   const chapterImageHandle:
    //     | ElementHandle<Element>
    //     | undefined = await chapterImageElement?.getProperty("src");

    //   const widthHandle:
    //     | ElementHandle<Element>
    //     | undefined = await chapterImageElement?.getProperty("width");

    //   const heightHandle:
    //     | ElementHandle<Element>
    //     | undefined = await chapterImageElement?.getProperty("height");

    //   const imageWidth = await widthHandle?.jsonValue();

    //   const imageHeight = await heightHandle?.jsonValue();

    //   const chapterImageUrl = await chapterImageHandle?.jsonValue();

    //   // console.log("scrape of " + chapter + "success")
    //   await browser.close();
    //   res.send({ chapterImageUrl, imageWidth, imageHeight });
    // }
  }
);

module.exports = router;
