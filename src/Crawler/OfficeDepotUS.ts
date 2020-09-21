import {CrawlerInterface} from './CrawlerInterface';
import cheerio from 'cheerio';
import {Product} from '../Model/Product';
import {Logger} from '../Logger';
import axios from 'axios';

export class OfficeDepotUS implements CrawlerInterface {
  private products: Product[] = [
    {
      name: 'PNY GeForce RTX 3080 10GB GDDR6X PCI Express XLR8 Gaming Edition Video Card',
      url: 'https://www.officedepot.com/a/products/7189374/PNY-GeForce-RTX-3080-10GB-GDDR6X/'
    },
    {
        name: 'PNY GeForce RTX 3080 10GB GDDR6X XLR8 Gaming EPIC-X RGB Triple Fan Video Card',
        url: 'https://www.officedepot.com/a/products/7791294/PNY-GeForce-RTX-3080-10GB-GDDR6X/'
    },
  ];

  getRetailerName(): string {
    return 'Office Depot US';
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
        product.stock    = $('.deliveryMessage').first().children("span").text().trim();
        logger.debug(`Acquired stock from ${this.getRetailerName()}`, product);
        products.push(product);
      } catch (e) {
        logger.error(e.message, { url: product.url });
      }
    }
    return products;
  }
}