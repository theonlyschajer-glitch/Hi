// College Football Empire - Prototype Engine
// NOTE: This is a starter framework. Team data can be expanded to ALL FBS + FCS.
// It supports: team select, strategy-based drives, NIL/budget, stadium upgrades, and saves per player.

const STORAGE_KEY = 'cfe_save_v1';

const Data = {
  teams: [
    // SAMPLE DATA. Expand this list to include ALL FBS and FCS teams.
    { id: 'alabama', name: 'Alabama', level: 'FBS', prestige: 90, budget: 60, nil: 25, stadium: 100000 },
    { id: 'uconn', name: 'UConn', level: 'FBS', prestige: 55, budget: 25, nil: 8, stadium: 38000 },
    { id: 'ndsu', name: 'North Dakota State', level: 'FCS', prestige: 70, budget: 10, nil: 3, stadium: 19000 },
    { id: 'uri', name: 'Rhode Island', level: 'FCS', prestige: 45, budget: 6, nil: 1.5, stadium: 6500 }
  ],
  recruits: [
    { id: 1, name: 'QB ⭐⭐⭐⭐', cost: 1.2 },
    { id: 2, name: 'WR ⭐⭐⭐', cost: 0.6 },
    { id: 3, name: 'LB ⭐⭐⭐', cost: 0.5 }
  ]
};

const Game = {
  state: null,

  init() {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      this.state = JSON.parse(saved);
      this.showDashboard();
    } else {
      this.showTeamSelect();
    }
  },

  showTeamSelect() {
    this.switchScreen('team-select');
    const list = document.getElementById('team-list');
    list.innerHTML = '';
    Data.teams.forEach(team => {
      const div = document.createElement('div');
      div.className = 'team';
      div.innerHTML = `<strong>${team.name}</strong><br/>
                       <small>${team.level}</small><br/>
                       Prestige: ${team.prestige}`;
      div.onclick = () => this.startDynasty(team);
      list.appendChild(div);
    });
  },

  startDynasty(team) {
    this.state = {
      team: { ...team },
      wins: 0,
      losses: 0,
      log: []
    };
    this.save();
    this.showDashboard();
  },

  showDashboard() {
    this.switchScreen('dashboard');
    const t = this.state.team;
    document.getElementById('team-name').innerText = t.name;
    document.getElementById('stat-prestige').innerText = t.prestige;
    document.getElementById('stat-budget').innerText = t.budget.toFixed(1);
    document.getElementById('stat-nil').innerText = t.nil.toFixed(1);
    document.getElementById('stat-stadium').innerText = t.stadium.toLocaleString();
    document.getElementById('stat-level').innerText = t.level;
  },

  goTo(screen) {
    this.switchScreen(screen);
    if (screen === 'recruiting') this.renderRecruits();
  },

  switchScreen(name) {
    document.querySelectorAll('.screen').forEach(s => s.classList.remove('active'));
    document.getElementById('screen-' + name).classList.add('active');
  },

  playDrive() {
    const offense = document.getElementById('offense-style').value;
    const tempo = document.getElementById('tempo').value;
    const risk = document.getElementById('risk').value;

    // Simple drive outcome model (can be expanded)
    let base = this.state.team.prestige / 100;
    if (offense === 'pass') base += 0.05;
    if (tempo === 'fast') base += 0.05;
    if (risk === 'aggressive') base += 0.05;

    const rand = Math.random();
    let result = '';
    if (rand < base) {
      result = 'Touchdown!';
      this.state.wins += 0.1;
      this.state.team.budget += 0.5;
      this.state.team.nil += 0.2;
    } else if (rand < base + 0.2) {
      result = 'Field Goal.';
      this.state.team.budget += 0.2;
    } else {
      result = 'Punt / Turnover.';
    }

    this.log(`Drive: ${result}`);
    this.save();
    document.getElementById('game-log').textContent = this.state.log.join('\n');
  },

  renderRecruits() {
    const list = document.getElementById('recruit-list');
    list.innerHTML = '';
    Data.recruits.forEach(r => {
      const div = document.createElement('div');
      div.className = 'team';
      div.innerHTML = `<strong>${r.name}</strong><br/>NIL Cost: $${r.cost}M`;
      div.onclick = () => this.signRecruit(r);
      list.appendChild(div);
    });
  },

  signRecruit(r) {
    if (this.state.team.nil >= r.cost) {
      this.state.team.nil -= r.cost;
      this.state.team.prestige += 1;
      this.log(`Signed ${r.name} for $${r.cost}M NIL.`);
      this.save();
      alert('Recruit signed!');
      this.showDashboard();
    } else {
      alert('Not enough NIL funds.');
    }
  },

  applyBudget() {
    const nilSpend = parseFloat(document.getElementById('budget-nil').value || 0);
    const facSpend = parseFloat(document.getElementById('budget-facilities').value || 0);
    const total = nilSpend + facSpend;

    if (total > this.state.team.budget) {
      alert('Not enough budget.');
      return;
    }

    this.state.team.budget -= total;
    this.state.team.nil += nilSpend;
    this.state.team.prestige += facSpend * 0.5;
    this.log(`Budget applied. NIL +$${nilSpend}M, Facilities +${(facSpend*0.5).toFixed(1)} prestige.`);
    this.save();
    this.showDashboard();
  },

  upgradeStadium() {
    const cost = 5;
    if (this.state.team.budget < cost) {
      alert('Not enough budget.');
      return;
    }
    this.state.team.budget -= cost;
    this.state.team.stadium += 5000;
    this.state.team.prestige += 1;
    this.log('Stadium upgraded by 5,000 seats.');
    this.save();
    this.showDashboard();
  },

  log(msg) {
    this.state.log.push(msg);
    if (this.state.log.length > 20) this.state.log.shift();
  },

  save() {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(this.state));
  },

  reset() {
    if (confirm('Start a new dynasty?')) {
      localStorage.removeItem(STORAGE_KEY);
      location.reload();
    }
  }
};

document.addEventListener('DOMContentLoaded', () => Game.init());
