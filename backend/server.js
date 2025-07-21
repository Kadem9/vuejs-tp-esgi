const express = require('express');
const cors = require('cors');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { PrismaClient } = require('@prisma/client');

const app = express();
const prisma = new PrismaClient();
const PORT = process.env.PORT || 3001;
const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key';

// middleware
app.use(cors());
app.use(express.json());

// middleware pr auth
const authenticateToken = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    return res.status(401).json({ message: 'Token manquant' });
  }

  jwt.verify(token, JWT_SECRET, (err, user) => {
    if (err) {
      return res.status(403).json({ message: 'Token invalide' });
    }
    req.user = user;
    next();
  });
};

// middleware pr admin
const requireAdmin = (req, res, next) => {
  if (req.user.role !== 'admin') {
    return res.status(403).json({ message: 'Accès réservé aux administrateurs' });
  }
  next();
};

// routes auth
app.post('/api/auth/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await prisma.user.findUnique({
      where: { email }
    });

    if (!user || !(await bcrypt.compare(password, user.password))) {
      return res.status(401).json({ message: 'Email ou mot de passe incorrect' });
    }

    const token = jwt.sign(
      { id: user.id, email: user.email, role: user.role },
      JWT_SECRET,
      { expiresIn: '24h' }
    );

    res.json({
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        role: user.role,
        avatar: user.avatar
      },
      token
    });
  } catch (error) {
    console.error('Erreur login:', error);
    res.status(500).json({ message: 'Erreur serveur' });
  }
});

app.get('/api/auth/me', authenticateToken, async (req, res) => {
  try {
    const user = await prisma.user.findUnique({
      where: { id: req.user.id },
      select: {
        id: true,
        email: true,
        name: true,
        role: true,
        avatar: true
      }
    });

    if (!user) {
      return res.status(404).json({ message: 'Utilisateur non trouvé' });
    }

    res.json(user);
  } catch (error) {
    console.error('Erreur get user:', error);
    res.status(500).json({ message: 'Erreur serveur' });
  }
});

// routes clients
app.get('/api/customers', authenticateToken, async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const search = req.query.search || '';
    const status = req.query.status || '';

    const skip = (page - 1) * limit;

    let where = {};
    
    if (search) {
      where.OR = [
        { name: { contains: search } },
        { email: { contains: search } },
        { company: { contains: search } }
      ];
    }

    if (status) {
      where.status = status;
    }

    const [customers, total] = await Promise.all([
      prisma.customer.findMany({
        where,
        skip,
        take: limit,
        orderBy: { createdAt: 'desc' }
      }),
      prisma.customer.count({ where })
    ]);

    res.json({
      data: customers,
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit)
    });
  } catch (error) {
    console.error('Erreur get customers:', error);
    res.status(500).json({ message: 'Erreur serveur' });
  }
});

app.get('/api/customers/:id', authenticateToken, async (req, res) => {
  try {
    const customer = await prisma.customer.findUnique({
      where: { id: req.params.id }
    });

    if (!customer) {
      return res.status(404).json({ message: 'Client non trouvé' });
    }

    res.json(customer);
  } catch (error) {
    console.error('Erreur get customer:', error);
    res.status(500).json({ message: 'Erreur serveur' });
  }
});

app.post('/api/customers', authenticateToken, requireAdmin, async (req, res) => {
  try {
    const { name, email, phone, company, status, notes } = req.body;

    const customer = await prisma.customer.create({
      data: {
        name,
        email,
        phone,
        company,
        status,
        notes
      }
    });

    res.status(201).json(customer);
  } catch (error) {
    console.error('error create customer:', error);
    res.status(500).json({ message: 'server error' });
  }
});

// import en masse clients
app.post('/api/customers/bulk', authenticateToken, async (req, res) => {
  try {
    const { customers } = req.body;

    const createdCustomers = await prisma.customer.createMany({
      data: customers,
      skipDuplicates: true
    });

    res.status(201).json({ 
      message: `${createdCustomers.count} customers imported`,
      count: createdCustomers.count 
    });
  } catch (error) {
    console.error('error bulk import customers:', error);
    res.status(500).json({ message: 'server error' });
  }
});

app.put('/api/customers/:id', authenticateToken, requireAdmin, async (req, res) => {
  try {
    const { name, email, phone, company, status, notes } = req.body;

    const customer = await prisma.customer.update({
      where: { id: req.params.id },
      data: {
        name,
        email,
        phone,
        company,
        status,
        notes
      }
    });

    res.json(customer);
  } catch (error) {
    console.error('Erreur update customer:', error);
    res.status(500).json({ message: 'Erreur serveur' });
  }
});

app.delete('/api/customers/:id', authenticateToken, requireAdmin, async (req, res) => {
  try {
    await prisma.customer.delete({
      where: { id: req.params.id }
    });

    res.status(204).send();
  } catch (error) {
    console.error('Erreur delete customer:', error);
    res.status(500).json({ message: 'Erreur serveur' });
  }
});

