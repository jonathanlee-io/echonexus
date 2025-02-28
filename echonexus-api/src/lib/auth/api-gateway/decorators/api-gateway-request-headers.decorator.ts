import {createParamDecorator, ExecutionContext} from '@nestjs/common';

import {ApiGatewayRequestHeadersDto} from '../domain/ApiGatewayRequestHeaders.dto';

export const ApiGatewayRequestHeaders = createParamDecorator(
  (_data: unknown, context: ExecutionContext) => {
    const request = context.switchToHttp().getRequest();
    return <ApiGatewayRequestHeadersDto>{
      requestingUserEmail:
        request.headers['X-Requesting-User-Email'.toLowerCase()]?.toLowerCase(),
      requestingUserSubjectId:
        request.headers['X-Requesting-User-Subject-Id'.toLowerCase()],
      clientSubdomain:
        request.headers[
          'X-Requesting-User-Client-Subdomain'.toLowerCase()
        ]?.toLowerCase(),
    };
  },
);
