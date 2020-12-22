import express, { Request, Response, NextFunction, Router } from 'express';
import Crawler from '../../crawler';

// create router
const router: Router = express.Router();

// @route POST api/crawl/
// @description Route to crawl manga database (no images)
// @access Public
router.post(
  '/',
  async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    // const cra = new Crawler(req.body.baseUrl)

    // await cra.crawl(req.body.site)

    // console.log(cra.result)
    res.json('NOT READY YET');
  }
);

module.exports = router;
