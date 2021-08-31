/* eslint-disable @typescript-eslint/no-inferrable-types */
import { FileInterceptor, FilesInterceptor } from '@nestjs/platform-express';

import { diskStorage } from 'multer';
import { editFileName, excelFileFilter, imageFileFilter } from '../helpers/file-upload.helper';

export class FileUploadingUtils {
    static fileFilterSwitcher(format) {
        switch (format) {
            case 'image':
                return imageFileFilter;
                break;
            case 'excel':
                return excelFileFilter
            default:
                return imageFileFilter;
                break;
        }
    }

    static singleFileUploader(name: string, dest: string = 'public/images', format: string = 'image') {
        return FileInterceptor(name, {
            storage: diskStorage({
                destination: dest,
                filename: editFileName,
            }),
            fileFilter: this.fileFilterSwitcher(format)
        });
    }

    static multipleFileUploader(name: string, dest: string = 'public/images', maxFileNumber: number = 20) {
        return FilesInterceptor(name, maxFileNumber, {
            storage: diskStorage({
                destination: dest,
                filename: editFileName,
            }),
            fileFilter: imageFileFilter
        });
    }
}