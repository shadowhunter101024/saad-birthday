(function () {
    'use strict';

    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    /* ---------- Twinkling stars ---------- */
    const starsBox = document.getElementById('stars');
    const starCount = window.innerWidth < 600 ? 18 : 34;
    for (let i = 0; i < starCount; i++) {
        const s = document.createElement('span');
        s.className = 'star';
        s.style.left = Math.random() * 100 + '%';
        s.style.top = Math.random() * 100 + '%';
        s.style.animationDelay = (Math.random() * 3).toFixed(2) + 's';
        s.style.animationDuration = (2 + Math.random() * 3).toFixed(2) + 's';
        starsBox.appendChild(s);
    }

    /* ---------- Reveal on scroll ---------- */
    const items = document.querySelectorAll('.reveal');
    if ('IntersectionObserver' in window) {
        const waiting = [];
        const io = new IntersectionObserver(entries => {
            entries.forEach(e => {
                if (!e.isIntersecting) return;
                io.unobserve(e.target);
                // While the intro screen is open, hold the reveals until "Open" is tapped
                if (document.body.classList.contains('intro-on')) waiting.push(e.target);
                else e.target.classList.add('show');
            });
        }, { threshold: 0.15 });
        document.addEventListener('birthday:open', () => {
            waiting.splice(0).forEach(el => el.classList.add('show'));
        });
        items.forEach((el, i) => {
            if (el.closest('.hero')) el.style.transitionDelay = (i * 0.12) + 's';
            io.observe(el);
        });
    } else {
        items.forEach(el => el.classList.add('show'));
    }

    /* ---------- Scroll progress ---------- */
    const bar = document.getElementById('progress');
    let scrollTick = false;
    function updateBar() {
        const h = document.documentElement.scrollHeight - window.innerHeight;
        bar.style.transform = 'scaleX(' + (h > 0 ? Math.min(window.scrollY / h, 1) : 0) + ')';
        scrollTick = false;
    }
    window.addEventListener('scroll', () => {
        if (!scrollTick) { scrollTick = true; requestAnimationFrame(updateBar); }
    }, { passive: true });
    updateBar();

    /* ---------- Typewriter for the name ---------- */
    const nameEl = document.getElementById('nameText');
    if (nameEl && !reduce) {
        const full = nameEl.dataset.text || nameEl.textContent;
        nameEl.textContent = '';
        nameEl.classList.add('typing');
        let i = 0;
        const startTyping = () => setTimeout(function type() {
            nameEl.textContent = full.slice(0, ++i);
            if (i < full.length) setTimeout(type, 170);
            else setTimeout(() => nameEl.classList.remove('typing'), 1200);
        }, 900);
        // Start typing after the intro "Open" tap (or right away if there is no intro)
        if (document.body.classList.contains('intro-on')) {
            document.addEventListener('birthday:open', startTyping, { once: true });
        } else {
            startTyping();
        }
    }

    /* ---------- Sparkles around photo ---------- */
    const wrap = document.getElementById('photoWrap');
    if (wrap && !reduce) {
        const icons = ['✨', '⭐', '💖', '🎈', '🎉'];
        for (let i = 0; i < 6; i++) {
            const sp = document.createElement('span');
            sp.className = 'sparkle';
            sp.textContent = icons[i % icons.length];
            const edge = Math.random();
            sp.style.left = (edge < .5 ? -4 + Math.random() * 8 : 92 + Math.random() * 8) + '%';
            sp.style.top = Math.random() * 100 + '%';
            sp.style.animationDelay = (Math.random() * 2).toFixed(2) + 's';
            sp.style.fontSize = (0.9 + Math.random() * 0.9) + 'rem';
            wrap.appendChild(sp);
        }
    }

    /* ---------- Photo tilt (mouse on web, touch on phone) ---------- */
    const polaroid = document.querySelector('.polaroid');
    if (polaroid && !reduce) {
        let tiltTick = false, tx = 0, ty = 0;
        const tilt = (x, y) => {
            tx = x; ty = y;
            if (tiltTick) return;
            tiltTick = true;
            requestAnimationFrame(() => {
                const r = polaroid.getBoundingClientRect();
                const px = (tx - r.left) / r.width - 0.5;
                const py = (ty - r.top) / r.height - 0.5;
                polaroid.style.transform = `rotate(-2.5deg) rotateY(${px * 14}deg) rotateX(${-py * 14}deg)`;
                tiltTick = false;
            });
        };
        const reset = () => { polaroid.style.transform = ''; };
        wrap.addEventListener('mousemove', e => tilt(e.clientX, e.clientY));
        wrap.addEventListener('mouseleave', reset);
        wrap.addEventListener('touchmove', e => tilt(e.touches[0].clientX, e.touches[0].clientY), { passive: true });
        wrap.addEventListener('touchend', reset);
    }

    /* ---------- Confetti ---------- */
    const canvas = document.getElementById('confetti');
    const ctx = canvas.getContext('2d');
    let pieces = [];
    let running = false;
    const colors = ['#ff5c8a', '#ffd166', '#4ee1c1', '#a78bfa', '#fb923c', '#ffffff'];

    function resize() {
        const dpr = window.devicePixelRatio || 1;
        canvas.width = window.innerWidth * dpr;
        canvas.height = window.innerHeight * dpr;
        canvas.style.width = window.innerWidth + 'px';
        canvas.style.height = window.innerHeight + 'px';
        ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    }
    window.addEventListener('resize', resize);
    resize();

    function burst(count, x, y) {
        const fromPoint = x !== undefined;
        for (let i = 0; i < count; i++) {
            pieces.push({
                x: fromPoint ? x : Math.random() * window.innerWidth,
                y: fromPoint ? y : -10,
                vx: (Math.random() - 0.5) * (fromPoint ? 14 : 4),
                vy: fromPoint ? -Math.random() * 13 - 4 : Math.random() * 3 + 2,
                size: Math.random() * 8 + 5,
                rot: Math.random() * 360,
                vr: (Math.random() - 0.5) * 12,
                color: colors[Math.floor(Math.random() * colors.length)]
            });
        }
        if (!running) { running = true; requestAnimationFrame(tick); }
    }

    function tick() {
        ctx.clearRect(0, 0, window.innerWidth, window.innerHeight);
        pieces.forEach(p => {
            p.x += p.vx; p.y += p.vy; p.vy += 0.12; p.vx *= 0.995; p.rot += p.vr;
            ctx.save();
            ctx.translate(p.x, p.y);
            ctx.rotate(p.rot * Math.PI / 180);
            ctx.fillStyle = p.color;
            ctx.fillRect(-p.size / 2, -p.size / 4, p.size, p.size / 2);
            ctx.restore();
        });
        pieces = pieces.filter(p => p.y < window.innerHeight + 20);
        if (pieces.length) requestAnimationFrame(tick);
        else { running = false; ctx.clearRect(0, 0, window.innerWidth, window.innerHeight); }
    }

    function party() {
        burst(150);
        burst(70, window.innerWidth * 0.15, window.innerHeight * 0.75);
        burst(70, window.innerWidth * 0.85, window.innerHeight * 0.75);
    }

    document.getElementById('partyBtn').addEventListener('click', party);
    if (!reduce) document.addEventListener('birthday:open', () => setTimeout(party, 500), { once: true });

    /* ---------- Tap anywhere = floating hearts ---------- */
    document.addEventListener('pointerdown', e => {
        if (e.target.closest('button, a, .cake')) return;
        const h = document.createElement('span');
        h.textContent = ['❤️', '💖', '🎈', '✨', '🎉'][Math.floor(Math.random() * 5)];
        h.style.cssText = `position:fixed;left:${e.clientX - 12}px;top:${e.clientY - 12}px;font-size:1.6rem;` +
            'pointer-events:none;z-index:95;transition:transform 1.2s ease-out, opacity 1.2s ease-out;';
        document.body.appendChild(h);
        requestAnimationFrame(() => {
            h.style.transform = `translate(${(Math.random() - .5) * 60}px, -110px) scale(1.5)`;
            h.style.opacity = '0';
        });
        setTimeout(() => h.remove(), 1300);
    });

    /* ---------- Countdown ---------- */
    const target = new Date(document.body.dataset.date + 'T00:00:00');
    const msg = document.getElementById('countdownMsg');
    const el = {
        d: document.getElementById('d'), h: document.getElementById('h'),
        m: document.getElementById('m'), s: document.getElementById('s')
    };

    function updateCountdown() {
        const now = new Date();
        const diff = target - now;
        const sameDay = now.toDateString() === target.toDateString();

        if (sameDay) {
            msg.textContent = '🎉 Aj tor din! Full enjoy kor! 🎉';
            el.d.textContent = el.h.textContent = el.m.textContent = el.s.textContent = '0';
            return;
        }
        if (diff <= 0) {
            msg.textContent = 'Asha kori tor birthday ta darun kaatse! 🎈';
            return;
        }
        msg.textContent = 'Birthday-er jonno countdown';
        el.d.textContent = Math.floor(diff / 86400000);
        el.h.textContent = Math.floor(diff / 3600000) % 24;
        el.m.textContent = Math.floor(diff / 60000) % 60;
        el.s.textContent = Math.floor(diff / 1000) % 60;
    }
    updateCountdown();
    setInterval(updateCountdown, 1000);

    /* ---------- Cake ---------- */
    const cake = document.getElementById('cake');
    const hint = document.getElementById('cakeHint');
    function toggleCandle() {
        const out = cake.classList.toggle('out');
        if (out) {
            hint.textContent = '🎉 Wish ta mone mone bol... Happy Birthday! 🎉';
            const r = cake.getBoundingClientRect();
            burst(120, r.left + r.width / 2, r.top + 30);
            burst(80);
        } else {
            hint.textContent = 'Abar jalate abar tap koro 🕯️';
        }
    }
    cake.addEventListener('click', toggleCandle);
    cake.addEventListener('keydown', e => {
        if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); toggleCandle(); }
    });
})();

