import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  // Create sample store
  const sephoraUAE = await prisma.store.upsert({
    where: { id: 'store-sephora-uae' },
    update: {},
    create: {
      id: 'store-sephora-uae',
      name: 'Sephora UAE',
      location: 'UAE',
    },
  });

  // Create sample SKUs
  const skuData = [
    { id: 'sku-fauxfilter', name: 'Huda Beauty #FauxFilter Foundation', brand: 'Huda Beauty' },
    { id: 'sku-powerbullet', name: 'Huda Beauty Power Bullet Matte Lipstick', brand: 'Huda Beauty' },
    { id: 'sku-easybake', name: 'Huda Beauty Easy Bake Loose Powder', brand: 'Huda Beauty' },
    { id: 'sku-obsessions', name: 'Huda Beauty Obsessions Eyeshadow Palette', brand: 'Huda Beauty' },
  ];
  for (const sku of skuData) {
    await prisma.sku.upsert({
      where: { id: sku.id },
      update: {},
      create: sku,
    });
  }

  // Create admin user
  await prisma.user.upsert({
    where: { email: 'admin@hudabeauty.com' },
    update: {},
    create: {
      name: 'Admin User',
      email: 'admin@hudabeauty.com',
      password: 'adminpass', // In production, use hashed passwords!
      role: 'ADMIN',
    },
  });

  // Create beauty advisor user
  await prisma.user.upsert({
    where: { email: 'advisor@sephora.ae' },
    update: {},
    create: {
      name: 'Beauty Advisor',
      email: 'advisor@sephora.ae',
      password: 'advisorpass',
      role: 'BEAUTY_ADVISOR',
      stores: {
        connect: { id: sephoraUAE.id },
      },
    },
  });

  // Assign all SKUs to Sephora UAE inventory with default status
  const allSkus = await prisma.sku.findMany();
  for (const sku of allSkus) {
    await prisma.inventory.upsert({
      where: {
        storeId_skuId: {
          storeId: sephoraUAE.id,
          skuId: sku.id,
        },
      },
      update: {},
      create: {
        storeId: sephoraUAE.id,
        skuId: sku.id,
        status: 'IN_STOCK',
      },
    });
  }

  console.log('Seed data created successfully.');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
