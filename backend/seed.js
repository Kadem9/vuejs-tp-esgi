const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');

const prisma = new PrismaClient();

async function main() {
  console.log('starting seeding...');

  // mes users
  const adminPassword = await bcrypt.hash('password', 10);
  const userPassword = await bcrypt.hash('password', 10);

  const admin = await prisma.user.upsert({
    where: { email: 'admin@crm.com' },
    update: {},
    create: {
      email: 'admin@crm.com',
      name: 'Admin User',
      password: adminPassword,
      role: 'admin',
      avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=admin'
    }
  });

  const user = await prisma.user.upsert({
    where: { email: 'user@crm.com' },
    update: {},
    create: {
      email: 'user@crm.com',
      name: 'Regular User',
      password: userPassword,
      role: 'user',
      avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=user'
    }
  });

  console.log('users created:', { admin: admin.email, user: user.email });

  // mes clients de test
  const customers = [
    {
      name: 'Jean Dupont',
      email: 'jean.dupont@entreprise.com',
      phone: '01 23 45 67 89',
      company: 'Entreprise SA',
      status: 'active',
      notes: 'Client fidèle depuis 2 ans'
    },
    {
      name: 'Marie Martin',
      email: 'marie.martin@startup.fr',
      phone: '06 12 34 56 78',
      company: 'Startup Innovante',
      status: 'prospect',
      notes: 'Intéressée par nos services premium'
    },
    {
      name: 'Pierre Durand',
      email: 'pierre.durand@consulting.com',
      phone: '04 56 78 90 12',
      company: 'Consulting Pro',
      status: 'inactive',
      notes: 'N\'a pas renouvelé son contrat'
    },
    {
      name: 'Sophie Bernard',
      email: 'sophie.bernard@tech.com',
      phone: '07 89 01 23 45',
      company: 'Tech Solutions',
      status: 'active',
      notes: 'Nouveau client très satisfait'
    },
    {
      name: 'Lucas Moreau',
      email: 'lucas.moreau@design.fr',
      phone: '06 78 90 12 34',
      company: 'Design Studio',
      status: 'prospect',
      notes: 'Intéressé par notre offre design'
    }
  ];

  const createdCustomers = [];
  for (const customerData of customers) {
    const customer = await prisma.customer.upsert({
      where: { email: customerData.email },
      update: {},
      create: customerData
    });
    createdCustomers.push(customer);
  }

  console.log('customers created:', createdCustomers.length);

  // mes interactions de test
  const interactions = [
    {
      customerId: createdCustomers[0].id, // Jean Dupont
      userId: admin.id,
      type: 'call',
      title: 'Appel de suivi',
      description: 'Appel de suivi mensuel, client satisfait des services',
      date: new Date('2024-07-15'),
      status: 'completed',
      priority: 'medium'
    },
    {
      customerId: createdCustomers[1].id, // Marie Martin
      userId: admin.id,
      type: 'meeting',
      title: 'Démo produit',
      description: 'Présentation des fonctionnalités premium',
      date: new Date('2024-07-20'),
      status: 'pending',
      priority: 'high'
    },
    {
      customerId: createdCustomers[2].id, // Pierre Durand
      userId: user.id,
      type: 'email',
      title: 'Relance commerciale',
      description: 'Email de relance pour renouvellement de contrat',
      date: new Date('2024-07-10'),
      status: 'completed',
      priority: 'low'
    },
    {
      customerId: createdCustomers[3].id, // Sophie Bernard
      userId: admin.id,
      type: 'note',
      title: 'Premier contact',
      description: 'Premier contact très positif, intéressée par nos solutions',
      date: new Date('2024-07-18'),
      status: 'completed',
      priority: 'medium'
    },
    {
      customerId: createdCustomers[4].id, // Lucas Moreau
      userId: user.id,
      type: 'task',
      title: 'Envoi devis',
      description: 'Préparer et envoyer devis pour projet design',
      date: new Date('2024-07-22'),
      status: 'pending',
      priority: 'high'
    }
  ];

  for (const interactionData of interactions) {
    await prisma.interaction.create({
      data: interactionData
    });
  }

  console.log('interactions created:', interactions.length);

  console.log('seeding done!');
}

main()
  .catch((e) => {
    console.error('seeding error:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  }); 