import { PrismaService } from '../../prisma/prisma.service';

/**
 * Generate NIM (Nomor Induk Mahasiswa) dengan format: YYYYXXXX
 * Contoh: 202600001 (2026 = tahun masuk, 00001 = nomor urut)
 */
export async function generateNIM(
  prisma: PrismaService,
  tahunMasuk: number = new Date().getFullYear(),
): Promise<string> {
  const currentYear = tahunMasuk.toString();

  // Cari NIM dengan prefix tahun ini yang paling besar
  const lastMahasiswa = await prisma.mahasiswa.findFirst({
    where: {
      nim: {
        startsWith: currentYear,
      },
    },
    orderBy: {
      nim: 'desc',
    },
  });

  let sequence = 1;
  if (lastMahasiswa) {
    // Ekstrak nomor urut dari NIM terakhir
    const lastSequence = parseInt(lastMahasiswa.nim.substring(4), 10);
    sequence = lastSequence + 1;
  }

  // Format: YYYYXXXX (4 digit tahun + 4 digit nomor urut)
  return `${currentYear}${String(sequence).padStart(4, '0')}`;
}

/**
 * Generate NIDN (Nomor Induk Dosen Nasional) dengan format: NIDNxxxx
 * Contoh: NIDN0001
 */
export async function generateNIDN(prisma: PrismaService): Promise<string> {
  const lastDosen = await prisma.dosen.findFirst({
    orderBy: {
      nidn: 'desc',
    },
  });

  let sequence = 1;
  if (lastDosen) {
    // Ekstrak nomor urut dari NIDN terakhir
    const lastSequence = parseInt(lastDosen.nidn.substring(4), 10);
    sequence = lastSequence + 1;
  }

  // Format: NIDNxxxx (4 huruf + 4 digit nomor urut)
  return `NIDN${String(sequence).padStart(4, '0')}`;
}

/**
 * Generate Kode Mata Kuliah dengan format: MKxxxx
 * Contoh: MK0001
 */
export async function generateMataKuliahKode(
  prisma: PrismaService,
): Promise<string> {
  const lastMataKuliah = await prisma.mataKuliah.findFirst({
    orderBy: {
      kode: 'desc',
    },
  });

  let sequence = 1;
  if (lastMataKuliah) {
    // Ekstrak nomor urut dari kode terakhir
    const lastSequence = parseInt(lastMataKuliah.kode.substring(2), 10);
    sequence = lastSequence + 1;
  }

  // Format: MKxxxx (2 huruf + 4 digit nomor urut)
  return `MK${String(sequence).padStart(4, '0')}`;
}
