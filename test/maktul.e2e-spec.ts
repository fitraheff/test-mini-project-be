/* eslint-disable @typescript-eslint/no-unsafe-member-access */
import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import { HttpAdapterHost } from '@nestjs/core';
import { PrismaClientExceptionFilter } from 'nestjs-prisma';
import request from 'supertest';
import { App } from 'supertest/types';
import { AppModule } from './../src/app.module';
import { PrismaService } from './../src/prisma/prisma.service';

describe('Maktul (e2e)', () => {
  let app: INestApplication<App>;
  let prismaService: PrismaService;

  const createMaktulDto = {
    kode: 'MK001',
    nama: 'Pemrograman Dasar',
    sks: 3,
    semester: 1,
  };

  const updateMaktulDto = {
    nama: 'Pemrograman Lanjut',
    sks: 4,
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
    await prismaService.mataKuliah.deleteMany({});
    await app.close();
  });

  afterEach(async () => {
    await prismaService.mataKuliah.deleteMany({});
  });

  describe('POST /maktul', () => {
    it('should create a new mata kuliah', () => {
      return request(app.getHttpServer())
        .post('/maktul')
        .send(createMaktulDto)
        .expect(201)
        .expect((res) => {
          expect(res.body).toHaveProperty('kode', createMaktulDto.kode);
          expect(res.body).toHaveProperty('nama', createMaktulDto.nama);
          expect(res.body).toHaveProperty('sks', createMaktulDto.sks);
          expect(res.body).toHaveProperty('semester', createMaktulDto.semester);
          expect(res.body).toHaveProperty('createdAt');
          expect(res.body).toHaveProperty('updatedAt');
        });
    });

    it('should fail when kode is missing', () => {
      return request(app.getHttpServer())
        .post('/maktul')
        .send({
          nama: 'Mata Kuliah Test',
          sks: 3,
          semester: 1,
        })
        .expect(400);
    });

    it('should fail when nama is missing', () => {
      return request(app.getHttpServer())
        .post('/maktul')
        .send({
          kode: 'MK001',
          sks: 3,
          semester: 1,
        })
        .expect(400);
    });

    it('should fail when sks is missing', () => {
      return request(app.getHttpServer())
        .post('/maktul')
        .send({
          kode: 'MK001',
          nama: 'Mata Kuliah Test',
          semester: 1,
        })
        .expect(400);
    });

    it('should fail when semester is missing', () => {
      return request(app.getHttpServer())
        .post('/maktul')
        .send({
          kode: 'MK001',
          nama: 'Mata Kuliah Test',
          sks: 3,
        })
        .expect(400);
    });

    it('should fail when kode is too short', () => {
      return request(app.getHttpServer())
        .post('/maktul')
        .send({
          kode: 'MK',
          nama: 'Mata Kuliah Test',
          sks: 3,
          semester: 1,
        })
        .expect(400);
    });

    it('should fail when creating duplicate kode', async () => {
      await request(app.getHttpServer())
        .post('/maktul')
        .send(createMaktulDto)
        .expect(201);

      return request(app.getHttpServer())
        .post('/maktul')
        .send(createMaktulDto)
        .expect(409);
    });
  });

  describe('GET /maktul', () => {
    it('should return empty array when no mata kuliah exists', () => {
      return request(app.getHttpServer())
        .get('/maktul')
        .expect(200)
        .expect((res) => {
          expect(Array.isArray(res.body)).toBe(true);
          expect(res.body.length).toBe(0);
        });
    });

    it('should return all mata kuliah', async () => {
      const mk1 = {
        kode: 'MK001',
        nama: 'Pemrograman Dasar',
        sks: 3,
        semester: 1,
      };
      const mk2 = {
        kode: 'MK002',
        nama: 'Struktur Data',
        sks: 3,
        semester: 2,
      };

      await request(app.getHttpServer()).post('/maktul').send(mk1).expect(201);

      await request(app.getHttpServer()).post('/maktul').send(mk2).expect(201);

      return request(app.getHttpServer())
        .get('/maktul')
        .expect(200)
        .expect((res) => {
          expect(Array.isArray(res.body)).toBe(true);
          expect(res.body.length).toBe(2);
        });
    });
  });

  describe('GET /maktul/:id', () => {
    it('should return a specific mata kuliah by kode', async () => {
      const mk = {
        kode: 'MK001',
        nama: 'Pemrograman Dasar',
        sks: 3,
        semester: 1,
      };

      await request(app.getHttpServer()).post('/maktul').send(mk).expect(201);

      return request(app.getHttpServer())
        .get(`/maktul/${mk.kode}`)
        .expect(200)
        .expect((res) => {
          expect(res.body).toHaveProperty('kode', mk.kode);
          expect(res.body).toHaveProperty('nama', mk.nama);
          expect(res.body).toHaveProperty('sks', mk.sks);
        });
    });

    it('should return 404 when mata kuliah not found', () => {
      return request(app.getHttpServer())
        .get('/maktul/NONEXISTENT')
        .expect(404);
    });
  });

  describe('PATCH /maktul/:id', () => {
    it('should update a mata kuliah', async () => {
      const mk = {
        kode: 'MK001',
        nama: 'Original Name',
        sks: 3,
        semester: 1,
      };

      await request(app.getHttpServer()).post('/maktul').send(mk).expect(201);

      return request(app.getHttpServer())
        .patch(`/maktul/${mk.kode}`)
        .send(updateMaktulDto)
        .expect(200)
        .expect((res) => {
          expect(res.body).toHaveProperty('kode', mk.kode);
          expect(res.body).toHaveProperty('nama', updateMaktulDto.nama);
          expect(res.body).toHaveProperty('sks', updateMaktulDto.sks);
        });
    });

    it('should partially update mata kuliah', async () => {
      const mk = {
        kode: 'MK002',
        nama: 'Original Name',
        sks: 3,
        semester: 2,
      };

      await request(app.getHttpServer()).post('/maktul').send(mk).expect(201);

      return request(app.getHttpServer())
        .patch(`/maktul/${mk.kode}`)
        .send({ sks: 4 })
        .expect(200)
        .expect((res) => {
          expect(res.body.sks).toBe(4);
          expect(res.body.nama).toBe(mk.nama);
        });
    });

    it('should return 404 when updating non-existent mata kuliah', () => {
      return request(app.getHttpServer())
        .patch('/maktul/NONEXISTENT')
        .send(updateMaktulDto)
        .expect(404);
    });
  });

  describe('DELETE /maktul/:id', () => {
    it('should delete a mata kuliah', async () => {
      const mk = {
        kode: 'MK001',
        nama: 'To Delete',
        sks: 3,
        semester: 1,
      };

      await request(app.getHttpServer()).post('/maktul').send(mk).expect(201);

      await request(app.getHttpServer())
        .delete(`/maktul/${mk.kode}`)
        .expect(200);

      return request(app.getHttpServer()).get(`/maktul/${mk.kode}`).expect(404);
    });

    it('should return 404 when deleting non-existent mata kuliah', () => {
      return request(app.getHttpServer())
        .delete('/maktul/NONEXISTENT')
        .expect(404);
    });
  });

  describe('Maktul CRUD Integration', () => {
    it('should perform full CRUD operations in sequence', async () => {
      const testMk = {
        kode: 'MK999',
        nama: 'Integration Test Course',
        sks: 3,
        semester: 1,
      };

      // Create
      const createRes = await request(app.getHttpServer())
        .post('/maktul')
        .send(testMk)
        .expect(201);

      expect(createRes.body.kode).toBe(testMk.kode);

      // Read
      const getRes = await request(app.getHttpServer())
        .get(`/maktul/${testMk.kode}`)
        .expect(200);

      expect(getRes.body.nama).toBe(testMk.nama);

      // Update
      const updateRes = await request(app.getHttpServer())
        .patch(`/maktul/${testMk.kode}`)
        .send({ nama: 'Updated Integration Test' })
        .expect(200);

      expect(updateRes.body.nama).toBe('Updated Integration Test');

      // Delete
      await request(app.getHttpServer())
        .delete(`/maktul/${testMk.kode}`)
        .expect(200);

      // Verify deletion
      return request(app.getHttpServer())
        .get(`/maktul/${testMk.kode}`)
        .expect(404);
    });
  });
});
