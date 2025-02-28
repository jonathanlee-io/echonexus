import {ApiProperty} from '@nestjs/swagger';
import {IsBoolean, IsDefined} from 'class-validator';

export class UpdateProjectDto {
  @IsDefined()
  @IsBoolean()
  @ApiProperty({required: true})
  isBugReportsEnabled: boolean;

  @IsDefined()
  @IsBoolean()
  @ApiProperty({required: true})
  isFeatureRequestsEnabled: boolean;

  @IsDefined()
  @IsBoolean()
  @ApiProperty({required: true})
  isFeatureFeedbackEnabled: boolean;
}
