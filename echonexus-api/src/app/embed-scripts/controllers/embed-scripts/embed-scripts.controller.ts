import {Controller, Get, Header} from '@nestjs/common';
import {ApiTags} from '@nestjs/swagger';

import {ApiGatewayRequestHeaders} from '../../../../lib/auth/api-gateway/decorators/api-gateway-request-headers.decorator';
import {ApiGatewayRequestHeadersDto} from '../../../../lib/auth/api-gateway/domain/ApiGatewayRequestHeaders.dto';
import {ProjectsService} from '../../../projects/services/projects/projects.service';

@ApiTags('Embed Scripts')
@Controller()
export class EmbedScriptsController {
  constructor(private readonly projectsService: ProjectsService) {}

  @Get('feedback-widget.js')
  @Header('Content-Type', 'text/javascript')
  @Header('Cache-Control', 'no-cache, no-store, must-revalidate')
  async getFeedbackWidgetScript(
    @ApiGatewayRequestHeaders()
    {clientSubdomain}: ApiGatewayRequestHeadersDto,
  ) {
    return this.projectsService.getFeedbackWidgetScript(clientSubdomain);
  }

  @Get('echonexus-widget.js')
  @Header('Content-Type', 'text/javascript')
  async getWidgetScript() {
    return this.projectsService.getWidgetScript();
  }
}
