document.addEventListener('DOMContentLoaded', function () {
    const nav = document.querySelector('.nav');
    const toggle = document.querySelector('.nav-toggle');
    const menu = document.querySelector('.nav-links');
    const links = document.querySelectorAll('.nav-links a');

    // Scroll shadow on nav
    window.addEventListener('scroll', function () {
        nav.classList.toggle('scrolled', window.scrollY > 10);
    });

    // Mobile menu
    toggle.addEventListener('click', function () {
        toggle.classList.toggle('open');
        menu.classList.toggle('open');
    });

    // Close menu on link click
    links.forEach(function (link) {
        link.addEventListener('click', function () {
            toggle.classList.remove('open');
            menu.classList.remove('open');
        });
    });

    // Close menu on outside click
    document.addEventListener('click', function (e) {
        if (!toggle.contains(e.target) && !menu.contains(e.target)) {
            toggle.classList.remove('open');
            menu.classList.remove('open');
        }
    });

    // Active nav link on scroll
    var sections = document.querySelectorAll('.section');

    function updateActive() {
        var scrollPos = window.scrollY + 120;
        var current = '';

        sections.forEach(function (section) {
            if (section.offsetTop <= scrollPos) {
                current = section.getAttribute('id');
            }
        });

        links.forEach(function (link) {
            link.classList.toggle('active', link.getAttribute('href') === '#' + current);
        });
    }

    window.addEventListener('scroll', updateActive);
    updateActive();

    // ===== Horizontal Timeline =====
    (function () {
        var TIMELINE_START = new Date('2023-08-01');
        var TIMELINE_END = new Date('2026-07-01');
        var totalMonths = (TIMELINE_END.getFullYear() - TIMELINE_START.getFullYear()) * 12
            + (TIMELINE_END.getMonth() - TIMELINE_START.getMonth());

        function monthsFrom(dateStr) {
            var d = new Date(dateStr + '-01');
            return (d.getFullYear() - TIMELINE_START.getFullYear()) * 12
                + (d.getMonth() - TIMELINE_START.getMonth());
        }

        // Position bars
        var bars = document.querySelectorAll('.htl-bar');
        bars.forEach(function (bar) {
            var startOffset = monthsFrom(bar.getAttribute('data-start'));
            var endOffset = monthsFrom(bar.getAttribute('data-end'));
            var leftPct = (startOffset / totalMonths) * 100;
            var widthPct = ((endOffset - startOffset) / totalMonths) * 100;
            bar.style.left = leftPct + '%';
            bar.style.width = widthPct + '%';
        });

        // Render axis labels
        var axis = document.getElementById('htl-axis');
        var years = [2024, 2025, 2026];
        years.forEach(function (year) {
            var offset = ((year - TIMELINE_START.getFullYear()) * 12) / totalMonths * 100;
            var label = document.createElement('span');
            label.className = 'htl-axis-label';
            label.textContent = year;
            label.style.left = offset + '%';
            axis.appendChild(label);
        });

        // Click to expand
        var rows = document.querySelectorAll('.htl-row');
        var details = document.querySelectorAll('.htl-detail-inner');

        rows.forEach(function (row) {
            row.addEventListener('click', function () {
                var idx = this.getAttribute('data-exp');
                var wasActive = this.classList.contains('active');

                rows.forEach(function (r) { r.classList.remove('active'); });
                details.forEach(function (d) { d.classList.remove('active'); });

                if (!wasActive) {
                    this.classList.add('active');
                    var detail = document.querySelector('[data-detail="' + idx + '"]');
                    if (detail) detail.classList.add('active');
                }
            });
        });
    })();

    // ===== Chat Widget =====
    var chatWidget = document.getElementById('chat-widget');
    var chatToggle = document.getElementById('chat-toggle');
    var chatPanel = document.getElementById('chat-panel');
    var chatForm = document.getElementById('chat-form');
    var chatInput = document.getElementById('chat-input');
    var chatMessages = document.getElementById('chat-messages');
    var chatSend = document.getElementById('chat-send');
    var sessionId = 'sess_' + Math.random().toString(36).slice(2);

    // Open by default
    chatWidget.classList.add('open');

    chatToggle.addEventListener('click', function () {
        chatWidget.classList.toggle('open');
        if (chatWidget.classList.contains('open')) {
            chatInput.focus();
        }
    });

    chatForm.addEventListener('submit', function (e) {
        e.preventDefault();
        var msg = chatInput.value.trim();
        if (!msg) return;

        appendMessage('user', msg);
        chatInput.value = '';
        chatSend.disabled = true;

        var typing = showTyping();

        fetch('/api/chat', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ message: msg, sessionId: sessionId }),
        })
            .then(function (res) { return res.json(); })
            .then(function (data) {
                removeTyping(typing);
                if (data.error) {
                    appendMessage('assistant', data.error);
                    if (data.remaining === 0) {
                        chatInput.disabled = true;
                        chatSend.disabled = true;
                        chatInput.placeholder = 'Weekly limit reached';
                    }
                } else {
                    appendMessage('assistant', data.reply);
                    if (typeof data.remaining === 'number') {
                        chatInput.placeholder = data.remaining + ' messages left this week';
                    }
                }
            })
            .catch(function () {
                removeTyping(typing);
                appendMessage('assistant', 'Sorry, I couldn\'t connect. Please try again later.');
            })
            .finally(function () {
                chatSend.disabled = false;
            });
    });

    function renderMarkdown(text) {
        // Escape HTML first
        var safe = text.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
        // Bold: **text**
        safe = safe.replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>');
        // Italic: *text*
        safe = safe.replace(/\*(.+?)\*/g, '<em>$1</em>');
        // Inline code: `text`
        safe = safe.replace(/`(.+?)`/g, '<code>$1</code>');
        // Line breaks
        safe = safe.replace(/\n/g, '<br>');
        return safe;
    }

    function appendMessage(role, text) {
        var div = document.createElement('div');
        div.className = 'chat-msg ' + role;
        var p = document.createElement('p');
        if (role === 'assistant') {
            p.innerHTML = renderMarkdown(text);
        } else {
            p.textContent = text;
        }
        div.appendChild(p);
        chatMessages.appendChild(div);
        chatMessages.scrollTop = chatMessages.scrollHeight;
    }

    function showTyping() {
        var div = document.createElement('div');
        div.className = 'chat-msg assistant';
        div.innerHTML = '<div class="chat-typing"><span></span><span></span><span></span></div>';
        chatMessages.appendChild(div);
        chatMessages.scrollTop = chatMessages.scrollHeight;
        return div;
    }

    function removeTyping(el) {
        if (el && el.parentNode) el.parentNode.removeChild(el);
    }
});
