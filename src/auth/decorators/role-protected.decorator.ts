import { SetMetadata } from '@nestjs/common';
import { validRoles } from '../enums/valid-roles';

export const META_ROL: string = 'roles';

export const RoleProtected = (...args: validRoles[]) => {
  return SetMetadata(META_ROL, args);
};
