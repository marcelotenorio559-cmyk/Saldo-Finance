'use strict';

(() => {
  const STORAGE_KEY = 'saldo-finance:v1:transactions';
  const root = document.getElementById('root');
  const navItems = [
    { id: 'dashboard', label: 'Visão geral', icon: 'dashboard' },
    { id: 'transactions', label: 'Lançamentos', icon: 'activity' },
    { id: 'budgets', label: 'Orçamentos', icon: 'sliders' },
    { id: 'goals', label: 'Metas', icon: 'target' },
    { id: 'reports', label: 'Relatórios', icon: 'chart' },
  ];
  const categories = {
    income: ['Salário', 'Serviços', 'Vendas', 'Renda extra', 'Investimentos', 'Outros'],
    expense: ['Alimentação', 'Moradia', 'Transporte', 'Casa e contas', 'Saúde', 'Lazer', 'Software', 'Estrutura', 'Operação', 'Materiais', 'Impostos', 'Outros'],
  };
  const iconPaths = {
    leaf: '<path d="M20 4c-8 0-13 3-13 10a6 6 0 0 0 6 6c7 0 10-5 10-13V4h-3Z"/><path d="M4 21c3-6 7-9 13-12"/>',
    dashboard: '<rect x="3" y="3" width="8" height="8" rx="2"/><rect x="13" y="3" width="8" height="5" rx="2"/><rect x="13" y="10" width="8" height="11" rx="2"/><rect x="3" y="13" width="8" height="8" rx="2"/>',
    activity: '<path d="M22 12h-4l-3 9L9 3l-3 9H2"/>',
    sliders: '<line x1="4" x2="4" y1="21" y2="14"/><line x1="4" x2="4" y1="10" y2="3"/><line x1="12" x2="12" y1="21" y2="12"/><line x1="12" x2="12" y1="8" y2="3"/><line x1="20" x2="20" y1="21" y2="16"/><line x1="20" x2="20" y1="12" y2="3"/><line x1="2" x2="6" y1="14" y2="14"/><line x1="10" x2="14" y1="8" y2="8"/><line x1="18" x2="22" y1="16" y2="16"/>',
    target: '<circle cx="12" cy="12" r="9"/><circle cx="12" cy="12" r="5"/><circle cx="12" cy="12" r="1"/>',
    chart: '<path d="M3 3v18h18"/><path d="m19 9-5 5-4-4-5 5"/>',
    wallet: '<rect x="3" y="5" width="18" height="15" rx="3"/><path d="M3 9h18"/><path d="M16 15h.01"/>',
    briefcase: '<rect x="3" y="7" width="18" height="14" rx="2"/><path d="M8 7V4h8v3M3 12h18M10 12v2h4v-2"/>',
    check: '<path d="m5 12 4 4L19 6"/>',
    plus: '<path d="M12 5v14M5 12h14"/>',
    x: '<path d="m18 6-12 12M6 6l12 12"/>',
    bell: '<path d="M18 8a6 6 0 0 0-12 0c0 7-3 7-3 9h18c0-2-3-2-3-9M10 21h4"/>',
    calendar: '<rect x="3" y="5" width="18" height="16" rx="2"/><path d="M16 3v4M8 3v4M3 10h18"/>',
    down: '<path d="M12 5v14m-7-5 7 7 7-7"/>',
    up: '<path d="M12 19V5m-7 5 7-7 7 7"/>',
    downLeft: '<path d="M17 7 7 17M7 7v10h10"/>',
    upRight: '<path d="M7 17 17 7M7 7h10v10"/>',
    search: '<circle cx="11" cy="11" r="7"/><path d="m20 20-4-4"/>',
    download: '<path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4M7 10l5 5 5-5M12 15V3"/>',
    sparkle: '<path d="m12 3 1.9 5.8L20 11l-6.1 2.2L12 19l-2-5.8L4 11l6-2.2L12 3ZM19 15l1 2.5 2 1-2 1L19 22l-1-2.5-2-1 2-1 1-2.5Z"/>',
    help: '<circle cx="12" cy="12" r="9"/><path d="M9.6 9a2.5 2.5 0 0 1 4.8 1c0 1.7-2.4 2-2.4 4M12 17h.01"/>',
    settings: '<circle cx="12" cy="12" r="3"/><path d="m19.4 15 .1.1 1.4 1.1-1.5 2.6-1.7-.6a8 8 0 0 1-1.8 1l-.3 1.8h-3l-.4-1.8a8 8 0 0 1-1.8-1l-1.7.6-1.5-2.6 1.4-1.1a7 7 0 0 1 0-2L5.2 12l1.5-2.6 1.7.6a8 8 0 0 1 1.8-1l.4-1.8h3l.3 1.8a8 8 0 0 1 1.8 1l1.7-.6 1.5 2.6-1.4 1.1a7 7 0 0 1 .1 1.9Z"/>',
  };
  const icon = (name, size = 18, extra = '') => `<svg class="${extra}" width="${size}" height="${size}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">${iconPaths[name] || iconPaths.activity}</svg>`;
  const todayISO = () => { const d = new Date(); return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`; };
  const dateOffset = n => { const d = new Date(); d.setDate(d.getDate() + n); return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`; };
  const money = value => new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL', maximumFractionDigits: 2 }).format(value || 0);
  const dateLabel = iso => { try { return new Intl.DateTimeFormat('pt-BR', { day: '2-digit', month: 'short' }).format(new Date(`${iso}T12:00:00`)).replace('.', ''); } catch { return iso; } };
  const monthLabel = () => new Intl.DateTimeFormat('pt-BR', { month: 'long', year: 'numeric' }).format(new Date());
  const esc = value => String(value ?? '').replace(/[&<>"']/g, ch => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[ch]));
  const demo = [
    { id: 'p1', title: 'Salário', category: 'Salário', amount: 6800, kind: 'income', date: dateOffset(-2), scope: 'personal', account: 'Conta principal' },
    { id: 'p2', title: 'Mercado do mês', category: 'Alimentação', amount: 428.65, kind: 'expense', date: dateOffset(-1), scope: 'personal', account: 'Cartão de débito' },
    { id: 'p3', title: 'Aluguel', category: 'Moradia', amount: 1850, kind: 'expense', date: dateOffset(-3), scope: 'personal', account: 'Conta principal' },
    { id: 'p4', title: 'Freelance — projeto', category: 'Renda extra', amount: 750, kind: 'income', date: dateOffset(-5), scope: 'personal', account: 'Conta principal' },
    { id: 'p5', title: 'Internet', category: 'Casa e contas', amount: 119.9, kind: 'expense', date: dateOffset(-6), scope: 'personal', account: 'Conta principal' },
    { id: 'p6', title: 'Transporte', category: 'Transporte', amount: 186.4, kind: 'expense', date: dateOffset(-7), scope: 'personal', account: 'Cartão de débito' },
    { id: 'b1', title: 'Projeto Aurora', category: 'Serviços', amount: 9800, kind: 'income', date: dateOffset(-1), scope: 'business', account: 'Conta da empresa' },
    { id: 'b2', title: 'Sala comercial', category: 'Estrutura', amount: 1900, kind: 'expense', date: dateOffset(-2), scope: 'business', account: 'Conta da empresa' },
    { id: 'b3', title: 'Ferramentas de trabalho', category: 'Software', amount: 389.9, kind: 'expense', date: dateOffset(-4), scope: 'business', account: 'Cartão empresarial' },
    { id: 'b4', title: 'Consultoria', category: 'Serviços', amount: 2400, kind: 'income', date: dateOffset(-5), scope: 'business', account: 'Conta da empresa' },
    { id: 'b5', title: 'Internet e telefone', category: 'Operação', amount: 179.9, kind: 'expense', date: dateOffset(-6), scope: 'business', account: 'Conta da empresa' },
    { id: 'b6', title: 'Material de escritório', category: 'Materiais', amount: 245.5, kind: 'expense', date: dateOffset(-8), scope: 'business', account: 'Cartão empresarial' },
  ];
  const load = () => { try { const raw = localStorage.getItem(STORAGE_KEY); if (!raw) return demo; const parsed = JSON.parse(raw); return Array.isArray(parsed) ? parsed : demo; } catch { return demo; } };
  const state = { transactions: load(), scope: 'personal', view: 'dashboard', modal: false, query: '', filter: 'all', mobileNav: false, toast: '' };
  const save = () => { try { localStorage.setItem(STORAGE_KEY, JSON.stringify(state.transactions)); } catch { showToast('Não foi possível salvar neste navegador.'); } };
  const scoped = () => state.transactions.filter(t => t.scope === state.scope);
  const monthly = () => scoped().filter(t => t.date.slice(0, 7) === todayISO().slice(0, 7));
  const sumKind = (arr, kind) => arr.filter(t => t.kind === kind).reduce((s, t) => s + Number(t.amount), 0);
  const netOf = arr => sumKind(arr, 'income') - sumKind(arr, 'expense');
  const displayed = () => scoped().filter(t => (state.filter === 'all' || t.kind === state.filter) && `${t.title} ${t.category} ${t.account}`.toLowerCase().includes(state.query.toLowerCase())).sort((a, b) => b.date.localeCompare(a.date));
  const scopeName = () => state.scope === 'personal' ? 'Pessoal' : 'Empresa';
  const pageIntro = view => ({ dashboard: 'Uma visão tranquila e clara do que acontece com seu dinheiro.', transactions: 'Tudo o que entrou e saiu, em um só lugar.', budgets: `Acompanhe os limites planejados para ${state.scope === 'personal' ? 'suas finanças pessoais' : 'a operação da sua empresa'}.`, goals: 'Transforme planos em metas, um passo de cada vez.', reports: 'Entenda os números e acompanhe sua evolução.' }[view]);

  function sidebar() {
    return `<aside class="sidebar ${state.mobileNav ? 'sidebar-open' : ''}">
      <div class="brand"><div class="brand-mark">${icon('leaf', 21)}</div><div><div class="brand-name">saldo<span>.</span></div><div class="brand-subtitle">FINANCE</div></div><button class="icon-button sidebar-close" data-action="close-nav" aria-label="Fechar menu">${icon('x', 18)}</button></div>
      <div class="workspace-label">ESPAÇO DE TRABALHO</div>
      <div class="scope-switcher">
        <button class="scope-option ${state.scope === 'personal' ? 'selected' : ''}" data-scope="personal"><span class="scope-icon">${icon('wallet', 17)}</span><span>Meu pessoal</span>${state.scope === 'personal' ? icon('check', 15, 'scope-check') : ''}</button>
        <button class="scope-option ${state.scope === 'business' ? 'selected' : ''}" data-scope="business"><span class="scope-icon">${icon('briefcase', 17)}</span><span>Minha empresa</span>${state.scope === 'business' ? icon('check', 15, 'scope-check') : ''}</button>
      </div>
      <div class="workspace-label nav-label">MENU PRINCIPAL</div>
      <nav class="side-nav" aria-label="Menu principal">${navItems.map(item => `<button class="nav-item ${state.view === item.id ? 'active' : ''}" data-view="${item.id}">${icon(item.icon, 18)}<span>${item.label}</span>${item.id === 'transactions' ? `<span class="nav-count">${scoped().length}</span>` : ''}</button>`).join('')}</nav>
      <div class="sidebar-bottom"><div class="upgrade-card"><div class="upgrade-icon">${icon('sparkle', 17)}</div><strong>Seu dinheiro, mais claro.</strong><p>Pequenos passos para decisões melhores.</p><button data-view="goals">Ver minhas metas ${icon('upRight', 14)}</button></div><button class="nav-item secondary-nav" data-action="settings">${icon('settings', 18)}<span>Configurações</span></button><div class="user-mini"><div class="avatar">SF</div><div class="user-info"><strong>Meu espaço</strong><span>${scopeName()}</span></div><span class="muted">⌄</span></div></div>
    </aside>${state.mobileNav ? '<button class="sidebar-scrim" data-action="close-nav" aria-label="Fechar navegação"></button>' : ''}`;
  }
  function topbar() {
    const nav = navItems.find(n => n.id === state.view);
    return `<header class="topbar"><div class="topbar-left"><button class="icon-button mobile-menu" data-action="open-nav" aria-label="Abrir menu">☰</button><div class="breadcrumb">Seu espaço <span>/</span> <strong>${nav.label}</strong></div></div><div class="topbar-actions"><div class="period-pill">${icon('calendar', 15)}<span>${esc(monthLabel())}</span><span>⌄</span></div><button class="icon-button notification-button" data-action="notifications" aria-label="Notificações">${icon('bell', 18)}<span class="notification-dot"></span></button><div class="avatar top-avatar">SF</div></div></header>`;
  }
  function heading() {
    const title = state.view === 'dashboard' ? (state.scope === 'personal' ? 'Bom dia, vamos organizar?' : 'Seu negócio em equilíbrio.') : navItems.find(n => n.id === state.view).label;
    return `<div class="page-heading"><div><div class="eyebrow">${state.scope === 'personal' ? 'SUAS FINANÇAS, EM EQUILÍBRIO' : 'GESTÃO DO SEU NEGÓCIO'}</div><h1>${title}</h1><p class="page-intro">${pageIntro(state.view)}</p></div><button class="primary-button" data-action="add">${icon('plus', 17)} Novo lançamento</button></div>`;
  }
  function transactionRow(tx) {
    const incoming = tx.kind === 'income';
    return `<div class="transaction-row"><div class="transaction-type-icon ${incoming ? 'tx-income' : 'tx-expense'}">${icon(incoming ? 'downLeft' : 'upRight', 17)}</div><div class="transaction-main"><strong>${esc(tx.title)}</strong><span>${esc(tx.category)} <i>·</i> ${esc(tx.account)}</span></div><div class="transaction-date">${dateLabel(tx.date)}</div><div class="transaction-value ${incoming ? 'value-income' : 'value-expense'}">${incoming ? '+' : '−'} ${money(tx.amount)}</div></div>`;
  }
  function metricCard(label, value, note, symbol, tone) {
    return `<div class="metric-card"><div class="metric-icon ${tone}">${icon(symbol, 18)}</div><div class="metric-label">${label}</div><div class="metric-value">${value}</div><div class="metric-note">${note}</div></div>`;
  }
  function categoryBars(arr) {
    const groups = Object.entries(arr.filter(t => t.kind === 'expense').reduce((acc, t) => { acc[t.category] = (acc[t.category] || 0) + Number(t.amount); return acc; }, {})).sort((a, b) => b[1] - a[1]).slice(0, 4);
    if (!groups.length) return '<div class="empty-inline">Seus gastos por categoria aparecerão aqui.</div>';
    return `<div class="category-bars">${groups.map(([name, val], i) => `<div class="category-bar-row"><div class="category-bar-label"><span>${esc(name)}</span><strong>${money(val)}</strong></div><div class="bar-track"><div class="bar-fill bar-color-${i + 1}" style="width:${val / groups[0][1] * 100}%"></div></div></div>`).join('')}</div>`;
  }
  function dashboard() {
    const txs = monthly(); const income = sumKind(txs, 'income'); const expenses = sumKind(txs, 'expense'); const net = income - expenses;
    const recent = [...txs].sort((a, b) => b.date.localeCompare(a.date)).slice(0, 5);
    const max = Math.max(income, expenses, 1);
    const upcoming = state.scope === 'personal' ? [{ title: 'Internet residencial', subtitle: 'Casa e contas', due: 'Em 5 dias', amount: 119.9, day: '25' }, { title: 'Plano de saúde', subtitle: 'Saúde', due: 'Em 8 dias', amount: 289, day: '28' }] : [{ title: 'Ferramenta de gestão', subtitle: 'Software', due: 'Em 3 dias', amount: 89.9, day: '23' }, { title: 'Serviço de contabilidade', subtitle: 'Serviços', due: 'Em 7 dias', amount: 350, day: '27' }];
    return `<section class="hero-card"><div class="hero-decoration hero-decoration-one"></div><div class="hero-decoration hero-decoration-two"></div><div class="hero-main"><div class="hero-label"><span class="hero-live-dot"></span> RESUMO DO MÊS</div><div class="hero-title">Saldo do período</div><div class="hero-total">${money(net)}</div><div class="hero-change ${net >= 0 ? 'positive' : 'negative'}"><span class="change-arrow">${icon(net >= 0 ? 'upRight' : 'downLeft', 15)}</span><span>${net >= 0 ? 'Você recebeu mais do que gastou' : 'Suas despesas passaram das entradas'}</span></div></div><div class="hero-side"><div class="hero-side-label">MOVIMENTAÇÕES DO MÊS</div><div class="hero-mini-stat"><span class="mini-stat-icon income-bg">${icon('downLeft', 16)}</span><div><span>Entradas</span><strong>${money(income)}</strong></div></div><div class="hero-mini-stat"><span class="mini-stat-icon expense-bg">${icon('upRight', 16)}</span><div><span>Saídas</span><strong>${money(expenses)}</strong></div></div><div class="hero-bar"><span style="width:${Math.min(100, income / max * 100)}%"></span><span style="width:${Math.min(100, expenses / max * 100)}%"></span></div><div class="hero-bar-caption"><span><i class="legend-income"></i> Entradas</span><span><i class="legend-expense"></i> Saídas</span></div></div></section>
      <section class="metric-grid">${metricCard('Entradas no mês', money(income), `${txs.filter(t => t.kind === 'income').length} movimentações`, 'downLeft', 'mint')}${metricCard('Saídas no mês', money(expenses), `${txs.filter(t => t.kind === 'expense').length} movimentações`, 'upRight', 'peach')}${metricCard('Lançamentos', String(scoped().length).padStart(2, '0'), 'no histórico', 'activity', 'lavender')}</section>
      <section class="dashboard-grid"><div class="panel recent-panel"><div class="panel-heading"><div><h2>Últimas movimentações</h2><p>O que aconteceu recentemente</p></div><button class="text-button" data-view="transactions">Ver todas ${icon('upRight', 14)}</button></div>${recent.length ? `<div class="transaction-list">${recent.map(transactionRow).join('')}</div>` : emptyState('Seu histórico começa aqui', 'Adicione a primeira movimentação para acompanhar seu dinheiro.')}</div><div class="right-stack"><div class="panel spending-panel"><div class="panel-heading"><div><h2>Onde você gastou</h2><p>Principais categorias do mês</p></div><button class="subtle-icon" data-view="reports" aria-label="Ver relatórios">${icon('upRight', 17)}</button></div>${categoryBars(txs)}<button class="panel-bottom-link" data-view="reports">Abrir relatório ${icon('upRight', 14)}</button></div><div class="panel bills-panel"><div class="panel-heading"><div><h2>Próximos vencimentos</h2><p>Planeje com tranquilidade</p></div>${icon('calendar', 17, 'soft-icon')}</div>${upcoming.map(b => `<div class="bill-row"><div class="bill-calendar"><span>OUT</span><strong>${b.day}</strong></div><div class="bill-info"><strong>${b.title}</strong><span>${b.subtitle} · ${b.due}</span></div><strong class="bill-amount">${money(b.amount)}</strong></div>`).join('')}<div class="demo-note">Exemplos de vencimentos — cadastre seus compromissos nas próximas versões.</div></div></div></section>
      <section class="quick-tip"><div class="tip-icon">${icon('sparkle', 18)}</div><div><strong>Um hábito que faz diferença</strong><p>Reserve alguns minutos por semana para revisar seus lançamentos e manter tudo em dia.</p></div><button class="tip-action" data-view="transactions">Revisar lançamentos ${icon('upRight', 15)}</button></section>`;
  }
  function emptyState(title, text) { return `<div class="empty-state"><div class="empty-symbol">${icon('wallet', 22)}</div><strong>${title}</strong><p>${text}</p><button class="primary-button small-button" data-action="add">${icon('plus', 15)} Adicionar lançamento</button></div>`; }
  function transactionsPage() {
    const arr = displayed(); const net = netOf(arr);
    return `<div class="panel table-panel"><div class="table-toolbar"><div class="search-box">${icon('search', 17)}<input data-query placeholder="Buscar movimentação..." value="${esc(state.query)}" aria-label="Buscar movimentação" /><kbd>⌕</kbd></div><div class="toolbar-actions"><select class="filter-select" data-filter aria-label="Filtrar tipo"><option value="all" ${state.filter === 'all' ? 'selected' : ''}>Todos os tipos</option><option value="income" ${state.filter === 'income' ? 'selected' : ''}>Entradas</option><option value="expense" ${state.filter === 'expense' ? 'selected' : ''}>Saídas</option></select><button class="outline-button" data-action="export">${icon('download', 15)} Exportar CSV</button></div></div><div class="table-summary"><span>${arr.length} movimentações encontradas</span><span>Saldo listado <strong class="${net >= 0 ? 'value-income' : 'value-expense'}">${money(net)}</strong></span></div><div class="table-overflow"><table class="transactions-table"><thead><tr><th>Descrição</th><th>Categoria</th><th>Data</th><th>Conta</th><th>Tipo</th><th class="align-right">Valor</th></tr></thead><tbody>${arr.map(tx => `<tr><td><div class="table-title"><span class="tiny-status ${tx.kind}"></span>${esc(tx.title)}</div></td><td><span class="category-chip">${esc(tx.category)}</span></td><td>${dateLabel(tx.date)}</td><td>${esc(tx.account)}</td><td><span class="kind-pill ${tx.kind}">${tx.kind === 'income' ? 'Entrada' : 'Saída'}</span></td><td class="align-right table-amount ${tx.kind === 'income' ? 'value-income' : 'value-expense'}">${tx.kind === 'income' ? '+' : '−'} ${money(tx.amount)}</td></tr>`).join('')}</tbody></table>${!arr.length ? `<div class="table-empty">${icon('search', 20)}<strong>Nenhuma movimentação encontrada</strong><span>Tente outro termo ou adicione um lançamento novo.</span><button class="outline-button" data-action="add">${icon('plus', 15)} Novo lançamento</button></div>` : ''}</div><div class="table-footer"><span>Valores em reais (BRL)</span><span>Os dados são salvos neste dispositivo.</span></div></div>`;
  }
  function budgetsPage() {
    const budgets = state.scope === 'personal' ? [{ name: 'Alimentação', limit: 850 }, { name: 'Moradia', limit: 2100 }, { name: 'Transporte', limit: 400 }, { name: 'Lazer', limit: 300 }, { name: 'Casa e contas', limit: 500 }] : [{ name: 'Estrutura', limit: 2400 }, { name: 'Software', limit: 600 }, { name: 'Operação', limit: 900 }, { name: 'Materiais', limit: 500 }, { name: 'Marketing', limit: 700 }];
    const txs = monthly(); const planned = budgets.reduce((s, b) => s + b.limit, 0); const spent = budgets.reduce((s, b) => s + txs.filter(t => t.kind === 'expense' && t.category === b.name).reduce((a, t) => a + t.amount, 0), 0);
    return `<div class="budget-summary-grid"><div class="panel budget-summary"><span class="summary-overline">ORÇAMENTO PLANEJADO</span><strong>${money(planned)}</strong><span>Limite mensal de todas as categorias</span></div><div class="panel budget-summary"><span class="summary-overline">GASTO NAS CATEGORIAS</span><strong>${money(spent)}</strong><span>Com base nos lançamentos deste mês</span></div></div><div class="panel budgets-panel"><div class="panel-heading"><div><h2>Seus limites mensais</h2><p>Os valores abaixo são exemplos para planejar seu mês.</p></div><span class="soft-tag">${esc(monthLabel())}</span></div><div class="budget-list">${budgets.map((b, i) => { const value = txs.filter(t => t.kind === 'expense' && t.category === b.name).reduce((s, t) => s + t.amount, 0); const pct = value / b.limit * 100; return `<div class="budget-row"><div class="budget-category-icon category-tone-${i + 1}">${icon(['activity', 'wallet', 'sliders', 'chart', 'briefcase'][i], 18)}</div><div class="budget-details"><div class="budget-name-row"><strong>${b.name}</strong><span>${money(value)} <i>de</i> ${money(b.limit)}</span></div><div class="bar-track budget-track"><div class="bar-fill ${pct > 100 ? 'over-budget' : ''}" style="width:${Math.min(100, pct)}%"></div></div><span class="budget-percent">${Math.round(pct)}% utilizado ${pct > 100 ? '<b>· limite ultrapassado</b>' : ''}</span></div><button class="subtle-icon" data-action="demo-settings" aria-label="Editar limite">${icon('settings', 16)}</button></div>`; }).join('')}</div><div class="note-strip">${icon('help', 17)}<span>Os limites nesta versão são demonstrativos. A edição completa de orçamentos será adicionada em uma próxima atualização.</span></div></div>`;
  }
  function goalsPage() {
    const goals = state.scope === 'personal' ? [{ title: 'Reserva de emergência', current: 4200, target: 10000, due: 'Meta sugerida: 6 meses' }, { title: 'Viagem dos sonhos', current: 1250, target: 4000, due: 'Planejamento pessoal' }] : [{ title: 'Reserva da empresa', current: 8500, target: 20000, due: 'Capital de segurança' }, { title: 'Equipamento novo', current: 2100, target: 6000, due: 'Investimento operacional' }];
    return `<div class="goals-intro panel"><div class="goal-intro-icon">${icon('target', 22)}</div><div><h2>Todo objetivo começa com um plano.</h2><p>Defina um destino para seu dinheiro e acompanhe o progresso sem perder de vista o presente.</p></div></div><div class="goal-grid">${goals.map((g, i) => `<div class="panel goal-card"><div class="goal-card-top"><div class="goal-icon goal-icon-${i + 1}">${icon('target', 19)}</div><span class="soft-tag">Em andamento</span></div><h3>${g.title}</h3><p>${g.due}</p><div class="goal-amount-row"><strong>${money(g.current)}</strong><span>de ${money(g.target)}</span></div><div class="bar-track goal-track"><div class="bar-fill" style="width:${Math.min(100, g.current / g.target * 100)}%"></div></div><div class="goal-progress-footer"><span>${Math.round(g.current / g.target * 100)}% concluído</span><span>Faltam ${money(Math.max(0, g.target - g.current))}</span></div></div>`).join('')}</div><div class="note-strip">${icon('help', 17)}<span>Metas de demonstração para a primeira versão. Em uma próxima etapa, você poderá criar, editar e registrar contribuições.</span></div>`;
  }
  function reportsPage() {
    const txs = monthly(); const income = sumKind(txs, 'income'); const expenses = sumKind(txs, 'expense');
    const groups = Object.entries(txs.filter(t => t.kind === 'expense').reduce((acc, t) => { acc[t.category] = (acc[t.category] || 0) + Number(t.amount); return acc; }, {})).sort((a, b) => b[1] - a[1]); const largest = Math.max(...groups.map(c => c[1]), 1);
    return `<div class="report-topline"><div><span class="summary-overline">RELATÓRIO MENSAL</span><p>Resumo de ${esc(monthLabel())}</p></div><button class="outline-button" data-action="export">${icon('download', 15)} Exportar dados</button></div><div class="report-kpis"><div class="panel report-kpi"><span>Entradas</span><strong class="value-income">${money(income)}</strong><div class="kpi-caption">${icon('downLeft', 14)} Total recebido no mês</div></div><div class="panel report-kpi"><span>Saídas</span><strong class="value-expense">${money(expenses)}</strong><div class="kpi-caption">${icon('upRight', 14)} Total gasto no mês</div></div><div class="panel report-kpi"><span>Resultado líquido</span><strong>${money(income - expenses)}</strong><div class="kpi-caption">${icon('chart', 14)} ${income > 0 ? `${Math.round((income - expenses) / income * 100)}% das entradas` : 'Sem entradas registradas'}</div></div></div><div class="panel report-breakdown"><div class="panel-heading"><div><h2>Despesas por categoria</h2><p>${state.scope === 'personal' ? 'Seus gastos pessoais' : 'Gastos da operação empresarial'}</p></div><span class="soft-tag">${groups.length} categorias</span></div>${groups.length ? `<div class="report-category-list">${groups.map(([name, val], i) => `<div class="report-category"><span class="report-color color-${i % 4 + 1}"></span><div class="report-category-main"><div><strong>${esc(name)}</strong><span>${Math.round(val / (expenses || 1) * 100)}% do total de saídas</span></div><div class="bar-track"><div class="bar-fill bar-color-${i % 4 + 1}" style="width:${val / largest * 100}%"></div></div></div><strong class="report-value">${money(val)}</strong></div>`).join('')}</div>` : '<div class="empty-inline">Ainda não há despesas neste período.</div>'}<div class="report-footer-note">Relatório calculado a partir dos lançamentos registrados neste dispositivo.</div></div>`;
  }
  function modal() {
    if (!state.modal) return '';
    const accounts = state.scope === 'personal' ? ['Conta principal', 'Conta poupança', 'Cartão de débito', 'Cartão de crédito', 'Dinheiro'] : ['Conta da empresa', 'Cartão empresarial', 'Caixa da empresa', 'Outra conta'];
    return `<div class="modal-backdrop" data-action="backdrop"><section class="modal" role="dialog" aria-modal="true" aria-labelledby="modal-title"><div class="modal-heading"><div><div class="eyebrow">${state.scope === 'personal' ? 'GESTÃO PESSOAL' : 'GESTÃO EMPRESARIAL'}</div><h2 id="modal-title">Novo lançamento</h2><p>Registre uma entrada ou saída de dinheiro.</p></div><button class="icon-button" data-action="close-modal" aria-label="Fechar janela">${icon('x', 19)}</button></div><form id="transaction-form"><div class="kind-switch"><button type="button" class="kind-choice selected expense-choice" data-kind="expense">${icon('upRight', 17)} Saída</button><button type="button" class="kind-choice" data-kind="income">${icon('downLeft', 17)} Entrada</button></div><label class="form-label">Descrição<input name="title" autofocus placeholder="Ex.: Compra no mercado" maxlength="80" required /></label><div class="form-row"><label class="form-label">Valor (R$)<div class="amount-input"><span>R$</span><input name="amount" inputmode="decimal" placeholder="0,00" required /></div></label><label class="form-label">Data<input name="date" type="date" value="${todayISO()}" required /></label></div><div class="form-row"><label class="form-label">Categoria<select name="category">${categories.expense.map(c => `<option>${esc(c)}</option>`).join('')}</select></label><label class="form-label">Conta<select name="account">${accounts.map(a => `<option>${esc(a)}</option>`).join('')}</select></label></div><div class="form-error" hidden></div><div class="modal-footer"><button type="button" class="outline-button" data-action="close-modal">Cancelar</button><button type="submit" class="primary-button">${icon('check', 16)} Salvar lançamento</button></div></form></section></div>`;
  }
  function render() {
    const viewContent = ({ dashboard, transactions: transactionsPage, budgets: budgetsPage, goals: goalsPage, reports: reportsPage })[state.view]();
    root.innerHTML = `${sidebar()}<main class="main-area">${topbar()}<div class="page-content">${heading()}${viewContent}<footer class="page-footer"><span><span class="footer-dot"></span> Seus dados ficam salvos neste dispositivo</span><span>Saldo Finance <span class="footer-version">• primeira versão</span></span></footer></div></main>${modal()}${state.toast ? `<div role="status" class="toast"><span class="toast-check">${icon('check', 14)}</span>${esc(state.toast)}<button data-action="clear-toast" aria-label="Fechar aviso">${icon('x', 15)}</button></div>` : ''}`;
    const query = root.querySelector('[data-query]');
    if (query && document.activeElement && document.activeElement.matches('[data-query]')) {
      query.focus(); query.setSelectionRange(query.value.length, query.value.length);
    }
  }
  let toastTimeout;
  function showToast(message) { state.toast = message; clearTimeout(toastTimeout); render(); toastTimeout = setTimeout(() => { state.toast = ''; render(); }, 2800); }
  function exportCSV() {
    const arr = displayed();
    const rows = [['Data', 'Descrição', 'Categoria', 'Tipo', 'Valor', 'Conta'], ...arr.map(t => [t.date, t.title, t.category, t.kind === 'income' ? 'Entrada' : 'Saída', Number(t.amount).toFixed(2).replace('.', ','), t.account])];
    const csv = '\ufeff' + rows.map(row => row.map(cell => `"${String(cell).replaceAll('"', '""')}"`).join(';')).join('\r\n');
    const url = URL.createObjectURL(new Blob([csv], { type: 'text/csv;charset=utf-8;' }));
    const a = document.createElement('a'); a.href = url; a.download = `saldo-finance-${state.scope}-${todayISO()}.csv`; document.body.appendChild(a); a.click(); a.remove(); URL.revokeObjectURL(url); showToast('Seu arquivo CSV está pronto.');
  }
  function closeModal() { state.modal = false; render(); }
  root.addEventListener('click', event => {
    const el = event.target.closest('[data-view],[data-scope],[data-action],[data-kind]'); if (!el) return;
    if (el.dataset.view) { state.view = el.dataset.view; state.mobileNav = false; render(); return; }
    if (el.dataset.scope) { state.scope = el.dataset.scope; state.query = ''; state.filter = 'all'; render(); return; }
    if (el.dataset.kind) {
      const form = root.querySelector('#transaction-form'); if (!form) return;
      form.dataset.kind = el.dataset.kind;
      form.querySelectorAll('[data-kind]').forEach(btn => { btn.classList.toggle('selected', btn.dataset.kind === el.dataset.kind); btn.classList.toggle('expense-choice', btn.dataset.kind === 'expense' && btn.dataset.kind === el.dataset.kind); btn.classList.toggle('income-choice', btn.dataset.kind === 'income' && btn.dataset.kind === el.dataset.kind); });
      const category = form.querySelector('[name="category"]'); category.innerHTML = categories[el.dataset.kind].map(c => `<option>${esc(c)}</option>`).join(''); return;
    }
    const action = el.dataset.action;
    if (action === 'add') { state.modal = true; render(); return; }
    if (action === 'close-modal' || action === 'backdrop' && event.target === el) { closeModal(); return; }
    if (action === 'open-nav') { state.mobileNav = true; render(); return; }
    if (action === 'close-nav') { state.mobileNav = false; render(); return; }
    if (action === 'export') { exportCSV(); return; }
    if (action === 'clear-toast') { state.toast = ''; render(); return; }
    if (action === 'notifications') { showToast('Você está em dia. Nenhum novo alerta por enquanto.'); return; }
    if (action === 'settings' || action === 'demo-settings') { showToast('Esta configuração estará disponível em uma próxima versão.'); return; }
  });
  root.addEventListener('input', event => {
    const el = event.target;
    if (el.matches('[data-query]')) { state.query = el.value; const pos = el.selectionStart; render(); const next = root.querySelector('[data-query]'); if (next) { next.focus(); try { next.setSelectionRange(pos, pos); } catch {} } }
  });
  root.addEventListener('change', event => { if (event.target.matches('[data-filter]')) { state.filter = event.target.value; render(); } });
  root.addEventListener('submit', event => {
    if (event.target.id !== 'transaction-form') return;
    event.preventDefault(); const form = event.target; const data = new FormData(form);
    const title = String(data.get('title') || '').trim(); const amount = Number(String(data.get('amount') || '').replace(',', '.')); const date = String(data.get('date') || '');
    const error = form.querySelector('.form-error');
    let message = '';
    if (!title) message = 'Informe uma descrição.';
    else if (!Number.isFinite(amount) || amount <= 0) message = 'Informe um valor maior que zero.';
    else if (!/^\d{4}-\d{2}-\d{2}$/.test(date) || Number.isNaN(Date.parse(`${date}T12:00:00`))) message = 'Informe uma data válida.';
    if (message) { error.hidden = false; error.textContent = message; return; }
    const tx = { id: (crypto.randomUUID ? crypto.randomUUID() : `${Date.now()}-${Math.random()}`), title, amount, date, category: String(data.get('category') || 'Outros'), account: String(data.get('account') || 'Conta principal'), kind: form.dataset.kind || 'expense', scope: state.scope };
    state.transactions.unshift(tx); save(); state.modal = false; state.view = 'transactions'; state.query = ''; state.filter = 'all'; render(); showToast('Lançamento adicionado com sucesso.');
  });
  document.addEventListener('keydown', event => { if (event.key === 'Escape' && state.modal) closeModal(); });
  render();
})();
