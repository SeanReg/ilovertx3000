import {Product} from '../Model/Product';
import {Logger} from '../Logger';
import {RegionSpec} from '../Model/RegionSpec'

export interface CrawlerInterface extends RegionSpec {
  getRetailerName(): string;

  acquireStock(logger: Logger): Promise<Product[]>;
}
