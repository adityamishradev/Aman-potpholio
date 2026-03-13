// Main JavaScript for portfolio
// Handles: background particles, scroll reveal, navbar behavior, testimonials slider, contact validation

/* =========================
   Background particles (canvas)
   ========================= */
(function(){
  const canvas = document.getElementById('bg-canvas');
  if(!canvas) return;
  const ctx = canvas.getContext('2d');
  let w=canvas.width=innerWidth; let h=canvas.height=innerHeight;
  const particles = [];
  const count = Math.round((w*h)/90000);

  function rand(min,max){return Math.random()*(max-min)+min}
  function resize(){w=canvas.width=innerWidth;h=canvas.height=innerHeight}
  addEventListener('resize',resize);

  for(let i=0;i<count;i++){particles.push({x:rand(0,w),y:rand(0,h),vx:rand(-0.25,0.25),vy:rand(-0.2,0.2),r:rand(0.6,1.6)})}

  function draw(){
    ctx.clearRect(0,0,w,h);
    particles.forEach(p=>{
      p.x += p.vx; p.y += p.vy;
      if(p.x<0) p.x=w; if(p.x>w) p.x=0;
      if(p.y<0) p.y=h; if(p.y>h) p.y=0;
      ctx.beginPath(); ctx.fillStyle='rgba(212,175,55,0.05)';
      ctx.arc(p.x,p.y,p.r,0,Math.PI*2); ctx.fill();
    });
    requestAnimationFrame(draw);
  }
  draw();
})();

/* =========================
   Scroll reveal using IntersectionObserver
   ========================= */
(function(){
  const obs = new IntersectionObserver((entries)=>{
    entries.forEach(e=>{ if(e.isIntersecting){ e.target.classList.add('show'); obs.unobserve(e.target);} });
  },{threshold:0.12});
  document.querySelectorAll('.reveal, .reveal-left').forEach(el=>obs.observe(el));
  
  // Timeline items animation - one by one based on scroll position
  const timelineItems = Array.from(document.querySelectorAll('.timeline-item'));
  
  const timelineObs = new IntersectionObserver((entries)=>{
    entries.forEach(e=>{ 
      if(e.isIntersecting){ 
        const index = timelineItems.indexOf(e.target);
        // Stagger each card by 300ms for clear one-by-one effect
        setTimeout(()=>{
          e.target.classList.add('show');
        }, index * 300);
      } else {
        // Remove show class when scrolling away to re-animate on scroll back
        e.target.classList.remove('show');
      }
    });
  },{threshold:0.3, rootMargin: '0px 0px -100px 0px'});
  
  timelineItems.forEach(el=>timelineObs.observe(el));
})();

/* =========================
   Navbar color change on scroll and mobile toggle
   ========================= */
(function(){
  const header = document.getElementById('site-header');
  const toggle = document.getElementById('nav-toggle');
  const nav = document.getElementById('nav');
  window.addEventListener('scroll',()=>{
    if(window.scrollY>40) header.classList.add('scrolled'); else header.classList.remove('scrolled');
  });
  toggle && toggle.addEventListener('click', ()=>{
    if(nav.style.display==='block'){nav.style.display='';} else {nav.style.display='block'}
  });
  
  // Smooth scroll animation for navbar links
  document.querySelectorAll('.nav a[href^="#"]').forEach(link=>{
    link.addEventListener('click', function(e){
      e.preventDefault();
      const targetId = this.getAttribute('href');
      const targetSection = document.querySelector(targetId);
      
      if(targetSection){
        // Add click animation
        this.style.transform = 'scale(0.95)';
        setTimeout(()=>{
          this.style.transform = '';
        }, 150);
        
        // Smooth scroll to section
        targetSection.scrollIntoView({
          behavior: 'smooth',
          block: 'start'
        });
      }
    });
  });
})();

/* =========================
   Testimonials slider
   ========================= */
(function(){
  const slidesEl = document.getElementById('slides');
  if(!slidesEl) return;
  const testimonials = [
    {name:'A. Gupta', text:'Excellent guidance — handled my case with empathy and expertise.', img: 'assets/testimonial1.svg'},
    {name:'R. Sharma', text:'Quick to respond, clear advice and strong representation.', img: 'assets/testimonial2.svg'},
    {name:'S. Kaur', text:'Professional and trustworthy. Recommended for family matters.', img: 'assets/testimonial3.svg'}
  ];
  let idx=0, timer;
  function render(){
    slidesEl.innerHTML='';
    testimonials.forEach((t,i)=>{
      const el = document.createElement('div'); el.className='slide';
      el.style.opacity = i===idx?1:0; el.style.transform = i===idx?'none':'translateY(10px)';
      el.innerHTML = `
        <div class="testimonial-top">
          <img src="${t.img}" alt="${t.name}" class="testimonial-avatar" />
          <div>
            <p style="margin:0 0 .4rem;color:var(--muted)">${t.name}</p>
            <p style="margin:0;font-weight:600">Client</p>
          </div>
        </div>
        <p style="margin:.8rem 0 0;">“${t.text}”</p>
      `;
      slidesEl.appendChild(el);
    });
  }
  function next(){ idx = (idx+1)%testimonials.length; render(); }
  function prev(){ idx = (idx-1+testimonials.length)%testimonials.length; render(); }
  document.getElementById('next').addEventListener('click', ()=>{ next(); reset(); });
  document.getElementById('prev').addEventListener('click', ()=>{ prev(); reset(); });
  function reset(){ clearInterval(timer); timer = setInterval(next,4500); }
  render(); reset();
})();

/* =========================
   WhatsApp button behavior
   Opens WhatsApp with a prefilled message when clicked
   ========================= */
(function(){
  const waBtn = document.getElementById('whatsapp-btn');
  if(!waBtn) return;
  waBtn.addEventListener('click', ()=>{
    const phone = '918319948306'; // +91 83199 48306 -> remove plus and separators
    const text = encodeURIComponent('Hello Nishchal Mishra, I would like to discuss a legal matter.');
    const url = `https://wa.me/${phone}?text=${text}`;
    window.open(url, '_blank', 'noopener');
  });
})();

/* =========================
   Small helpers
   ========================= */
// Year is static in footer per design; no dynamic year replacement required.

/* =========================
   Consultation Fees Popup on page load
   ========================= */
(function(){
  const popup = document.getElementById('fees-popup');
  const closeBtn = document.getElementById('popup-close');
  const contactBtn = document.getElementById('popup-contact');
  
  if(!popup) return;
  
  // Show popup after 1.5 seconds of page load
  setTimeout(()=>{
    popup.classList.add('show');
  }, 1500);
  
  // Close popup on close button click
  closeBtn && closeBtn.addEventListener('click', ()=>{
    popup.classList.remove('show');
  });
  
  // Close popup when clicking outside
  popup.addEventListener('click', (e)=>{
    if(e.target === popup){
      popup.classList.remove('show');
    }
  });
  
  // Close popup and scroll to contact when contact button clicked
  contactBtn && contactBtn.addEventListener('click', ()=>{
    popup.classList.remove('show');
  });
  
  // Close on Escape key
  document.addEventListener('keydown', (e)=>{
    if(e.key === 'Escape' && popup.classList.contains('show')){
      popup.classList.remove('show');
    }
  });
})();
