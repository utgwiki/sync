document.addEventListener('DOMContentLoaded', () => {
    const body = document.body;
    const pageContainer = document.querySelector('.citizen-body');
    
    if (!pageContainer) return;

    // setup wrapper
    let sidewrapper = document.querySelector('.sidewrapper');
    if (!sidewrapper) {
        sidewrapper = document.createElement('div');
        sidewrapper.className = 'sidewrapper';
        sidewrapper.innerHTML = '<div class="sideicons"></div>';
        pageContainer.prepend(sidewrapper);
    }
    const sideicons = sidewrapper.querySelector('.sideicons');

    // move tab to sideicons
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

    // observer
    const observer = new MutationObserver((mutations) => {
        for (const mutation of mutations) {
            if (mutation.type === 'childList') {
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
    });

    // initialise
    teleport();

    setTimeout(() => {
        teleport();
    }, 100);

    observer.observe(body, {
        childList: true,
        subtree: true
    });
});
