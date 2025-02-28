import {ApiProperty} from '@nestjs/swagger';
import {IsDefined, IsNotEmpty, IsString} from 'class-validator';

export class WidgetMetadataDto {
  @IsNotEmpty()
  @IsString()
  @IsDefined()
  @ApiProperty({required: true})
  type: string;

  @IsNotEmpty()
  @IsString()
  @IsDefined()
  @ApiProperty({required: true})
  timezone: string;

  @IsNotEmpty()
  @IsString()
  @IsDefined()
  @ApiProperty({required: true})
  url: string;
}

export class SubmitProductFeedbackRequestDto {
  @IsNotEmpty()
  @IsString()
  @IsDefined()
  @ApiProperty({required: true})
  userFeedback: string;

  @IsDefined()
  @ApiProperty({required: true})
  widgetMetadata: WidgetMetadataDto;
}
