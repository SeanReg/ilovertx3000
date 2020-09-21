import {CrawlerInterface} from './Crawler/CrawlerInterface';
import {Product} from './Model/Product';
import {Logger} from './Logger';
import {NotificationInterface} from './Notification/NotificationInterface';

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

    for (const crawler of this.crawler) {
      this.runCrawler(crawler)
    }
  }

  private runCrawler(crawler: CrawlerInterface) {
    this.logger.info(`Starting crawler ${crawler.getRetailerName()}`)
    crawler.acquireStock(this.logger).then(stock => {
      stock.forEach(product => {
        const existing = this.stock.find(p => p.retailer === product.retailer && p.name === product.name);
        if (!existing) {
          this.stock.push({...product});
          return;
        }
        if (product.stock !== existing.stock) {
          this.handleStockChange(product, existing);
          existing.stock = product.stock;
        }
      });
    }).finally(() => {
      //Resechdule for later
      setTimeout(() => this.runCrawler(crawler), this.delay)
    })
  }

  private handleStockChange(product: Product, previous: Product) {
    this.notifications.forEach(notification => {
      notification.notify(`${product.retailer}: Stock changed from "${previous.stock}" to "${product.stock}". ${product.url}`, this.logger);
    });
  }
}
