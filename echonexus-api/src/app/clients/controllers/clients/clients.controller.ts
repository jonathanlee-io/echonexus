import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  Patch,
  Post,
} from '@nestjs/common';
import {ApiTags} from '@nestjs/swagger';

import {ApiGatewayRequestHeaders} from '../../../../lib/auth/api-gateway/decorators/api-gateway-request-headers.decorator';
import {ApiGatewayRequestHeadersDto} from '../../../../lib/auth/api-gateway/domain/ApiGatewayRequestHeaders.dto';
import {IdParamDto} from '../../../../lib/validation/id.param.dto';
import {CreateClientDto} from '../../dto/CreateClient.dto';
import {IsSubdomainAvailableDto} from '../../dto/IsSubdomainAvailable.dto';
import {ClientsService} from '../../services/clients/clients.service';

@ApiTags('Clients')
@Controller()
export class ClientsController {
  constructor(private readonly clientsService: ClientsService) {}

  @Post('create')
  async registerNewClient(
    @ApiGatewayRequestHeaders()
    {requestingUserEmail, requestingUserSubjectId}: ApiGatewayRequestHeadersDto,
    @Body() createClientDto: CreateClientDto,
  ) {
    return this.clientsService.createClient(
      requestingUserSubjectId,
      requestingUserEmail,
      createClientDto,
    );
  }

  @Post('is-subdomain-available')
  @HttpCode(HttpStatus.OK)
  async isSubdomainAvailable(
    @Body() isSubdomainAvailableDto: IsSubdomainAvailableDto,
  ) {
    return this.clientsService.checkIfSubdomainAvailable(
      isSubdomainAvailableDto,
    );
  }

  @Get('where-involved')
  async getClientsWhereInvolved(
    @ApiGatewayRequestHeaders()
    {requestingUserEmail}: ApiGatewayRequestHeadersDto,
  ) {
    return this.clientsService.getClientsWhereInvolved(requestingUserEmail);
  }

  @Get(':id')
  async getClientById(
    @ApiGatewayRequestHeaders()
    {requestingUserSubjectId}: ApiGatewayRequestHeadersDto,
    @Param() {id: clientId}: IdParamDto,
  ) {
    return this.clientsService.getClientById(requestingUserSubjectId, clientId);
  }

  @Patch(':id/remove-member')
  async removeMemberFromClientById(
    @ApiGatewayRequestHeaders()
    {requestingUserEmail}: ApiGatewayRequestHeadersDto,
    @Param() {id: clientId}: IdParamDto,
    @Body() {emailToRemove}: {emailToRemove: string},
  ) {
    return this.clientsService.removeMemberFromClientById(
      requestingUserEmail,
      clientId,
      emailToRemove,
    );
  }

  @Patch(':id/add-member')
  async addMemberToClientById(
    @ApiGatewayRequestHeaders()
    {requestingUserEmail}: ApiGatewayRequestHeadersDto,
    @Param() {id: clientId}: IdParamDto,
    @Body() {emailToAdd}: {emailToAdd: string},
  ) {
    return this.clientsService.addMemberFromClientById(
      requestingUserEmail,
      clientId,
      emailToAdd,
    );
  }
}
