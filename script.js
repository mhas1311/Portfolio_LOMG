document.addEventListener('DOMContentLoaded', () => {
    // usar dados globais se presentes (data.js)
    const projects = window.projects || {};
    const equipe = window.equipe || [];

    const projetosContainer = document.getElementById("projetosContainer");
    const equipeContainer = document.getElementById("equipeContainer");
    const filtersRoot = document.getElementById('filters');
    const toggleFiltersBtn = document.getElementById('toggleFilters');

    // botão para abrir/fechar painel de filtros
    if (toggleFiltersBtn && filtersRoot) {
      toggleFiltersBtn.addEventListener('click', () => {
        const isShown = filtersRoot.classList.toggle('show');
        filtersRoot.setAttribute('aria-hidden', isShown ? 'false' : 'true');
        toggleFiltersBtn.setAttribute('aria-expanded', isShown ? 'true' : 'false');
      });
    }

    // util: extrai lista única
    const unique = (arr) => Array.from(new Set(arr.flat()));

    // preparar conjuntos para filtros
    const allTechs = unique(Object.values(projects).map(p=>p.techs || []));
    const allCats = unique(Object.values(projects).map(p=>p.category ? [p.category] : []));
    const allYears = unique(Object.values(projects).map(p=>p.year ? [p.year] : [])).sort((a,b)=>b-a);

    // estado dos filtros
    const state = { techs: new Set(), cats: new Set(), years: new Set() };

    // renderiza grupo de checkboxes
    function renderFilterGroup(title, items, key) {
      const wrap = document.createElement('div');
      wrap.className = 'filter-group';
      const t = document.createElement('div');
      t.style.fontWeight = 600;
      t.style.marginRight = '8px';
      t.textContent = title + ':';
      wrap.appendChild(t);

      items.forEach(item => {
        const id = `f-${key}-${String(item).replace(/\s+/g,'-')}`;
        const label = document.createElement('label');

        const input = document.createElement('input');
        input.type = 'checkbox';
        input.id = id;
        input.value = item;
        input.addEventListener('change', (e) => {
          const set = state[key];
          const val = (key === 'years') ? Number(e.target.value) : e.target.value;
          if (e.target.checked) set.add(val); else set.delete(val);
          applyFilters();
        });

        const span = document.createElement('span');
        span.textContent = item;

        label.append(input, span);
        wrap.appendChild(label);
      });

      return wrap;
    }

    // popular filtros no DOM (só se existir container)
    if (filtersRoot) {
      filtersRoot.innerHTML = ''; // garante estado limpo
      filtersRoot.appendChild(renderFilterGroup('Ano', allYears, 'years'));
      filtersRoot.appendChild(renderFilterGroup('Categoria', allCats, 'cats'));
      filtersRoot.appendChild(renderFilterGroup('Tecnologias', allTechs, 'techs'));

      // botão limpar
      const clearBtn = document.createElement('button');
      clearBtn.type = 'button';
      clearBtn.textContent = 'Limpar filtros';
      clearBtn.className = 'btn';
      clearBtn.addEventListener('click', () => {
        state.techs.clear(); state.cats.clear(); state.years.clear();
        filtersRoot.querySelectorAll('input[type="checkbox"]').forEach(i=>i.checked=false);
        applyFilters();
      });
      filtersRoot.appendChild(clearBtn);
    }

    // função de renderização dos projetos (aceita array de objetos ou mapa values)
    function renderProjects(list) {
      if (!projetosContainer) return;
      projetosContainer.innerHTML = '';
      const arr = Array.isArray(list) ? list : Object.values(list);
      if (!arr.length) {
        const p = document.createElement('p');
        p.className = 'small';
        p.id = 'noResults';
        p.textContent = 'Nenhum projeto encontrado com os filtros selecionados.';
        projetosContainer.appendChild(p);
        return;
      }
      arr.forEach(p => {
        // card conforme solicitado: nome, descrição breve, ver detalhes
        const card = document.createElement('article');
        card.className = 'card project-card';

        const h4 = document.createElement('h4');
        h4.textContent = p.title;

        const desc = document.createElement('p');
        desc.textContent = p.desc;

        const a = document.createElement('a');
        a.href = '#';
        a.className = 'btn';
        // achar a key do projeto para data-open
        const key = Object.keys(projects).find(k => projects[k] === p);
        a.setAttribute('data-open', key);
        a.textContent = 'Ver detalhes';

        card.append(h4, desc, a);
        projetosContainer.appendChild(card);
      });
    }

    // aplica filtros e chama render
    function applyFilters() {
      const selTechs = Array.from(state.techs);
      const selCats = Array.from(state.cats);
      const selYears = Array.from(state.years);

      const filtered = Object.values(projects).filter(p => {
        // tecnologies: if none selected -> pass; else must intersect
        if (selTechs.length) {
          const ptechs = Array.isArray(p.techs) ? p.techs : [];
          const intersects = selTechs.some(t => ptechs.includes(t));
          if (!intersects) return false;
        }
        // category
        if (selCats.length && !selCats.includes(p.category)) return false;
        // year
        if (selYears.length && !selYears.includes(p.year)) return false;
        return true;
      });

      renderProjects(filtered);
    }

    // render inicial
    renderProjects(projects);

    // equipe: render como foto + nome; clique abre card de membro no modal
    if (equipeContainer) {
        equipeContainer.innerHTML = '';
        equipe.forEach(m => {
            const card = document.createElement("div");
            card.className = "card member";
            card.style.cursor = 'pointer';
            card.setAttribute('data-member', m.id);

            // layout: imagem à esquerda, nome ao lado
            const imgWrap = document.createElement('div');
            if (m.img) {
                const img = document.createElement('img');
                img.loading = 'lazy';
                img.src = m.img;
                img.alt = m.nome;
                img.style.width = '64px';
                img.style.height = '64px';
                img.style.borderRadius = '50%';
                img.style.objectFit = 'cover';
                imgWrap.appendChild(img);
            }

            const info = document.createElement('div');
            info.style.display = 'flex';
            info.style.flexDirection = 'column';
            info.style.justifyContent = 'center';
            info.style.marginLeft = '10px';

            const nameEl = document.createElement("div");
            nameEl.textContent = m.nome;
            nameEl.style.fontWeight = 600;

            info.appendChild(nameEl);

            // assemble row
            const row = document.createElement('div');
            row.style.display = 'flex';
            row.style.alignItems = 'center';
            row.appendChild(imgWrap);
            row.appendChild(info);

            card.appendChild(row);
            equipeContainer.appendChild(card);
        });
    } else {
        console.warn("equipeContainer não encontrado");
    }

    // listener global: prioriza abertura de card de membro, depois projetos
    document.addEventListener('click', (ev) => {
      // abrir perfil do membro em modal
      const memBtn = ev.target.closest('[data-member]');
      if (memBtn) {
        ev.preventDefault();
        const id = Number(memBtn.getAttribute('data-member'));
        const member = equipe.find(x => Number(x.id) === id);
        if (!member) return;
        const content = document.getElementById('modalContent');
        content.innerHTML = '';

        // layout: Name: (Foto)  / Bio / LinkedIn / Github / Projetos relacionados
        const header = document.createElement('div');
        header.style.display = 'flex';
        header.style.alignItems = 'flex-start';
        header.style.gap = '12px';

        const left = document.createElement('div');
        const nameTitle = document.createElement('h2');
        nameTitle.textContent = member.nome;
        left.appendChild(nameTitle);

        const bio = document.createElement('p');
        bio.textContent = member.bio || '';
        left.appendChild(bio);

        // socials list (explicit labels)
        const socials = document.createElement('div');
        socials.style.marginTop = '8px';
        // attempt to find linkedin/github by label
        const linkLabels = {};
        (member.links || []).forEach(l => {
          const labelLower = (l.label||'').toLowerCase();
          if (labelLower.includes('linkedin')) linkLabels.linkedin = l.href;
          if (labelLower.includes('github')) linkLabels.github = l.href;
          if (labelLower.includes('instagram')) linkLabels.instagram = l.href;
        });
        if (linkLabels.linkedin) {
          const row = document.createElement('div');
          row.innerHTML = `<strong>LinkedIn:</strong> `;
          const a = document.createElement('a');
          a.href = linkLabels.linkedin;
          a.target = '_blank';
          a.rel = 'noopener noreferrer';
          a.textContent = linkLabels.linkedin;
          row.appendChild(a);
          socials.appendChild(row);
        }
        if (linkLabels.github) {
          const row = document.createElement('div');
          row.innerHTML = `<strong>Github:</strong> `;
          const a = document.createElement('a');
          a.href = linkLabels.github;
          a.target = '_blank';
          a.rel = 'noopener noreferrer';
          a.textContent = linkLabels.github;
          row.appendChild(a);
          socials.appendChild(row);
        }
        if (linkLabels.instagram) {
          const row = document.createElement('div');
          row.innerHTML = `<strong>Instagram:</strong> `;
          const a = document.createElement('a');
          a.href = linkLabels.instagram;
          a.target = '_blank';
          a.rel = 'noopener noreferrer';
          a.textContent = linkLabels.instagram;
          row.appendChild(a);
          socials.appendChild(row);
        }
        left.appendChild(socials);

        const right = document.createElement('div');
        if (member.img) {
          const img = document.createElement('img');
          img.src = member.img;
          img.alt = member.nome;
          img.loading = 'lazy';
          img.style.width = '120px';
          img.style.height = '120px';
          img.style.objectFit = 'cover';
          img.style.borderRadius = '10px';
          right.appendChild(img);
        }

        header.appendChild(left);
        header.appendChild(right);

        content.appendChild(header);

        // projetos relacionados
        const related = Object.values(projects).filter(p => Array.isArray(p.memberIds) && p.memberIds.includes(member.id));
        const projTitle = document.createElement('h3');
        projTitle.textContent = 'Projetos relacionados';
        projTitle.style.marginTop = '12px';
        content.appendChild(projTitle);

        if (!related.length) {
          const p = document.createElement('p');
          p.className = 'small';
          p.textContent = 'Nenhum projeto relacionado.';
          content.appendChild(p);
        } else {
          const list = document.createElement('div');
          list.style.display = 'flex';
          list.style.flexDirection = 'column';
          list.style.gap = '8px';
          related.forEach(p => {
            const item = document.createElement('div');
            item.className = 'card';
            item.style.padding = '10px';
            const t = document.createElement('div');
            t.style.display = 'flex';
            t.style.justifyContent = 'space-between';
            const title = document.createElement('div');
            title.textContent = p.title;
            const btn = document.createElement('a');
            btn.href = '#';
            btn.className = 'btn';
            const key = Object.keys(projects).find(k => projects[k] === p);
            btn.setAttribute('data-open', key);
            btn.textContent = 'Ver detalhes';
            t.appendChild(title);
            t.appendChild(btn);
            item.appendChild(t);
            list.appendChild(item);
          });
          content.appendChild(list);
        }

        document.getElementById('modal').classList.add('show');
        return;
      }

      // abrir modal de projeto (existente)
      const btn = ev.target.closest('[data-open]');
      if (!btn) return;
      ev.preventDefault();

      const id = btn.getAttribute('data-open');
      const p = projects[id];
      if (!p) return;

      const content = document.getElementById('modalContent');
      content.innerHTML = '';

      // nome projeto
      const title = document.createElement('h2');
      title.textContent = p.title;

      // descrição breve
      const brief = document.createElement('p');
      brief.textContent = p.desc;

      // participantes
      const members = (Array.isArray(p.memberIds) ? p.memberIds.map(mid => {
        const m = equipe.find(x => Number(x.id) === mid);
        return m ? m.nome : null;
      }).filter(x => x) : []);
      const memTitle = document.createElement('p');
      memTitle.className = 'medium';
      memTitle.innerHTML = '<strong>Participantes:</strong> ' + (members.length ? members.join(', ') : 'N/A');

      // categoria
      const catTitle = document.createElement('p');
      catTitle.className = 'small';
      catTitle.innerHTML = '<strong>Categoria:</strong> ' + (p.category || 'N/A');

      // tecnologias
      const techTitle = document.createElement('p');
      techTitle.className = 'small';
      techTitle.innerHTML = '<strong>Tecnologias:</strong> ' + (Array.isArray(p.techs) ? p.techs.join(', ') : p.techs || '');

      // ano
      const yearTitle = document.createElement('p');
      yearTitle.className = 'small';
      yearTitle.innerHTML = '<strong>Ano:</strong> ' + (p.year || 'N/A');

      // abrir repositório
      const repoWrap = document.createElement('p');
      repoWrap.style.marginTop = '12px';
      const repoLink = document.createElement('a');
      repoLink.className = 'btn';
      repoLink.textContent = 'Abrir repositório';
      repoLink.href = p.repo || '#';
      repoLink.target = '_blank';
      repoLink.rel = 'noopener noreferrer';
      repoWrap.appendChild(repoLink);

      content.append(title, memTitle, brief, catTitle, techTitle, yearTitle, repoWrap);
      document.getElementById('modal').classList.add('show');
    });

    // fechar modal
    const closeModal = document.getElementById('closeModal');
    if (closeModal) closeModal.addEventListener('click', ()=>document.getElementById('modal').classList.remove('show'));
    const modal = document.getElementById('modal');
    if (modal) modal.addEventListener('click', (e)=>{ if (e.target.id === 'modal') modal.classList.remove('show'); });

    // Form validation e envio simulado (mantido)
    const form = document.getElementById('contactForm');
    const status = document.getElementById('status');
    if (form && status) {
      form.addEventListener('submit', (ev)=>{
        ev.preventDefault();
        status.textContent = '';
        const nome = form.nome.value.trim();
        const email = form.email.value.trim();
        const mensagem = form.mensagem.value.trim();
        if(!nome || !email || !mensagem){ status.textContent = 'Preencha todos os campos obrigatórios.'; return }
        const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if(!re.test(email)){ status.textContent = 'Email com formato inválido.'; return }

        status.textContent = 'Enviando...';
        setTimeout(()=>{
          status.textContent = 'Mensagem enviada com sucesso! Obrigado.';
          form.reset();
        },1000);
      });
    }

    // Smooth scroll for nav
    // document.querySelectorAll('nav a').forEach(a=>{
    //   a.addEventListener('click', (e)=>{
    //     e.preventDefault();
    //     const id = a.getAttribute('href').replace('#','');
    //     const el = document.getElementById(id);
    //     if(el) el.scrollIntoView({behavior:'smooth',block:'start'});
    //     document.querySelectorAll('nav a').forEach(x=>x.classList.remove('active'));
    //     a.classList.add('active');
    //   })
    // });

    // Gerenciar tema claro/escuro
    (function() {
      const themeToggle = document.getElementById('themeToggle');
      const htmlElement = document.documentElement;
      
      // Carregar tema salvo ou usar preferência do sistema
      const savedTheme = localStorage.getItem('theme') || 
        (window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light');
      
      const applyTheme = (theme) => {
        if (theme === 'dark') {
          document.body.classList.add('dark-theme');
          themeToggle.textContent = '🌤️';
          localStorage.setItem('theme', 'dark');
        } else {
          document.body.classList.remove('dark-theme');
          themeToggle.textContent = '🌙';
          localStorage.setItem('theme', 'light');
        }
      };
      
      // Aplicar tema inicial
      applyTheme(savedTheme);
      
      // Alternar tema ao clicar
      themeToggle.addEventListener('click', () => {
        const currentTheme = document.body.classList.contains('dark-theme') ? 'dark' : 'light';
        applyTheme(currentTheme === 'dark' ? 'light' : 'dark');
      });
    })();
});