// Dados compartilhados (projects, equipe) usados por index e profile
window.projects = {
  1: {
    title: 'Liga de Futebol',
    desc: 'Sistema completo de gerenciamento de Liga de Futebol, com funcionalidades CRUD e totalmente integrada com o back-end Spring Boot.',
    techs: ['Java','Spring Boot','MySQL','TypeScript','CSS','HTML','Angular'],
    repo: 'https://github.com/mhas1311/Liga-de-Futebol_dstrabalho2',
    category: 'Sistema',
    year: 2024,
    memberIds: [1,4]
  },
  2: {
    title: 'Task Master',
    desc: 'Ferramenta simples e eficaz para o gerenciamento de tarefas mensais, pode cadastrar tarefas específicas para cada mês e marcá-las como concluídas conforme as finaliza.',
    techs: ['HTML','CSS','JavaScript'],
    repo: 'https://github.com/Gustaalexandre/TaskMater',
    category: 'Ferramenta',
    year: 2024,
    memberIds: [2,3]
  },
  3: {
    title: 'Studio Essencial',
    desc: 'Projeto de desenvolvimento de um sistema de salão de beleza completo, com funcionalidades para agendamento de serviços, gerenciamento de clientes e controle de estoque.',
    techs: ['Java','Spring Boot','MySQL','TypeScript','CSS','HTML','Angular','Dockerfile'],
    repo: 'https://github.com/Gustaalexandre/StudioEssecial-api',
    category: 'Sistema',
    year: 2024,
    memberIds: [2,3]
  },
  4: {
    title: 'King Pong',
    desc: 'Jogo Pong clássico com design moderno e controles responsivos, onde os usuários podem criar e logar em suas contas para jogar uma partida contra o computador.',
    techs: ['HTML','CSS','JavaScript'],
    repo: 'https://github.com/mhas1311/KingPong_pwprojeto',
    category: 'Jogo',
    year: 2024,
    memberIds: [1,4]
  },
  5: {
    title: 'Site Portfólio',
    desc: 'Site responsivo, moderno e intuitivo com projetos e conteúdos criados pela equipe LOMG.',
    techs: ['HTML','CSS','JavaScript'],
    repo: 'https://git.juninho.com.br/Gustavo_Alexandre/portfolio-lomg-2025',
    category: 'Website',
    year: 2025,
    memberIds: [1,2,3,4]
  }
};

window.equipe = [
  {
    id: 1,
    nome: "Lucas B. Meckler",
    bio: "Desenvolvedor Backend/DevOps com foco em infraestrutura e APIs.",
    habilidades: ["Node.js","Docker","CI/CD","Postgres"],
    academics: ["Engenharia da Computação — Universidade X", "Monografia: Escalabilidade de APIs"],
    img: '/media/perfilLucasB.jpg',
    links: [{label:'GitHub', href:'https://github.com/LMeckler/'}, {label:'Instagram', href:'https://www.instagram.com/lucas.meckler/'}],
    portfolio: 'https://exemplo.dev/lucas'
  },
  {
    id: 2,
    nome: "Gustavo A. Silva",
    bio: "Gerente de Projetos com experiência em coordenação de times ágeis.",
    habilidades: ["Gestão","Scrum","Planejamento"],
    academics: ["Engenharia da Computação — Universidade X"],
    img: '/media/perfilGustavoA.jpg',
    links: [{label:'LinkedIn', href:'https://www.linkedin.com/in/gustavoalexandre2005/'}, {label:'GitHub', href:'https://github.com/Gustaalexandre'}, {label:'Instagram', href:'https://www.instagram.com/gustaalexandre/'}],
    portfolio: 'https://exemplo.dev/gustavo'
  },
  {
    id: 3,
    nome: "Gabriel B. de Souza",
    bio: "Desenvolvedor Frontend orientado a UX e performance.",
    habilidades: ["React","Vue","HTML","CSS","A11y"],
    academics: ["Engenharia da Computação — Universidade X", "Curso Avançado em Frontend"],
    img: '/media/perfilGabrielB.jpg',
    links: [{label:'GitHub', href:'https://github.com/GabrielBatista14'}, {label:'Instagram', href:'https://www.instagram.com/gabrielbatista14_/'}, {label:'Portfolio', href:'https://gabriel.dev/'}],
    portfolio: 'https://gabriel.dev'
  },
  {
    id: 4,
    nome: "Matheus H. Almeida",
    bio: "Analista de Qualidade com foco em testes automatizados.",
    habilidades: ["Testes","QA","Automação"],
    academics: ["Engenharia da Computação — Universidade X"],
    img: '/media/perfilMatheusH.jpg',
    links: [{label:'LinkedIn', href:'https://www.linkedin.com/in/matheus-henrique-almeida-silva/'}, {label:'GitHub', href:'https://github.com/mhas1311'}, {label:'Instagram', href:'https://www.instagram.com/matheus_has13/'}],
    portfolio: ''
  }
];