/* ---------- Music + memory video ---------- */
(function () {
    'use strict';
    const audio = document.getElementById('bgm');
    const btn = document.getElementById('musicBtn');
    const video = document.getElementById('memoryVideo');
    const memory = document.getElementById('memory');
    let audioOk = false;
    let userPaused = false;

    function setState(playing) {
        btn.classList.toggle('playing', playing);
        btn.classList.toggle('paused', !playing);
    }

    if (audio && btn) {
        audio.volume = 0.7;
        audio.loop = true;

        // 1) Find which song file really exists (song.mp3 / song.m4a / song.ogg)
        const candidates = Array.from(audio.querySelectorAll('source')).map(s => s.getAttribute('src'));
        const exists = u => fetch(u, { method: 'HEAD' })
            .then(r => r.ok && !(r.headers.get('content-type') || '').includes('text/html'))
            .catch(() => false);

        // 2) Try to start the song. Browsers only allow this after a real tap/click/key press,
        //    so we retry on every user gesture until it works.
        const gestures = ['click', 'touchend', 'pointerup', 'keydown'];
        function stopListening() { gestures.forEach(g => document.removeEventListener(g, tryPlay, true)); }
        function tryPlay(e) {
            if (e && e.target && btn.contains(e.target)) return;   // the music button handles its own taps
            if (!audioOk || userPaused || !audio.paused) return;
            const p = audio.play();
            if (p && p.then) p.then(stopListening).catch(() => {});
        }
        gestures.forEach(g => document.addEventListener(g, tryPlay, true));
        document.addEventListener('birthday:open', () => tryPlay());   // the intro "Open" tap starts the song

        Promise.all(candidates.map(exists)).then(found => {
            const i = found.findIndex(Boolean);
            if (i < 0) return;                       // no song added yet: keep the button hidden
            while (audio.firstChild) audio.removeChild(audio.firstChild);
            audio.src = candidates[i];               // use the one file that exists
            audio.load();
            audioOk = true;
            btn.hidden = false;                      // show the music button right away
            setState(false);
            tryPlay();                               // works immediately if the browser allows it
        });

        btn.addEventListener('click', e => {
            e.stopPropagation();
            if (!audioOk) return;
            if (audio.paused) { userPaused = false; audio.play().catch(() => {}); }
            else { userPaused = true; audio.pause(); }
        });
        audio.addEventListener('play', () => setState(true));
        audio.addEventListener('pause', () => setState(false));
        audio.addEventListener('error', () => { btn.title = 'Song could not be played'; });

        // Pause the song when the tab is hidden (saves battery / CPU), resume on return
        document.addEventListener('visibilitychange', () => {
            if (document.hidden) { if (!audio.paused) { audio.pause(); audio.dataset.auto = '1'; } }
            else if (audio.dataset.auto === '1') { audio.dataset.auto = ''; if (!userPaused) audio.play().catch(() => {}); }
        });
    }

    if (video && memory) {
        const msgBtn = document.getElementById('msgBtn');
        const modal = document.getElementById('videoModal');
        const closeBtn = document.getElementById('modalClose');

        // Hide the message icon when no video file exists yet
        const urls = Array.from(video.querySelectorAll('source')).map(s => s.getAttribute('src'));
        Promise.all(urls.map(u => fetch(u, { method: 'HEAD' })
            .then(r => r.ok && !(r.headers.get('content-type') || '').includes('text/html'))
            .catch(() => false)))
            .then(found => { if (!found.some(Boolean)) memory.classList.add('hidden'); });

        function openVideo() {
            modal.hidden = false;
            document.body.classList.add('no-scroll');
            requestAnimationFrame(() => modal.classList.add('open'));
            video.play().catch(() => {});
        }
        function closeVideo() {
            video.pause();
            modal.classList.remove('open');
            document.body.classList.remove('no-scroll');
            setTimeout(() => { modal.hidden = true; }, 300);
        }
        msgBtn.addEventListener('click', openVideo);
        closeBtn.addEventListener('click', closeVideo);
        modal.addEventListener('click', e => { if (e.target === modal) closeVideo(); });
        document.addEventListener('keydown', e => { if (e.key === 'Escape' && !modal.hidden) closeVideo(); });
        // Pause the song while the video plays, resume after
        video.addEventListener('play', () => { if (audio && !audio.paused) { audio.pause(); video.dataset.resume = '1'; } });
        const resume = () => {
            if (video.dataset.resume === '1' && audio && !userPaused) { audio.play().catch(() => {}); }
            video.dataset.resume = '';
        };
        video.addEventListener('pause', resume);
        video.addEventListener('ended', resume);
    }
})();

