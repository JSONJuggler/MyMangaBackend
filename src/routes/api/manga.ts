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
  "/",
  async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    const searchRequest: any = req.query;
    const browser: Browser = await puppeteer.launch({
      args: ["--no-sandbox", "--disable-setuid-sandbox"],
    });
    const page: Page = await browser.newPage();
    page.on("console", (msg: ConsoleMessage): void =>
      console.log("PAGE LOG:", msg.text())
    );
    await browser.close();
    res.send("hello")
  }
);
module.exports = router;
