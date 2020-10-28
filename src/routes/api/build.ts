import express, { Request, Response, NextFunction, Router } from "express";
import puppeteer, {
  Page,
  Browser,
  ConsoleMessage,
  ElementHandle,
  JSHandle,
} from "puppeteer";
import Crawler from "../../mangapanda/crawler";

// create router
const router: Router = express.Router();

// @route GET api/build/
// @description Route to build manga database (no images)
// @access Public
router.get(
  "/",
  async (req: Request, res: Response, next: NextFunction): Promise<void> => {

    const { chapter }: any = req.query;

    const browser: Browser = await puppeteer.launch({
      args: ["--no-sandbox", "--disable-setuid-sandbox"],
    });

    const page: Page = await browser.newPage();

    await page.setUserAgent(
      "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_6) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/86.0.4240.75 Safari/537.36"
    );

    // page.on("console", (msg: ConsoleMessage): void =>
    //   console.log("PAGE LOG:", msg.text())
    // );

    // console.log(chapterLandingUrl)
    try {
      await page.goto("http://www.mangapanda.com" + chapter
        , { waitUntil: "domcontentloaded", timeout: 3000 });
    } catch (e) {

      await page.reload({ waitUntil: "domcontentloaded", timeout: 3000 });
    }

    // manually added this type to the Page interface
    // await page.waitForTimeout(3000)

    try {

      const chapterImageElement: ElementHandle | null = await page.$(
        "img#img"
      );

      const chapterImageHandle: JSHandle<any> | undefined = await chapterImageElement?.getProperty("src")

      const widthHandle: JSHandle<any> | undefined = await chapterImageElement?.getProperty("width")

      const heightHandle: JSHandle<any> | undefined = await chapterImageElement?.getProperty("height")

      const imageWidth = await widthHandle?.jsonValue();

      const imageHeight = await heightHandle?.jsonValue();

      const chapterImageUrl: any = await chapterImageHandle?.jsonValue()

      // console.log("scrape of " + chapter + "success")
      await browser.close();
      res.send({ chapterImageUrl, imageWidth, imageHeight })
    } catch (e) {
      await page.reload({ waitUntil: "load", timeout: 3000 });
      // console.log(e)
      // console.log("page reloaded")

      const chapterImageElement: ElementHandle | null = await page.$(
        "img#img"
      );

      const chapterImageHandle: JSHandle<any> | undefined = await chapterImageElement?.getProperty("src")

      const widthHandle: JSHandle<any> | undefined = await chapterImageElement?.getProperty("width")

      const heightHandle: JSHandle<any> | undefined = await chapterImageElement?.getProperty("height")

      const imageWidth = await widthHandle?.jsonValue();

      const imageHeight = await heightHandle?.jsonValue();

      const chapterImageUrl = await chapterImageHandle?.jsonValue()

      // console.log("scrape of " + chapter + "success")
      await browser.close();
      res.send({ chapterImageUrl, imageWidth, imageHeight })
    }

  }
);

module.exports = router;