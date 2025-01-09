import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { Repository } from 'typeorm';
import { Product } from './entities/product.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { HandleError } from 'src/common/exceptions/handle-error';

@Injectable()
export class ProductsService {
  constructor(
    @InjectRepository(Product)
    private readonly productRepository: Repository<Product>,

    private readonly handleError: HandleError,
  ) {
    this.handleError.setServiceName('ProductsService');
  }
  async create(createProductDto: CreateProductDto) {
    try {
      const product = this.productRepository.create(createProductDto);
      await this.productRepository.save(product);

      return product;
    } catch (error) {
      this.handleError.handleErrorService(error);
    }
  }

  async findAll() {
    try {
      const products = await this.productRepository.find();
      return products;
    } catch (error) {
      this.handleError.handleErrorService(error);
    }
  }

  async findOne(id: string) {
    try {
      const product = await this.productRepository.findOne({
        where: { id: id },
      });
      if (!product) {
        throw new NotFoundException(`Product with id: ${id} not found`);
      }

      return product;
    } catch (error) {
      this.handleError.handleErrorService(error);
    }
  }

  update(id: number, updateProductDto: UpdateProductDto) {
    return `This action updates a #${id} product`;
  }

  remove(id: number) {
    return `This action removes a #${id} product`;
  }
}
