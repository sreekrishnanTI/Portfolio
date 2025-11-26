// script.js
// Theme toggle, mailto contact, particles parallax, year, and Show more logic

(function(){
  const html = document.documentElement;
  const toggle = document.getElementById('themeToggle');
  const sendBtn = document.getElementById('sendMail');
  const msgInput = document.getElementById('msg');
  const YEAR = document.getElementById('year');
  const particles = document.querySelectorAll('.p');

  // Show more button elements
  const showMoreBtn = document.getElementById('showMoreBtn');
  const moreProjects = document.querySelectorAll('.more-project');

  // Apply theme: saved > OS pref > default dark
  function applyTheme(theme){
    if(theme === 'light'){
      html.classList.add('light');
      html.setAttribute('data-theme','light');
      toggle.setAttribute('aria-pressed','true');
      localStorage.setItem('site-theme','light');
      html.style.setProperty('--icon-color','#000');
    } else {
      html.classList.remove('light');
      html.setAttribute('data-theme','dark');
      toggle.setAttribute('aria-pressed','false');
      localStorage.setItem('site-theme','dark');
      html.style.setProperty('--icon-color','#fff');
    }
  }

  const saved = localStorage.getItem('site-theme');
  const prefersLight = window.matchMedia && window.matchMedia('(prefers-color-scheme: light)').matches;
  if(saved) applyTheme(saved);
  else applyTheme(prefersLight ? 'light' : 'dark');

  // Toggle handler
  toggle.addEventListener('click', () => {
    const isLight = html.classList.contains('light');
    applyTheme(isLight ? 'dark' : 'light');
    toggle.blur();
  });
  toggle.addEventListener('keydown', (e) => {
    if(e.key === 'Enter' || e.key === ' ') { e.preventDefault(); toggle.click(); }
  });

  // Send via Gmail
  sendBtn.addEventListener('click', () => {
    const msg = msgInput.value.trim();
    if(!msg){ msgInput.focus(); return; }
    const recipient = 'ti.sreekrishnan@gmail.com'; // <-- REPLACE with your email
    const subject = encodeURIComponent('Portfolio message from website');
    const body = encodeURIComponent(msg + '\n\n-- Sent from portfolio site');
    const mailto = `https://mail.google.com/mail/?view=cm&fs=1&to=${encodeURIComponent(recipient)}&su=${subject}&body=${body}`;
    const newWin = window.open(mailto, '_blank');
    if(!newWin) window.location.href = `mailto:${encodeURIComponent(recipient)}?subject=${subject}&body=${body}`;
  });

  // Particles parallax on scroll (lightweight)
  let lastScroll = 0;
  function parallax(){
    const sc = window.scrollY;
    const diff = sc - lastScroll;
    lastScroll = sc;
    particles.forEach((el, i) => {
      const speed = (i % 3) * 0.12 + 0.04;
      const tx = Math.round((sc * speed) % 120);
      el.style.transform = `translateY(${tx * -0.2}px)`;
    });
  }
  if(!window.matchMedia('(prefers-reduced-motion: reduce)').matches){
    window.addEventListener('scroll', parallax, { passive: true });
  }

  // Show more / Show less behavior
  function setMoreState(expanded){
    if(!showMoreBtn) return;
    if(expanded){
      moreProjects.forEach((card, idx) => {
        card.classList.remove('hidden');
        // animate each revealed card slightly staggered
        setTimeout(() => card.classList.add('reveal'), idx * 60);
      });
      showMoreBtn.textContent = 'Show less';
      showMoreBtn.setAttribute('aria-expanded','true');
    } else {
      moreProjects.forEach((card) => {
        card.classList.remove('reveal');
        card.classList.add('hidden');
      });
      showMoreBtn.textContent = 'Show more projects';
      showMoreBtn.setAttribute('aria-expanded','false');
      // bring focus back to button for accessibility
      showMoreBtn.focus({ preventScroll: true });
    }
  }

  // initialize: hide more projects
  if(moreProjects.length){
    moreProjects.forEach(card => card.classList.add('hidden'));
    if(showMoreBtn){
      showMoreBtn.addEventListener('click', () => {
        const expanded = showMoreBtn.getAttribute('aria-expanded') === 'true';
        setMoreState(!expanded);
      });
      // initial aria state
      showMoreBtn.setAttribute('aria-expanded','false');
    }
  } else {
    // if there are no extra projects, hide the button
    if(showMoreBtn) showMoreBtn.style.display = 'none';
  }

  // Update year
  if(YEAR) YEAR.textContent = new Date().getFullYear();

  // Simple Skills: render cards and animate fills once on load
(() => {
  const skills = [
    { id: 'html', name: 'HTML', value: 85 },
    { id: 'css', name: 'CSS', value: 70 },
    { id: 'js', name: 'JavaScript', value: 40 },
    { id: 'Photoshop', name: 'Photoshop', value: 85 },
    { id: 'daVinciResolve', name: 'Da Vinci Resolve', value: 89 },
  ];

  const skillsList = document.getElementById('skillsList');
  if (!skillsList) return;

  function createCard(skill) {
    const card = document.createElement('div');
    card.className = 'skill';
    card.setAttribute('role','listitem');

    card.innerHTML = `
      <div class="skill-head">
        <div class="skill-name">${skill.name}</div>
        <div class="skill-val" aria-live="polite"><span class="skill-percent">0</span>%</div>
      </div>
      <div class="skill-bar" aria-hidden="true">
        <div class="skill-fill" data-target="${skill.value}"></div>
      </div>
      <div class="skill-ticks"><span>0%</span><span>50%</span><span>100%</span></div>
    `;
    return card;
  }

  function render() {
    skillsList.innerHTML = '';
    skills.forEach(s => skillsList.appendChild(createCard(s)));
  }

  function animate(duration = 900, stagger = 120) {
    const fills = skillsList.querySelectorAll('.skill-fill');
    fills.forEach((fill, i) => {
      const target = Math.max(0, Math.min(100, Number(fill.dataset.target) || 0));
      // staggered start for nicer effect
      setTimeout(() => {
        // trigger transition
        fill.style.width = target + '%';

        // animate the numeric counter in header
        const headerPercent = fill.closest('.skill').querySelector('.skill-percent');
        const start = 0;
        const startTime = performance.now();
        function step(now) {
          const t = Math.min(1, (now - startTime) / duration);
          const current = Math.round(start + (target - start) * t);
          headerPercent.textContent = current;
          if (t < 1) requestAnimationFrame(step);
        }
        requestAnimationFrame(step);
      }, i * stagger);
    });
  }

  // init
  render();
  // small delay so layout paints first
  setTimeout(() => animate(900, 120), 250);

})();


})();
