import { Test } from '@nestjs/testing';
import { Connection } from 'mongoose';
import { AppModule } from '../../../app.module';
import { DatabaseService } from '../../../database/database.service';
import { userStub } from '../stubs/user.stub';
import * as request from 'supertest';
import { CreateUserDto } from 'src/users/dto/create-user.dto';

describe('UsersController', () => {
  let dbConnection: Connection;
  let httpServer: any;
  let app: any;

  // testando iniciação da aplicação de da conecção com o banco de dados antes de iniciar os testes
  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleRef.createNestApplication();
    await app.init();
    dbConnection = moduleRef
      .get<DatabaseService>(DatabaseService)
      .getDbHandle();
    httpServer = app.getHttpServer();
  });

  afterAll(async () => {
    app.close();
  });

  beforeEach(async () => {
    await dbConnection.collection('users').deleteMany({});
  });

  describe('getUsers', () => {
    it('should return an array os users', async () => {
      //userStubs é uma function que retorna os dados a serem cadastrados para o teste
      await dbConnection.collection('users').insertOne(userStub());
      const response = await request(httpServer).get('/users');

      expect(response.status).toBe(200);
      expect(response.body).toMatchObject([userStub()]);
    });
  });

  describe('createUser', () => {
    it('should create a new user', async () => {
      const createUserRequest: CreateUserDto = {
        email: userStub().email,
        name: userStub().name,
        password: userStub().password,
      };
      const response = await request(httpServer)
        .post('/users')
        .send(createUserRequest);

      expect(response.status).toBe(201);
      expect(response.body).toMatchObject(createUserRequest);

      const user = await dbConnection
        .collection('users')
        .findOne({ email: createUserRequest.email });
      expect(user).toMatchObject(createUserRequest);
    });
  });
});
