/* eslint-disable @typescript-eslint/no-unsafe-member-access */
import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import { HttpAdapterHost } from '@nestjs/core';
import { PrismaClientExceptionFilter } from 'nestjs-prisma';
import request from 'supertest';
import { App } from 'supertest/types';
import { AppModule } from './../src/app.module';
import { PrismaService } from './../src/prisma/prisma.service';

describe('Mahasiswa (e2e)', () => {
  let app: INestApplication<App>;
  let prismaService: PrismaService;

  const createMahasiswaDto = {
    nim: 'NIM12345678',
    nama: 'John Doe',
  };

  const updateMahasiswaDto = {
    nama: 'Jane Doe',
  };

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();

    // 🔥 TAMBAHKAN INI
    app.useGlobalPipes(
      new ValidationPipe({
        whitelist: true,
        forbidNonWhitelisted: true,
        transform: true,
      }),
    );

    const { httpAdapter } = app.get(HttpAdapterHost);
    app.useGlobalFilters(
      new PrismaClientExceptionFilter(httpAdapter, {
        P2000: 400,
        P2002: 409,
        P2025: 404,
      }),
    );

    prismaService = moduleFixture.get<PrismaService>(PrismaService);
    await app.init();
  });

  afterAll(async () => {
    await prismaService.mahasiswa.deleteMany({});
    await app.close();
    await prismaService.$disconnect();
  });

  afterEach(async () => {
    await prismaService.mahasiswa.deleteMany({});
  });

  describe('POST /mahasiswa', () => {
    it('should create a new mahasiswa', () => {
      return request(app.getHttpServer())
        .post('/mahasiswa')
        .send(createMahasiswaDto)
        .expect(201)
        .expect((res) => {
          expect(res.body).toHaveProperty('nim', createMahasiswaDto.nim);
          expect(res.body).toHaveProperty('nama', createMahasiswaDto.nama);
          expect(res.body).toHaveProperty('createdAt');
          expect(res.body).toHaveProperty('updatedAt');
        });
    });

    it('should fail when nim is missing', () => {
      return request(app.getHttpServer())
        .post('/mahasiswa')
        .send({ nama: 'Test Student' })
        .expect(400);
    });

    it('should fail when nama is missing', () => {
      return request(app.getHttpServer())
        .post('/mahasiswa')
        .send({ nim: 'NIM00000001' })
        .expect(400);
    });

    it('should fail when nim is too short', () => {
      return request(app.getHttpServer())
        .post('/mahasiswa')
        .send({
          nim: 'NIM',
          nama: 'Test Student',
        })
        .expect(400);
    });

    it('should fail when nama is too short', () => {
      return request(app.getHttpServer())
        .post('/mahasiswa')
        .send({
          nim: 'NIM00000001',
          nama: 'AB',
        })
        .expect(400);
    });

    it('should fail when creating duplicate nim', async () => {
      await request(app.getHttpServer())
        .post('/mahasiswa')
        .send(createMahasiswaDto)
        .expect(201);

      return request(app.getHttpServer())
        .post('/mahasiswa')
        .send(createMahasiswaDto)
        .expect(409);
    });
  });

  describe('GET /mahasiswa', () => {
    it('should return empty array when no mahasiswa exists', () => {
      return request(app.getHttpServer())
        .get('/mahasiswa')
        .expect(200)
        .expect((res) => {
          expect(Array.isArray(res.body)).toBe(true);
          expect(res.body.length).toBe(0);
        });
    });

    it('should return all mahasiswa', async () => {
      const mhs1 = { nim: 'NIM00000001', nama: 'Student One' };
      const mhs2 = { nim: 'NIM00000002', nama: 'Student Two' };

      await request(app.getHttpServer())
        .post('/mahasiswa')
        .send(mhs1)
        .expect(201);

      await request(app.getHttpServer())
        .post('/mahasiswa')
        .send(mhs2)
        .expect(201);

      return request(app.getHttpServer())
        .get('/mahasiswa')
        .expect(200)
        .expect((res) => {
          expect(Array.isArray(res.body)).toBe(true);
          expect(res.body.length).toBe(2);
        });
    });
  });

  describe('GET /mahasiswa/:id', () => {
    it('should return a specific mahasiswa by nim', async () => {
      const mhs = { nim: 'NIM00000001', nama: 'Test Student' };

      await request(app.getHttpServer())
        .post('/mahasiswa')
        .send(mhs)
        .expect(201);

      return request(app.getHttpServer())
        .get(`/mahasiswa/${mhs.nim}`)
        .expect(200)
        .expect((res) => {
          expect(res.body).toHaveProperty('nim', mhs.nim);
          expect(res.body).toHaveProperty('nama', mhs.nama);
        });
    });

    it('should return 404 when mahasiswa not found', () => {
      return request(app.getHttpServer())
        .get('/mahasiswa/NONEXISTENT')
        .expect(404);
    });
  });

  describe('PATCH /mahasiswa/:id', () => {
    it('should update a mahasiswa', async () => {
      const mhs = { nim: 'NIM00000001', nama: 'Original Name' };

      await request(app.getHttpServer())
        .post('/mahasiswa')
        .send(mhs)
        .expect(201);

      return request(app.getHttpServer())
        .patch(`/mahasiswa/${mhs.nim}`)
        .send(updateMahasiswaDto)
        .expect(200)
        .expect((res) => {
          expect(res.body).toHaveProperty('nim', mhs.nim);
          expect(res.body).toHaveProperty('nama', updateMahasiswaDto.nama);
        });
    });

    it('should return 404 when updating non-existent mahasiswa', () => {
      return request(app.getHttpServer())
        .patch('/mahasiswa/NONEXISTENT')
        .send(updateMahasiswaDto)
        .expect(404);
    });
  });

  describe('DELETE /mahasiswa/:id', () => {
    it('should delete a mahasiswa', async () => {
      const mhs = { nim: 'NIM00000001', nama: 'To Delete' };

      await request(app.getHttpServer())
        .post('/mahasiswa')
        .send(mhs)
        .expect(201);

      await request(app.getHttpServer())
        .delete(`/mahasiswa/${mhs.nim}`)
        .expect(200);

      return request(app.getHttpServer())
        .get(`/mahasiswa/${mhs.nim}`)
        .expect(404);
    });

    it('should return 404 when deleting non-existent mahasiswa', () => {
      return request(app.getHttpServer())
        .delete('/mahasiswa/NONEXISTENT')
        .expect(404);
    });
  });

  describe('Mahasiswa CRUD Integration', () => {
    it('should perform full CRUD operations in sequence', async () => {
      const testMhs = { nim: 'NIM99999999', nama: 'Integration Test' };

      // Create
      const createRes = await request(app.getHttpServer())
        .post('/mahasiswa')
        .send(testMhs)
        .expect(201);

      expect(createRes.body.nim).toBe(testMhs.nim);

      // Read
      const getRes = await request(app.getHttpServer())
        .get(`/mahasiswa/${testMhs.nim}`)
        .expect(200);

      expect(getRes.body.nama).toBe(testMhs.nama);

      // Update
      const updateRes = await request(app.getHttpServer())
        .patch(`/mahasiswa/${testMhs.nim}`)
        .send({ nama: 'Updated Integration Test' })
        .expect(200);

      expect(updateRes.body.nama).toBe('Updated Integration Test');

      // Delete
      await request(app.getHttpServer())
        .delete(`/mahasiswa/${testMhs.nim}`)
        .expect(200);

      // Verify deletion
      return request(app.getHttpServer())
        .get(`/mahasiswa/${testMhs.nim}`)
        .expect(404);
    });
  });
});
