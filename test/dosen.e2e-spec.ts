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
    nidn: 'NIDN12345',
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
    // Cleanup: delete all dosen records created during tests
    await prismaService.dosen.deleteMany({});
    await app.close();
    await prismaService.$disconnect();
  });

  afterEach(async () => {
    // Cleanup after each test
    await prismaService.dosen.deleteMany({});
  });

  describe('POST /dosen', () => {
    it('should create a new dosen', () => {
      return request(app.getHttpServer())
        .post('/dosen')
        .send(createDosenDto)
        .expect(201)
        .expect((res) => {
          expect(res.body).toHaveProperty('nidn', createDosenDto.nidn);
          expect(res.body).toHaveProperty('nama', createDosenDto.nama);
          expect(res.body).toHaveProperty('createdAt');
          expect(res.body).toHaveProperty('updatedAt');
        });
    });

    it('should fail when nidn is missing', () => {
      return request(app.getHttpServer())
        .post('/dosen')
        .send({ nama: 'Dr. Test' })
        .expect(400);
    });

    it('should fail when nama is missing', () => {
      return request(app.getHttpServer())
        .post('/dosen')
        .send({ nidn: 'NIDN00001' })
        .expect(400);
    });

    it('should fail when nidn is too short', () => {
      return request(app.getHttpServer())
        .post('/dosen')
        .send({
          nidn: 'NID',
          nama: 'Dr. Test',
        })
        .expect(400);
    });

    it('should fail when nama is too short', () => {
      return request(app.getHttpServer())
        .post('/dosen')
        .send({
          nidn: 'NIDN00001',
          nama: 'Dr',
        })
        .expect(400);
    });

    it('should fail when nidn exceeds max length', () => {
      return request(app.getHttpServer())
        .post('/dosen')
        .send({
          nidn: 'N'.repeat(21),
          nama: 'Dr. Test',
        })
        .expect(400);
    });

    it('should fail when nama exceeds max length', () => {
      return request(app.getHttpServer())
        .post('/dosen')
        .send({
          nidn: 'NIDN00001',
          nama: 'A'.repeat(256),
        })
        .expect(400);
    });

    it('should fail when creating duplicate nidn', async () => {
      // First create
      await request(app.getHttpServer())
        .post('/dosen')
        .send(createDosenDto)
        .expect(201);

      // Try to create duplicate
      return request(app.getHttpServer())
        .post('/dosen')
        .send(createDosenDto)
        .expect(409);
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
      const dosen1 = { nidn: 'NIDN00001', nama: 'Dr. Test 1' };
      const dosen2 = { nidn: 'NIDN00002', nama: 'Dr. Test 2' };

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
      const dosen = { nidn: 'NIDN00001', nama: 'Dr. Test Specific' };

      await request(app.getHttpServer()).post('/dosen').send(dosen).expect(201);

      return request(app.getHttpServer())
        .get(`/dosen/${dosen.nidn}`)
        .expect(200)
        .expect((res) => {
          expect(res.body).toHaveProperty('nidn', dosen.nidn);
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
      const dosen = { nidn: 'NIDN00001', nama: 'Dr. Original Name' };

      await request(app.getHttpServer()).post('/dosen').send(dosen).expect(201);

      return request(app.getHttpServer())
        .patch(`/dosen/${dosen.nidn}`)
        .send(updateDosenDto)
        .expect(200)
        .expect((res) => {
          expect(res.body).toHaveProperty('nidn', dosen.nidn);
          expect(res.body).toHaveProperty('nama', updateDosenDto.nama);
        });
    });

    it('should partially update dosen with only nama', async () => {
      const dosen = { nidn: 'NIDN00002', nama: 'Dr. Original' };

      await request(app.getHttpServer()).post('/dosen').send(dosen).expect(201);

      return request(app.getHttpServer())
        .patch(`/dosen/${dosen.nidn}`)
        .send({ nama: 'Dr. Updated Name' })
        .expect(200)
        .expect((res) => {
          expect(res.body.nama).toBe('Dr. Updated Name');
          expect(res.body.nidn).toBe(dosen.nidn);
        });
    });

    it('should return 404 when trying to update non-existent dosen', () => {
      return request(app.getHttpServer())
        .patch('/dosen/NONEXISTENT')
        .send(updateDosenDto)
        .expect(404);
    });

    it('should fail when updating with invalid nama length', async () => {
      const dosen = { nidn: 'NIDN00003', nama: 'Dr. Valid' };

      await request(app.getHttpServer()).post('/dosen').send(dosen).expect(201);

      return request(app.getHttpServer())
        .patch(`/dosen/${dosen.nidn}`)
        .send({ nama: 'AB' })
        .expect(400);
    });
  });

  describe('DELETE /dosen/:id', () => {
    it('should delete a dosen', async () => {
      const dosen = { nidn: 'NIDN00001', nama: 'Dr. To Delete' };

      await request(app.getHttpServer()).post('/dosen').send(dosen).expect(201);

      await request(app.getHttpServer())
        .delete(`/dosen/${dosen.nidn}`)
        .expect(200);

      return request(app.getHttpServer())
        .get(`/dosen/${dosen.nidn}`)
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
      const testDosen = { nidn: 'NIDN99999', nama: 'Dr. Integration Test' };

      // Create
      const createRes = await request(app.getHttpServer())
        .post('/dosen')
        .send(testDosen)
        .expect(201);

      expect(createRes.body.nidn).toBe(testDosen.nidn);

      // Read
      const getRes = await request(app.getHttpServer())
        .get(`/dosen/${testDosen.nidn}`)
        .expect(200);

      expect(getRes.body.nama).toBe(testDosen.nama);

      // Update
      const updateRes = await request(app.getHttpServer())
        .patch(`/dosen/${testDosen.nidn}`)
        .send({ nama: 'Dr. Integration Test Updated' })
        .expect(200);

      expect(updateRes.body.nama).toBe('Dr. Integration Test Updated');

      // Delete
      await request(app.getHttpServer())
        .delete(`/dosen/${testDosen.nidn}`)
        .expect(200);

      // Verify deletion
      return request(app.getHttpServer())
        .get(`/dosen/${testDosen.nidn}`)
        .expect(404);
    });
  });
});
