import { Test } from '@nestjs/testing';
import { Connection } from 'mongoose';
import { AppModule } from '../../../app.module';
import { DatabaseService } from '../../../database/database.service';
import { userStub } from '../stubs/user.stub';
import * as request from 'supertest';

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
    await dbConnection.collection('users').deleteMany({});
    app.close();
  });

  describe('getUsers', async () => {
    it('should return an array os users', async () => {
      //userStubs é uma function que retorna os dados a serem cadastrados para o teste
      await dbConnection.collection('users').insertOne(userStub());
      const response = await request(httpServer).get('/users');

      expect(response.status).toBe(200);
      expect(response.body).toEqual([userStub()]);
    });
  });
});
