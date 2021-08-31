import { ApiProperty } from '@nestjs/swagger';
import { IPagination } from '@app/api-interfaces';
import { IPaginationOptions } from 'nestjs-typeorm-paginate';
export class PaginationDto implements IPagination {
    @ApiProperty({
        required: false,
    })
    page?: number;

    @ApiProperty({
        required: false,
    })
    limit?: number;

    @ApiProperty({
        required: false,
    })
    query?: string;

    paginationOptions(): IPaginationOptions {
        return {
            page: this.page,
            limit: this.limit
        } as unknown as IPaginationOptions
    }
}