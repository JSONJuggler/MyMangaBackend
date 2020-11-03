import puppeteer, {
  Page,
  Browser,
  ConsoleMessage,
  ElementHandle,
  JSHandle,
} from "puppeteer";

type Selector = {
  name: string
  selector: string
  children: Array<Selector>
}

type Site = Selector

export default class Crawler {
  private baseUrl: string;
  private chpCounter: number = 0;
  public result: any = {};

  constructor(baseUrl: string) {
    this.baseUrl = baseUrl;
  }

  async crawl(site: Site) {
    const browser: Browser = await puppeteer.launch({
      args: ["--no-sandbox", "--disable-setuid-sandbox"],
    });

    const page: Page = await browser.newPage();
    page.on("console", (msg: ConsoleMessage): void =>
      console.log("PAGE LOG:", msg.text())
    );
    await page.setUserAgent(
      "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_6) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/86.0.4240.75 Safari/537.36"
    );

    await this.crawlInternal(page, `${this.baseUrl}`, site.children);

    browser.close();

    return this.result
  }

  async crawlInternal(page: Page, path: string, selectors: Array<Selector>) {
    path === "testC" && await page.goto(path, { waitUntil: 'domcontentloaded' });

    console.log(path)
    if (selectors.length === 0) {
      return;
    }

    switch (selectors[0].selector) {
      case "select#pageMenu > option":
      case "img#img":
      case "ul.series_alpha":
        let mangaLinks: Array<string> = await page.evaluate(sel => {
          let returnedItems = [];
          console.log(sel)
          for (let ul of document.querySelectorAll(sel)) {
            for (let anchor of ul.querySelectorAll("a")) {
              let href = anchor.getAttribute("href");
              console.log(href + "yu")
              returnedItems.push(href);
            }
          }
          return returnedItems;
        }, selectors[0].selector);
        console.log(mangaLinks.length)

        for (let i = 0; i < mangaLinks.length; i++) {
          await this.crawlInternal(page,
            "", selectors[0].children)
        }
        return
      default:
        return
    }
    if (selectors[0].selector === "img#img") {
      this.chpCounter++
      let imageLink: string = await page.evaluate(sel => {
        const item = document.querySelector(sel)
        const img = item.getAttribute("src")
        return img
      }, selectors[0].selector);

      this.result[this.chpCounter] = imageLink

    }

    if (selectors[0].selector === "select#pageMenu > option") {
      this.chpCounter = 0;
      let childrenLinks: Array<string> = await page.evaluate(sel => {
        let ret = [];
        for (let item of document.querySelectorAll(sel)) {
          let href = item.getAttribute("value");
          ret.push("http://www.mangapanda.com" + href);
        }
        return ret;
      }, selectors[0].selector);

      // this.result[path] = childrenLinks

      for (let item of childrenLinks) {
        await this.crawlInternal(page,
          `${item}`, selectors[0].children)
      }
    }


  }

}
