import 'dotenv/config'
import { PrismaClient } from '@prisma/client'
import bcrypt from 'bcryptjs'

const prisma = new PrismaClient()

async function main() {
  console.log('🌱 Iniciando seed do Portfolio CMS...\n')

  // ============================================================
  // ADMIN
  // ============================================================
  const adminEmail = process.env.ADMIN_EMAIL ?? 'alex@portfolio.com'
  const adminPass  = process.env.ADMIN_PASSWORD ?? 'Admin@123456'

  const existingAdmin = await prisma.admin.findUnique({ where: { email: adminEmail } })
  if (!existingAdmin) {
    const hash = await bcrypt.hash(adminPass, 12)
    await prisma.admin.create({
      data: { email: adminEmail, password: hash, name: 'Alexander' },
    })
    console.log(`✅ Admin criado: ${adminEmail}`)
  } else {
    console.log(`⏭  Admin já existe: ${adminEmail}`)
  }

  // ============================================================
  // HERO
  // ============================================================
  const existingHero = await prisma.hero.findFirst()
  if (!existingHero) {
    await prisma.hero.create({
      data: {
        name:        'Alexander Bueno Santiago',
        role:        'Desenvolvedor Full Stack',
        description: 'Construo soluções digitais completas — sistemas web, SaaS, aplicações desktop e automações. Do back-end ao deploy, entrego arquitetura sólida e resultado real para o seu negócio.',
        githubUrl:   'https://github.com/DevAlex-full',
        linkedinUrl: 'https://www.linkedin.com/in/alexander-bueno-43823a358/',
        emailAddress:'alex.bueno22@hotmail.com',
        whatsapp:    '5511983943905',
        typingSvgUrl:'https://readme-typing-svg.demolab.com?font=Fira+Code&size=18&duration=4000&pause=500&color=9615F7&center=false&width=435&lines=Seja+Bem-Vindo!;Desenvolvedor+FullStack+S%C3%AAnior;Web+%E2%80%A2+Desktop+%E2%80%A2+APIs+%E2%80%A2+Automa%C3%A7%C3%B5es',
        cvUrl:       null, // Atualize via painel admin após fazer upload do CV
        available:   true,
      },
    })
    console.log('✅ Hero criado')
  } else {
    console.log('⏭  Hero já existe')
  }

  // ============================================================
  // ABOUT
  // ============================================================
  const existingAbout = await prisma.about.findFirst()
  if (!existingAbout) {
    await prisma.about.create({
      data: {
        paragraph1: 'Sou Desenvolvedor Full Stack e entrego soluções digitais completas — de sistemas web e SaaS a aplicações desktop e automações. Não sou especialista em apenas uma camada: domino o ciclo inteiro, do banco de dados ao deploy em produção.',
        paragraph2: 'No front, trabalho com React, Next.js e TypeScript. No back, construo APIs robustas com Node.js e Express, com PostgreSQL e Prisma ORM. Para desktop e automações, uso Python com foco em entrega rápida e resultado concreto.',
        paragraph3: 'Já construí um SaaS multi-tenant do zero, desenvolvi sistemas para clientes reais e crio automações que eliminam trabalho manual. Acredito que o melhor software é aquele que resolve um problema de verdade — e faz isso de forma simples, rápida e escalável.',
        highlights: [
          {
            icon:        'Layers',
            title:       'Full Stack Completo',
            description: 'Do banco de dados à interface — sistemas web, mobile e aplicações desktop em um único profissional.',
          },
          {
            icon:        'Code2',
            title:       'Código que Escala',
            description: 'Aplico SOLID, Clean Code e arquitetura em camadas para entregar software que cresce com o seu negócio.',
          },
          {
            icon:        'Rocket',
            title:       'Entrega Real',
            description: 'MVP funcional em dias, não meses. Foco em resultado desde o primeiro commit até o deploy em produção.',
          },
          {
            icon:        'TrendingUp',
            title:       'Visão de Negócio',
            description: 'Entendo que software resolve dores reais. Desenvolvimento orientado a impacto e retorno financeiro.',
          },
        ],
      },
    })
    console.log('✅ About criado')
  } else {
    console.log('⏭  About já existe')
  }

  // ============================================================
  // CONTACT
  // ============================================================
  const existingContact = await prisma.contact.findFirst()
  if (!existingContact) {
    await prisma.contact.create({
      data: {
        whatsapp:       '5511983943905',
        email:          'alex.bueno22@hotmail.com',
        location:       'São Paulo, SP',
        github:         'DevAlex-full',
        githubUrl:      'https://github.com/DevAlex-full',
        linkedin:       'alexander-bueno-43823a358',
        linkedinUrl:    'https://www.linkedin.com/in/alexander-bueno-43823a358/',
        instagram:      '@devalex_fullstack',
        instagramUrl:   'https://www.instagram.com/devalex_fullstack/',
        defaultMessage: 'Olá, Alexander! Vim pelo seu portfólio e gostaria de conversar sobre um projeto.',
      },
    })
    console.log('✅ Contact criado')
  } else {
    console.log('⏭  Contact já existe')
  }

  // ============================================================
  // SITE SETTINGS
  // ============================================================
  const existingSettings = await prisma.siteSettings.findFirst()
  if (!existingSettings) {
    await prisma.siteSettings.create({
      data: {
        siteTitle:    'Alexander Bueno Santiago — Desenvolvedor Full Stack',
        description:  'Desenvolvedor Full Stack especializado em React, Next.js, Node.js e TypeScript. Criação de sistemas web, SaaS, APIs e automações.',
        keywords:     ['desenvolvedor full stack', 'react', 'next.js', 'node.js', 'typescript', 'são paulo', 'freelancer', 'sistema web', 'saas'],
        ogTitle:      'Alexander Bueno Santiago — Desenvolvedor Full Stack',
        ogDescription:'Sistemas web, SaaS, APIs e automações com arquitetura sólida.',
      },
    })
    console.log('✅ SiteSettings criado')
  } else {
    console.log('⏭  SiteSettings já existe')
  }

  // ============================================================
  // PROJECTS
  // ============================================================
  const projectsCount = await prisma.project.count()
  if (projectsCount === 0) {
    const projectsData = [
      {
        title:            'BarberFlow',
        slug:             'barberflow',
        shortDescription: 'SaaS completo para gestão de barbearias. Plataforma multi-tenant com agendamento, gestão financeira, controle de estoque, comissões e app mobile.',
        fullDescription:  'SaaS completo para gestão de barbearias. Plataforma multi-tenant com agendamento, gestão financeira, controle de estoque, comissões e app mobile. Arquitetura real de produção com autenticação JWT, multi-tenancy e dashboard analítico.',
        image:            '/imagens/barberflow1.png',
        images:           [
          { src: '/imagens/barberflow1.png', alt: 'BarberFlow - Dashboard' },
          { src: '/imagens/barberflow2.png', alt: 'BarberFlow - Gestão' },
          { src: '/imagens/barberflow3.png', alt: 'BarberFlow - Mobile' },
        ],
        tags:             ['Next.js', 'TypeScript', 'Node.js', 'Express', 'Prisma ORM', 'PostgreSQL', 'Supabase', 'React Native'],
        categories:       ['web', 'commercial'],
        featured:         true,
        highlight:        'SaaS • Multi-tenant',
        linkDemo:         'https://barberflowoficial.vercel.app/',
        linkGithubFront:  'https://github.com/DevAlex-full/barbeflow-frontend',
        linkGithubBack:   'https://github.com/DevAlex-full/BarberFlow-Back-End',
        order:            1,
      },
      {
        title:            'TaskFlow',
        slug:             'taskflow',
        shortDescription: 'Aplicação full-stack de gerenciamento de tarefas com autenticação segura, dashboard analítico e sincronização em tempo real.',
        fullDescription:  'Aplicação full-stack de gerenciamento de tarefas com autenticação segura, dashboard analítico e sincronização em tempo real. Back-end próprio com Node.js, Express e PostgreSQL via Supabase.',
        image:            '/imagens/tarefa-dashboard.jpeg',
        images:           [
          { src: '/imagens/tarefa-dashboard.jpeg', alt: 'TaskFlow - Dashboard' },
          { src: '/imagens/tarefa-minhas-tarefas.jpeg', alt: 'TaskFlow - Tarefas' },
          { src: '/imagens/tarefa-analytics.jpeg', alt: 'TaskFlow - Analytics' },
        ],
        tags:             ['React', 'TypeScript', 'Vite', 'TailwindCSS', 'Node.js', 'Express', 'PostgreSQL', 'Supabase'],
        categories:       ['web', 'commercial'],
        featured:         true,
        highlight:        'Full Stack',
        order:            2,
      },
      {
        title:            'InstalockValorant',
        slug:             'instalock-valorant',
        shortDescription: 'Aplicação desktop para Windows que seleciona e trava automaticamente agentes no Valorant via API local oficial do Riot Client.',
        fullDescription:  'Aplicação desktop para Windows que seleciona e trava automaticamente agentes no Valorant via API local oficial do Riot Client. Configuração por mapa, hotkey global, UI dark theme e executável standalone — sem precisar de Python instalado.',
        image:            '/imagens/painel.png',
        images:           [
          { src: '/imagens/painel.png', alt: 'instalockvalorant - painel' },
          { src: '/imagens/print-landing-page.png', alt: 'instalockvalorant - landing-page' },
        ],
        tags:             ['Python', 'CustomTkinter', 'PyInstaller', 'Valorant API', 'pynput', 'Windows .exe'],
        categories:       ['web', 'interactive'],
        featured:         true,
        highlight:        'Desktop • .exe',
        linkDemo:         'https://instalockvalorant.vercel.app',
        linkGithub:       'https://github.com/DevAlex-full/InstalockValorant',
        order:            3,
      },
      {
        title:            'Advocacia Pro',
        slug:             'advocacia-pro',
        shortDescription: 'Landing page profissional para escritório de advocacia com design focado em conversão, SEO otimizado e formulário de captação de leads.',
        fullDescription:  'Landing page profissional para escritório de advocacia, desenvolvida em WordPress com tema customizado do zero. Design focado em conversão, SEO otimizado e formulário de captação de leads.',
        image:            '/imagens/advogacia1.png',
        images:           [
          { src: '/imagens/advogacia1.png', alt: 'Advocacia Pro - Hero' },
          { src: '/imagens/advogacia2.png', alt: 'Advocacia Pro - Serviços' },
          { src: '/imagens/advogacia3.png', alt: 'Advocacia Pro - Contato' },
        ],
        tags:             ['WordPress', 'PHP', 'MySQL', 'HTML5', 'CSS3', 'JavaScript'],
        categories:       ['landing', 'commercial'],
        featured:         true,
        highlight:        'WordPress Custom',
        linkDemo:         'https://advocaciapro.rf.gd/',
        linkGithub:       'https://github.com/DevAlex-full/advocacia-landing-wordpress',
        order:            4,
      },
      {
        title:            'BarberLess',
        slug:             'barberless',
        shortDescription: 'Site institucional para barbearia com catálogo de serviços, perfil de profissionais e agendamento direto pelo WhatsApp.',
        fullDescription:  'Site institucional para barbearia com catálogo de serviços, perfil de profissionais e agendamento direto pelo WhatsApp. Responsivo e otimizado para conversão mobile.',
        image:            '/imagens/barbearia.png',
        images:           [],
        tags:             ['HTML5', 'CSS3', 'JavaScript', 'WhatsApp API'],
        categories:       ['landing', 'commercial'],
        featured:         false,
        linkDemo:         'https://devalex-full.github.io/projeto-barbearia/',
        linkGithub:       'https://github.com/DevAlex-full/projeto-barbearia',
        order:            5,
      },
      {
        title:            'ONG Proteção Animal',
        slug:             'ong-protecao-animal',
        shortDescription: 'Site institucional responsivo para ONG de proteção animal com foco em adoção e conscientização.',
        fullDescription:  'Site institucional responsivo para ONG de proteção animal com foco em adoção e conscientização. Páginas de galeria, formulário de adoção e integração com redes sociais.',
        image:            '/imagens/ong.png',
        images:           [],
        tags:             ['HTML5', 'CSS3', 'JavaScript', 'Responsivo'],
        categories:       ['landing', 'commercial'],
        featured:         false,
        linkDemo:         'https://devalex-full.github.io/Projeto-Front-End-ONG/',
        linkGithub:       'https://github.com/DevAlex-full/Projeto-Front-End-ONG',
        order:            6,
      },
      {
        title:            'LuxeStore',
        slug:             'luxestore',
        shortDescription: 'E-commerce completo com React e TypeScript. Catálogo de produtos via API, carrinho de compras e filtros por categoria.',
        fullDescription:  'E-commerce completo com React e TypeScript. Catálogo de produtos via API, carrinho de compras, filtros por categoria e UI responsiva construída com TailwindCSS.',
        image:            '/imagens/loja de luxo.png',
        images:           [],
        tags:             ['React', 'TypeScript', 'Vite', 'TailwindCSS', 'REST API'],
        categories:       ['web', 'commercial'],
        featured:         false,
        linkDemo:         'https://luxestore-premium.netlify.app/',
        linkGithub:       'https://github.com/DevAlex-full/Exerc-cio---Buscar-dados-de-uma-API',
        order:            7,
      },
      {
        title:            'LojaTech E-commerce',
        slug:             'lojatech',
        shortDescription: 'E-commerce de produtos tecnológicos com interface limpa, carrinho de compras e fluxo de checkout.',
        fullDescription:  'E-commerce de produtos tecnológicos com interface limpa, carrinho de compras e fluxo de checkout. Layout responsivo com foco em experiência de compra.',
        image:            '/imagens/loja-virtual.png',
        images:           [],
        tags:             ['HTML5', 'CSS3', 'JavaScript', 'E-commerce'],
        categories:       ['web', 'commercial'],
        featured:         false,
        linkDemo:         'https://devalex-full.github.io/PROJETO-FRONT-END-WEB-VENDAS-CONCLUIDO/',
        linkGithub:       'https://github.com/DevAlex-full/PROJETO-FRONT-END-WEB-VENDAS-CONCLUIDO',
        order:            8,
      },
      {
        title:            'CineMatch',
        slug:             'cinematch',
        shortDescription: 'Aplicação com IA para recomendação de filmes baseada no humor do usuário. Integração com N8N para orquestração dos fluxos de IA.',
        fullDescription:  'Aplicação com IA para recomendação de filmes baseada no humor do usuário. Integração com N8N para orquestração dos fluxos de IA e chamadas a LLMs.',
        image:            '/imagens/cineMatch.png',
        images:           [],
        tags:             ['HTML5', 'CSS3', 'JavaScript', 'N8N', 'IA', 'LLM'],
        categories:       ['web', 'interactive'],
        featured:         false,
        linkDemo:         'https://my-cinematch.netlify.app/',
        linkGithub:       'https://github.com/DevAlex-full/CineMatch',
        order:            9,
      },
      {
        title:            'Mundo Invertido',
        slug:             'mundo-invertido',
        shortDescription: 'Experiência web imersiva inspirada em Stranger Things, com alternância temática entre dois mundos e animações CSS avançadas.',
        fullDescription:  'Experiência web imersiva inspirada em Stranger Things, com alternância temática entre dois mundos, trilha sonora contextual e animações CSS avançadas.',
        image:            '/imagens/mundo-invertido1.png',
        images:           [
          { src: '/imagens/mundo-invertido1.png', alt: 'Mundo Normal' },
          { src: '/imagens/mundo-invertido2.png', alt: 'Mundo Invertido' },
          { src: '/imagens/mundo-invertido3.png', alt: 'Transição' },
        ],
        tags:             ['HTML5', 'CSS3', 'JavaScript', 'Web Audio API', 'Animações'],
        categories:       ['web', 'interactive'],
        featured:         false,
        linkDemo:         'https://devalex-full.github.io/semana-frontend-mundo-invertido/',
        linkGithub:       'https://github.com/DevAlex-full/semana-frontend-mundo-invertido',
        order:            10,
      },
      {
        title:            'Pitadas & Descobertas',
        slug:             'pitadas-descobertas',
        shortDescription: 'Catálogo de receitas com busca e filtros por categoria, consumindo a API TheMealDB.',
        fullDescription:  'Catálogo de receitas com busca e filtros por categoria, consumindo a API TheMealDB. Ingredientes, instruções e modo preparo em interface responsiva.',
        image:            '/imagens/receitas.png',
        images:           [],
        tags:             ['HTML5', 'CSS3', 'JavaScript', 'REST API'],
        categories:       ['web', 'interactive'],
        featured:         false,
        linkDemo:         'https://devalex-full.github.io/Suas-Receitas-Favoritas/',
        linkGithub:       'https://github.com/DevAlex-full/Suas-Receitas-Favoritas',
        order:            11,
      },
    ]

    for (const p of projectsData) {
      await prisma.project.create({ data: p })
    }
    console.log(`✅ ${projectsData.length} projetos criados`)
  } else {
    console.log(`⏭  Projetos já existem (${projectsCount})`)
  }

  // ============================================================
  // CERTIFICATIONS
  // ============================================================
  const certsCount = await prisma.certification.count()
  if (certsCount === 0) {
    const certsData = [
      { title: 'DevQuest 2.0 — Back-End',                      institution: 'DevQuest',                      year: 2025, hours: 90,    tags: ['SQL', 'HTTP', 'Node.js', 'Express', 'PostgreSQL', 'Docker', 'Prisma'],               stars: 5, inProgress: false, order: 1 },
      { title: 'DevQuest 2.0 — Front-End',                     institution: 'DevQuest',                      year: 2025, hours: 90,    tags: ['HTML5', 'CSS3', 'JavaScript', 'TailwindCSS', 'React', 'TypeScript', 'Node.js'],       stars: 5, inProgress: false, order: 2 },
      { title: 'DevQuest 2.0 — IA para Devs',                  institution: 'DevQuest',                      year: 2025, hours: 16,    tags: ['Inteligência Artificial', 'IA', 'Machine Learning'],                                  stars: 4, inProgress: false, order: 3 },
      { title: 'Análise de Dados e Inteligência de Negócios',   institution: 'Gran Faculdade',                year: 2025, hours: 30,    tags: ['Análise de Dados', 'Business Intelligence', 'Negócios'],                              stars: 4, inProgress: false, order: 4 },
      { title: 'Imersão Dev do Futuro',                         institution: 'Dev do Futuro',                 year: 2025, hours: 16,    tags: ['HTML5', 'CSS3', 'JavaScript', 'N8N', 'IA'],                                           stars: 4, inProgress: false, order: 5 },
      { title: 'Formação Front-End Web Developer',              institution: 'Digital Innovation One (DIO)',  year: 2025, hours: 75,    tags: ['HTML5', 'CSS3', 'JavaScript', 'Git', 'GitHub'],                                       stars: 4, inProgress: false, order: 6 },
      { title: 'Java Cloud Native',                             institution: 'Digital Innovation One (DIO)',  year: 2025, hours: 90,    tags: ['Java', 'SQL', 'MongoDB', 'Azure', 'Azure OpenAI', 'IA'],                               stars: 4, inProgress: false, order: 7 },
      { title: 'Tecnológico em Sistemas para Internet',         institution: 'Universidade Unifatecie',       year: 2025, hours: 17532, tags: ['Full Stack', 'Cloud Developer', 'Software Architect', 'Back-End', 'Front-End'],        stars: 5, inProgress: true,  order: 8 },
    ]

    for (const c of certsData) {
      await prisma.certification.create({ data: c })
    }
    console.log(`✅ ${certsData.length} certificações criadas`)
  } else {
    console.log(`⏭  Certificações já existem (${certsCount})`)
  }

  // ============================================================
  // SKILLS
  // ============================================================
  const skillsCount = await prisma.skill.count()
  if (skillsCount === 0) {
    const skillsData = [
      { name: 'HTML5',       icon: 'html5',      level: 'expert',       category: 'frontend', order: 1  },
      { name: 'CSS3',        icon: 'css3',        level: 'expert',       category: 'frontend', order: 2  },
      { name: 'JavaScript',  icon: 'javascript',  level: 'expert',       category: 'frontend', order: 3  },
      { name: 'TypeScript',  icon: 'typescript',  level: 'advanced',     category: 'frontend', order: 4  },
      { name: 'React',       icon: 'react',       level: 'advanced',     category: 'frontend', order: 5  },
      { name: 'Next.js',     icon: 'nextjs',      level: 'advanced',     category: 'frontend', order: 6  },
      { name: 'Tailwind CSS',icon: 'tailwind',    level: 'advanced',     category: 'frontend', order: 7  },
      { name: 'React Native',icon: 'react',       level: 'intermediate', category: 'frontend', order: 8  },
      { name: 'Node.js',     icon: 'nodejs',      level: 'advanced',     category: 'backend',  order: 9  },
      { name: 'Express',     icon: 'express',     level: 'advanced',     category: 'backend',  order: 10 },
      { name: 'Python',      icon: 'python',      level: 'advanced',     category: 'backend',  order: 11 },
      { name: 'REST APIs',   icon: 'api',         level: 'advanced',     category: 'backend',  order: 12 },
      { name: 'PHP',         icon: 'php',         level: 'intermediate', category: 'backend',  order: 13 },
      { name: 'PostgreSQL',  icon: 'postgresql',  level: 'advanced',     category: 'database', order: 14 },
      { name: 'MySQL',       icon: 'mysql',       level: 'advanced',     category: 'database', order: 15 },
      { name: 'Prisma ORM',  icon: 'prisma',      level: 'advanced',     category: 'database', order: 16 },
      { name: 'Supabase',    icon: 'supabase',    level: 'advanced',     category: 'database', order: 17 },
      { name: 'Vercel',      icon: 'vercel',      level: 'advanced',     category: 'devops',   order: 18 },
      { name: 'Render',      icon: 'render',      level: 'advanced',     category: 'devops',   order: 19 },
      { name: 'Docker',      icon: 'docker',      level: 'intermediate', category: 'devops',   order: 20 },
      { name: 'Git',         icon: 'git',         level: 'expert',       category: 'tools',    order: 21 },
      { name: 'GitHub',      icon: 'github',      level: 'expert',       category: 'tools',    order: 22 },
      { name: 'WordPress',   icon: 'wordpress',   level: 'advanced',     category: 'tools',    order: 23 },
      { name: 'N8N',         icon: 'n8n',         level: 'intermediate', category: 'tools',    order: 24 },
      { name: 'Figma',       icon: 'figma',       level: 'intermediate', category: 'design',   order: 25 },
    ]

    for (const s of skillsData) {
      await prisma.skill.create({ data: s })
    }
    console.log(`✅ ${skillsData.length} habilidades criadas`)
  } else {
    console.log(`⏭  Habilidades já existem (${skillsCount})`)
  }

  // ============================================================
  // SERVICE PLANS
  // ============================================================
  const plansCount = await prisma.servicePlan.count()
  if (plansCount === 0) {
    const plansData = [
      {
        name:        'Site & Landing Page',
        price:       'A partir de R$ 800',
        period:      'entrega única',
        description: 'Presença digital profissional e otimizada para converter visitantes em clientes.',
        features:    [
          'Site institucional ou landing page',
          'Design responsivo (mobile + desktop)',
          'Formulário de contato via WhatsApp',
          'SEO básico configurado',
          'Deploy em produção incluso',
          'Suporte por 30 dias',
        ],
        highlighted: false,
        badge:       null,
        ctaText:     'Solicitar Orçamento',
        ctaMessage:  'Olá, Alexander! Tenho interesse no pacote Site & Landing Page. Pode me passar mais detalhes?',
        order:       1,
      },
      {
        name:        'Sistema Web',
        price:       'A partir de R$ 2.500',
        period:      'entrega única',
        description: 'Aplicação web completa com back-end, banco de dados, autenticação e painel administrativo.',
        features:    [
          'Front-end React / Next.js',
          'Back-end Node.js + API REST',
          'Banco de dados PostgreSQL',
          'Autenticação e controle de acesso',
          'Painel administrativo',
          'Deploy em produção incluso',
          'Documentação técnica',
          'Suporte por 60 dias',
        ],
        highlighted: true,
        badge:       'Mais Solicitado',
        ctaText:     'Solicitar Orçamento',
        ctaMessage:  'Olá, Alexander! Tenho interesse no pacote Sistema Web. Pode me passar mais detalhes?',
        order:       2,
      },
      {
        name:        'SaaS / Plataforma',
        price:       'A partir de R$ 6.000',
        period:      'sob consulta',
        description: 'Plataforma multi-tenant, marketplace ou sistema complexo com escalabilidade desde a arquitetura.',
        features:    [
          'Arquitetura multi-tenant',
          'App mobile (React Native)',
          'Módulos customizados',
          'Integrações e webhooks',
          'Gestão financeira / relatórios',
          'Infraestrutura escalável',
          'CI/CD configurado',
          'Suporte contínuo (plano mensal)',
        ],
        highlighted: false,
        badge:       'Premium',
        ctaText:     'Agendar Conversa',
        ctaMessage:  'Olá, Alexander! Tenho interesse no pacote SaaS / Plataforma. Pode me passar mais detalhes?',
        order:       3,
      },
    ]

    for (const p of plansData) {
      await prisma.servicePlan.create({ data: p })
    }
    console.log(`✅ ${plansData.length} planos de serviço criados`)
  } else {
    console.log(`⏭  Planos já existem (${plansCount})`)
  }

  // ============================================================
  // SERVICE EXTRAS
  // ============================================================
  const extrasCount = await prisma.serviceExtra.count()
  if (extrasCount === 0) {
    const extrasData = [
      { label: 'Aplicação Desktop (.exe)', description: 'Programas Windows standalone em Python ou Electron', icon: 'Monitor',    order: 1 },
      { label: 'Automações & N8N',         description: 'Fluxos automáticos, integrações entre sistemas e chatbots', icon: 'Bot', order: 2 },
      { label: 'App Mobile',               description: 'Aplicativo iOS + Android com React Native / Expo', icon: 'Smartphone',   order: 3 },
      { label: 'API & Microserviços',      description: 'Back-end isolado, integrações e endpoints para terceiros', icon: 'Server',order: 4 },
    ]

    for (const e of extrasData) {
      await prisma.serviceExtra.create({ data: e })
    }
    console.log(`✅ ${extrasData.length} serviços extras criados`)
  } else {
    console.log(`⏭  Extras já existem (${extrasCount})`)
  }

  // ── Clients (vitrine pública) — idempotente por nome ─────────
  // Upsert: cria se não existe, atualiza se já existe.
  // Isso garante que BarberFlow sempre esteja no banco, mesmo que
  // outros clientes já tenham sido inseridos manualmente antes.
  const barberImages = [
    { src: '/imagens/barberflow1.png', alt: 'BarberFlow - Dashboard' },
    { src: '/imagens/barberflow2.png', alt: 'BarberFlow - Gestão'    },
    { src: '/imagens/barberflow3.png', alt: 'BarberFlow - Mobile'    },
  ] as unknown as import('@prisma/client').Prisma.InputJsonValue

  const barberflow = await prisma.client.findFirst({ where: { name: 'BarberFlow' } })
  if (barberflow) {
    await prisma.client.update({
      where: { id: barberflow.id },
      data: {
        subtitle:     'SaaS Multi-tenant para Barbearias',
        segment:      'Barbearias e Salões',
        description:  'Plataforma completa para gestão de barbearias, com agendamento online, gestão financeira, controle de estoque, comissões por barbeiro e app mobile.',
        image:        '/imagens/barberflow1.png',
        images:       barberImages,
        technologies: ['Next.js', 'TypeScript', 'Node.js', 'PostgreSQL', 'Prisma ORM', 'Supabase', 'React Native'],
        metrics:      [] as unknown as import('@prisma/client').Prisma.InputJsonValue,
        linkDemo:     'https://barberflowoficial.vercel.app/',
        featured:     true,
        status:       'em_producao',
        order:        1,
        active:       true,
      },
    })
    console.log('⏭  BarberFlow (client) já existe — atualizado')
  } else {
    await prisma.client.create({
      data: {
        name:         'BarberFlow',
        subtitle:     'SaaS Multi-tenant para Barbearias',
        segment:      'Barbearias e Salões',
        description:  'Plataforma completa para gestão de barbearias, com agendamento online, gestão financeira, controle de estoque, comissões por barbeiro e app mobile.',
        image:        '/imagens/barberflow1.png',
        images:       barberImages,
        technologies: ['Next.js', 'TypeScript', 'Node.js', 'PostgreSQL', 'Prisma ORM', 'Supabase', 'React Native'],
        metrics:      [] as unknown as import('@prisma/client').Prisma.InputJsonValue,
        linkDemo:     'https://barberflowoficial.vercel.app/',
        linkGithub:   null,
        featured:     true,
        status:       'em_producao',
        order:        1,
        active:       true,
      },
    })
    console.log('✅ BarberFlow (client) criado')
  }

  // ── Resumo ───────────────────────────────────────────────────
  console.log('\n🎉 Seed concluído com sucesso!')
  console.log('─'.repeat(40))
  console.log(`Acesse o painel em: /admin/login`)
  console.log(`Email:    ${adminEmail}`)
  console.log(`Senha:    ${process.env.ADMIN_PASSWORD ? '(definida via .env)' : adminPass}`)
  console.log('─'.repeat(40))
}

main()
  .catch(err => {
    console.error('❌ Erro durante o seed:', err)
    process.exit(1)
  })
  .finally(() => prisma.$disconnect())