document.addEventListener('DOMContentLoaded', () => {
  const params = new URLSearchParams(location.search);
  const id = Number(params.get('id'));
  const root = document.getElementById('profileRoot');
  if (!root) return;

  const equipe = window.equipe || [];
  const projects = window.projects || {};

  const member = equipe.find(m => Number(m.id) === id);
  if (!member) {
    root.innerHTML = '<div class="card"><p class="small">Perfil não encontrado.</p></div>';
    return;
  }

  // Header do perfil
  const card = document.createElement('div');
  card.className = 'card';
  const top = document.createElement('div');
  top.style.display = 'flex';
  top.style.gap = '16px';
  top.style.alignItems = 'center';

  if (member.img) {
    const img = document.createElement('img');
    img.src = member.img;
    img.alt = member.nome;
    img.loading = 'lazy';
    img.style.width = '140px';
    img.style.height = '140px';
    img.style.objectFit = 'cover';
    img.style.borderRadius = '10px';
    top.appendChild(img);
  }

  const info = document.createElement('div');
  const h1 = document.createElement('h2');
  h1.textContent = member.nome;
  const bio = document.createElement('p');
  bio.textContent = member.bio;
  const skills = document.createElement('p');
  skills.className = 'small';
  skills.innerHTML = '<strong>Habilidades:</strong> ' + (Array.isArray(member.habilidades) ? member.habilidades.join(', ') : member.habilidades);

  info.appendChild(h1);
  info.appendChild(bio);
  info.appendChild(skills);

  // links sociais e portfolio
  const linksWrap = document.createElement('div');
  linksWrap.style.marginTop = '8px';
  if (Array.isArray(member.links)) {
    member.links.forEach(l => {
      const a = document.createElement('a');
      a.href = l.href || '#';
      a.textContent = l.label || 'Link';
      a.target = '_blank';
      a.rel = 'noopener noreferrer';
      a.style.marginRight = '8px';
      linksWrap.appendChild(a);
    });
  }
  if (member.portfolio) {
    const pLink = document.createElement('a');
    pLink.href = member.portfolio;
    pLink.textContent = 'Portfólio';
    pLink.target = '_blank';
    pLink.rel = 'noopener noreferrer';
    pLink.style.marginLeft = '8px';
    linksWrap.appendChild(pLink);
  }
  info.appendChild(linksWrap);

  top.appendChild(info);
  card.appendChild(top);

  // Acadêmicos / experiências
  if (Array.isArray(member.academics) && member.academics.length) {
    const acad = document.createElement('div');
    acad.style.marginTop = '12px';
    const t = document.createElement('div');
    t.style.fontWeight = 600;
    t.textContent = 'Formação / Experiências';
    acad.appendChild(t);
    member.academics.forEach(a => {
      const p = document.createElement('p');
      p.className = 'small';
      p.textContent = a;
      acad.appendChild(p);
    });
    card.appendChild(acad);
  }

  // Projetos relacionados
  const related = Object.values(projects).filter(p => Array.isArray(p.memberIds) && p.memberIds.includes(member.id));
  const projSection = document.createElement('div');
  projSection.style.marginTop = '14px';
  const projTitle = document.createElement('h3');
  projTitle.textContent = 'Projetos relacionados';
  projSection.appendChild(projTitle);

  if (!related.length) {
    const p = document.createElement('p');
    p.className = 'small';
    p.textContent = 'Nenhum projeto relacionado.';
    projSection.appendChild(p);
  } else {
    const grid = document.createElement('div');
    grid.className = 'grid-3';
    related.forEach(p => {
      const c = document.createElement('div');
      c.className = 'card project-card';
      const t = document.createElement('h4'); t.textContent = p.title;
      const d = document.createElement('p'); d.textContent = p.desc;
      const tech = document.createElement('p'); tech.className='small'; tech.textContent = (Array.isArray(p.techs) ? p.techs.join(', ') : '');
      const a = document.createElement('a'); a.className='btn'; a.href = `#`; a.setAttribute('data-open', Object.keys(window.projects).find(k=>window.projects[k]===p)); a.textContent='Ver detalhes';
      c.append(t,d,tech,a);
      grid.appendChild(c);
    });
    projSection.appendChild(grid);
  }

  root.appendChild(card);
  root.appendChild(projSection);
});