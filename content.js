function extractFeatures() {
    const url = window.local.href;
    const protocol = window.location.protocol;
    const forms = document.forms.length;
    const inputs = document.querySelectorAll('input[type="password"]').length;
    const title = document.title.toLowerCase();
    const suspiciousWords = ["verify", "login", "bank", "security", "urgent", "account", "card"];
    const hasSuspiciousWord = suspiciousWords.some(word => title.includes(word));

    return {
        url_length: url.length,
        has_at: url.includes('@') ? 1 : 0,
        has_dash: (url.match(/-/g) || []).length,
        subdomain_count: (url.split('.').length - 2),
        is_https: protocol == 'https:' ? 1 : 0,
        form_count: forms,
        password_input: inputs,
        title_suspicious: hasSuspiciousWord ? 1 : 0,
        dom_depth: getMaxDepth(document.body)
    };
}

function getMaxDepth(element) {
    if (!element.children) return 0;
    let max = 0;
    for (let child of element.children) {
        max = Math.max(max, getMaxDepth(child));
    }
    return max + 1;
}

const features = extractFeatures();
chrome.runtime.sendMessage({
    type: "ANALYZE_URL",
    features: features,
    url: window.location.href
});
