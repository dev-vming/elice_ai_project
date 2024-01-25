import { IsInt, IsNotEmpty, IsUUID, IsString, IsEnum, IsOptional, IsDate, ValidateNested } from "class-validator";
import { ApiProperty } from "@nestjs/swagger";
import { Exclude, Expose, Type } from "class-transformer";
import { MealType } from '../record.entity'

class Food {
    @IsString()
    @IsNotEmpty()
    @ApiProperty({ description: "음식 이름" })
    foodName: string;
  
    @IsInt()
    @IsNotEmpty()
    @ApiProperty({ description: "음식 수량" })
    counts: number;

    @IsString()
    @ApiProperty({ description: "음식 사진" })
    foodImage: string;
}  

@Exclude()
export class RecordDto {
    @Expose()
    @IsUUID()
    @ApiProperty({ description: "기록 id" })
    recordId: string;

    @Expose()
    @IsString()
    @IsNotEmpty()
    @ApiProperty({ description: "사용자 id" })
    userId: string;

    @Expose()
    @IsEnum(MealType)
    @ApiProperty({ description: "식단 구분", enum: MealType })
    mealType: MealType;

    @Expose()
    @IsString()
    @IsNotEmpty()
    @ApiProperty({ description: "음식 이름" })
    foodName: string;

    @Expose()
    @ValidateNested({ each: true })
    @Type(() => Food)
    @ApiProperty({ description: "음식 목록", type: [Food] })
    foods: Food[];

    @Expose()
    @IsInt()
    @IsOptional()
    @ApiProperty({ description: "탄수화물", required: false })
    carbohydrates?: number;

    @Expose()
    @IsInt()
    @IsOptional()
    @ApiProperty({ description: "단백질", required: false })
    proteins?: number;

    @Expose()
    @IsInt()
    @IsOptional()
    @ApiProperty({ description: "지방", required: false })
    fats?: number;

    @Expose()
    @IsInt()
    @IsOptional()
    @ApiProperty({ description: "식이섬유", required: false })
    dietaryFiber?: number;

    @Expose()
    @IsInt()
    @IsOptional()
    @ApiProperty({ description: "총 칼로리", required: false })
    totalCalories?: number;

    @Expose()
    @IsString()
    @IsOptional()
    @ApiProperty({ description: "이미지", required: false })
    foodImage?: string;

    @Expose()
    @IsDate()
    @IsOptional()
    @ApiProperty({ description: "첫 기록 날짜", required: false, type: Date })
    firstRecordDate?: Date;

    @Expose()
    @IsDate()
    @IsOptional()
    @ApiProperty({ description: "최근 수정 날짜", required: false, type: Date })
    updatedDate?: Date;
}