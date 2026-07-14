(function () {
  'use strict';

  

  var isTouch = 'ontouchstart' in window || navigator.maxTouchPoints > 0;
  var prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var isMobile = window.innerWidth < 640;

  var mouseX = window.innerWidth / 2;
  var mouseY = window.innerHeight / 2;
  var smoothMouseX = mouseX;
  var smoothMouseY = mouseY;
  var cursorX = mouseX;
  var cursorY = mouseY;
  var currentSectionIndex = 0;
  var scrollTicking = false;
  var rafId = null;

  

  var body = document.body;
  var preloader = document.getElementById('preloader');
  var preloaderText = document.getElementById('preloaderText');
  var cursorEl = document.getElementById('cursor');
  var cursorDot, cursorRing;
  var glowEl = document.querySelector('.glow');
  var progressFill = document.querySelector('.progress-fill');
  var progressDotsContainer = document.querySelector('.progress-dots');
  var labelText = document.querySelector('.label-text');
  var labelIndex = document.querySelector('.label-index');
  var sections = document.querySelectorAll('.section');
  var reveals = document.querySelectorAll('.reveal, .reveal-up');
  var tiltElements = document.querySelectorAll('[data-tilt]');
  var magneticElements = document.querySelectorAll('[data-magnetic]');
  var langFills = document.querySelectorAll('.lang-fill');
  var splitElements = document.querySelectorAll('[data-split]');
  var header = document.querySelector('.site-header');

  if (cursorEl) {
    cursorDot = cursorEl.querySelector('.cursor-dot');
    cursorRing = cursorEl.querySelector('.cursor-ring');
  }

  

  function init() {
    if (isTouch) body.classList.add('is-touch');

    splitTextElements();
    createProgressDots();
    setLanguageFillWidths();

    if (prefersReduced) {
      skipPreloader();
    } else {
      runPreloader();
    }
  }

  

  function splitTextElements() {
    splitElements.forEach(function (el) {
      var text = el.textContent;
      el.setAttribute('aria-label', text);
      el.innerHTML = '';

      for (var i = 0; i < text.length; i++) {
        var span = document.createElement('span');
        span.className = 'char' + (text[i] === ' ' ? ' space' : '');
        span.textContent = text[i] === ' ' ? '\u00A0' : text[i];
        span.style.transitionDelay = (i * 0.05) + 's';
        el.appendChild(span);
      }
    });
  }

  

  function skipPreloader() {
    preloader.classList.add('done');
    body.classList.remove('loading');
    body.classList.add('preloaded');
    initAfterPreload();
  }

  function runPreloader() {
    var target = 'YASSINE MAGNOUNE';
    var scrambleChars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789@#$%&*!?';
    var duration = 1400;
    var startTime = null;

    preloaderText.textContent = '';

    function scrambleStep(timestamp) {
      if (!startTime) startTime = timestamp;
      var elapsed = timestamp - startTime;
      var progress = Math.min(elapsed / duration, 1);

      var result = '';
      for (var i = 0; i < target.length; i++) {
        if (target[i] === ' ') {
          result += ' ';
        } else if (i / target.length < progress) {
          result += target[i];
        } else {
          result += scrambleChars[Math.floor(Math.random() * scrambleChars.length)];
        }
      }

      preloaderText.textContent = result;

      if (progress < 1) {
        requestAnimationFrame(scrambleStep);
      } else {
        preloaderText.textContent = target;
        onScrambleDone();
      }
    }

    requestAnimationFrame(scrambleStep);
  }

  function onScrambleDone() {
    preloader.classList.add('show-sub');

    setTimeout(function () {
      preloader.classList.add('show-bar');
    }, 300);

    setTimeout(function () {
      preloader.classList.add('done');
      body.classList.remove('loading');
      body.classList.add('preloaded');

      setTimeout(function () {
        initAfterPreload();
      }, 100);
    }, 1800);
  }

  

  function initAfterPreload() {
    initRevealObserver();
    initSectionObserver();
    initScrollProgress();
    animateHeroChars();
    initTextScramble();
    initGlitchEffect();
    initShimmerEffect();
    initFloatingParallax();
    initSkillsWave();
    initTimelineInView();

    if (!isTouch && !prefersReduced && !isMobile) {
      initCursor();
      initMouseGlow();
      initCardTilt();
      initCompanion();
    }

    initMagnetic();
    initCounterAnimation();
    initLangBarObserver();
    initHeaderScroll();
    initScrollParallax();
    initFooterObserver();
    initScrollDrivenTransforms();
  }

  

  function animateHeroChars() {
    var charWraps = document.querySelectorAll('.hero .char-wrap');
    charWraps.forEach(function (wrap) {
      setTimeout(function () {
        wrap.classList.add('split');
      }, 400);
    });
  }

  

  function initCursor() {
    cursorEl.style.opacity = '1';

    document.addEventListener('mousemove', function (e) {
      mouseX = e.clientX;
      mouseY = e.clientY;
    }, { passive: true });

    document.addEventListener('mousedown', function () {
      if (cursorRing) cursorRing.classList.add('clicking');
    });

    document.addEventListener('mouseup', function () {
      if (cursorRing) cursorRing.classList.remove('clicking');
    });

    
    document.addEventListener('mouseover', function (e) {
      var target = e.target.closest('[data-cursor]');
      if (!target) {
        if (cursorRing) {
          cursorRing.classList.remove('hover-expand');
          cursorRing.classList.remove('hover-contract');
        }
        return;
      }

      var type = target.getAttribute('data-cursor');
      if (cursorRing) {
        cursorRing.classList.remove('hover-expand', 'hover-contract');
        if (type === 'pointer') {
          cursorRing.classList.add('hover-expand');
        } else if (type === 'text') {
          cursorRing.classList.add('hover-contract');
        }
      }
    });

    animateCursor();
  }

  function animateCursor() {
    
    cursorX += (mouseX - cursorX) * 0.15;
    cursorY += (mouseY - cursorY) * 0.15;

    
    smoothMouseX += (mouseX - smoothMouseX) * 0.06;
    smoothMouseY += (mouseY - smoothMouseY) * 0.06;

    if (cursorDot) {
      cursorDot.style.transform = 'translate(' + cursorX + 'px, ' + cursorY + 'px)';
    }

    if (cursorRing) {
      cursorRing.style.transform = 'translate(' + smoothMouseX + 'px, ' + smoothMouseY + 'px)';
    }

    rafId = requestAnimationFrame(animateCursor);
  }

  

  function initMouseGlow() {
    body.classList.add('glow-active');
    
  }

  function updateGlow() {
    if (!glowEl || isMobile) return;
    glowEl.style.left = smoothMouseX + 'px';
    glowEl.style.top = smoothMouseY + 'px';
  }

  

  function initScrollParallax() {
    window.addEventListener('scroll', onScrollParallax, { passive: true });
    onScrollParallax();
  }

  function onScrollParallax() {
    if (!scrollTicking) {
      requestAnimationFrame(function () {
        updateParallaxElements();
        updateGlow();
        scrollTicking = false;
      });
      scrollTicking = true;
    }
  }

  function updateParallaxElements() {
    var scrollY = window.pageYOffset || document.documentElement.scrollTop;
    var vh = window.innerHeight;

    
    var hero = document.querySelector('.hero');
    if (hero) {
      var heroRect = hero.getBoundingClientRect();
      var heroProgress = Math.max(0, Math.min(1, -heroRect.top / heroRect.height));
      var bgText = hero.querySelector('.hero-bg-text');
      if (bgText) {
        bgText.style.transform = 'translateX(' + (-heroProgress * 150) + 'px) scale(' + (1 + heroProgress * 0.1) + ')';
        bgText.style.opacity = Math.max(0, 1 - heroProgress * 2);
      }

      
      var gridLines = hero.querySelector('.hero-grid-lines');
      if (gridLines) {
        gridLines.style.opacity = Math.max(0, 1 - heroProgress * 3);
      }
    }

    
    document.querySelectorAll('[data-parallax]').forEach(function (el) {
      var speed = parseFloat(el.getAttribute('data-parallax'));
      var rect = el.getBoundingClientRect();
      var centerY = rect.top + rect.height / 2;
      var normalized = (centerY / vh - 0.5);
      var offset = normalized * speed * vh * 0.5;
      el.style.transform = 'translateY(' + offset + 'px)';
    });
  }

  

  function initRevealObserver() {
    if (!('IntersectionObserver' in window)) {
      reveals.forEach(function (el) { el.classList.add('visible'); });
      return;
    }

    var observer = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
          observer.unobserve(entry.target);
        }
      });
    }, {
      threshold: 0.12,
      rootMargin: '0px 0px -30px 0px'
    });

    reveals.forEach(function (el) {
      observer.observe(el);
    });
  }

  

  function initSectionObserver() {
    if (!('IntersectionObserver' in window)) {
      sections[0].classList.add('in-view');
      updateLabel(0);
      return;
    }

    var observer = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add('in-view');

          var idx = Array.prototype.indexOf.call(sections, entry.target);
          if (idx !== -1) {
            currentSectionIndex = idx;
            updateLabel(idx);
            updateDots(idx);
          }
        }
      });
    }, {
      threshold: 0.3
    });

    sections.forEach(function (section) {
      observer.observe(section);
    });

    updateLabel(0);
    updateDots(0);
  }

  function updateLabel(index) {
    var section = sections[index];
    if (!section) return;

    var label = section.getAttribute('data-label');
    if (!label) return;

    var num = String(index).padStart(2, '0');

    labelText.classList.add('fade-out');

    setTimeout(function () {
      labelText.textContent = label;
      labelIndex.textContent = num;
      labelText.classList.remove('fade-out');
    }, 250);
  }

  

  function createProgressDots() {
    sections.forEach(function (_, i) {
      var dot = document.createElement('div');
      dot.className = 'progress-dot';
      if (i === 0) dot.classList.add('active');

      dot.addEventListener('click', function () {
        sections[i].scrollIntoView({ behavior: 'smooth' });
      });

      progressDotsContainer.appendChild(dot);
    });
  }

  function updateDots(index) {
    var dots = progressDotsContainer.querySelectorAll('.progress-dot');
    dots.forEach(function (dot, i) {
      dot.classList.toggle('active', i === index);
    });
  }

  

  function initScrollProgress() {
    window.addEventListener('scroll', updateProgress, { passive: true });
    updateProgress();
  }

  function updateProgress() {
    var scrollTop = window.pageYOffset || document.documentElement.scrollTop;
    var docHeight = document.documentElement.scrollHeight - window.innerHeight;
    var progress = docHeight > 0 ? scrollTop / docHeight : 0;
    progressFill.style.transform = 'scaleY(' + Math.min(progress, 1) + ')';
  }

  

  function initCardTilt() {
    tiltElements.forEach(function (el) {
      el.addEventListener('mousemove', function (e) {
        var rect = el.getBoundingClientRect();
        var x = (e.clientX - rect.left) / rect.width;
        var y = (e.clientY - rect.top) / rect.height;

        var tiltX = (0.5 - y) * 10;
        var tiltY = (x - 0.5) * 10;

        el.style.transform =
          'perspective(900px) rotateX(' + tiltX + 'deg) rotateY(' + tiltY + 'deg) scale(1.015)';
      }, { passive: true });

      el.addEventListener('mouseleave', function () {
        el.style.transform = 'perspective(900px) rotateX(0) rotateY(0) scale(1)';
        el.style.transition = 'transform 0.6s cubic-bezier(0.34, 1.56, 0.64, 1)';
        setTimeout(function () {
          el.style.transition = '';
        }, 600);
      });

      el.addEventListener('mouseenter', function () {
        el.style.transition = '';
      });
    });
  }

  

  function initMagnetic() {
    magneticElements.forEach(function (el) {
      el.addEventListener('mousemove', function (e) {
        var rect = el.getBoundingClientRect();
        var x = e.clientX - rect.left - rect.width / 2;
        var y = e.clientY - rect.top - rect.height / 2;

        el.style.transform =
          'translate(' + (x * 0.3) + 'px, ' + (y * 0.3) + 'px)';
      }, { passive: true });

      el.addEventListener('mouseleave', function () {
        el.style.transform = 'translate(0, 0)';
        el.style.transition = 'transform 0.6s cubic-bezier(0.34, 1.56, 0.64, 1)';
        setTimeout(function () {
          el.style.transition = '';
        }, 600);
      });

      el.addEventListener('mouseenter', function () {
        el.style.transition = '';
      });
    });
  }

  

  function initCounterAnimation() {
    if (!('IntersectionObserver' in window)) {
      document.querySelectorAll('[data-count]').forEach(function (el) {
        el.textContent = el.getAttribute('data-count');
      });
      return;
    }

    var counterObserver = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          animateCounter(entry.target);
          counterObserver.unobserve(entry.target);
        }
      });
    }, { threshold: 0.5 });

    document.querySelectorAll('[data-count]').forEach(function (el) {
      counterObserver.observe(el);
    });
  }

  function animateCounter(el) {
    var target = parseInt(el.getAttribute('data-count'), 10);
    var duration = 1800;
    var startTime = null;

    function step(timestamp) {
      if (!startTime) startTime = timestamp;
      var elapsed = timestamp - startTime;
      var progress = Math.min(elapsed / duration, 1);

      
      var eased = progress === 1 ? 1 : 1 - Math.pow(2, -10 * progress);
      el.textContent = Math.round(eased * target);

      if (progress < 1) {
        requestAnimationFrame(step);
      } else {
        el.textContent = target;
      }
    }

    requestAnimationFrame(step);
  }

  

  function initLangBarObserver() {
    if (!('IntersectionObserver' in window)) {
      document.querySelectorAll('.lang-item').forEach(function (el) {
        el.classList.add('visible');
      });
      return;
    }

    var langObserver = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
          langObserver.unobserve(entry.target);
        }
      });
    }, { threshold: 0.3 });

    document.querySelectorAll('.lang-item').forEach(function (el) {
      langObserver.observe(el);
    });
  }

  

  function initHeaderScroll() {
    var scrollCue = document.getElementById('scrollCue');

    window.addEventListener('scroll', function () {
      var sy = window.scrollY;

      if (sy > 60) {
        header.classList.add('scrolled');
      } else {
        header.classList.remove('scrolled');
      }

      
      if (scrollCue) {
        if (sy > 80) {
          scrollCue.classList.add('hidden');
        } else {
          scrollCue.classList.remove('hidden');
        }
      }
    }, { passive: true });
  }

  

  function initTextScramble() {
    var scrambleChars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    var titles = document.querySelectorAll('[data-split]');

    titles.forEach(function (el) {
      var original = el.getAttribute('aria-label') || el.textContent;
      var isScrambling = false;

      el.addEventListener('mouseenter', function () {
        if (isScrambling || prefersReduced) return;
        isScrambling = true;
        el.classList.add('scrambling');

        var iteration = 0;
        var interval = setInterval(function () {
          el.textContent = original.split('').map(function (char, i) {
            if (char === ' ') return ' ';
            if (i < iteration) return char;
            return scrambleChars[Math.floor(Math.random() * scrambleChars.length)];
          }).join('');

          iteration += 1.5;

          if (iteration >= original.length) {
            clearInterval(interval);
            el.textContent = original;
            el.classList.remove('scrambling');
            isScrambling = false;
          }
        }, 30);
      });
    });
  }

  

  function initGlitchEffect() {
    if (prefersReduced) return;

    var heroName = document.querySelector('.hero-name');
    if (!heroName) return;

    function triggerGlitch() {
      heroName.classList.add('glitching');
      setTimeout(function () {
        heroName.classList.remove('glitching');
      }, 200);
    }

    
    function scheduleGlitch() {
      var delay = 4000 + Math.random() * 6000;
      setTimeout(function () {
        triggerGlitch();
        scheduleGlitch();
      }, delay);
    }

    setTimeout(scheduleGlitch, 5000);
  }

  

  function initShimmerEffect() {
    if (prefersReduced) return;

    var nameLines = document.querySelectorAll('.hero-name .name-line');
    if (!nameLines.length) return;

    
    setTimeout(function () {
      nameLines.forEach(function (line, i) {
        setTimeout(function () {
          line.classList.add('shimmer');
        }, i * 200);
      });
    }, 2000);

    
    setInterval(function () {
      nameLines.forEach(function (line, i) {
        line.classList.remove('shimmer');
        void line.offsetWidth; 
        setTimeout(function () {
          line.classList.add('shimmer');
        }, i * 150);
      });
    }, 8000);
  }

  

  function initFloatingParallax() {
    if (isTouch || isMobile || prefersReduced) return;

    var shapes = document.querySelectorAll('.float-shape');
    if (!shapes.length) return;

    
    var factors = [0.02, -0.015, 0.01, -0.025, 0.008, -0.012];

    function updateShapes() {
      var cx = mouseX - window.innerWidth / 2;
      var cy = mouseY - window.innerHeight / 2;

      shapes.forEach(function (shape, i) {
        var factor = factors[i % factors.length];
        var x = cx * factor * 100;
        var y = cy * factor * 100;
        shape.style.transform = 'translate(' + x + 'px, ' + y + 'px)' +
          (i === 1 ? ' rotate(45deg)' : '');
      });

      requestAnimationFrame(updateShapes);
    }

    updateShapes();
  }

  

  function initSkillsWave() {
    var grid = document.querySelector('.skills-grid');
    if (!grid) return;

    if (!('IntersectionObserver' in window)) {
      grid.classList.add('in-view');
      return;
    }

    var observer = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add('in-view');
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.15 });

    observer.observe(grid);
  }

  

  function initTimelineInView() {
    var timeline = document.querySelector('.timeline');
    if (!timeline) return;

    if (!('IntersectionObserver' in window)) {
      timeline.classList.add('in-view');
      return;
    }

    var observer = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add('in-view');
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.2 });

    observer.observe(timeline);
  }

  

  function initFooterObserver() {
    var footer = document.querySelector('.footer');
    if (!footer) return;

    if (!('IntersectionObserver' in window)) {
      footer.classList.add('in-view');
      return;
    }

    var observer = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add('in-view');
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.3 });

    observer.observe(footer);
  }

  

  function initScrollDrivenTransforms() {
    var scrollElements = document.querySelectorAll('[data-scroll-y]');
    if (!scrollElements.length && !document.querySelector('.section-number')) return;

    var sectionNumbers = document.querySelectorAll('.section-number');
    var lastScrollY = 0;
    var ticking = false;

    function onScrollDrive() {
      lastScrollY = window.pageYOffset || document.documentElement.scrollTop;

      if (!ticking) {
        requestAnimationFrame(function () {
          updateScrollDriveElements(lastScrollY);
          ticking = false;
        });
        ticking = true;
      }
    }

    function updateScrollDriveElements(scrollY) {
      var vh = window.innerHeight;

      
      sectionNumbers.forEach(function (num) {
        var rect = num.getBoundingClientRect();
        var centerY = rect.top + rect.height / 2;
        var distFromCenter = Math.abs(centerY - vh / 2);
        var maxDist = vh / 2;
        var progress = 1 - Math.min(distFromCenter / maxDist, 1);
        var scale = 0.85 + progress * 0.25;
        var opacity = 0.3 + progress * 0.7;
        num.style.transform = 'scale(' + scale + ')';
        num.style.opacity = opacity;
      });

      
      scrollElements.forEach(function (el) {
        var speed = parseFloat(el.getAttribute('data-scroll-y')) || 0.1;
        var rect = el.getBoundingClientRect();
        var elCenter = rect.top + rect.height / 2;
        var offset = (elCenter - vh / 2) * speed;
        el.style.transform = 'translateY(' + offset + 'px)';
      });
    }

    window.addEventListener('scroll', onScrollDrive, { passive: true });
    updateScrollDriveElements(lastScrollY);
  }

  

  function initCompanion() {
    var svgEl = document.getElementById('companionSvg');
    var pathEl = document.getElementById('companionPath');
    var objEl = document.getElementById('companionObject');
    var polyEl = document.getElementById('companionPolygon');
    if (!svgEl || !pathEl || !objEl || !polyEl) return;
    if (isTouch || isMobile || prefersReduced) return;

    var PTS = 32;
    var SHAPE_R = 10;
    var K = 0.045;
    var DAMP = 0.85;
    var ROT_K = 0.04;
    var SCALE_K = 0.03;

    var totalLen = 0;
    var built = false;
    var didDraw = false;
    var curX = window.innerWidth / 2, curY = 20;
    var vX = 0, vY = 0;
    var curRot = 0, tgtRot = 0;
    var curSc = 0.3, tgtSc = 1;

    var SIDES = [32, 4, 6, 3, 5, 8, 32];
    var shapeCache = SIDES.map(function (s) { return genShape(s, SHAPE_R); });

    function genShape(sides, r) {
      var pts = [];
      for (var i = 0; i < PTS; i++) {
        var a = (2 * Math.PI * i) / PTS - Math.PI / 2;
        var rad = r;
        if (sides < 32) {
          var seg = (2 * Math.PI) / sides;
          var half = seg / 2;
          var loc = ((a % seg) + seg) % seg;
          rad = r * Math.cos(half) / Math.cos(loc - half);
        }
        pts.push({ x: rad * Math.cos(a), y: rad * Math.sin(a) });
      }
      return pts;
    }

    function mix(a, b, t) {
      var o = [];
      for (var i = 0; i < a.length; i++) {
        o.push({ x: a[i].x + (b[i].x - a[i].x) * t, y: a[i].y + (b[i].y - a[i].y) * t });
      }
      return o;
    }

    function ease(t) { return t < 0.5 ? 2 * t * t : -1 + (4 - 2 * t) * t; }

    function buildPath() {
      var secs = document.querySelectorAll('.section');
      if (!secs.length) return;

      var vw = window.innerWidth;
      var vh = window.innerHeight;
      var docH = document.documentElement.scrollHeight;
      if (docH < vh) return;

      svgEl.setAttribute('viewBox', '0 0 ' + vw + ' ' + vh);

      var maxW = 1100;
      var half = Math.min(vw, maxW) / 2;
      var cx = vw / 2;
      var lx = Math.max(cx - half - 30, vw * 0.04);
      var rx = Math.min(cx + half + 30, vw * 0.96);

      var wp = [{ x: cx, y: 0 }];

      var arr = Array.prototype.slice.call(secs);
      for (var i = 0; i < arr.length; i++) {
        var mid = arr[i].offsetTop + arr[i].offsetHeight / 2;
        wp.push({ x: i % 2 === 0 ? lx : rx, y: mid });
      }

      wp.push({ x: cx, y: docH });

      var d = 'M ' + wp[0].x + ' ' + wp[0].y;
      for (var i = 0; i < wp.length - 1; i++) {
        var p0 = wp[i], p3 = wp[i + 1];
        var dy = p3.y - p0.y;
        var c1x, c1y, c2x, c2y;
        if (i === 0 || i === wp.length - 2) {
          c1x = p0.x + (p3.x - p0.x) * 0.12;
          c1y = p0.y + dy * 0.6;
          c2x = p3.x - (p3.x - p0.x) * 0.12;
          c2y = p3.y - dy * 0.6;
        } else {
          c1x = p0.x;
          c1y = p0.y + dy * 0.4;
          c2x = p3.x;
          c2y = p3.y - dy * 0.4;
        }
        d += ' C ' + c1x + ',' + c1y + ' ' + c2x + ',' + c2y + ' ' + p3.x + ',' + p3.y;
      }

      pathEl.setAttribute('d', d);
      totalLen = pathEl.getTotalLength();

      if (didDraw) {
        pathEl.style.transition = 'none';
        pathEl.style.strokeDashoffset = '0';
      } else {
        pathEl.style.strokeDasharray = totalLen;
        pathEl.style.strokeDashoffset = totalLen;
      }

      built = true;
    }

    function drawPath() {
      void pathEl.offsetWidth;
      pathEl.style.transition = 'stroke-dashoffset 1.5s cubic-bezier(0.16,1,0.3,1)';
      pathEl.style.strokeDashoffset = '0';
      didDraw = true;
    }

    function getShape(prog) {
      var n = SIDES.length;
      var sp = prog * (n - 1);
      var idx = Math.min(Math.floor(sp), n - 2);
      var w = sp - Math.floor(sp);
      if (w > 0.5 && idx < n - 1) {
        return mix(shapeCache[idx], shapeCache[idx + 1], ease((w - 0.5) / 0.5));
      }
      return shapeCache[Math.max(0, idx)];
    }

    function tick() {
      if (!built || totalLen < 1) { requestAnimationFrame(tick); return; }

      var st = window.pageYOffset || document.documentElement.scrollTop;
      var maxScroll = document.documentElement.scrollHeight - window.innerHeight;
      var prog = maxScroll > 0 ? Math.max(0, Math.min(1, st / maxScroll)) : 0;

      svgEl.style.transform = 'translateY(' + (-st) + 'px)';

      var len = prog * totalLen;
      var pt = pathEl.getPointAtLength(len);

      var tx = pt.x;
      var ty = pt.y - st;

      var delta = 3;
      var pa = pathEl.getPointAtLength(Math.max(0, len - delta));
      var pb = pathEl.getPointAtLength(Math.min(totalLen, len + delta));
      tgtRot = Math.atan2(pb.y - pa.y, pb.x - pa.x) * (180 / Math.PI);

      tgtSc = 1 + Math.sin(prog * Math.PI * 6) * 0.15;

      vX += (tx - curX) * K;
      vY += (ty - curY) * K;
      vX *= DAMP;
      vY *= DAMP;
      curX += vX;
      curY += vY;

      var rd = tgtRot - curRot;
      if (rd > 180) rd -= 360;
      if (rd < -180) rd += 360;
      curRot += rd * ROT_K;

      curSc += (tgtSc - curSc) * SCALE_K;

      objEl.style.transform =
        'translate(' + (curX - 16) + 'px,' + (curY - 16) + 'px)' +
        ' rotate(' + curRot.toFixed(1) + 'deg)' +
        ' scale(' + curSc.toFixed(3) + ')';

      var sh = getShape(prog);
      var s = '';
      for (var i = 0; i < sh.length; i++) {
        if (i) s += ' ';
        s += sh[i].x.toFixed(2) + ',' + sh[i].y.toFixed(2);
      }
      polyEl.setAttribute('points', s);

      requestAnimationFrame(tick);
    }

    buildPath();
    drawPath();
    tick();

    var rt;
    window.addEventListener('resize', function () {
      clearTimeout(rt);
      rt = setTimeout(buildPath, 200);
    });
  }

  

  function setLanguageFillWidths() {
    langFills.forEach(function (el) {
      var width = el.getAttribute('data-width');
      el.style.setProperty('--fill', width);
    });
  }

  

  document.addEventListener('click', function (e) {
    var link = e.target.closest('a[href^="#"]');
    if (!link) return;

    var targetId = link.getAttribute('href');
    if (targetId === '#') return;

    var targetEl = document.querySelector(targetId);
    if (!targetEl) return;

    e.preventDefault();
    targetEl.scrollIntoView({ behavior: 'smooth', block: 'start' });
  });

  

  var resizeTimer;
  window.addEventListener('resize', function () {
    clearTimeout(resizeTimer);
    resizeTimer = setTimeout(function () {
      isMobile = window.innerWidth < 640;
    }, 200);
  });

  

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }

})();


