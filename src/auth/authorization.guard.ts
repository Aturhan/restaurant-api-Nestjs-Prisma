import { Injectable, CanActivate, ExecutionContext } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { Observable } from 'rxjs';
import { ROLES_KEY } from 'src/decorators/roles-decorator';

@Injectable()
export class AuthhorizationGuard implements CanActivate {
    constructor(private reflector: Reflector){}

  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {
    const request = context.switchToHttp().getRequest();
    
    const requiredRoles = this.reflector.getAllAndOverride(ROLES_KEY,[context.getClass(),context.getHandler()])
    const userRole = request.user.role
    if(requiredRoles !== userRole) return false
    return true 
  }
}
