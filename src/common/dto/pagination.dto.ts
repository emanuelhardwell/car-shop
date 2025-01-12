import { Type } from 'class-transformer';
import { IsOptional, IsPositive, Min } from 'class-validator';

export class PaginationDto {
  @IsOptional()
  @IsPositive()
  @Type(() => Number) // Convert the String a Number
  limit?: number;

  @Type(() => Number)
  @IsOptional()
  @Min(0)
  offset?: number;
}
