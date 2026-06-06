document.addEventListener('DOMContentLoaded', () => {
    const html = document.documentElement;
    const body = document.body;
    const pageContainer = document.querySelector('.citizen-page-container');
    
    if (!pageContainer) return;

    // --- 1. SETUP WRAPPER ---
    let sidewrapper = document.querySelector('.sidewrapper');
    if (!sidewrapper) {
        sidewrapper = document.createElement('div');
        sidewrapper.className = 'sidewrapper';
        sidewrapper.innerHTML = '<div class="sideicons"></div>';
        pageContainer.prepend(sidewrapper);
    }
    const sideicons = sidewrapper.querySelector('.sideicons');

    // --- 2. CLASS SYNCING (ns-* classes) ---
    let lastNSState = "";
    const syncNSClasses = () => {
        const nsClasses = Array.from(body.classList).filter(c => c.startsWith("ns-"));
        const newState = nsClasses.sort().join(' ');

        if (newState === lastNSState) return;
        
        requestAnimationFrame(() => {
            const currentHTMLClasses = Array.from(html.classList);
            currentHTMLClasses.forEach(c => {
                if (c.startsWith("ns-")) html.classList.remove(c);
            });
            if (nsClasses.length) html.classList.add(...nsClasses);
            lastNSState = newState;
        });
    };

    // --- 3. THE TELEPORT FUNCTION ---
    const targetSelector = '.mw-indicators, .utg-tabs';
    const ignoreSelector = '.ext-WikiEditor-realtimepreview-preview';

    const teleport = (root = document) => {
        const elements = root.querySelectorAll(targetSelector);
        
        elements.forEach(el => {
            // Check if it's already inside sideicons OR inside the preview pane
            if (el.parentElement !== sideicons && !el.closest(ignoreSelector)) {
                sideicons.appendChild(el);
            }
        });
    };

    // --- 4. OBSERVER ---
    const observer = new MutationObserver((mutations) => {
        let shouldSyncClasses = false;

        for (const mutation of mutations) {
            if (mutation.type === 'attributes') {
                shouldSyncClasses = true;
            } else if (mutation.type === 'childList') {
                mutation.addedNodes.forEach(node => {
                    if (node.nodeType === 1) {
                        // Skip entire branches if they are the preview container
                        if (node.closest(ignoreSelector)) return;

                        if (node.matches(targetSelector)) {
                            if (node.parentElement !== sideicons) sideicons.appendChild(node);
                        } else {
                            teleport(node);
                        }
                    }
                });
            }
        }

        if (shouldSyncClasses) syncNSClasses();
    });

    // --- 5. INITIALIZE ---
    syncNSClasses();
    teleport();

    setTimeout(() => {
        syncNSClasses();
        teleport();
    }, 100);

    observer.observe(body, {
        attributes: true,
        attributeFilter: ['class'],
        childList: true,
        subtree: true
    });
});