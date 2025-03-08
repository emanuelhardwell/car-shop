import { BadRequestException } from '@nestjs/common';

export const fileFilter = (
  req,
  file: Express.Multer.File,
  callback: Function,
) => {
  const validatedExtensions = ['png', 'jpg', 'jpeg', 'gif'];
  const extension = file.mimetype.split('/')[1];

  if (validatedExtensions.includes(extension)) return callback(null, true);

  callback(
    new BadRequestException(
      'Invalid file type! Only .png, .jpg, .jpeg, and.gif are allowed.',
    ),
    false,
  );
};
