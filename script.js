(function () {
    'use strict';

    var tabs = Array.prototype.slice.call(document.querySelectorAll('[role="tab"]'));
    var panels = Array.prototype.slice.call(document.querySelectorAll('[role="tabpanel"]'));
    var reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
    var tabIds = tabs.map(function (tab) {
        return tab.getAttribute('href').slice(1);
    });

    function validTab(id) {
        return tabIds.indexOf(id) !== -1;
    }

    function activateTab(id, options) {
        var settings = options || {};
        var selectedId = validTab(id) ? id : 'overview';

        tabs.forEach(function (tab) {
            var active = tab.getAttribute('href') === '#' + selectedId;
            tab.setAttribute('aria-selected', String(active));
            tab.setAttribute('tabindex', active ? '0' : '-1');

            if (active && settings.focus) {
                tab.focus();
            }
        });

        panels.forEach(function (panel) {
            var active = panel.id === 'panel-' + selectedId;
            panel.hidden = !active;
            panel.classList.toggle('is-active', active);

            if (active) {
                panel.classList.remove('is-entering');
                window.requestAnimationFrame(function () {
                    panel.classList.add('is-entering');
                });
            }
        });

        if (settings.updateHistory !== false && window.location.hash !== '#' + selectedId) {
            window.history.pushState({ tab: selectedId }, '', '#' + selectedId);
        }

        if (settings.scroll) {
            window.scrollTo({ top: 0, behavior: reduceMotion.matches ? 'auto' : 'smooth' });
        }
    }

    tabs.forEach(function (tab, index) {
        tab.addEventListener('click', function (event) {
            event.preventDefault();
            activateTab(tab.getAttribute('href').slice(1), {
                updateHistory: true,
                scroll: true
            });
        });

        tab.addEventListener('keydown', function (event) {
            var targetIndex = index;

            if (event.key === ' ' || event.key === 'Enter') {
                event.preventDefault();
                activateTab(tab.getAttribute('href').slice(1), {
                    updateHistory: true,
                    focus: true,
                    scroll: false
                });
                return;
            } else if (event.key === 'ArrowRight') {
                targetIndex = (index + 1) % tabs.length;
            } else if (event.key === 'ArrowLeft') {
                targetIndex = (index - 1 + tabs.length) % tabs.length;
            } else if (event.key === 'Home') {
                targetIndex = 0;
            } else if (event.key === 'End') {
                targetIndex = tabs.length - 1;
            } else {
                return;
            }

            event.preventDefault();
            activateTab(tabs[targetIndex].getAttribute('href').slice(1), {
                updateHistory: true,
                focus: true,
                scroll: false
            });
        });
    });

    document.querySelectorAll('[data-select-tab]').forEach(function (control) {
        control.addEventListener('click', function (event) {
            var id = control.getAttribute('data-select-tab');

            if (!validTab(id)) {
                return;
            }

            event.preventDefault();
            activateTab(id, {
                updateHistory: true,
                focus: true,
                scroll: true
            });
        });
    });

    function handleLocationChange() {
        var id = window.location.hash.slice(1);
        var selected = tabs.find(function (tab) {
            return tab.getAttribute('aria-selected') === 'true';
        });
        var selectedId = selected ? selected.getAttribute('href').slice(1) : '';

        if (!id) {
            if (selectedId !== 'overview') {
                activateTab('overview', {
                    updateHistory: false,
                    scroll: false
                });
            }
            return;
        }

        if (validTab(id) && id !== selectedId) {
            activateTab(id, {
                updateHistory: false,
                scroll: false
            });
        } else if (!validTab(id) && !document.getElementById(id)) {
            window.history.replaceState({ tab: selectedId || 'overview' }, '', '#' + (selectedId || 'overview'));
        }
    }

    window.addEventListener('popstate', handleLocationChange);
    window.addEventListener('hashchange', handleLocationChange);

    var filterButtons = Array.prototype.slice.call(document.querySelectorAll('[data-filter]'));
    var projects = Array.prototype.slice.call(document.querySelectorAll('.project-row'));
    var filterStatus = document.getElementById('filter-status');

    filterButtons.forEach(function (button) {
        button.addEventListener('click', function () {
            var filter = button.getAttribute('data-filter');
            var visibleCount = 0;

            filterButtons.forEach(function (item) {
                item.setAttribute('aria-pressed', String(item === button));
            });

            projects.forEach(function (project) {
                var categories = project.getAttribute('data-category').split(' ');
                var visible = filter === 'all' || categories.indexOf(filter) !== -1;
                project.hidden = !visible;

                if (visible) {
                    visibleCount += 1;
                }
            });

            if (filterStatus) {
                filterStatus.textContent = 'Showing ' + visibleCount + (visibleCount === 1 ? ' project' : ' projects');
            }
        });
    });

    var printButton = document.getElementById('print-cv');

    if (printButton) {
        printButton.addEventListener('click', function () {
            window.print();
        });
    }

    var initialId = window.location.hash.slice(1);

    if (validTab(initialId)) {
        activateTab(initialId, {
            updateHistory: false,
            scroll: false
        });
    } else if (initialId && !document.getElementById(initialId)) {
        window.history.replaceState({ tab: 'overview' }, '', '#overview');
    }
}());
