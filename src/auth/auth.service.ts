import { Injectable, NotFoundException, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { Prisma } from '@prisma/client';
import { DatabaseService } from 'src/database/database.service';
import { LoginDto } from './dto/login.dto';
import * as bcrypt from 'bcrypt';

@Injectable()
export class AuthService {
    constructor(
        private databaseService: DatabaseService,
        private jwtService: JwtService){}

    async register(createUserDto: Prisma.UserCreateInput) {
        const hashedPass = await bcrypt.hash(createUserDto.password,10)
        createUserDto.password = hashedPass
        return this.databaseService.user.create({data: createUserDto})
    }
    

    async login(loginDto: LoginDto) {
        const {email,password} = loginDto

        const user = await this.databaseService.user.findUnique({where: {email: email}})
        
        if(!user) throw new NotFoundException('User not found')

        
        const validatePassword  = await bcrypt.compare(password, user.password)
        
        if(!validatePassword) throw new UnauthorizedException('Invalid password')
    
        return {
            token :await this.jwtService.signAsync({email})
        }
    }
}
