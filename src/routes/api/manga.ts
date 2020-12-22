import express, { Request, Response, NextFunction, Router } from 'express';
import puppeteer, {
  Page,
  Browser,
  ConsoleMessage,
  ElementHandle,
  JSHandle
} from 'puppeteer';
import { SearchResult } from '../../types';

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

      const browser: Browser = await puppeteer.launch({
        args: ['--no-sandbox', '--disable-setuid-sandbox']
      });

      const page: Page = await browser.newPage();

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

      const searchResult: Array<ElementHandle> = await page.$$(
        'div#ares > div.d54'
      );

      const searchResultMapping: Array<Promise<any>> = searchResult.map(
        async (result: ElementHandle): Promise<any> => {
          const coverUrl:
            | string
            | null = await result.$eval(
            'table > tbody > tr > td:nth-child(2) > div.d56',
            el => el.getAttribute('style')
          );

          const parsedUrl = coverUrl?.slice(22, -2);

          const titleElement: ElementHandle | null = await result.$(
            'div.d57 > a'
          );

          const titleString: JSHandle<any> = await titleElement!.getProperty(
            'innerText'
          );

          const linkString: JSHandle<any> = await titleElement!.getProperty(
            'href'
          );

          const chapterCountElement: ElementHandle | null = await result.$(
            'div.d58'
          );

          const chapterCountString: JSHandle<any> = await chapterCountElement!.getProperty(
            'innerText'
          );

          const mangaTypeElement: ElementHandle | null = await result.$(
            'div.d59'
          );

          const mangaTypeString: JSHandle<any> = await mangaTypeElement!.getProperty(
            'innerText'
          );

          const mangaGenreElement: ElementHandle | null = await result.$(
            'div.d60'
          );

          const mangaGenreString: JSHandle<any> = await mangaGenreElement!.getProperty(
            'innerText'
          );

          return {
            coverUrl: await parsedUrl,
            titleString: await titleString.jsonValue(),
            linkString: await linkString.jsonValue(),
            chapterCountString: await chapterCountString.jsonValue(),
            mangaTypeString: await mangaTypeString.jsonValue(),
            mangaGenreString: await mangaGenreString.jsonValue()
          };
        }
      );

      const results = await Promise.all(searchResultMapping);

      await browser.close();

      res.send(results);
    } catch (err) {
      console.log(err);
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

      const browser: Browser = await puppeteer.launch({
        args: ['--no-sandbox', '--disable-setuid-sandbox']
      });

      const page: Page = await browser.newPage();

      await page.goto(requestUrl, {
        waitUntil: 'domcontentloaded',
        timeout: 10000
      });

      const coverElement: ElementHandle | null = await page.$('div#d38 > img');

      const coverHandle:
        | JSHandle<any>
        | undefined = await coverElement?.getProperty('src');

      const authorElement: ElementHandle | null = await page.$(
        'div.d39  tbody  tr:nth-child(5)  td:nth-child(2)'
      );

      const authorHandle:
        | JSHandle<any>
        | undefined = await authorElement?.getProperty('innerText');

      const artistElement: ElementHandle | null = await page.$(
        'div.d39 table tbody tr:nth-child(6) td:nth-child(2)'
      );

      const artistHandle:
        | JSHandle<any>
        | undefined = await artistElement?.getProperty('innerText');

      const summaryElement: ElementHandle | null = await page.$('div.d46 > p');

      const summaryHandle:
        | JSHandle<any>
        | undefined = await summaryElement?.getProperty('innerText');

      const tableHead: Array<ElementHandle> = await page.$$('tr.d49 ~ tr');

      const tableHeadMapping: Array<Promise<any>> = tableHead.map(
        async (result: ElementHandle): Promise<any> => {
          const chapterNumberElement: ElementHandle | null = await result.$(
            'a'
          );

          const chapterNumberString: JSHandle<any> = await chapterNumberElement!.getProperty(
            'innerText'
          );

          const linkString: JSHandle<any> = await chapterNumberElement!.getProperty(
            'href'
          );

          const dateElement: ElementHandle | null = await result.$(
            'td:nth-child(2)'
          );

          const dateString: JSHandle<any> = await dateElement!.getProperty(
            'innerText'
          );

          return {
            linkString: await linkString.jsonValue(),
            chapterNumberString: await chapterNumberString.jsonValue(),
            dateString: await dateString.jsonValue()
          };
        }
      );

      const coverUrl = await coverHandle?.jsonValue();

      const authorString = await authorHandle?.jsonValue();

      const artistString = await artistHandle?.jsonValue();

      const summaryString = await summaryHandle?.jsonValue();

      const chapters = await Promise.all(tableHeadMapping);

      const result = {
        coverUrl,
        requestUrl,
        authorString,
        artistString,
        summaryString,
        chapters
      };

      await browser.close();

      res.send(result);
    } catch (err) {
      console.log(err);
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

      const browser: Browser = await puppeteer.launch({
        args: ['--no-sandbox', '--disable-setuid-sandbox']
      });

      const page: Page = await browser.newPage();

      await page.setUserAgent(
        'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_6) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/86.0.4240.75 Safari/537.36'
      );

      await page.goto(chapterLandingUrl, {
        waitUntil: 'domcontentloaded',
        timeout: 3000
      });

      await page.click('div#swsc');
      await page.waitForSelector('div#in');

      const chapterPagesElements: Array<ElementHandle> = await page.$$(
        'div#in > div ~ div'
      );

      const chapterPagesMapping: Array<Promise<any>> = chapterPagesElements.map(
        async (result: ElementHandle): Promise<any> => {
          const chapterImageElement: ElementHandle | null = await result.$(
            'img'
          );
          const chapterImageHandle:
            | JSHandle<any>
            | undefined = await chapterImageElement?.getProperty('src');

          const widthHandle:
            | JSHandle<any>
            | undefined = await chapterImageElement?.getProperty('width');

          const heightHandle:
            | JSHandle<any>
            | undefined = await chapterImageElement?.getProperty('height');

          const imageWidth = await widthHandle?.jsonValue();

          const imageHeight = await heightHandle?.jsonValue();

          const chapterImageUrl: any = await chapterImageHandle?.jsonValue();

          return {
            chapterImageUrl,
            imageHeight,
            imageWidth
          };
        }
      );

      const chapterPages = await Promise.all(chapterPagesMapping);

      const result = chapterPages;
      await browser.close();

      res.send(result);
    } catch (err) {
      console.log(err);
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
    //     timeout: 3000,
    //   });
    // } catch (e) {
    //   await page.reload({ waitUntil: "domcontentloaded", timeout: 3000 });
    // }

    // // manually added this type to the Page interface
    // // await page.waitForTimeout(3000)

    // try {
    //   const chapterImageElement: ElementHandle | null = await page.$("img#ci");

    //   const chapterImageHandle:
    //     | JSHandle<any>
    //     | undefined = await chapterImageElement?.getProperty("src");

    //   const widthHandle:
    //     | JSHandle<any>
    //     | undefined = await chapterImageElement?.getProperty("width");

    //   const heightHandle:
    //     | JSHandle<any>
    //     | undefined = await chapterImageElement?.getProperty("height");

    //   const imageWidth = await widthHandle?.jsonValue();

    //   const imageHeight = await heightHandle?.jsonValue();

    //   const chapterImageUrl: any = await chapterImageHandle?.jsonValue();

    //   // console.log("scrape of " + chapter + "success")
    //   await browser.close();
    //   res.send({ chapterImageUrl, imageWidth, imageHeight });
    // } catch (e) {
    //   await page.reload({ waitUntil: "load", timeout: 3000 });
    //   // console.log(e)
    //   // console.log("page reloaded")

    //   const chapterImageElement: ElementHandle | null = await page.$("img#ci");

    //   const chapterImageHandle:
    //     | JSHandle<any>
    //     | undefined = await chapterImageElement?.getProperty("src");

    //   const widthHandle:
    //     | JSHandle<any>
    //     | undefined = await chapterImageElement?.getProperty("width");

    //   const heightHandle:
    //     | JSHandle<any>
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
