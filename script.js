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
        if (!hamburger.contains(e.target) && !navMenu.contains(e.target)) {
            navMenu.classList.remove('active');
        }
    });

    // Handle initial hash in URL
    if (window.location.hash) {
        const initialSection = window.location.hash.slice(1);
        const validSections = ['home', 'projects', 'experience', 'education', 'skills'];
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
    });

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
});