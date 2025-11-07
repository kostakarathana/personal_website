// Scroll-based Navigation and Mobile Menu Functionality
document.addEventListener('DOMContentLoaded', function() {
    // Get all navigation elements
    const navLinks = document.querySelectorAll('.nav-link');
    const sections = document.querySelectorAll('.section');
    const hamburger = document.querySelector('.hamburger');
    const navMenu = document.querySelector('.nav-menu');

    // Smooth scroll to section
    function scrollToSection(targetId) {
        const targetSection = document.getElementById(targetId);
        if (targetSection) {
            const navbarHeight = 70;
            const targetPosition = targetSection.offsetTop - navbarHeight;
            
            window.scrollTo({
                top: targetPosition,
                behavior: 'smooth'
            });
        }
        
        // Close mobile menu if open
        navMenu.classList.remove('active');
    }

    // Add click event listeners to navigation links
    navLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            const targetId = this.getAttribute('data-tab');
            scrollToSection(targetId);
        });
    });

    // Update active navigation link based on scroll position
    function updateActiveNavLink() {
        const scrollPos = window.scrollY + 100; // Offset for navbar
        
        navLinks.forEach(link => {
            link.classList.remove('current');
        });
        
        // Find the section currently in view
        let currentSection = '';
        sections.forEach(section => {
            const sectionTop = section.offsetTop - 100;
            const sectionBottom = sectionTop + section.offsetHeight;
            
            if (scrollPos >= sectionTop && scrollPos < sectionBottom) {
                currentSection = section.getAttribute('id');
            }
        });
        
        // Highlight the corresponding nav link
        if (currentSection) {
            const currentNavLink = document.querySelector(`[data-tab="${currentSection}"]`);
            if (currentNavLink) {
                currentNavLink.classList.add('current');
            }
        }
    }

    // Listen for scroll events
    window.addEventListener('scroll', updateActiveNavLink);
    
    // Initial call to set active link on page load
    updateActiveNavLink();

    // Mobile hamburger menu toggle
    if (hamburger) {
        hamburger.addEventListener('click', function() {
            navMenu.classList.toggle('active');
        });
    }

    // Close mobile menu when clicking outside
    document.addEventListener('click', function(e) {
        if (hamburger && navMenu && !hamburger.contains(e.target) && !navMenu.contains(e.target)) {
            navMenu.classList.remove('active');
        }
    });

    // Handle initial hash in URL
    if (window.location.hash) {
        const initialSection = window.location.hash.slice(1);
    const validSections = ['home', 'projects', 'experience', 'education', 'coursework', 'tech-stack', 'awards'];
        if (validSections.includes(initialSection)) {
            setTimeout(() => {
                scrollToSection(initialSection);
            }, 100);
        }
    }

    // Add scroll effect to navbar
    const navbar = document.querySelector('.navbar');
    
    window.addEventListener('scroll', function() {
        const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
        
        // Add/remove shadow based on scroll position
        if (scrollTop > 10) {
            navbar.style.boxShadow = '0 2px 20px rgba(0,0,0,0.1)';
        } else {
            navbar.style.boxShadow = '0 1px 3px rgba(0,0,0,0.1)';
        }
        
        // Handle scroll animations
        handleScrollAnimations();
    });

    // Scroll Animation Handler
    function handleScrollAnimations() {
        const scrollElements = document.querySelectorAll('.scroll-animate, .scroll-animate-left, .scroll-animate-right, .scroll-animate-scale, .scroll-animate-bounce');
        
        scrollElements.forEach(element => {
            const elementTop = element.getBoundingClientRect().top;
            const elementVisible = 150;
            
            if (elementTop < window.innerHeight - elementVisible) {
                element.classList.add('animate-in');
            }
        });
    }

    // Initial check for elements already in view
    handleScrollAnimations();

    // Simple Search Functionality
    const searchInput = document.getElementById('searchInput');
    const searchControls = document.getElementById('searchControls');
    const prevBtn = document.getElementById('prevBtn');
    const nextBtn = document.getElementById('nextBtn');
    const searchCounter = document.getElementById('searchCounter');
    
    let currentMatches = [];
    let currentMatchIndex = -1;

    function performSearch() {
        const searchTerm = searchInput.value; // Keep original spacing and case
        
        // Clear previous highlights
        clearHighlights();
        
        if (searchTerm.length === 0) {
            searchControls.style.display = 'none';
            return;
        }

        // Find all text elements containing the exact search term (case-insensitive)
        currentMatches = [];
        const allTextElements = document.querySelectorAll('*:not(script):not(style):not(nav):not(.search-container *)');
        
        allTextElements.forEach(element => {
            // Only check leaf elements (no child elements)
            if (element.children.length === 0) {
                const elementText = element.textContent;
                
                // Check if the search term exists as-is in the text (case-insensitive)
                if (elementText.toLowerCase().includes(searchTerm.toLowerCase())) {
                    currentMatches.push(element);
                }
            }
        });

        if (currentMatches.length > 0) {
            currentMatchIndex = 0;
            highlightCurrentMatch();
            showControls();
            scrollToCurrentMatch();
        } else {
            searchControls.style.display = 'none';
        }
    }

    function clearHighlights() {
        document.querySelectorAll('.search-active').forEach(el => {
            el.classList.remove('search-active');
        });
    }

    function highlightCurrentMatch() {
        clearHighlights();
        if (currentMatchIndex >= 0 && currentMatchIndex < currentMatches.length) {
            currentMatches[currentMatchIndex].classList.add('search-active');
        }
    }

    function showControls() {
        searchControls.style.display = 'flex';
        updateCounter();
    }

    function updateCounter() {
        searchCounter.textContent = `${currentMatchIndex + 1}/${currentMatches.length}`;
        prevBtn.disabled = currentMatchIndex <= 0;
        nextBtn.disabled = currentMatchIndex >= currentMatches.length - 1;
    }

    function scrollToCurrentMatch() {
        if (currentMatchIndex >= 0 && currentMatchIndex < currentMatches.length) {
            const element = currentMatches[currentMatchIndex];
            element.scrollIntoView({
                behavior: 'smooth',
                block: 'center'
            });
        }
    }

    function goToNext() {
        if (currentMatchIndex < currentMatches.length - 1) {
            currentMatchIndex++;
            highlightCurrentMatch();
            updateCounter();
            scrollToCurrentMatch();
        }
    }

    function goToPrevious() {
        if (currentMatchIndex > 0) {
            currentMatchIndex--;
            highlightCurrentMatch();
            updateCounter();
            scrollToCurrentMatch();
        }
    }

    // Event listeners
    searchInput.addEventListener('input', performSearch);
    nextBtn.addEventListener('click', goToNext);
    prevBtn.addEventListener('click', goToPrevious);

    // Keyboard shortcuts
    document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape') {
            searchInput.value = '';
            clearHighlights();
            searchControls.style.display = 'none';
        }
        
        if (e.key === 'Enter' && document.activeElement === searchInput && currentMatches.length > 0) {
            e.preventDefault();
            if (e.shiftKey) {
                goToPrevious();
            } else {
                goToNext();
            }
        }
    });

    // Console message for developers
    console.log('🚀 Kosta\'s Personal Website Loaded Successfully!');
    console.log('💼 Single-page portfolio with smooth scroll navigation');
    console.log('🔍 Search functionality enabled - try searching for skills!');
    console.log('📫 Contact: kostakarathanasopoulos@gmail.com');

    // Hex-encoded name mouse trail effect
    let lastTrailTime = 0;
    const trailInterval = 45;
    const trailPalette = ['#5eead4', '#34d399', '#22d3ee', '#a7f3d0'];

    const nameBits = [
        '01001011', // K
        '01101111', // o
        '01110011', // s
        '01110100', // t
        '01100001'  // a
    ];
    let bitIndex = 0;
    let lastMousePosition = null;
    let lastPerpendicularAngle = 90;
    let scrollBoost = 0;
    let lastScrollMetrics = {
        y: window.scrollY,
        time: performance.now()
    };
    let effectsActive = true;

    const effectsToggle = document.getElementById('effectsToggle');
    const rootElement = document.documentElement;
    const EGG_IMAGE_PATH = 'photos/easterEgg.png';
    let easterEggElements = [];
    let lastChromaticFilter = 'none';

    rootElement.style.setProperty('--theme-filter', 'none');

    function randomFloat(min, max) {
        return Math.random() * (max - min) + min;
    }

    function debounce(callback, wait = 220) {
        let timeoutId;
        return (...args) => {
            clearTimeout(timeoutId);
            timeoutId = setTimeout(() => {
                callback.apply(null, args);
            }, wait);
        };
    }

    function applyRandomChromaticShift() {
        let filterValue = lastChromaticFilter;
        let attempts = 0;

        while (filterValue === lastChromaticFilter && attempts < 8) {
            const invertChoice = Math.random() < 0.55 ? 1 : 0;
            const hue = Math.floor(Math.random() * 360);
            const saturate = randomFloat(1.05, 1.85).toFixed(2);
            const contrast = randomFloat(invertChoice ? 1.15 : 1.25, invertChoice ? 1.6 : 1.7).toFixed(2);
            const brightnessRange = invertChoice ? [0.92, 1.28] : [0.78, 1.18];
            const brightness = randomFloat(brightnessRange[0], brightnessRange[1]).toFixed(2);
            const sepiaAmount = randomFloat(0, 0.28);
            const sepia = sepiaAmount > 0.08 ? ` sepia(${sepiaAmount.toFixed(2)})` : '';
            const grayscaleAmount = randomFloat(0, 0.18);
            const grayscale = grayscaleAmount > 0.06 ? ` grayscale(${grayscaleAmount.toFixed(2)})` : '';

            const invertSegment = invertChoice ? 'invert(1) ' : '';
            filterValue = `${invertSegment}hue-rotate(${hue}deg) saturate(${saturate}) contrast(${contrast}) brightness(${brightness})${sepia}${grayscale}`.trim();
            attempts += 1;
        }

        lastChromaticFilter = filterValue;
        rootElement.style.setProperty('--theme-filter', filterValue);
    }

    function destroyEasterEggs() {
        easterEggElements.forEach(egg => egg.remove());
        easterEggElements = [];
    }

    const EGG_PLACEMENTS = [
        {
            selector: '.project-card:nth-of-type(1)',
            anchor: 'top-left',
            offset: { x: -14, y: -12 },
            minWidth: 700,
            drift: {
                x: [2.5, 5.5],
                y: [4.5, 9],
                rotation: [-6, 6],
                duration: [7, 10]
            }
        },
        {
            selector: '.project-card:nth-of-type(4)',
            anchor: 'bottom-right',
            offset: { x: -12, y: -18 },
            minWidth: 860,
            drift: {
                x: [2, 5],
                y: [3.5, 8],
                rotation: [-8, 5],
                duration: [6.5, 9.5]
            }
        },
        {
            selector: '.experience-item:nth-of-type(2)',
            anchor: 'top-right',
            offset: { x: -16, y: -6 },
            minWidth: 680,
            drift: {
                x: [2.5, 6],
                y: [4, 8.5],
                rotation: [-9, 7],
                duration: [7, 10]
            }
        },
        {
            selector: '.coursework-card:nth-of-type(2)',
            anchor: 'top-right',
            offset: { x: -14, y: -14 },
            minWidth: 720,
            drift: {
                x: [2.5, 5.5],
                y: [4.5, 9.5],
                rotation: [-7, 6],
                duration: [7.5, 10.5]
            }
        },
        {
            selector: '.skills-category:nth-of-type(3)',
            anchor: 'top-left',
            offset: { x: -16, y: -14 },
            minWidth: 780,
            drift: {
                x: [2, 4.5],
                y: [3.5, 7.5],
                rotation: [-5, 5],
                duration: [6.5, 9]
            }
        },
        {
            selector: '.skills-category:nth-of-type(1)',
            anchor: 'bottom-left',
            offset: { x: -14, y: -10 },
            maxWidth: 699,
            drift: {
                x: [2, 4],
                y: [3.5, 7],
                rotation: [-6, 6],
                duration: [6.5, 9]
            }
        },
        {
            selector: '.experience-item:nth-of-type(1)',
            anchor: 'bottom-right',
            offset: { x: -14, y: -16 },
            maxWidth: 699,
            drift: {
                x: [2, 4.5],
                y: [3.5, 7],
                rotation: [-7, 5],
                duration: [6.5, 9]
            }
        },
        {
            selector: '.award-item:nth-of-type(2)',
            anchor: 'top-right',
            offset: { x: -12, y: -10 },
            minWidth: 880,
            drift: {
                x: [2, 4],
                y: [3, 7],
                rotation: [-5, 6],
                duration: [6.5, 9]
            }
        }
    ];

    function getAnchorPoint(rect, anchor = 'top-left') {
        switch (anchor) {
            case 'top-left':
                return { x: rect.left, y: rect.top };
            case 'top-right':
                return { x: rect.right, y: rect.top };
            case 'bottom-left':
                return { x: rect.left, y: rect.bottom };
            case 'bottom-right':
                return { x: rect.right, y: rect.bottom };
            case 'middle-right':
                return { x: rect.right, y: rect.top + rect.height / 2 };
            case 'middle-left':
                return { x: rect.left, y: rect.top + rect.height / 2 };
            case 'bottom-center':
                return { x: rect.left + rect.width / 2, y: rect.bottom };
            default:
                return { x: rect.left, y: rect.top };
        }
    }

    function configureEggAnimation(egg, driftConfig) {
        const drift = driftConfig || {};
        const driftX = drift.x || [2.5, 6];
        const driftY = drift.y || [4, 9];
        const driftRotation = drift.rotation || [-6, 6];
        const driftDuration = drift.duration || [7, 11];

        egg.style.setProperty('--egg-drift-x', `${randomFloat(driftX[0], driftX[1]).toFixed(2)}px`);
        egg.style.setProperty('--egg-drift-y', `${randomFloat(driftY[0], driftY[1]).toFixed(2)}px`);
        egg.style.setProperty('--egg-rotation', `${randomFloat(driftRotation[0], driftRotation[1]).toFixed(2)}deg`);
        egg.style.setProperty('--egg-drift-duration', `${randomFloat(driftDuration[0], driftDuration[1]).toFixed(2)}s`);
    }

    function createEasterEgg(config) {
        const target = document.querySelector(config.selector);
        if (!target) {
            return null;
        }

        const rect = target.getBoundingClientRect();
        const anchorPoint = getAnchorPoint(rect, config.anchor);
        if (!anchorPoint) {
            return null;
        }

    const offsetX = config.offset?.x || 0;
    const offsetY = config.offset?.y || 0;
    const scrollX = window.scrollX || window.pageXOffset;
    const scrollY = window.scrollY || window.pageYOffset;
    const left = anchorPoint.x + scrollX + offsetX;
    const top = anchorPoint.y + scrollY + offsetY;

        const egg = document.createElement('button');
        egg.type = 'button';
        egg.className = 'easter-egg';
        egg.setAttribute('aria-label', 'Trigger a chromatic shift');
        egg.style.left = `${left}px`;
        egg.style.top = `${top}px`;

        configureEggAnimation(egg, config.drift);

        const eggImage = document.createElement('img');
        eggImage.src = EGG_IMAGE_PATH;
        eggImage.alt = 'Decorative easter egg';
        egg.appendChild(eggImage);

        egg.addEventListener('click', event => {
            event.preventDefault();
            if (!effectsActive) {
                setEffectsActive(true);
            }
            rootElement.removeAttribute('data-theme-mode');
            applyRandomChromaticShift();
        });

        return egg;
    }

    function placeEasterEggs() {
        destroyEasterEggs();
        if (!effectsActive) {
            return;
        }

        EGG_PLACEMENTS.forEach(config => {
            if (config.minWidth && window.innerWidth < config.minWidth) {
                return;
            }
            if (config.maxWidth && window.innerWidth > config.maxWidth) {
                return;
            }

            const egg = createEasterEgg(config);
            if (egg) {
                document.body.appendChild(egg);
                easterEggElements.push(egg);
            }
        });
    }

    const debouncedRepositionEggs = debounce(() => {
        if (effectsActive) {
            placeEasterEggs();
        }
    }, 240);

    function setEffectsActive(isActive) {
        effectsActive = isActive;
        document.body.classList.toggle('effects-disabled', !isActive);

        if (effectsToggle) {
            effectsToggle.textContent = isActive ? 'Remove Special Effects' : 'Restore Special Effects';
            effectsToggle.setAttribute('aria-pressed', (!isActive).toString());
        }

        if (!isActive) {
            scrollBoost = 0;
            document.querySelectorAll('.binary-trail').forEach(el => el.remove());
            lastChromaticFilter = 'none';
            rootElement.style.setProperty('--theme-filter', 'none');
            rootElement.setAttribute('data-theme-mode', 'default');
            destroyEasterEggs();
        } else {
            requestAnimationFrame(() => {
                placeEasterEggs();
            });
        }
    }

    if (effectsToggle) {
        effectsToggle.addEventListener('click', () => {
            setEffectsActive(!effectsActive);
        });
    }

    setEffectsActive(true);
    window.addEventListener('resize', debouncedRepositionEggs);
    window.addEventListener('orientationchange', debouncedRepositionEggs);
    window.addEventListener('load', () => {
        if (effectsActive) {
            placeEasterEggs();
        }
    });

    window.addEventListener('scroll', () => {
        const now = performance.now();
        const deltaY = window.scrollY - lastScrollMetrics.y;
        const deltaTime = now - lastScrollMetrics.time || 16;
        const scrollVelocity = Math.abs(deltaY) / Math.max(deltaTime, 1);
        scrollBoost = Math.min(scrollVelocity * 0.35, 1.6);
        lastScrollMetrics = {
            y: window.scrollY,
            time: now
        };
    });

    document.addEventListener('mousemove', event => {
        const now = performance.now();
        const currentX = event.clientX;
        const currentY = event.clientY;

        let angleDeg = lastPerpendicularAngle;
        let motionScale = 1;

        if (lastMousePosition) {
            const dx = currentX - lastMousePosition.x;
            const dy = currentY - lastMousePosition.y;
            const distance = Math.hypot(dx, dy);
            const deltaTime = now - lastMousePosition.time || 16;

            if (distance > 0.5) {
                const perpendicularAngle = Math.atan2(dy, dx) + Math.PI / 2;
                angleDeg = perpendicularAngle * (180 / Math.PI);
                lastPerpendicularAngle = angleDeg;
            }

            const velocity = distance / Math.max(deltaTime, 1);
            motionScale = 1 + Math.min(velocity * 0.25, 1.2);
        }

        const newPosition = {
            x: currentX,
            y: currentY,
            time: now
        };

        if (!effectsActive) {
            lastMousePosition = newPosition;
            return;
        }

        if (now - lastTrailTime < trailInterval) {
            lastMousePosition = newPosition;
            return;
        }
        lastTrailTime = now;
        lastMousePosition = newPosition;

        const trail = document.createElement('span');
        trail.className = 'binary-trail';
        trail.textContent = nameBits[bitIndex];
        bitIndex = (bitIndex + 1) % nameBits.length;
        trail.style.left = `${currentX}px`;
        trail.style.top = `${currentY}px`;
        trail.style.color = trailPalette[Math.floor(Math.random() * trailPalette.length)];

        const boostedScale = (motionScale + scrollBoost).toFixed(2);
        scrollBoost *= 0.85;

        trail.style.setProperty('--trail-rotation', `${angleDeg}deg`);
        trail.style.setProperty('--trail-scale', boostedScale);

        document.body.appendChild(trail);

        setTimeout(() => {
            trail.remove();
        }, 1600);
    });

    // Jigsaw Puzzle Functionality
    let draggedPiece = null;
    let dragOffset = { x: 0, y: 0 };
    let puzzleActive = false;
    let activePuzzleCards = [];

    function initializePuzzle() {
        const projectsContainer = document.querySelector('.projects-container');
        const projectsGrid = document.querySelector('.projects-grid');
        const puzzleCandidates = Array.from(document.querySelectorAll('.project-card')).filter(card => !card.classList.contains('no-puzzle'));
        const puzzleSlots = document.querySelectorAll('.puzzle-slot');
        const slotCount = puzzleSlots.length || puzzleCandidates.length;
        const projectCards = puzzleCandidates.slice(0, slotCount);
        
        if (!projectsContainer || !projectsGrid || !projectCards.length) return;

        // Only activate puzzle if effects are enabled
        const effectsToggle = document.getElementById('effects-toggle');
        if (!effectsToggle || !effectsToggle.checked) return;

        puzzleActive = true;
        activePuzzleCards = projectCards;
        projectsContainer.classList.add('puzzle-mode');
        if (projectsGrid) {
            projectsGrid.classList.add('puzzle-mode');
        }

        projectCards.forEach((card, index) => {
            card.classList.add('puzzle-piece');
            card.classList.add(`puzzle-piece-${index + 1}`);
            card.setAttribute('data-piece-index', index);
            card.setAttribute('data-placed', 'false');
            
            // Set initial scattered positions using CSS classes (they're already defined)
            // Remove any inline transforms first
            card.style.transform = '';
            card.style.position = 'absolute';
            
            // Add drag event listeners
            card.addEventListener('mousedown', startDrag);
            card.addEventListener('touchstart', startDrag, { passive: false });
        });

        // Add global event listeners for dragging
        document.addEventListener('mousemove', handleDrag);
        document.addEventListener('mouseup', endDrag);
        document.addEventListener('touchmove', handleDrag, { passive: false });
        document.addEventListener('touchend', endDrag);
    }

    function startDrag(e) {
        if (!puzzleActive) return;
        
        e.preventDefault();
        draggedPiece = e.currentTarget;
        draggedPiece.classList.add('dragging');
        
        const rect = draggedPiece.getBoundingClientRect();
        const clientX = e.type === 'mousedown' ? e.clientX : e.touches[0].clientX;
        const clientY = e.type === 'mousedown' ? e.clientY : e.touches[0].clientY;
        
        dragOffset.x = clientX - rect.left;
        dragOffset.y = clientY - rect.top;
        
        // Bring to front
        draggedPiece.style.zIndex = '1000';
    }

    function handleDrag(e) {
        if (!draggedPiece || !puzzleActive) return;
        
        e.preventDefault();
        const clientX = e.type === 'mousemove' ? e.clientX : e.touches[0].clientX;
        const clientY = e.type === 'mousemove' ? e.clientY : e.touches[0].clientY;
        
        const x = clientX - dragOffset.x;
        const y = clientY - dragOffset.y;
        
        draggedPiece.style.left = `${x}px`;
        draggedPiece.style.top = `${y}px`;
        draggedPiece.style.transform = 'none';
    }

    function endDrag(e) {
        if (!draggedPiece || !puzzleActive) return;
        
        const piece = draggedPiece;
        const pieceIndex = parseInt(piece.getAttribute('data-piece-index'));
        
        // Check if piece is close to its correct position
        const correctSlot = document.querySelector(`.puzzle-slot[data-slot-index="${pieceIndex}"]`);
        if (correctSlot && isNearSlot(piece, correctSlot)) {
            snapToSlot(piece, correctSlot);
        }
        
        piece.classList.remove('dragging');
        piece.style.zIndex = '';
        draggedPiece = null;
        
        // Check if puzzle is complete
        checkPuzzleComplete();
    }

    function isNearSlot(piece, slot) {
        const pieceRect = piece.getBoundingClientRect();
        const slotRect = slot.getBoundingClientRect();
        
        const centerDistance = Math.sqrt(
            Math.pow(pieceRect.left + pieceRect.width / 2 - slotRect.left - slotRect.width / 2, 2) +
            Math.pow(pieceRect.top + pieceRect.height / 2 - slotRect.top - slotRect.height / 2, 2)
        );
        
        return centerDistance < 80; // Snap distance
    }

    function snapToSlot(piece, _slot) {
        // Add the puzzle-placed class which positions the piece correctly via CSS
        piece.setAttribute('data-placed', 'true');
        piece.classList.add('puzzle-placed');
        
        // Clear any manual positioning
        piece.style.left = '';
        piece.style.top = '';
        piece.style.transform = '';
        
        // Add satisfying snap effect
        piece.style.animation = 'puzzleSnap 0.3s ease-out';
        setTimeout(() => {
            piece.style.animation = '';
        }, 300);
    }

    function checkPuzzleComplete() {
        if (!activePuzzleCards.length) return;

        const allPlaced = activePuzzleCards.every(card => card.getAttribute('data-placed') === 'true');

        if (allPlaced) {
            // Puzzle complete! Add celebration effect
            setTimeout(() => {
                const projectsContainer = document.querySelector('.projects-container');
                if (projectsContainer) {
                    projectsContainer.classList.add('puzzle-complete');
                }
                
                // Reset puzzle after celebration
                setTimeout(() => {
                    resetPuzzle();
                }, 2000);
            }, 500);
        }
    }

    function resetPuzzle() {
        const projectsContainer = document.querySelector('.projects-container');
        const projectsGrid = document.querySelector('.projects-grid');
        const projectCards = activePuzzleCards.length ? activePuzzleCards : Array.from(document.querySelectorAll('.project-card')).filter(card => !card.classList.contains('no-puzzle'));
        
        if (projectsContainer) {
            projectsContainer.classList.remove('puzzle-mode', 'puzzle-complete');
        }
        if (projectsGrid) projectsGrid.classList.remove('puzzle-mode');
        
        projectCards.forEach((card, index) => {
            // Remove puzzle classes
            card.classList.remove('puzzle-piece', 'placed', 'dragging', `puzzle-piece-${index + 1}`, 'puzzle-placed');
            card.setAttribute('data-placed', 'false');
            
            // Reset styles
            card.style.left = '';
            card.style.top = '';
            card.style.transform = '';
            card.style.zIndex = '';
            card.style.animation = '';
            card.style.position = '';
            
            // Remove event listeners
            card.removeEventListener('mousedown', startDrag);
            card.removeEventListener('touchstart', startDrag);
        });
        
        // Remove global event listeners
        document.removeEventListener('mousemove', handleDrag);
        document.removeEventListener('mouseup', endDrag);
        document.removeEventListener('touchmove', handleDrag);
        document.removeEventListener('touchend', endDrag);
        
        puzzleActive = false;
        activePuzzleCards = [];
    }

    // Initialize puzzle when effects are toggled on
    const puzzleEffectsToggle = document.getElementById('effects-toggle');
    if (puzzleEffectsToggle) {
        puzzleEffectsToggle.addEventListener('change', function() {
            if (this.checked) {
                // Delay puzzle initialization to let animations settle
                setTimeout(initializePuzzle, 1000);
            } else {
                resetPuzzle();
            }
        });
    }

    // Initialize puzzle if effects are already enabled on page load
    if (puzzleEffectsToggle && puzzleEffectsToggle.checked) {
        setTimeout(initializePuzzle, 1500);
    }
});