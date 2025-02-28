import {IsDefined, IsNotEmpty, IsString} from 'class-validator';

export class SubdomainParamDto {
  @IsDefined()
  @IsNotEmpty()
  @IsString()
  subdomain: string;
}
