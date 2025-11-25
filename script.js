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

})();
