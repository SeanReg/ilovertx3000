import {CrawlerInterface} from './CrawlerInterface';
import cheerio from 'cheerio';
import {Product} from '../Model/Product';
import {Logger} from '../Logger';
import axios from 'axios';

export class BHPhotoUS implements CrawlerInterface {
  private products: Product[] = [
    {
      name: 'ZOTAC GAMING GeForce RTX 3080 Trinity Graphics Card',
      url: 'https://www.bhphotovideo.com/c/product/1592969-REG/zotac_zt_a30800d_10p_gaming_geforce_rtx_3080.html'
    },
    {
        name: 'Gigabyte GeForce RTX 3080 EAGLE OC 10G Graphics Card',
        url: 'https://www.bhphotovideo.com/c/product/1593332-REG/gigabyte_gv_n3080eagle_oc_10gd_geforce_rtx_3080_eagle.html'
    },
    {
        name: 'MSI GeForce RTX 3080 VENTUS 3X 10G OC Graphics Card',
        url: 'https://www.bhphotovideo.com/c/product/1593997-REG/msi_g3080v3x10c_geforce_rtx_3080_ventus.html'
    },
    {
        name: 'MSI GeForce RTX 3080 VENTUS 3X 10G Oc Graphic Card',
        url: 'https://www.bhphotovideo.com/c/product/1593646-REG/msi_geforce_rtx_3080_ventus.html'
    },
    {
        name: 'Gigabyte GeForce RTX 3080 GAMING OC 10G Graphics Card',
        url: 'https://www.bhphotovideo.com/c/product/1593333-REG/gigabyte_gv_n3080gaming_oc_10gd_geforce_rtx_3080_gaming.html'
    },
    {
        name: 'MSI GeForce RTX 3080 GAMING X TRIO 10G Graphic Card',
        url: 'https://www.bhphotovideo.com/c/product/1593645-REG/msi_geforce_rtx_3080_gaming.html'
    },
    {
        name: 'MSI GeForce RTX 3080 GAMING X TRIO 10G Graphics Card',
        url: 'https://www.bhphotovideo.com/c/product/1593996-REG/msi_g3080gxt10_geforce_rtx_3080_gaming.html'
    },
    {
        name: 'ASUS TUF Gaming GeForce RTX 3080 Graphics Card',
        url: 'https://www.bhphotovideo.com/c/product/1593649-REG/asus_tuf_rtx3080_10g_gaming_tuf_gaming_geforce_rtx.html'
    },
    {
        name: 'ASUS TUF Gaming GeForce RTX 3080 OC Graphics Card',
        url: 'https://www.bhphotovideo.com/c/product/1593650-REG/asus_tuf_rtx3080_o10g_gaming_tuf_gaming_geforce_rtx.html'
    },
  ];

  getRetailerName(): string {
    return 'B&H Photo US';
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
        product.stock    = $('[data-selenium=notifyAvailabilityButton]').first().text().trim();
        logger.debug(`Acquired stock from ${this.getRetailerName()}`, product);
        products.push(product);
      } catch (e) {
        logger.error(e.message, { url: product.url });
      }
    }
    return products;
  }
}