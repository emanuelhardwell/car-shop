import { Injectable } from '@nestjs/common';
import { HandleError } from '../common/exceptions/handle-error';
import { ProductsService } from '../products/products.service';
import { initialData } from './data/seed-data';
import { AuthService } from 'src/auth/auth.service';
import { User } from 'src/auth/entities/user.entity';

@Injectable()
export class SeedService {
  constructor(
    private readonly productsService: ProductsService,
    private readonly handleError: HandleError,
    private readonly authService: AuthService,
  ) {
    this.handleError.setServiceName('SeedService');
  }
  async seedExecute() {
    try {
      const users = await this.saveNewUser();
      const user1 = users[0];

      this.saveNewProducts(user1);
      return 'Products saved successfully';
    } catch (error) {
      this.handleError.handleErrorService(error);
    }
  }

  async saveNewUser() {
    try {
      await this.authService.deleteAll();
      const users = initialData.users;

      const insertPromises = [];
      for (const user of users) {
        insertPromises.push(this.authService.create(user));
      }

      const usersSaved = await Promise.all(insertPromises);
      return usersSaved;
    } catch (error) {
      this.handleError.handleErrorService(error);
    }
  }

  async saveNewProducts(user: User) {
    try {
      await this.productsService.deleteAll();

      const products = initialData.products;

      const insertPromises = [];
      for (const product of products) {
        insertPromises.push(this.productsService.create(product, user));
      }

      await Promise.all(insertPromises);
    } catch (error) {
      this.handleError.handleErrorService(error);
    }
  }
}
