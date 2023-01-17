import { Test } from '@nestjs/testing';
import { AppModule } from 'src/app.module';
import { PrismaService } from 'src/prisma/prisma.service';
import { AuthDto } from './dto';
import * as dayjs from 'dayjs';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { ValidationPipe } from '@nestjs/common/pipes';
import { AuthService } from './auth.service';

describe('AuthService Int', () => {
  let app: INestApplication;
  let prisma: PrismaService;
  let authService: AuthService;
  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    prisma = moduleRef.get(PrismaService);
    authService = moduleRef.get(AuthService);
    app = moduleRef.createNestApplication();
    app.useGlobalPipes(
      new ValidationPipe({
        whitelist: true,
      }),
    );
    await app.init();
    await prisma.cleantDbForTesting();
  });

  describe('Create user', () => {
    const authDto: AuthDto = {
      firstName: 'Usuario',
      lastName: 'Last',
      email: 'user@email.com',
      password: '12345678',
      birthday: dayjs('08-10-1998').toDate(),
    };
    it('should create user', () => {
      return request(app.getHttpServer())
        .post('/auth/signup')
        .send(authDto)
        .expect(201);
    });
    it('should throw on duplicate email', async () => {
      return request(app.getHttpServer())
        .post('/auth/signup')
        .send(authDto)
        .expect(403);
    });
    it('should throw on missing field', async () => {
      const dtoCopy = { ...authDto };
      delete dtoCopy.email;
      return request(app.getHttpServer())
        .post('/auth/signup')
        .send(dtoCopy)
        .expect(400);
    });
  });

  describe('Activate user account', () => {
    const authDto: AuthDto = {
      firstName: 'Usuario',
      lastName: 'Last',
      email: 'user@email.com',
      password: '12345678',
      birthday: dayjs('08-10-1998').toDate(),
    };
    it('should throw on login if user email isnt confirmed', async () => {
      const error = await request(app.getHttpServer())
        .post('/auth/signin')
        .send(authDto);
      expect(error.status).toBe(403);
      expect(error.body.message).toBe('User not active');
    });
    it('should activate user account with a token', async () => {
      const token = await authService.generateActivationToken(authDto);
      const response = await request(app.getHttpServer()).post(
        `/auth/verify_email/${token}`,
      );
      expect(response.status).toBe(200);
    });
    it('should set true activeStatus and isEmailConfirmed in user', async () => {
      const user = await prisma.user.findUnique({
        where: { email: authDto.email },
      });

      expect(user.activeStatus).toBe(true);
      expect(user.isEmailConfirmed).toBe(true);
    });
    it('should throw on email already confirmed', async () => {
      const token = await authService.generateActivationToken(authDto);
      const error = await request(app.getHttpServer()).post(
        `/auth/verify_email/${token}`,
      );
      expect(error.status).toBe(400);
      expect(error.body.message).toBe('Email already confirmed');
    });
    it('should throw on unvalid token', async () => {
      const token = '325458dsjfklw';
      const error = await request(app.getHttpServer()).post(
        `/auth/verify_email/${token}`,
      );
      expect(error.status).toBe(400);
      expect(error.body.message).toBe('Bad confirmation token');
    });
  });
  describe('Login with user', () => {
    const authDto: AuthDto = {
      firstName: 'Usuario',
      lastName: 'Last',
      email: 'user@email.com',
      password: '12345678',
      birthday: dayjs('08-10-1998').toDate(),
    };
    it('should login with user and return user with token', async () => {
      const response = await request(app.getHttpServer())
        .post('/auth/signin')
        .send(authDto);

      expect(response.status).toBe(200);
      expect(response.body.id).toBeDefined();
      expect(response.body.token).toBeDefined();
      expect(response.body.email).toBeDefined();
      expect(response.body.hash).not.toBeDefined();
      expect(response.body.activeStatus).toBe(true);
      expect(response.body.isEmailConfirmed).toBe(true);
    });
  });

  it.todo('should pass');
});
