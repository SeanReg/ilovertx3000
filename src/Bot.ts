import {CrawlerInterface} from './Crawler/CrawlerInterface';
import {Product} from './Model/Product';
import {Logger} from './Logger';
import {NotificationInterface} from './Notification/NotificationInterface';
import { Region } from './Model/RegionSpec';

export class Bot {
  private stock: Product[] = [];

  constructor(
    private readonly delay: number,
    private readonly crawler: CrawlerInterface[],
    private readonly notifications: NotificationInterface[],
    private readonly logger: Logger
  ) {
  }

  async start() {
    this.logger.info(`Starting ilovertx3000 with ${this.crawler.length} crawler: ${this.crawler.map(c => c.constructor.name).join(', ')}`);

    if (this.crawler.length === 0) {
      this.logger.info('Nothing to do here...');
      return;
    }

    // noinspection InfiniteLoopJS
    while (true) {
      for await (const crawler of this.crawler) {
        const stock = await crawler.acquireStock(this.logger);
        stock.forEach(product => {
          const existing = this.stock.find(p => p.retailer === product.retailer && p.name === product.name);
          if (!existing) {
            this.stock.push({...product});
            return;
          }
          if (product.stock !== existing.stock) {
            this.handleStockChange(crawler, product, existing);
            existing.stock = product.stock;
          }
        });
      }
      await this.sleep(this.delay);
    }
  }

  private handleStockChange(crawler: CrawlerInterface, product: Product, previous: Product) {
    this.notifications.forEach(notification => {
      if ((crawler.region == Region.ALL || notification.region == Region.ALL) || notification.region == crawler.region) {
        notification.notify(`${product.retailer}: Stock changed from "${previous.stock}" to "${product.stock}". ${product.url}`, this.logger);
      }
    });
  }

  private async sleep(ms: number) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }
}
