import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { UserEntity } from './user.entity';

type IUser = {
  id?: number;
  name: string;
  email: string;
  password: string;
};

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(UserEntity)
    private userRepository: Repository<UserEntity>,
  ) {}

  private users: IUser[] = [];

  async findAll(): Promise<UserEntity[]> {
    return await this.userRepository.find();
  }

  async create(user: IUser): Promise<UserEntity> {
    return await this.userRepository.save(user);
  }
}
