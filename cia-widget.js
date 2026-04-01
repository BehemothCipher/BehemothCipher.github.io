/**
 * C.I.A. — Cipher Integrated Assistant
 * Self-contained embeddable widget for behemothlab.dev
 *
 * HOW TO EMBED — add ONE line before </body> in your HTML:
 *   <script src="/cia-widget.js" data-cia-endpoint="https://your-render-server.onrender.com/api/cia/chat"></script>
 *
 * That's it. No other dependencies needed.
 */
(function () {
  'use strict';

  // ── Config ──────────────────────────────────────────────────────────────────
  const ENDPOINT = document.currentScript?.dataset?.ciaEndpoint
    || '/api/cia/chat';

  const GREETING = `Hello — I'm **C.I.A.**, the Cipher Integrated Assistant for **behemothlab.dev**.

I can help you explore the CipherBuilds tool suite, find the right product, or figure out which commission tier fits your project.

What are you looking for today?`;

  // ── Inject styles ────────────────────────────────────────────────────────────
  const STYLES = `
    :root {
      --cia-bg:      #0b0f16;
      --cia-panel:   #101722;
      --cia-panel2:  #1a2330;
      --cia-line:    #1c3248;
      --cia-text:    #e6eef8;
      --cia-muted:   #8ea6bf;
      --cia-accent:  #00b8e8;
      --cia-accent2: #1d9bf0;
      --cia-glow:    0 0 20px rgba(0,184,232,0.25), 0 0 60px rgba(0,184,232,0.08);
      --cia-radius:  12px;
    }

    #cia-root * { box-sizing: border-box; margin: 0; padding: 0; }

    /* ── FAB button ── */
    #cia-fab {
      position: fixed;
      bottom: 28px;
      right: 28px;
      z-index: 99998;
      width: 58px;
      height: 58px;
      border-radius: 50%;
      background: var(--cia-bg);
      border: 2px solid var(--cia-accent);
      box-shadow: var(--cia-glow);
      cursor: pointer;
      display: flex;
      align-items: center;
      justify-content: center;
      transition: transform 0.2s ease, box-shadow 0.2s ease;
      outline: none;
    }
    #cia-fab:hover {
      transform: scale(1.08);
      box-shadow: 0 0 28px rgba(0,184,232,0.45), 0 0 70px rgba(0,184,232,0.15);
    }
    #cia-fab svg { width: 28px; height: 28px; }
    #cia-fab .cia-badge {
      position: absolute;
      top: -4px;
      right: -4px;
      width: 18px;
      height: 18px;
      border-radius: 50%;
      background: var(--cia-accent);
      border: 2px solid var(--cia-bg);
      animation: cia-pulse 2s ease infinite;
    }
    @keyframes cia-pulse {
      0%, 100% { opacity: 1; transform: scale(1); }
      50%       { opacity: 0.6; transform: scale(0.9); }
    }

    /* ── Panel ── */
    #cia-panel {
      position: fixed;
      bottom: 100px;
      right: 28px;
      z-index: 99999;
      width: min(400px, calc(100vw - 32px));
      height: min(580px, calc(100vh - 140px));
      background: var(--cia-bg);
      border: 1px solid var(--cia-line);
      border-top: 2px solid var(--cia-accent);
      border-radius: var(--cia-radius);
      box-shadow: var(--cia-glow), 0 24px 80px rgba(0,0,0,0.7);
      display: flex;
      flex-direction: column;
      overflow: hidden;
      font-family: 'Segoe UI', system-ui, sans-serif;
      font-size: 14px;
      color: var(--cia-text);
      transition: opacity 0.2s ease, transform 0.2s ease;
    }
    #cia-panel.cia-hidden {
      opacity: 0;
      transform: translateY(12px) scale(0.97);
      pointer-events: none;
    }

    /* ── Header ── */
    #cia-header {
      padding: 14px 16px 12px;
      background: var(--cia-panel);
      border-bottom: 1px solid var(--cia-line);
      display: flex;
      align-items: center;
      gap: 12px;
      flex-shrink: 0;
    }
    .cia-avatar {
      width: 36px;
      height: 36px;
      border-radius: 50%;
      background: var(--cia-bg);
      border: 1.5px solid var(--cia-accent);
      display: flex;
      align-items: center;
      justify-content: center;
      flex-shrink: 0;
      font-weight: 800;
      font-size: 11px;
      color: var(--cia-accent);
      letter-spacing: 0.05em;
    }
    .cia-header-info { flex: 1; }
    .cia-name {
      font-weight: 700;
      font-size: 13px;
      color: var(--cia-text);
      letter-spacing: 0.04em;
    }
    .cia-status {
      font-size: 11px;
      color: var(--cia-accent);
      font-family: 'Consolas', monospace;
      display: flex;
      align-items: center;
      gap: 5px;
      margin-top: 1px;
    }
    .cia-dot {
      width: 6px; height: 6px;
      border-radius: 50%;
      background: var(--cia-accent);
      animation: cia-blink 2s ease infinite;
    }
    @keyframes cia-blink { 0%,100%{opacity:1} 50%{opacity:0.3} }
    #cia-close {
      background: none;
      border: none;
      color: var(--cia-muted);
      cursor: pointer;
      padding: 4px;
      border-radius: 4px;
      display: flex;
      transition: color 0.15s;
    }
    #cia-close:hover { color: var(--cia-text); }

    /* ── Messages ── */
    #cia-messages {
      flex: 1;
      overflow-y: auto;
      padding: 16px 14px;
      display: flex;
      flex-direction: column;
      gap: 14px;
      scroll-behavior: smooth;
    }
    #cia-messages::-webkit-scrollbar { width: 4px; }
    #cia-messages::-webkit-scrollbar-track { background: transparent; }
    #cia-messages::-webkit-scrollbar-thumb { background: var(--cia-line); border-radius: 999px; }

    .cia-msg { display: flex; gap: 9px; align-items: flex-start; }
    .cia-msg.cia-user { flex-direction: row-reverse; }

    .cia-msg-avatar {
      width: 26px; height: 26px;
      border-radius: 50%;
      flex-shrink: 0;
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 10px;
      font-weight: 700;
    }
    .cia-msg.cia-assistant .cia-msg-avatar {
      background: var(--cia-bg);
      border: 1.5px solid var(--cia-accent);
      color: var(--cia-accent);
    }
    .cia-msg.cia-user .cia-msg-avatar {
      background: var(--cia-panel2);
      border: 1.5px solid var(--cia-line);
      color: var(--cia-muted);
    }

    .cia-bubble {
      max-width: 82%;
      padding: 10px 13px;
      border-radius: 10px;
      line-height: 1.65;
      font-size: 13px;
    }
    .cia-msg.cia-user .cia-bubble {
      background: var(--cia-panel2);
      border: 1px solid var(--cia-line);
      color: var(--cia-text);
    }
    .cia-msg.cia-assistant .cia-bubble {
      background: var(--cia-panel);
      border: 1px solid var(--cia-line);
      color: var(--cia-text);
    }

    /* Markdown inside bubbles */
    .cia-bubble strong { color: var(--cia-text); font-weight: 700; }
    .cia-bubble em { color: var(--cia-muted); font-style: italic; }
    .cia-bubble p { margin: 0 0 8px; }
    .cia-bubble p:last-child { margin-bottom: 0; }
    .cia-bubble ul, .cia-bubble ol { margin: 6px 0 6px 18px; padding: 0; }
    .cia-bubble li { margin: 3px 0; }
    .cia-bubble code {
      background: var(--cia-bg);
      border: 1px solid var(--cia-line);
      border-radius: 3px;
      padding: 1px 5px;
      font-family: Consolas, monospace;
      font-size: 12px;
      color: #9fe1ff;
    }
    .cia-bubble h3 { font-size: 13px; font-weight: 700; margin: 8px 0 4px; color: var(--cia-accent); }

    /* Streaming cursor */
    .cia-cursor::after {
      content: '▋';
      color: var(--cia-accent);
      animation: cia-blink 0.9s step-start infinite;
    }

    /* Typing indicator */
    .cia-typing { display: flex; gap: 4px; padding: 10px 13px; align-items: center; }
    .cia-typing span {
      width: 6px; height: 6px;
      background: var(--cia-muted);
      border-radius: 50%;
      animation: cia-bounce 1.2s ease infinite;
    }
    .cia-typing span:nth-child(2) { animation-delay: 0.2s; }
    .cia-typing span:nth-child(3) { animation-delay: 0.4s; }
    @keyframes cia-bounce { 0%,80%,100%{transform:translateY(0)} 40%{transform:translateY(-6px)} }

    /* ── Input area ── */
    #cia-input-area {
      padding: 12px 14px;
      border-top: 1px solid var(--cia-line);
      background: var(--cia-panel);
      flex-shrink: 0;
    }
    #cia-input-wrap {
      display: flex;
      gap: 8px;
      align-items: flex-end;
      background: var(--cia-bg);
      border: 1px solid var(--cia-line);
      border-radius: 8px;
      padding: 8px 10px;
      transition: border-color 0.15s;
    }
    #cia-input-wrap:focus-within {
      border-color: var(--cia-accent);
      box-shadow: 0 0 0 2px rgba(0,184,232,0.1);
    }
    #cia-textarea {
      flex: 1;
      background: none;
      border: none;
      outline: none;
      color: var(--cia-text);
      font-family: inherit;
      font-size: 13px;
      resize: none;
      max-height: 120px;
      min-height: 20px;
      line-height: 1.5;
    }
    #cia-textarea::placeholder { color: var(--cia-muted); }
    #cia-send {
      background: var(--cia-accent);
      border: none;
      border-radius: 6px;
      width: 30px;
      height: 30px;
      display: flex;
      align-items: center;
      justify-content: center;
      cursor: pointer;
      flex-shrink: 0;
      transition: background 0.15s, transform 0.1s;
    }
    #cia-send:hover { background: #00d8ff; transform: scale(1.05); }
    #cia-send:disabled { opacity: 0.4; cursor: not-allowed; transform: none; }
    #cia-send svg { width: 14px; height: 14px; color: #001820; }

    /* ── Footer ── */
    #cia-footer {
      text-align: center;
      padding: 6px 0 10px;
      font-size: 10px;
      color: var(--cia-muted);
      letter-spacing: 0.04em;
    }
    #cia-footer a { color: var(--cia-accent); text-decoration: none; }

    /* ── Responsive ── */
    @media (max-width: 480px) {
      #cia-panel { right: 12px; bottom: 88px; width: calc(100vw - 24px); }
      #cia-fab   { right: 16px; bottom: 20px; }
    }
  `;

  // ── Markdown renderer ────────────────────────────────────────────────────────
  function md(text) {
    return String(text || '')
      .replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>')
      .replace(/\*(.+?)\*/g, '<em>$1</em>')
      .replace(/`([^`]+)`/g, '<code>$1</code>')
      .replace(/^### (.+)$/gm, '<h3>$1</h3>')
      .replace(/^[*-] (.+)$/gm, '<li>$1</li>')
      .replace(/(<li>[\s\S]*<\/li>)/m, '<ul>$1</ul>')
      .replace(/\n\n/g, '</p><p>')
      .replace(/\n/g, '<br>')
      .replace(/^(.+)$/s, '<p>$1</p>');
  }

  // ── Build DOM ────────────────────────────────────────────────────────────────
  function buildWidget() {
    const root = document.createElement('div');
    root.id = 'cia-root';

    // Style tag
    const style = document.createElement('style');
    style.textContent = STYLES;
    root.appendChild(style);

    // FAB
    root.innerHTML += `
      <button id="cia-fab" aria-label="Open Cipher Integrated Assistant" title="Chat with C.I.A.">
        <svg viewBox="0 0 24 24" fill="none" stroke="#00b8e8" stroke-width="1.8"
             stroke-linecap="round" stroke-linejoin="round">
          <path d="M12 2C6.48 2 2 6.03 2 11c0 2.87 1.37 5.44 3.54 7.18L5 21l3.18-1.06A10.3 10.3 0 0 0 12 20c5.52 0 10-4.03 10-9S17.52 2 12 2z"/>
          <circle cx="8.5" cy="11" r="1.2" fill="#00b8e8" stroke="none"/>
          <circle cx="12"  cy="11" r="1.2" fill="#00b8e8" stroke="none"/>
          <circle cx="15.5" cy="11" r="1.2" fill="#00b8e8" stroke="none"/>
        </svg>
        <span class="cia-badge"></span>
      </button>

      <div id="cia-panel" class="cia-hidden" role="dialog" aria-label="C.I.A. Chat">
        <div id="cia-header">
          <div class="cia-avatar">CIA</div>
          <div class="cia-header-info">
            <div class="cia-name">C.I.A. — Cipher Integrated Assistant</div>
            <div class="cia-status"><span class="cia-dot"></span>Online · behemothlab.dev</div>
          </div>
          <button id="cia-close" aria-label="Close">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor"
                 stroke-width="2" stroke-linecap="round">
              <line x1="18" y1="6" x2="6" y2="18"/>
              <line x1="6" y1="6" x2="18" y2="18"/>
            </svg>
          </button>
        </div>

        <div id="cia-messages"></div>

        <div id="cia-input-area">
          <div id="cia-input-wrap">
            <textarea id="cia-textarea" rows="1" placeholder="Ask about products, commissions, or anything on the site…"></textarea>
            <button id="cia-send" aria-label="Send">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"
                   stroke-linecap="round" stroke-linejoin="round">
                <line x1="22" y1="2" x2="11" y2="13"/>
                <polygon points="22 2 15 22 11 13 2 9 22 2"/>
              </svg>
            </button>
          </div>
          <div id="cia-footer">
            Powered by <a href="https://behemothlab.dev" target="_blank">CipherBuilds</a>
            · C.I.A. v1.0
          </div>
        </div>
      </div>
    `;

    document.body.appendChild(root);
  }

  // ── State ────────────────────────────────────────────────────────────────────
  let isOpen    = false;
  let busy      = false;
  let greeted   = false;
  const history = []; // { role, content }

  // ── DOM refs (set after build) ───────────────────────────────────────────────
  let fab, panel, msgEl, textarea, sendBtn;

  function scrollBottom() {
    msgEl.scrollTop = msgEl.scrollHeight;
  }

  function addMessage(role, contentHtml, isStreaming = false) {
    const row = document.createElement('div');
    row.className = `cia-msg cia-${role}`;

    const avatar = document.createElement('div');
    avatar.className = 'cia-msg-avatar';
    avatar.textContent = role === 'user' ? 'You' : 'CIA';

    const bubble = document.createElement('div');
    bubble.className = 'cia-bubble' + (isStreaming ? ' cia-cursor' : '');
    bubble.innerHTML = contentHtml;

    row.appendChild(avatar);
    row.appendChild(bubble);
    msgEl.appendChild(row);
    scrollBottom();
    return bubble;
  }

  function showTyping() {
    const row = document.createElement('div');
    row.className = 'cia-msg cia-assistant';
    row.id = 'cia-typing-row';

    const avatar = document.createElement('div');
    avatar.className = 'cia-msg-avatar';
    avatar.textContent = 'CIA';

    const bubble = document.createElement('div');
    bubble.className = 'cia-bubble';
    bubble.innerHTML = '<div class="cia-typing"><span></span><span></span><span></span></div>';

    row.appendChild(avatar);
    row.appendChild(bubble);
    msgEl.appendChild(row);
    scrollBottom();
    return row;
  }

  // ── Send a message ───────────────────────────────────────────────────────────
  async function send(text) {
    if (busy || !text.trim()) return;
    busy = true;
    sendBtn.disabled = true;

    // Show user message
    addMessage('user', `<p>${text.replace(/</g,'&lt;').replace(/>/g,'&gt;')}</p>`);
    history.push({ role: 'user', content: text });

    // Show typing
    const typingRow = showTyping();

    try {
      const resp = await fetch(ENDPOINT, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ messages: history }),
      });

      typingRow.remove();

      if (!resp.ok) {
        const err = await resp.json().catch(() => ({}));
        addMessage('assistant', `<p style="color:#f87171">${err.error || 'Something went wrong. Try again.'}</p>`);
        busy = false; sendBtn.disabled = false; return;
      }

      // Stream
      const bubble = addMessage('assistant', '', true);
      const reader  = resp.body.getReader();
      const decoder = new TextDecoder();
      let buf = '';
      let full = '';

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        buf += decoder.decode(value, { stream: true });
        const lines = buf.split('\n');
        buf = lines.pop();
        for (const line of lines) {
          if (!line.startsWith('data: ')) continue;
          try {
            const parsed = JSON.parse(line.slice(6));
            if (parsed.chunk) {
              full += parsed.chunk;
              bubble.innerHTML = md(full);
              bubble.classList.add('cia-cursor');
              scrollBottom();
            }
            if (parsed.done) {
              full = parsed.full || full;
              bubble.innerHTML = md(full);
              bubble.classList.remove('cia-cursor');
            }
            if (parsed.error) {
              bubble.innerHTML = `<p style="color:#f87171">${parsed.error}</p>`;
              bubble.classList.remove('cia-cursor');
            }
          } catch {}
        }
      }

      bubble.classList.remove('cia-cursor');
      history.push({ role: 'assistant', content: full });

    } catch (e) {
      typingRow.remove();
      addMessage('assistant', '<p style="color:#f87171">Connection error. Check your network and try again.</p>');
    }

    busy = false;
    sendBtn.disabled = false;
    textarea.focus();
  }

  // ── Greeting ─────────────────────────────────────────────────────────────────
  function showGreeting() {
    if (greeted) return;
    greeted = true;
    const bubble = addMessage('assistant', '');
    let i = 0;
    const words = GREETING.split('');
    const interval = setInterval(() => {
      if (i >= words.length) {
        clearInterval(interval);
        bubble.classList.remove('cia-cursor');
        bubble.innerHTML = md(GREETING);
        history.push({ role: 'assistant', content: GREETING });
        return;
      }
      bubble.innerHTML = md(GREETING.slice(0, ++i));
      bubble.classList.add('cia-cursor');
      scrollBottom();
    }, 12);
  }

  // ── Toggle panel ─────────────────────────────────────────────────────────────
  function togglePanel() {
    isOpen = !isOpen;
    panel.classList.toggle('cia-hidden', !isOpen);
    if (isOpen) {
      // Remove notification badge
      const badge = document.querySelector('#cia-fab .cia-badge');
      if (badge) badge.style.display = 'none';
      setTimeout(() => {
        showGreeting();
        textarea.focus();
      }, 50);
    }
  }

  // ── Init ──────────────────────────────────────────────────────────────────────
  function init() {
    buildWidget();

    fab      = document.getElementById('cia-fab');
    panel    = document.getElementById('cia-panel');
    msgEl    = document.getElementById('cia-messages');
    textarea = document.getElementById('cia-textarea');
    sendBtn  = document.getElementById('cia-send');

    fab.addEventListener('click', togglePanel);
    document.getElementById('cia-close').addEventListener('click', togglePanel);

    sendBtn.addEventListener('click', () => {
      const t = textarea.value.trim();
      if (!t) return;
      textarea.value = '';
      textarea.style.height = 'auto';
      send(t);
    });

    textarea.addEventListener('keydown', e => {
      if (e.key === 'Enter' && !e.shiftKey) {
        e.preventDefault();
        const t = textarea.value.trim();
        if (!t) return;
        textarea.value = '';
        textarea.style.height = 'auto';
        send(t);
      }
    });

    textarea.addEventListener('input', () => {
      textarea.style.height = 'auto';
      textarea.style.height = Math.min(textarea.scrollHeight, 120) + 'px';
    });

    // Close on outside click
    document.addEventListener('click', e => {
      if (isOpen && !panel.contains(e.target) && !fab.contains(e.target)) {
        togglePanel();
      }
    });

    // Escape key
    document.addEventListener('keydown', e => {
      if (e.key === 'Escape' && isOpen) togglePanel();
    });

    // Auto-open after 2 seconds
    setTimeout(() => { if (!isOpen) togglePanel(); }, 2000);
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