/* ---------- v5: card spotlight, floating emojis, cursor sparkle trail ---------- */
(function () {
    'use strict';
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (reduce) return;

    // Spotlight that follows the finger / mouse on cards
    document.querySelectorAll('.card').forEach(card => {
        card.addEventListener('pointermove', e => {
            const r = card.getBoundingClientRect();
            card.style.setProperty('--mx', (e.clientX - r.left) + 'px');
            card.style.setProperty('--my', (e.clientY - r.top) + 'px');
        });
    });

    // Floating emoji particles rising in the background
    const box = document.getElementById('floaties');
    if (box) {
        const icons = ['🎈', '🎉', '✨', '💖', '🎁', '⭐', '🎂', '🥳'];
        const n = window.innerWidth < 600 ? 5 : 9;
        for (let i = 0; i < n; i++) {
            const f = document.createElement('span');
            f.className = 'floaty';
            f.textContent = icons[i % icons.length];
            f.style.left = (Math.random() * 96) + '%';
            f.style.fontSize = (1 + Math.random() * 1.1) + 'rem';
            f.style.animationDuration = (12 + Math.random() * 12).toFixed(1) + 's';
            f.style.animationDelay = (-Math.random() * 20).toFixed(1) + 's';
            f.style.setProperty('--dx', ((Math.random() - .5) * 120).toFixed(0) + 'px');
            f.style.setProperty('--rot', ((Math.random() - .5) * 120).toFixed(0) + 'deg');
            box.appendChild(f);
        }
    }

    // Sparkle trail behind the mouse (only on devices with a real mouse)
    if (window.matchMedia('(hover: hover) and (pointer: fine)').matches) {
        let last = 0;
        document.addEventListener('mousemove', e => {
            const now = performance.now();
            if (now - last < 90) return;
            last = now;
            const t = document.createElement('span');
            t.className = 'trail';
            t.style.left = (e.clientX - 4) + 'px';
            t.style.top = (e.clientY - 4) + 'px';
            t.style.setProperty('--tx', ((Math.random() - .5) * 30) + 'px');
            document.body.appendChild(t);
            setTimeout(() => t.remove(), 800);
        }, { passive: true });
    }
})();

/* ---------- Intro screen: tap "Open" -> music + animations start ---------- */
(function () {
    'use strict';
    const intro = document.getElementById('intro');
    const openBtn = document.getElementById('openBtn');
    if (!intro || !openBtn) { document.body.classList.remove('intro-on'); return; }

    function openIt() {
        document.body.classList.remove('intro-on');
        intro.classList.add('hide');
        document.dispatchEvent(new Event('birthday:open'));
        window.scrollTo(0, 0);
        setTimeout(() => intro.remove(), 800);
    }
    openBtn.addEventListener('click', openIt, { once: true });
})();
