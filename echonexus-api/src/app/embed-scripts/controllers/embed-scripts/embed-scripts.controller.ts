import {Controller, Get, Header} from '@nestjs/common';
import {ApiTags} from '@nestjs/swagger';

import {CurrentUser} from '../../../../lib/auth/decorators/current-user/current-user.decorator';
import {CurrentUserDto} from '../../../../lib/auth/dto/CurrentUserDto';
import {ProjectsService} from '../../../projects/services/projects/projects.service';

@ApiTags('Embed Scripts')
@Controller()
export class EmbedScriptsController {
  constructor(private readonly projectsService: ProjectsService) {}

  @Get('feedback-widget.js')
  @Header('Content-Type', 'text/javascript')
  @Header('Cache-Control', 'no-cache, no-store, must-revalidate')
  async getFeedbackWidgetScript(
    @CurrentUser()
    {clientSubdomain}: CurrentUserDto,
  ) {
    return this.projectsService.getFeedbackWidgetScript(clientSubdomain);
  }

  @Get('echonexus-widget.js')
  @Header('Content-Type', 'text/javascript')
  async getWidgetScript() {
    return this.projectsService.getWidgetScript();
  }
}