// routes interactions
app.get('/api/interactions', authenticateToken, async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const customerId = req.query.customerId;
    const type = req.query.type;
    const status = req.query.status;

    const skip = (page - 1) * limit;

    let where = {};
    
    if (customerId) {
      where.customerId = customerId;
    }

    if (type) {
      where.type = type;
    }

    if (status) {
      where.status = status;
    }

    const [interactions, total] = await Promise.all([
      prisma.interaction.findMany({
        where,
        skip,
        take: limit,
        orderBy: { date: 'desc' },
        include: {
          customer: {
            select: {
              id: true,
              name: true,
              email: true
            }
          },
          user: {
            select: {
              id: true,
              name: true,
              avatar: true
            }
          }
        }
      }),
      prisma.interaction.count({ where })
    ]);

    res.json({
      data: interactions,
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit)
    });
  } catch (error) {
    console.error('Erreur get interactions:', error);
    res.status(500).json({ message: 'Erreur serveur' });
  }
});

app.get('/api/interactions/:id', authenticateToken, async (req, res) => {
  try {
    const interaction = await prisma.interaction.findUnique({
      where: { id: req.params.id },
      include: {
        customer: {
          select: {
            id: true,
            name: true,
            email: true
          }
        },
        user: {
          select: {
            id: true,
            name: true,
            avatar: true
          }
        }
      }
    });

    if (!interaction) {
      return res.status(404).json({ message: 'Interaction non trouvée' });
    }

    res.json(interaction);
  } catch (error) {
    console.error('Erreur get interaction:', error);
    res.status(500).json({ message: 'Erreur serveur' });
  }
});

app.post('/api/interactions', authenticateToken, async (req, res) => {
  try {
    const { customerId, type, title, description, date, status, priority } = req.body;

    const interaction = await prisma.interaction.create({
      data: {
        customerId,
        userId: req.user.id,
        type,
        title,
        description,
        date: date ? new Date(date) : new Date(),
        status,
        priority
      },
      include: {
        customer: {
          select: {
            id: true,
            name: true,
            email: true
          }
        },
        user: {
          select: {
            id: true,
            name: true,
            avatar: true
          }
        }
      }
    });

    res.status(201).json(interaction);
  } catch (error) {
    console.error('error create interaction:', error);
    res.status(500).json({ message: 'server error' });
  }
});

// import en masse interactions
app.post('/api/interactions/bulk', authenticateToken, async (req, res) => {
  try {
    const { interactions } = req.body;

    const interactionsWithUserId = interactions.map(interaction => ({
      ...interaction,
      userId: req.user.id
    }));

    const createdInteractions = await prisma.interaction.createMany({
      data: interactionsWithUserId,
      skipDuplicates: true
    });

    res.status(201).json({ 
      message: `${createdInteractions.count} interactions imported`,
      count: createdInteractions.count 
    });
  } catch (error) {
    console.error('error bulk import interactions:', error);
    res.status(500).json({ message: 'server error' });
  }
});

app.put('/api/interactions/:id', authenticateToken, async (req, res) => {
  try {
    const { type, title, description, date, status, priority } = req.body;

    const interaction = await prisma.interaction.update({
      where: { id: req.params.id },
      data: {
        type,
        title,
        description,
        date: date ? new Date(date) : new Date(),
        status,
        priority
      },
      include: {
        customer: {
          select: {
            id: true,
            name: true,
            email: true
          }
        },
        user: {
          select: {
            id: true,
            name: true,
            avatar: true
          }
        }
      }
    });

    res.json(interaction);
  } catch (error) {
    console.error('Erreur update interaction:', error);
    res.status(500).json({ message: 'Erreur serveur' });
  }
});

app.delete('/api/interactions/:id', authenticateToken, async (req, res) => {
  try {
    await prisma.interaction.delete({
      where: { id: req.params.id }
    });

    res.status(204).send();
  } catch (error) {
    console.error('Erreur delete interaction:', error);
    res.status(500).json({ message: 'Erreur serveur' });
  }
});

// route stats
app.get('/api/stats', authenticateToken, async (req, res) => {
  try {
    const [totalCustomers, activeCustomers, prospects, inactiveCustomers, totalInteractions, pendingInteractions] = await Promise.all([
      prisma.customer.count(),
      prisma.customer.count({ where: { status: 'active' } }),
      prisma.customer.count({ where: { status: 'prospect' } }),
      prisma.customer.count({ where: { status: 'inactive' } }),
      prisma.interaction.count(),
      prisma.interaction.count({ where: { status: 'pending' } })
    ]);

    const conversionRate = totalCustomers > 0 ? Math.round((activeCustomers / totalCustomers) * 100) : 0;

    res.json({
      totalCustomers,
      activeCustomers,
      prospects,
      inactiveCustomers,
      conversionRate,
      totalInteractions,
      pendingInteractions
    });
  } catch (error) {
    console.error('Erreur get stats:', error);
    res.status(500).json({ message: 'Erreur serveur' });
  }
});

// démarrage serveur
app.listen(PORT, () => {
  console.log(`server started on port ${PORT}`);
});

// arrêt propre
process.on('SIGINT', async () => {
  await prisma.$disconnect();
  process.exit(0);
}); 