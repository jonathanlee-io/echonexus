import {Injectable} from '@nestjs/common';

import {PrismaService} from '../../../../lib/prisma/services/prisma.service';

@Injectable()
export class ProductsRepositoryService {
  constructor(private readonly prisma: PrismaService) {}

  async createProduct(projectId: string) {
    return this.prisma.product.create({
      data: {
        project: {
          connect: {
            id: projectId,
          },
        },
      },
    });
  }
}
