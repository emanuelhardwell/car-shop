import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { Repository } from 'typeorm';
import { Product } from './entities/product.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { HandleError } from 'src/common/exceptions/handle-error';
import { PaginationDto } from 'src/common/dto/pagination.dto';
import uuid from "uuid"

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

  async findAll(paginationDto: PaginationDto) {
    const { limit = 10, offset = 0 } = paginationDto;

    try {
      const products = await this.productRepository.find({
        take: limit,
        skip: offset,
      });
      return products;
    } catch (error) {
      this.handleError.handleErrorService(error);
    }
  }

  async findOne(term: string) {
    try {
      let product: Product;

      if (uuid.validate(term)) {
        product = await this.productRepository.findOneBy({ id: term });
      } else {
        const queryBuilder = this.productRepository.createQueryBuilder();
        product = await queryBuilder
          .where('UPPER(title) := title or slug := slug', {
            title: term.toLocaleUpperCase(),
            slug: term.toLocaleLowerCase(),
          })
          .getOne();
      }

      if (!product) {
        throw new NotFoundException(`Product with ${term} not found`);
      }

      return product;
    } catch (error) {
      this.handleError.handleErrorService(error);
    }
  }

  update(id: number, updateProductDto: UpdateProductDto) {
    return `This action updates a #${id} product`;
  }

  async remove(id: string) {
    try {
      const product = await this.findOne(id);
      await this.productRepository.remove(product);
    } catch (error) {
      this.handleError.handleErrorService(error);
    }
  }
}
