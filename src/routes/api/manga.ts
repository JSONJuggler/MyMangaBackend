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

// @route GET api/manga
// @description Route to get manga (test)
// @access Public
router.get(
  "/search",
  async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    const searchRequest: any = req.query;
    const browser: Browser = await puppeteer.launch({
      args: ["--no-sandbox", "--disable-setuid-sandbox"],
    });
    const page: Page = await browser.newPage();
    page.on("console", (msg: ConsoleMessage): void =>
      console.log("PAGE LOG:", msg.text())
    );
    await page.goto("http://www.mangapanda.com/");

    await page.type("#searchbox", searchRequest.manga);

    // manually added this type to the Page interface
    await page.waitForTimeout(3000)

    const searchResult: Array<ElementHandle> = await page.$$(
      "div.ac_results > ul > li"
    );

    const searchResultMapping: Array<Promise<any>> = searchResult.map(
      async (result: ElementHandle): Promise<any> => {
        const coverElement: ElementHandle | null = await result.$(
          "img"
        );

        if (coverElement) {
          const coverURL: JSHandle<any> = await coverElement.getProperty(
            "src"
          );

          const titleElement: ElementHandle | null = await result.$(
            "strong"
          );

          if (titleElement) {
            const titleString: JSHandle<any> = await titleElement.getProperty("innerText")

            const artistElement: ElementHandle | null = await result.$("i")

            if (artistElement) {
              const artistString: JSHandle<any> = await artistElement.getProperty("innerText")

              return {
                coverUrl: await coverURL.jsonValue(),
                titleString: await titleString.jsonValue(),
                artistString: await artistString.jsonValue(),
              };
            }
          }
        } else {
          const titleElement: ElementHandle | null = await result.$(
            "strong"
          );

          if (titleElement) {
            const titleString: JSHandle<any> = await titleElement.getProperty("innerText")

            const artistElement: ElementHandle | null = await result.$("i")

            if (artistElement) {
              const artistString: JSHandle<any> = await artistElement.getProperty("innerText")

              return {
                titleString: await titleString.jsonValue(),
                artistString: await artistString.jsonValue(),
              };
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
