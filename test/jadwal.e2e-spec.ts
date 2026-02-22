/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import { HttpAdapterHost } from '@nestjs/core';
import { PrismaClientExceptionFilter } from 'nestjs-prisma';
import request from 'supertest';
import { App } from 'supertest/types';
import { AppModule } from './../src/app.module';
import { PrismaService } from './../src/prisma/prisma.service';

describe('Jadwal (e2e)', () => {
  let app: INestApplication<App>;
  let prismaService: PrismaService;

  let maktulKode: string;
  let dosenNidn: string;

  const createJadwalDto = {
    hari: 'Senin',
    jamMulai: '2026-02-23T08:00:00Z',
    jamSelesai: '2026-02-23T10:00:00Z',
    ruangan: 'Ruang A101',
    kode: '',
    nidn: '',
  };

  const updateJadwalDto = {
    hari: 'Selasa',
    ruangan: 'Ruang B202',
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

    // Create required references with auto-generated IDs
    const dosenRes = await request(app.getHttpServer())
      .post('/dosen')
      .send({ nama: 'Dr. Test' });
    dosenNidn = dosenRes.body.nidn;

    const maktulRes = await request(app.getHttpServer()).post('/maktul').send({
      nama: 'Test Course',
      sks: 3,
      semester: 1,
    });
    maktulKode = maktulRes.body.kode;

    // Set the auto-generated IDs in createJadwalDto
    createJadwalDto.nidn = dosenNidn;
    createJadwalDto.kode = maktulKode;
  });

  afterAll(async () => {
    await prismaService.$disconnect();
  });

  afterEach(async () => {
    await prismaService.jadwal.deleteMany({});
  });

  describe('POST /jadwal', () => {
    it('should create a new jadwal', () => {
      return request(app.getHttpServer())
        .post('/jadwal')
        .send(createJadwalDto)
        .expect(201)
        .expect((res) => {
          expect(res.body).toHaveProperty('hari', createJadwalDto.hari);
          expect(res.body).toHaveProperty('ruangan', createJadwalDto.ruangan);
          expect(res.body).toHaveProperty('kode', maktulKode);
          expect(res.body).toHaveProperty('nidn', dosenNidn);
          expect(res.body).toHaveProperty('id');
          expect(res.body).toHaveProperty('createdAt');
          expect(res.body).toHaveProperty('updatedAt');
        });
    });

    it('should fail when hari is missing', () => {
      return request(app.getHttpServer())
        .post('/jadwal')
        .send({
          jamMulai: '2026-02-23T08:00:00Z',
          jamSelesai: '2026-02-23T10:00:00Z',
          ruangan: 'Ruang A101',
          kode: maktulKode,
          nidn: dosenNidn,
        })
        .expect(400);
    });

    it('should fail when jamMulai is missing', () => {
      return request(app.getHttpServer())
        .post('/jadwal')
        .send({
          hari: 'Senin',
          jamSelesai: '2026-02-23T10:00:00Z',
          ruangan: 'Ruang A101',
          kode: maktulKode,
          nidn: dosenNidn,
        })
        .expect(400);
    });

    it('should fail when jamSelesai is missing', () => {
      return request(app.getHttpServer())
        .post('/jadwal')
        .send({
          hari: 'Senin',
          jamMulai: '2026-02-23T08:00:00Z',
          ruangan: 'Ruang A101',
          kode: maktulKode,
          nidn: dosenNidn,
        })
        .expect(400);
    });

    it('should fail when ruangan is missing', () => {
      return request(app.getHttpServer())
        .post('/jadwal')
        .send({
          hari: 'Senin',
          jamMulai: '2026-02-23T08:00:00Z',
          jamSelesai: '2026-02-23T10:00:00Z',
          kode: maktulKode,
          nidn: dosenNidn,
        })
        .expect(400);
    });

    it('should fail when hari is too short', () => {
      return request(app.getHttpServer())
        .post('/jadwal')
        .send({
          hari: 'S',
          jamMulai: '2026-02-23T08:00:00Z',
          jamSelesai: '2026-02-23T10:00:00Z',
          ruangan: 'Ruang A101',
          kode: maktulKode,
          nidn: dosenNidn,
        })
        .expect(400);
    });
  });

  describe('GET /jadwal', () => {
    it('should return empty array when no jadwal exists', () => {
      return request(app.getHttpServer())
        .get('/jadwal')
        .expect(200)
        .expect((res) => {
          expect(Array.isArray(res.body)).toBe(true);
          expect(res.body.length).toBe(0);
        });
    });

    it('should return all jadwal', async () => {
      const jadwal1 = {
        hari: 'Senin',
        jamMulai: '2026-02-23T08:00:00Z',
        jamSelesai: '2026-02-23T10:00:00Z',
        ruangan: 'Ruang A101',
        kode: maktulKode,
        nidn: dosenNidn,
      };

      const jadwal2 = {
        hari: 'Selasa',
        jamMulai: '2026-02-24T10:00:00Z',
        jamSelesai: '2026-02-24T12:00:00Z',
        ruangan: 'Ruang B202',
        kode: maktulKode,
        nidn: dosenNidn,
      };

      await request(app.getHttpServer())
        .post('/jadwal')
        .send(jadwal1)
        .expect(201);

      await request(app.getHttpServer())
        .post('/jadwal')
        .send(jadwal2)
        .expect(201);

      return request(app.getHttpServer())
        .get('/jadwal')
        .expect(200)
        .expect((res) => {
          expect(Array.isArray(res.body)).toBe(true);
          expect(res.body.length).toBe(2);
        });
    });
  });

  describe('GET /jadwal/:id', () => {
    it('should return a specific jadwal by id', async () => {
      const jadwal = {
        hari: 'Senin',
        jamMulai: '2026-02-23T08:00:00Z',
        jamSelesai: '2026-02-23T10:00:00Z',
        ruangan: 'Ruang A101',
        kode: maktulKode,
        nidn: dosenNidn,
      };

      const createRes = await request(app.getHttpServer())
        .post('/jadwal')
        .send(jadwal)
        .expect(201);

      const jadwalId = createRes.body.id;

      return request(app.getHttpServer())
        .get(`/jadwal/${jadwalId}`)
        .expect(200)
        .expect((res) => {
          expect(res.body).toHaveProperty('id', jadwalId);
          expect(res.body).toHaveProperty('hari', jadwal.hari);
          expect(res.body).toHaveProperty('ruangan', jadwal.ruangan);
        });
    });

    it('should return 404 when jadwal not found', () => {
      return request(app.getHttpServer())
        .get('/jadwal/nonexistent-id-12345')
        .expect(404);
    });
  });

  describe('PATCH /jadwal/:id', () => {
    it('should update a jadwal', async () => {
      const jadwal = {
        hari: 'Senin',
        jamMulai: '2026-02-23T08:00:00Z',
        jamSelesai: '2026-02-23T10:00:00Z',
        ruangan: 'Ruang A101',
        kode: maktulKode,
        nidn: dosenNidn,
      };

      const createRes = await request(app.getHttpServer())
        .post('/jadwal')
        .send(jadwal)
        .expect(201);

      const jadwalId = createRes.body.id;

      return request(app.getHttpServer())
        .patch(`/jadwal/${jadwalId}`)
        .send(updateJadwalDto)
        .expect(200)
        .expect((res) => {
          expect(res.body).toHaveProperty('id', jadwalId);
          expect(res.body).toHaveProperty('hari', updateJadwalDto.hari);
          expect(res.body).toHaveProperty('ruangan', updateJadwalDto.ruangan);
        });
    });

    it('should partially update jadwal with only hari', async () => {
      const jadwal = {
        hari: 'Senin',
        jamMulai: '2026-02-23T08:00:00Z',
        jamSelesai: '2026-02-23T10:00:00Z',
        ruangan: 'Ruang A101',
        kode: maktulKode,
        nidn: dosenNidn,
      };

      const createRes = await request(app.getHttpServer())
        .post('/jadwal')
        .send(jadwal)
        .expect(201);

      const jadwalId = createRes.body.id;

      return request(app.getHttpServer())
        .patch(`/jadwal/${jadwalId}`)
        .send({ hari: 'Rabu' })
        .expect(200)
        .expect((res) => {
          expect(res.body.hari).toBe('Rabu');
          expect(res.body.ruangan).toBe(jadwal.ruangan);
        });
    });

    it('should return 404 when updating non-existent jadwal', () => {
      return request(app.getHttpServer())
        .patch('/jadwal/nonexistent-id-12345')
        .send(updateJadwalDto)
        .expect(404);
    });
  });

  describe('DELETE /jadwal/:id', () => {
    it('should delete a jadwal', async () => {
      const jadwal = {
        hari: 'Senin',
        jamMulai: '2026-02-23T08:00:00Z',
        jamSelesai: '2026-02-23T10:00:00Z',
        ruangan: 'Ruang A101',
        kode: maktulKode,
        nidn: dosenNidn,
      };

      const createRes = await request(app.getHttpServer())
        .post('/jadwal')
        .send(jadwal)
        .expect(201);

      const jadwalId = createRes.body.id;

      await request(app.getHttpServer())
        .delete(`/jadwal/${jadwalId}`)
        .expect(200);

      return request(app.getHttpServer())
        .get(`/jadwal/${jadwalId}`)
        .expect(404);
    });

    it('should return 404 when deleting non-existent jadwal', () => {
      return request(app.getHttpServer())
        .delete('/jadwal/nonexistent-id-12345')
        .expect(404);
    });
  });

  describe('Jadwal CRUD Integration', () => {
    it('should perform full CRUD operations in sequence', async () => {
      const testJadwal = {
        hari: 'Kamis',
        jamMulai: '2026-02-26T13:00:00Z',
        jamSelesai: '2026-02-26T15:00:00Z',
        ruangan: 'Ruang C303',
        kode: maktulKode,
        nidn: dosenNidn,
      };

      // Create
      const createRes = await request(app.getHttpServer())
        .post('/jadwal')
        .send(testJadwal)
        .expect(201);

      expect(createRes.body.hari).toBe(testJadwal.hari);
      const jadwalId = createRes.body.id;

      // Read
      const getRes = await request(app.getHttpServer())
        .get(`/jadwal/${jadwalId}`)
        .expect(200);

      expect(getRes.body.ruangan).toBe(testJadwal.ruangan);

      // Update
      const updateRes = await request(app.getHttpServer())
        .patch(`/jadwal/${jadwalId}`)
        .send({ hari: 'Jumat', ruangan: 'Ruang D404' })
        .expect(200);

      expect(updateRes.body.hari).toBe('Jumat');
      expect(updateRes.body.ruangan).toBe('Ruang D404');

      // Delete
      await request(app.getHttpServer())
        .delete(`/jadwal/${jadwalId}`)
        .expect(200);

      // Verify deletion
      return request(app.getHttpServer())
        .get(`/jadwal/${jadwalId}`)
        .expect(404);
    });
  });
});
