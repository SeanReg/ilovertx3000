import {CrawlerInterface} from './CrawlerInterface';
import cheerio from 'cheerio';
import {Product} from '../Model/Product';
import {Logger} from '../Logger';
import axios from 'axios';
import { Region } from '../Model/RegionSpec';

export class Caseking implements CrawlerInterface {
  private products: Product[] = [
    {
      url: 'https://www.caseking.de/gigabyte-geforce-rtx-3080-eagle-oc-10g-10240-mb-gddr6x-gcgb-326.html'
    },
    {
      url: 'https://www.caseking.de/msi-geforce-rtx-3080-gaming-x-trio-10g-10240-mb-gddr6x-gcmc-248.html'
    },
    {
      url: 'https://www.caseking.de/asus-geforce-rtx-3080-rog-strix-10g-10240-mb-gddr6x-gcas-400.html'
    },
    {
      url: 'https://www.caseking.de/evga-geforce-rtx-3080-xc3-black-gaming-10240-mb-gddr6x-gcev-414.html'
    },
    {
      url: 'https://www.caseking.de/asus-geforce-rtx-3080-rog-strix-o10g-10240-mb-gddr6x-gcas-399.html'
    },
    {
      url: 'https://www.caseking.de/gigabyte-geforce-rtx-3080-gaming-oc-10g-10240-mb-gddr6x-gcgb-327.html'
    },
    {
      url: 'https://www.caseking.de/evga-geforce-rtx-3080-ftw3-ultra-gaming-10240-mb-gddr6x-gcev-417.html'
    },
    {
      url: 'https://www.caseking.de/zotac-gaming-geforce-rtx-3080-trinity-10240-mb-gddr6x-gczt-163.html'
    },
    {
      url: 'https://www.caseking.de/msi-geforce-rtx-3080-ventus-3x-10g-oc-10240-mb-gddr6x-gcmc-247.html'
    },
    {
      url: 'https://www.caseking.de/asus-geforce-rtx-3080-tuf-gaming-10g-10240-mb-gddr6x-gcas-394.html'
    },
    {
      url: 'https://www.caseking.de/pny-geforce-rtx-3080-xlr8-gaming-epic-x-rgb-10240-mb-gddr6x-gcpn-075.html'
    },
    {
      url: 'https://www.caseking.de/evga-geforce-rtx-3080-xc3-ultra-gaming-10240-mb-gddr6x-gcev-423.html'
    },
    {
      url: 'https://www.caseking.de/inno3d-geforce-rtx-3080-ichill-x4-10240-mb-gddr6x-gci3-169.html'
    },
    {
      url: 'https://www.caseking.de/inno3d-geforce-rtx-3080-twin-x2-oc-10240-mb-gddr6x-gci3-171.html'
    },
    {
      url: 'https://www.caseking.de/evga-geforce-rtx-3080-xc3-gaming-10240-mb-gddr6x-gcev-415.html'
    },
    {
      url: 'https://www.caseking.de/inno3d-geforce-rtx-3080-ichill-x3-10240-mb-gddr6x-gci3-170.html'
    },
    {
      url: 'https://www.caseking.de/pny-geforce-rtx-3080-xlr8-gaming-epic-x-rgb-10240-mb-gddr6x-gcpn-076.html'
    },
    {
      url: 'https://www.caseking.de/evga-geforce-rtx-3080-ftw3-gaming-10240-mb-gddr6x-gcev-416.html'
    },
    {
      url: 'https://www.caseking.de/asus-geforce-rtx-3080-tuf-gaming-o10g-10240-mb-gddr6x-gcas-396.html'
    },
  ];

  region: Region = Region.DE

  getRetailerName(): string {
    return 'Caseking';
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
        product.stock    = $('#buybox .frontend_plugins_index_delivery_informations').text().trim();
        logger.debug(`Acquired stock from ${this.getRetailerName()}`, product);
        products.push(product);
      } catch (e) {
        logger.error(e.message, { url: product.url });
      }
    }
    return products;
  }
}
