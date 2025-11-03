import {
  Injectable,
  NotFoundException,
  ConflictException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User, UserDocument } from './schemas/user.schema';
import { CreateUserDto } from './dto/create-user.dto';
import bcrypt from 'bcrypt';

@Injectable()
export class UsersService {
  constructor(@InjectModel(User.name) private userModel: Model<UserDocument>) {}

  async create(createDto: CreateUserDto) {
    const existing = await this.userModel
      .findOne({ email: createDto.email })
      .exec();
    if (existing) throw new ConflictException('Email already in use');

    const salt = await bcrypt.genSalt(10);
    const passwordHash = await bcrypt.hash(createDto.password, salt);

    const created = new this.userModel({
      username: createDto.username,
      email: createDto.email,
      passwordHash,
    });

    return created.save();
  }

  async findById(id: string) {
    const user = await this.userModel
      .findById(id)
      .select('-passwordHash')
      .exec();
    if (!user) throw new NotFoundException('User not found');
    return user;
  }

  async findByEmail(email: string) {
    return this.userModel.findOne({ email }).exec();
  }

  async update(id: string, update: Partial<Record<string, any>>) {
    const updated = await this.userModel
      .findByIdAndUpdate(id, update, { new: true, runValidators: true })
      .select('-passwordHash')
      .exec();
    if (!updated) throw new NotFoundException('User not found');
    return updated;
  }

  async setAvatar(id: string, avatarUrl: string) {
    const updated = await this.userModel
      .findByIdAndUpdate(id, { avatarUrl }, { new: true })
      .select('-passwordHash')
      .exec();
    if (!updated) throw new NotFoundException('User not found');
    return updated;
  }
}
