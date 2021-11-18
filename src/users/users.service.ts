import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { User, UserDocument } from './entities/user.entity';
import { format } from 'date-fns';

@Injectable()
export class UsersService {
  constructor(@InjectModel(User.name) private userModel: Model<UserDocument>) {}

  formatNumber(str: string) {
    const format = '(xx) xxxxx-xxxx';

    const number = str.split('');

    return format.replace(/x/g, () => number.shift());
  }

  create(createUserDto: CreateUserDto) {
    const user = new this.userModel(createUserDto);

    const date = new Date();
    const formattedDate = format(date, 'HH:mm:ss dd/MMM/yyyy');
    user.createdAt = formattedDate;

    user.phone = this.formatNumber(user.phone);

    return user.save();
  }

  findAll() {
    const users = this.userModel.find();

    return users;
  }

  findOne(id: string) {
    return this.userModel.findById(id);
  }

  update(id: string, updateUserDto: UpdateUserDto) {
    if (updateUserDto.phone) {
      updateUserDto.phone = this.formatNumber(updateUserDto.phone);
    }

    return this.userModel.findByIdAndUpdate(
      {
        _id: id,
      },
      { $set: updateUserDto },
      { new: true },
    );
  }

  remove(id: string) {
    return this.userModel
      .deleteOne({
        _id: id,
      })
      .exec();
  }
}
