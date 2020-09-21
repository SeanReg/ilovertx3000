import {CrawlerInterface} from './CrawlerInterface';
import cheerio from 'cheerio';
import {Product} from '../Model/Product';
import {Logger} from '../Logger';
import axios from 'axios';
import { Region } from '../Model/RegionSpec';

export class Evga implements CrawlerInterface {
  private products: Product[] = [
    {
      name: 'EVGA GeForce RTX 3080 FTW3 ULTRA GAMING',
      url: 'https://www.evga.com/products/product.aspx?pn=10G-P5-3897-KR'
    },
    {
      name: 'EVGA GeForce RTX 3080 XC3 BLACK GAMING',
      url: 'https://www.evga.com/products/product.aspx?pn=10G-P5-3881-KR'
    },
    {
      name: 'EVGA GeForce RTX 3080 XC3 GAMING',
      url: 'https://www.evga.com/products/product.aspx?pn=10G-P5-3883-KR'
    },
    {
      name: 'EVGA GeForce RTX 3080 XC3 ULTRA GAMING',
      url: 'https://www.evga.com/products/product.aspx?pn=10G-P5-3885-KR'
    },
  ];

  region: Region = Region.ALL

  getRetailerName(): string {
    return 'EVGA Shop';
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
        product.retailer = this.getRetailerName();
        product.stock    = $('.message-information').first().text().trim();
        logger.debug(`Acquired stock from ${this.getRetailerName()}`, product);
        products.push(product);
      } catch (e) {
        logger.error(e.message, { url: product.url });
      }
    }
    return products;
  }
}
