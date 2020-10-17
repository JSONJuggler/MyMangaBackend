import express, { Request, Response, NextFunction, Router } from "express";
import puppeteer, {
  Page,
  Browser,
  ConsoleMessage,
  ElementHandle,
  JSHandle,
} from "puppeteer";

// create router
const router: Router = express.Router();

// @route GET api/manga/search
// @description Route to search manga (test)
// @access Public
router.get(
  "/search",
  async (req: Request, res: Response, next: NextFunction): Promise<void> => {

    const searchRequest: any = req.query;
    const { w, rd, status, order, genre } = searchRequest

    const browser: Browser = await puppeteer.launch({
      args: ["--no-sandbox", "--disable-setuid-sandbox"],
    });

    const page: Page = await browser.newPage();

    page.on("console", (msg: ConsoleMessage): void =>
      console.log("PAGE LOG:", msg.text())
    );

    await page.goto(
      "http://www.mangapanda.com/search/?w="
      + w.trim().replace(" ", "+")
      + "&rd=" + rd
      + "&status=" + status
      + "&order=" + order
      + "&genre=" + genre
    )

    // manually added this type to the Page interface
    // await page.waitForTimeout(3000)

    const searchResult: Array<ElementHandle> = await page.$$(
      "div#mangaresults > div"
    );

    const searchResultMapping: Array<Promise<any>> = searchResult.map(
      async (result: ElementHandle): Promise<any> => {
        const coverUrl: string | null = await result.$eval(
          "div.imgsearchresults", el => el.getAttribute("style")
        )

        const parsedUrl = coverUrl?.slice(22, -2)

        const titleElement: ElementHandle | null = await result.$(
          "a"
        );

        if (titleElement) {
          const titleString: JSHandle<any> = await titleElement.getProperty("innerText")

          const linkString: JSHandle<any> = await titleElement.getProperty("href")

          const chapterCountElement: ElementHandle | null = await result.$("div.chapter_count")

          if (chapterCountElement) {
            const chapterCountString: JSHandle<any> = await chapterCountElement.getProperty("innerText")

            const mangaTypeElement: ElementHandle | null = await result.$("div.manga_type")

            if (mangaTypeElement) {
              const mangaTypeString: JSHandle<any> = await mangaTypeElement.getProperty("innerText")

              const mangaGenreElement: ElementHandle | null = await result.$("div.manga_genre")

              if (mangaGenreElement) {
                const mangaGenreString: JSHandle<any> = await mangaGenreElement.getProperty("innerText")

                return {
                  coverUrl: await parsedUrl,
                  titleString: await titleString.jsonValue(),
                  linkString: await linkString.jsonValue(),
                  chapterCountString: await chapterCountString.jsonValue(),
                  mangaTypeString: await mangaTypeString.jsonValue(),
                  mangaGenreString: await mangaGenreString.jsonValue(),
                };
              }
            }
          }
        }
      }
    );

    const results = await Promise.all(searchResultMapping);

    await browser.close();

    res.send(results)
  }
);
module.exports = router;
