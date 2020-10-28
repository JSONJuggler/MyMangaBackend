import puppeteer, {
  Page,
  Browser,
  ConsoleMessage,
  ElementHandle,
  JSHandle,
} from "puppeteer";

type Selector = {
  name: string
  selector: Array<string>
  children: Array<Selector>
}

type Site = Selector

export default class Crawler {
  private baseUrl: string;

  constructor(baseUrl: string) {
    this.baseUrl = baseUrl;
  }

  crawl(site: Site) {
    (async () => {
      const browser: Browser = await puppeteer.launch();
      const page: Page = await browser.newPage();

      await this.crawlInternal(page, `${this.baseUrl}`, site.children);

      browser.close();
    })();
  }

  async crawlInternal(page: Page, path: string, selectors: Array<Selector>) {

    await page.goto(path, { waitUntil: 'domcontentloaded' });

    if (selectors.length === 0) {
      return;
    }

    let childrenLinks: Array<string> = await page.evaluate(sel => {
      let ret = [];
      for (let item of document.querySelectorAll(sel)) {
        let href = item.getAttribute("href");
        ret.push(href);
      }
      return ret;
    }, selectors[0].selector);

    for (let item of childrenLinks) {
      await this.crawlInternal(page,
        `${item}`, selectors[0].children)
    }
  }

}
