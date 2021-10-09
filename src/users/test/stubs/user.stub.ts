import { User } from 'src/users/entities/user.entity';

export const userStub = (): User => {
  return {
    name: 'Marcos Vinicius',
    email: 'marquinhos@test.com',
    password: '1234',
  };
};
