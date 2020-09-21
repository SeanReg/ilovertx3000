import {CrawlerInterface} from './CrawlerInterface';
import cheerio from 'cheerio';
import axios from 'axios';
import {Product} from '../Model/Product';
import {Logger} from '../Logger';
import { Region } from '../Model/RegionSpec';

export class AlternateDe implements CrawlerInterface {
  private products: Product[] = [
    {
      url: 'https://www.alternate.de/GIGABYTE/GeForce-RTX-3080-Eagle-OC-10G-Grafikkarte/html/product/1672756?'
    },
    {
      url: 'https://www.alternate.de/MSI/GeForce-RTX-3080-Ventus-3X-10G-OC-Grafikkarte/html/product/1672345?'
    },
    {
      url: 'https://www.alternate.de/ASUS/GeForce-RTX-3080-TUF-GAMING-Grafikkarte/html/product/1672251?'
    },
    {
      url: 'https://www.alternate.de/MSI/GeForce-RTX-3080-Gaming-X-TRIO-10G-Grafikkarte/html/product/1672343?'
    },
    {
      url: 'https://www.alternate.de/GIGABYTE/GeForce-RTX-3080-Gaming-OC-10G-Grafikkarte/html/product/1672753?'
    },
    {
      url: 'https://www.alternate.de/EVGA/GeForce-RTX-3080-XC3-BLACK-GAMING-Grafikkarte/html/product/1673512?'
    },
    {
      url: 'https://www.alternate.de/ZOTAC/GeForce-RTX-3080-Trinity-Grafikkarte/html/product/1672612?'
    },
    {
      url: 'https://www.alternate.de/ASUS/GeForce-RTX-3080-ROG-STRIX-OC-GAMING-Grafikkarte/html/product/1672867?'
    },
  ];

  region: Region = Region.DE

  getRetailerName(): string {
    return 'alternate.de';
  }

  async acquireStock(logger: Logger) {
    const products: Product[] = [];
    for await (const product of this.products) {
      try {
        const response = await axios.get(product.url);
        if (response.status !== 200) {
          continue;
        }
        const $          = cheerio.load(response.data);
        product.name     = $('title').text();
        product.retailer = this.getRetailerName();
        product.stock    = $('.stockStatus').text().trim();
        logger.debug(`Acquired stock from ${this.getRetailerName()}`, product);
        products.push(product);
      } catch (e) {
        logger.error(e.message, { url: product.url });
      }
    }
    return products;
  }
}
