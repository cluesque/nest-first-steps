import { Injectable } from '@nestjs/common';
import { User } from '@prisma/client'
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class UserService {
  constructor(private prisma: PrismaService) {}

  async makeUser(name: string, email: string) : Promise<User> {
    const user = {
      name: name,
      email: email
    }
    const newUser = await this.prisma.user.create({ data: { name: name, email: email } })
    return newUser;
  }
}
