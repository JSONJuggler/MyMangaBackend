import express, { Request, Response, NextFunction, Router } from "express";
import Crawler from "../../mangapanda/crawler";

// create router
const router: Router = express.Router();

// @route POST api/build/
// @description Route to build manga database (no images)
// @access Public
router.post(
  "/",
  async (req: Request, res: Response, next: NextFunction): Promise<void> => {

    const cra = new Crawler(req.body.baseUrl)
    cra.crawl(req.body.site)

  }
);

module.exports = router;