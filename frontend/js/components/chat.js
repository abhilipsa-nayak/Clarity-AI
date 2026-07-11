// Clarity AI — Chat Renderer & Markdown Parser

export function escapeHTML(str) {
  return str
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;');
}

export function parseMarkdown(mdText) {
  if (!mdText) return '';

  let html = escapeHTML(mdText);

  // 1. Code blocks (```language\ncode```)
  html = html.replace(/```(\w*)\n([\s\S]*?)```/g, (match, lang, code) => {
    return `<pre><code class="language-${lang}">${code.trim()}</code></pre>`;
  });

  // 2. Inline code (`code`)
  html = html.replace(/`([^`]+)`/g, '<code>$1</code>');

  // 3. Bold (**text**)
  html = html.replace(/\*\*([^*]+)\*\*/g, '<strong>$1</strong>');

  // 4. Headers (### text)
  html = html.replace(/^### (.*?)$/gm, '<h3>$1</h3>');
  html = html.replace(/^## (.*?)$/gm, '<h2>$1</h2>');
  html = html.replace(/^# (.*?)$/gm, '<h1>$1</h1>');

  // 5. Links ([text](url))
  html = html.replace(/\[([^\]]+)\]\(([^)]+)\)/g, '<a href="$2" target="_blank" rel="noopener noreferrer">$1</a>');

  // 6. Bullet lists (- item or * item)
  // Match contiguous lines starting with - or *
  let lines = html.split('\n');
  let inList = false;
  let listType = null; // 'ul' or 'ol'
  
  for (let i = 0; i < lines.length; i++) {
    const line = lines[i].trim();
    
    const bulletMatch = line.match(/^[\-\*]\s+(.*)$/);
    const numberMatch = line.match(/^\d+\.\s+(.*)$/);
    
    if (bulletMatch) {
      let content = bulletMatch[1];
      if (!inList || listType !== 'ul') {
        let prefix = inList ? `</${listType}><ul>` : '<ul>';
        lines[i] = `${prefix}<li>${content}</li>`;
        inList = true;
        listType = 'ul';
      } else {
        lines[i] = `<li>${content}</li>`;
      }
    } else if (numberMatch) {
      let content = numberMatch[1];
      if (!inList || listType !== 'ol') {
        let prefix = inList ? `</${listType}><ol>` : '<ol>';
        lines[i] = `${prefix}<li>${content}</li>`;
        inList = true;
        listType = 'ol';
      } else {
        lines[i] = `<li>${content}</li>`;
      }
    } else {
      if (inList) {
        lines[i] = `</${listType}>` + (line ? `<p>${line}</p>` : '');
        inList = false;
        listType = null;
      } else {
        if (line && !line.startsWith('<h') && !line.startsWith('<pre') && !line.startsWith('</pre')) {
          lines[i] = `<p>${line}</p>`;
        }
      }
    }
  }
  
  if (inList) {
    lines.push(`</${listType}>`);
  }
  
  html = lines.join('\n');

  // 7. Clean up multiple line breaks
  html = html.replace(/\n\n+/g, '\n');

  return html;
}

export function appendMessage(container, role, content) {
  if (!container) return null;
  
  const bubble = document.createElement('div');
  bubble.className = `chat-bubble chat-bubble--${role === 'user' ? 'user' : 'assistant'} slide-up`;
  
  if (role === 'user') {
    // Users don't type markdown often, but parse anyway just in case
    bubble.innerHTML = `<p>${escapeHTML(content)}</p>`;
  } else {
    bubble.innerHTML = parseMarkdown(content);
  }
  
  container.appendChild(bubble);
  container.scrollTop = container.scrollHeight;
  return bubble;
}

export function showTypingIndicator(container) {
  if (!container) return null;
  
  // Check if already showing
  const existing = container.querySelector('.typing-indicator');
  if (existing) return existing;
  
  const indicator = document.createElement('div');
  indicator.className = 'typing-indicator fade-in';
  indicator.innerHTML = `
    <div class="typing-dot"></div>
    <div class="typing-dot"></div>
    <div class="typing-dot"></div>
  `;
  
  container.appendChild(indicator);
  container.scrollTop = container.scrollHeight;
  return indicator;
}

export function hideTypingIndicator(container) {
  if (!container) return;
  const indicator = container.querySelector('.typing-indicator');
  if (indicator) {
    indicator.remove();
  }
}
