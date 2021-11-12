import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
// import { format } from 'date-fns';
// import { BeforeInsert } from 'typeorm';

export type UserDocument = User & Document;

@Schema()
export class User {
  @Prop()
  name: string;

  @Prop()
  email: string;

  @Prop()
  password: string;

  @Prop()
  phone: string;

  @Prop()
  createdAt?: string;

  // @BeforeInsert()
}

export const UserSchema = SchemaFactory.createForClass(User);
