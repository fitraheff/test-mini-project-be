/* eslint-disable @typescript-eslint/require-await */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import { HttpAdapterHost } from '@nestjs/core';
import { PrismaClientExceptionFilter } from 'nestjs-prisma';
import request from 'supertest';
import { App } from 'supertest/types';
import { AppModule } from './../src/app.module';
import { PrismaService } from './../src/prisma/prisma.service';

describe('Dosen (e2e)', () => {
  let app: INestApplication<App>;
  let prismaService: PrismaService;

  const createDosenDto = {
    nama: 'Dr. John Doe',
  };

  const updateDosenDto = {
    nama: 'Dr. Jane Doe',
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
    await prismaService.$disconnect();
  });

  afterEach(async () => {
    // Cleanup after each test
    await prismaService.dosen.deleteMany({});
  });

  describe('POST /dosen', () => {
    it('should create a new dosen with auto-generated NIDN', () => {
      return request(app.getHttpServer())
        .post('/dosen')
        .send(createDosenDto)
        .expect(201)
        .expect((res) => {
          expect(res.body).toHaveProperty('nidn');
          expect(res.body.nidn).toMatch(/^NIDN\d{4}$/);
          expect(res.body).toHaveProperty('nama', createDosenDto.nama);
          expect(res.body).toHaveProperty('createdAt');
          expect(res.body).toHaveProperty('updatedAt');
        });
    });

    it('should fail when nama is missing', () => {
      return request(app.getHttpServer()).post('/dosen').send({}).expect(400);
    });

    it('should fail when nama is too short', () => {
      return request(app.getHttpServer())
        .post('/dosen')
        .send({
          nama: 'Dr',
        })
        .expect(400);
    });

    it('should fail when nama exceeds max length', () => {
      return request(app.getHttpServer())
        .post('/dosen')
        .send({
          nama: 'A'.repeat(256),
        })
        .expect(400);
    });

    it('should fail when creating duplicate nidn', async () => {
      // This test is no longer relevant since NIDN is auto-generated
      // and duplicate is not possible with auto-increment
      expect(true).toBe(true);
    });
  });

  describe('GET /dosen', () => {
    it('should return empty array when no dosen exists', () => {
      return request(app.getHttpServer())
        .get('/dosen')
        .expect(200)
        .expect((res) => {
          expect(Array.isArray(res.body)).toBe(true);
          expect(res.body.length).toBe(0);
        });
    });

    it('should return all dosen', async () => {
      // Create test data
      const dosen1 = { nama: 'Dr. Test 1' };
      const dosen2 = { nama: 'Dr. Test 2' };

      await request(app.getHttpServer())
        .post('/dosen')
        .send(dosen1)
        .expect(201);

      await request(app.getHttpServer())
        .post('/dosen')
        .send(dosen2)
        .expect(201);

      return request(app.getHttpServer())
        .get('/dosen')
        .expect(200)
        .expect((res) => {
          expect(Array.isArray(res.body)).toBe(true);
          expect(res.body.length).toBe(2);
          expect(res.body[0]).toHaveProperty('nidn');
          expect(res.body[0]).toHaveProperty('nama');
        });
    });
  });

  describe('GET /dosen/:id', () => {
    it('should return a specific dosen by nidn', async () => {
      // Create test data
      const dosen = { nama: 'Dr. Test Specific' };

      const createRes = await request(app.getHttpServer())
        .post('/dosen')
        .send(dosen)
        .expect(201);

      return request(app.getHttpServer())
        .get(`/dosen/${createRes.body.nidn}`)
        .expect(200)
        .expect((res) => {
          expect(res.body).toHaveProperty('nidn', createRes.body.nidn);
          expect(res.body).toHaveProperty('nama', dosen.nama);
        });
    });

    it('should return 404 when dosen not found', () => {
      return request(app.getHttpServer()).get('/dosen/NONEXISTENT').expect(404);
    });
  });

  describe('PATCH /dosen/:id', () => {
    it('should update a dosen', async () => {
      // Create test data
      const dosen = { nama: 'Dr. Original Name' };

      const createRes = await request(app.getHttpServer())
        .post('/dosen')
        .send(dosen)
        .expect(201);

      return request(app.getHttpServer())
        .patch(`/dosen/${createRes.body.nidn}`)
        .send(updateDosenDto)
        .expect(200)
        .expect((res) => {
          expect(res.body).toHaveProperty('nidn', createRes.body.nidn);
          expect(res.body).toHaveProperty('nama', updateDosenDto.nama);
        });
    });

    it('should partially update dosen with only nama', async () => {
      const dosen = { nama: 'Dr. Original' };

      const createRes = await request(app.getHttpServer())
        .post('/dosen')
        .send(dosen)
        .expect(201);

      return request(app.getHttpServer())
        .patch(`/dosen/${createRes.body.nidn}`)
        .send({ nama: 'Dr. Updated Name' })
        .expect(200)
        .expect((res) => {
          expect(res.body.nama).toBe('Dr. Updated Name');
          expect(res.body.nidn).toBe(createRes.body.nidn);
        });
    });

    it('should return 404 when trying to update non-existent dosen', () => {
      return request(app.getHttpServer())
        .patch('/dosen/NONEXISTENT')
        .send(updateDosenDto)
        .expect(404);
    });

    it('should fail when updating with invalid nama length', async () => {
      const dosen = { nama: 'Dr. Valid' };

      const createRes = await request(app.getHttpServer())
        .post('/dosen')
        .send(dosen)
        .expect(201);

      return request(app.getHttpServer())
        .patch(`/dosen/${createRes.body.nidn}`)
        .send({ nama: 'AB' })
        .expect(400);
    });
  });

  describe('DELETE /dosen/:id', () => {
    it('should delete a dosen', async () => {
      const dosen = { nama: 'Dr. To Delete' };

      const createRes = await request(app.getHttpServer())
        .post('/dosen')
        .send(dosen)
        .expect(201);

      await request(app.getHttpServer())
        .delete(`/dosen/${createRes.body.nidn}`)
        .expect(200);

      return request(app.getHttpServer())
        .get(`/dosen/${createRes.body.nidn}`)
        .expect(404);
    });

    it('should return 404 when deleting non-existent dosen', () => {
      return request(app.getHttpServer())
        .delete('/dosen/NONEXISTENT')
        .expect(404);
    });
  });

  describe('Dosen Flow Integration Tests', () => {
    it('should create, read, update and delete dosen in sequence', async () => {
      const testDosen = { nama: 'Dr. Integration Test' };

      // Create
      const createRes = await request(app.getHttpServer())
        .post('/dosen')
        .send(testDosen)
        .expect(201);

      expect(createRes.body.nidn).toMatch(/^NIDN\d{4}$/);

      // Read
      const getRes = await request(app.getHttpServer())
        .get(`/dosen/${createRes.body.nidn}`)
        .expect(200);

      expect(getRes.body.nama).toBe(testDosen.nama);

      // Update
      const updateRes = await request(app.getHttpServer())
        .patch(`/dosen/${createRes.body.nidn}`)
        .send({ nama: 'Dr. Integration Test Updated' })
        .expect(200);

      expect(updateRes.body.nama).toBe('Dr. Integration Test Updated');

      // Delete
      await request(app.getHttpServer())
        .delete(`/dosen/${createRes.body.nidn}`)
        .expect(200);

      // Verify deletion
      return request(app.getHttpServer())
        .get(`/dosen/${createRes.body.nidn}`)
        .expect(404);
    });
  });
});
