import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { Repository } from 'typeorm';
import { Product } from './entities/product.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { HandleError } from 'src/common/exceptions/handle-error';
import { PaginationDto } from 'src/common/dto/pagination.dto';
import { validate as isUUID } from 'uuid';
import { ProductImage } from './entities/product-image.entity';

@Injectable()
export class ProductsService {
  constructor(
    @InjectRepository(Product)
    private readonly productRepository: Repository<Product>,
    @InjectRepository(ProductImage)
    private readonly productImageRepository: Repository<ProductImage>,

    private readonly handleError: HandleError,
  ) {
    this.handleError.setServiceName('ProductsService');
  }
  async create(createProductDto: CreateProductDto) {
    try {
      const product = this.productRepository.create({
        ...createProductDto,
        images: createProductDto.images.map((img) =>
          this.productImageRepository.create({ url: img }),
        ),
      });
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
      return products.map((product)=> ({ ...product, images: product.images.map((img=> img.url))}));
    } catch (error) {
      this.handleError.handleErrorService(error);
    }
  }

  async findOne(term: string) {
    try {
      let product: Product;

      if (isUUID(term)) { 
        product = await this.productRepository.findOneBy({ id: term });
      } else {
        const queryBuilder = this.productRepository.createQueryBuilder("prod");
        product = await queryBuilder
          .where('UPPER(title) =:title or slug =:slug', {
            title: term.toLocaleUpperCase(),
            slug: term.toLocaleLowerCase(),
          })
          .leftJoinAndSelect("prod.images", "prodImages")
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

  async update(id: string, updateProductDto: UpdateProductDto) {
    try {
      const product = await this.productRepository.preload({
        id,
        ...updateProductDto,
        images: updateProductDto?.images?.map((img) =>
          this.productImageRepository.create({ url: img }),
        ),
      });

      if (!product) {
        throw new NotFoundException(`Product with id '${id}' not found`);
      }

      const productUpdated = await this.productRepository.save(product);
      return productUpdated;
    } catch (error) {
      this.handleError.handleErrorService(error);
    }
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
