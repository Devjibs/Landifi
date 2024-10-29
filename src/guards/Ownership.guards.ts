import {
  CanActivate,
  ExecutionContext,
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { PropertiesService } from 'src/properties/properties.service';

@Injectable()
export class OwnershipGuard implements CanActivate {
  constructor(private propertiesService: PropertiesService) {}
  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const { userId, params } = request;

    const property = await this.propertiesService.findOne(params.id);

    if (!property) {
      throw new NotFoundException('Property not found!');
    }

    if (property.landlord._id.toString() !== userId) {
      throw new ForbiddenException('You do not have permission.');
    }

    return true;
  }
}
