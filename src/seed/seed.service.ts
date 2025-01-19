import { Injectable } from '@nestjs/common';
import { HandleError } from '../common/exceptions/handle-error';
import { ProductsService } from '../products/products.service';
import { initialData } from './data/seed-data';

@Injectable()
export class SeedService {
  constructor(
    private readonly productsService: ProductsService,
    private readonly handleError: HandleError,
  ) {
    this.handleError.setServiceName('SeedService');
  }
  seedExecute() {
    try {
      this.saveNewProducts();
      return 'Products saved successfully';
    } catch (error) {
      this.handleError.handleErrorService(error);
    }
  }

  async saveNewProducts() {
    try {
      await this.productsService.deleteAll();

      const products = initialData.products;

      const insertPromises = [];
      for (const product of products) {
        insertPromises.push(this.productsService.create(product));
      }

      await Promise.all(insertPromises);
    } catch (error) {
      this.handleError.handleErrorService(error);
    }
  }
}
