import {Injectable, NotFoundException} from '@nestjs/common';

import {ProjectsService} from '../../../projects/services/projects/projects.service';
import {ProductsRepositoryService} from '../../repositories/products-repository/products-repository.service';

@Injectable()
export class ProductsService {
  constructor(
    private readonly productsRepository: ProductsRepositoryService,
    private readonly projectsService: ProjectsService,
  ) {}

  async submitProductFeedback(productFeedback: {
    clientSubdomain: string;
    userFeedback: string;
    widgetMetadataType: 'bug_report' | 'feature_request' | 'feature_feedback';
    widgetMetadataUrl: string;
    widgetMetadataTimezone: string;
    ip: string;
    submittedAt: string;
  }) {
    const [project] = await this.projectsService.getProjectFromSubdomain(
      productFeedback.clientSubdomain,
    );
    if (!project) {
      throw new NotFoundException(
        `Project with subdomain ${productFeedback.clientSubdomain} not found`,
      );
    }
    const product = await this.productsRepository.findProductFromProject(
      project.id,
    );
    await this.productsRepository.createProductFeedback(
      product.id,
      productFeedback,
    );
  }
}
