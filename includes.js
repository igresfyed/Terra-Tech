// Dynamic content loading function
function loadIncludes() {
    const includes = document.getElementsByTagName('div');
    Array.from(includes).forEach(include => {
        if (include.getAttribute('include-html')) {
            const file = include.getAttribute('include-html');
            fetch(file)
                .then(response => response.text())
                .then(data => {
                    include.innerHTML = data;
                    // Initialize any scripts that might be in the included content
                    const scripts = include.getElementsByTagName('script');
                    Array.from(scripts).forEach(script => {
                        const newScript = document.createElement('script');
                        newScript.innerHTML = script.innerHTML;
                        script.parentNode.replaceChild(newScript, script);
                    });
                })
                .catch(error => console.error('Error loading include:', error));
        }
    });
}

// Load includes on page load
document.addEventListener('DOMContentLoaded', loadIncludes);

// Load includes when URL changes (for single-page applications)
window.addEventListener('hashchange', loadIncludes);
