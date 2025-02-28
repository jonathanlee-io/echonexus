import {
  BadRequestException,
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
} from '@nestjs/common';

import {ApiGatewayRequestHeaders} from '../../../../lib/auth/api-gateway/decorators/api-gateway-request-headers.decorator';
import {ApiGatewayRequestHeadersDto} from '../../../../lib/auth/api-gateway/domain/ApiGatewayRequestHeaders.dto';
import {IdParamDto} from '../../../../lib/validation/id.param.dto';
import {CreateProjectDto} from '../../dto/CreateProject.dto';
import {UpdateProjectDto} from '../../dto/UpdateProject.dto';
import {ProjectsService} from '../../services/projects/projects.service';

@Controller()
export class ProjectsController {
  constructor(private readonly projectsService: ProjectsService) {}

  @Post('create')
  async registerNewProject(
    @ApiGatewayRequestHeaders()
    {requestingUserSubjectId}: ApiGatewayRequestHeadersDto,
    @Body() createProjectDto: CreateProjectDto,
  ) {
    return this.projectsService.createProject(
      requestingUserSubjectId,
      createProjectDto,
    );
  }

  @Get('where-involved')
  async getProjectsWhereInvolved(
    @ApiGatewayRequestHeaders()
    {requestingUserSubjectId}: ApiGatewayRequestHeadersDto,
  ) {
    return this.projectsService.getProjectsWhereInvolved(
      requestingUserSubjectId,
    );
  }

  @Get('for-client/:id')
  async getProjectsForClient(
    @ApiGatewayRequestHeaders()
    {requestingUserSubjectId}: ApiGatewayRequestHeadersDto,
    @Param() {id: clientId}: IdParamDto,
  ) {
    return this.projectsService.getProjectsForClient(
      requestingUserSubjectId,
      clientId,
    );
  }

  @Get(':id')
  async getProjectById(
    @ApiGatewayRequestHeaders()
    {requestingUserSubjectId}: ApiGatewayRequestHeadersDto,
    @Param() {id: projectId}: IdParamDto,
  ) {
    return this.projectsService.getProjectById(
      requestingUserSubjectId,
      projectId,
    );
  }

  @Put(':id')
  async updateProjectById(
    @ApiGatewayRequestHeaders()
    {requestingUserSubjectId}: ApiGatewayRequestHeadersDto,
    @Param() {id: projectId}: IdParamDto,
    @Body() updateProjectDto: UpdateProjectDto,
  ) {
    return this.projectsService.updateProjectById(
      requestingUserSubjectId,
      projectId,
      updateProjectDto,
    );
  }

  @Delete(':id')
  async deleteProjectById(
    @ApiGatewayRequestHeaders()
    {requestingUserSubjectId}: ApiGatewayRequestHeadersDto,
    @Param() {id: projectId}: IdParamDto,
  ) {
    return this.projectsService.deleteProjectById(
      requestingUserSubjectId,
      projectId,
    );
  }

  @Post('for-client/:id')
  async createProjectForClient(
    @ApiGatewayRequestHeaders()
    {requestingUserSubjectId}: ApiGatewayRequestHeadersDto,
    @Param() {id: clientId}: IdParamDto,
    @Body() createProjectDto: CreateProjectDto,
  ) {
    if (clientId !== createProjectDto.clientId) {
      throw new BadRequestException('Client ID in URL does not match body');
    }
    return this.projectsService.createProject(
      requestingUserSubjectId,
      createProjectDto,
    );
  }
}
