// Clarity AI — Landing Page View & Interaction

import { parseMarkdown } from '../components/chat.js';

export function renderLanding() {
  return `
    <div>

      <!-- 2. Hero Section -->
      <section class="hero container">
        <div class="hero__grid">
          <div class="hero__content">
            <span class="badge badge--accent">AI Thinking Coach</span>
            <h1 class="hero__title">Better Decisions Begin With Better Thinking.</h1>
            <p class="hero__subtitle">
              Instead of giving instant answers, Clarity AI guides you through structured reflection, 
              helping you think clearly, focus on what matters, and take meaningful action.
            </p>
            <div class="hero__actions">
              <button class="btn btn--primary" onclick="window.location.hash = '#/signup'">Start Thinking</button>
              <a href="#learn-more" class="btn btn--secondary">Learn More</a>
            </div>
          </div>
          
          <!-- Interactive AI Chat Mockup -->
          <div class="hero__visual">
            <div class="mock-chat">
              <div class="mock-chat__header justify-between">
                <div class="flex align-center gap-sm">
                  <div class="avatar" style="width: 28px; height: 28px; font-size: 11px; background-color: var(--accent-light); color: var(--accent);">AI</div>
                  <strong style="font-size: 13px;">Clarity Coach</strong>
                </div>
                <span class="badge badge--accent" style="font-size: 10px; padding: 2px 6px;">Demo Mode</span>
              </div>
              <div class="mock-chat__body" id="demo-chat-body">
                <div class="mock-chat__bubble mock-chat__bubble--coach">
                  Hello! I'm your thinking coach. What complex problem or decision is on your mind today?
                </div>
              </div>
              <form class="mock-chat__input-area" id="demo-chat-form">
                <input type="text" class="mock-chat__input" placeholder="Type a scenario (e.g. I want to change jobs)..." id="demo-chat-input" required autocomplete="off">
                <button type="submit" class="btn btn--primary" style="padding: 6px 12px; border-radius: var(--radius-sm);" aria-label="Send message">
                  <i data-lucide="arrow-right" style="width: 16px; height: 16px;"></i>
                </button>
              </form>
            </div>
          </div>
        </div>
      </section>

      <!-- 3. Process Section (Merged) -->
      <section class="features" id="process">
        <div class="container">
          <div class="section-header text-center">
            <span class="badge">The Socratic Method</span>
            <h2 style="margin-top: 12px;">How It Works</h2>
            <p style="max-width: 600px; margin: 0 auto;">Move systematically from confusion to clarity through three distinct modes of thinking.</p>
          </div>
          
          <div class="features__grid">
            <div class="feature-card">
              <div class="feature-card__icon" style="color: var(--accent);"><i data-lucide="refresh-cw"></i></div>
              <h3>1. Reflect Mode</h3>
              <p>Unpack complex ideas and issues by answering guided, open-ended questions designed to examine details objectively.</p>
            </div>
            
            <div class="feature-card">
              <div class="feature-card__icon" style="color: var(--accent);"><i data-lucide="eye"></i></div>
              <h3>2. Focus Mode</h3>
              <p>Identify core assumptions, analyze potential blind spots, and isolate your single highest priority.</p>
            </div>
            
            <div class="feature-card">
              <div class="feature-card__icon" style="color: var(--accent);"><i data-lucide="compass"></i></div>
              <h3>3. Take Action Mode</h3>
              <p>Arrive at exactly one concrete, immediate next step. Move from analysis paralysis to meaningful execution.</p>
            </div>
          </div>
        </div>
      </section>

      <!-- 4. Deep Dives / CTA -->
      <section class="how-it-works" id="deep-dives" style="background-color: var(--bg-primary); border-top: 1px solid var(--border-color); border-bottom: 1px solid var(--border-color); padding-block: var(--spacing-xxl);">
        <div class="container">
          <div class="grid grid-cols-2 gap-xl" style="align-items: center;">
            <div>
              <span class="badge">Spacious & Private</span>
              <h2 style="margin-top: 12px; font-size: 28px; line-height: 1.3;">Designed to strengthen human intelligence, not replace it.</h2>
              <p style="margin-top: 16px; color: var(--text-secondary); line-height: 1.6;">
                Most AI apps try to solve problems for you, leading to cognitive reliance. Clarity AI acts as a mirror for your own thinking, protecting your privacy and data autonomy.
              </p>
            </div>
            <div style="display: flex; flex-direction: column; gap: var(--spacing-md); background-color: var(--bg-secondary); border: 1px solid var(--border-color); padding: var(--spacing-lg); border-radius: var(--radius-lg);">
              <h3 style="font-size: 18px; font-weight: 600;">Want to explore further?</h3>
              <p style="font-size: 14px; color: var(--text-secondary); line-height: 1.5;">Dive deeper into the psychological principles, cognitive science, and mission behind Clarity AI.</p>
              <div style="display: flex; gap: var(--spacing-sm); margin-top: 8px;">
                <button class="btn btn--secondary" onclick="window.location.hash = '#/about'" style="flex: 1;">About Us</button>
                <button class="btn btn--secondary" onclick="window.location.hash = '#/learn-more'" style="flex: 1;">The Science</button>
              </div>
            </div>
          </div>
        </div>
      </section>

      <!-- 5. Testimonials -->
      <section class="testimonials">
        <div class="container">
          <div class="section-header text-center">
            <h2>Trusted by Decision Makers</h2>
            <p>Here is how builders, leaders, and thinkers use Clarity AI.</p>
          </div>
          
          <div class="grid grid-cols-3 gap-lg" style="margin-top: var(--spacing-lg);">
            <div class="testimonial-card">
              <p class="testimonial-text">
                "Other AIs give me generic lists of options that expand my choices. Clarity AI forces me to focus on a single next step. It's incredibly grounding."
              </p>
              <div class="testimonial-author">
                <div class="avatar">SL</div>
                <div>
                  <strong style="font-size: 14px; display: block;">Sarah L.</strong>
                  <span style="font-size: 12px; color: var(--text-secondary);">Product Lead</span>
                </div>
              </div>
            </div>

            <div class="testimonial-card">
              <p class="testimonial-text">
                "As a startup founder, I suffer from analysis paralysis daily. Chatting with Clarity AI for 10 minutes helps me filter noise and identify what really matters."
              </p>
              <div class="testimonial-author">
                <div class="avatar">MK</div>
                <div>
                  <strong style="font-size: 14px; display: block;">Marcus K.</strong>
                  <span style="font-size: 12px; color: var(--text-secondary);">Founder & CTO</span>
                </div>
              </div>
            </div>

            <div class="testimonial-card">
              <p class="testimonial-text">
                "Clarity does not spoon-feed answers. It acts like a quiet psychologist. I end up writing out my thoughts and solving my own problems."
              </p>
              <div class="testimonial-author">
                <div class="avatar">EA</div>
                <div>
                  <strong style="font-size: 14px; display: block;">Elena A.</strong>
                  <span style="font-size: 12px; color: var(--text-secondary);">Creative Director</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <!-- 6. FAQ Section Accordion -->
      <section class="faq" id="faq" style="background-color: var(--bg-secondary); padding-block: var(--spacing-xxl);">
        <div class="container">
          <div class="section-header text-center">
            <span class="badge" style="margin-bottom: 12px;">FAQ</span>
            <h2>Frequently Asked Questions</h2>
            <p style="color: var(--text-secondary); margin-top: 8px;">Quick answers to essential questions.</p>
          </div>
          
          <div class="faq-list">
            <div class="faq-item">
              <button class="faq-question">
                <span>Why doesn't Clarity AI give me direct answers?</span>
                <i data-lucide="chevron-down" class="faq-chevron"></i>
              </button>
              <div class="faq-answer">
                Direct answers from LLMs encourage cognitive dependency. Clarity AI is specifically built as a mirror to guide your introspection, ensuring you build critical thinking capacity and own your outcomes.
              </div>
            </div>

            <div class="faq-item">
              <button class="faq-question">
                <span>Is my conversational data private and secure?</span>
                <i data-lucide="chevron-down" class="faq-chevron"></i>
              </button>
              <div class="faq-answer">
                Yes. Your records are stored securely in a local database tied to your password-encrypted account. We never sell your data or train external models on your thinking journeys.
              </div>
            </div>

            <div class="faq-item">
              <button class="faq-question">
                <span>Can I use Clarity AI if I don't have an active API Key?</span>
                <i data-lucide="chevron-down" class="faq-chevron"></i>
              </button>
              <div class="faq-answer">
                Yes! If no GEMINI_API_KEY is configured in the environment, Clarity AI will automatically fall back to Demo Mode. It will generate simulated Socratic questions, prioritize core blind spots, and offer action prompts based on your input content offline.
              </div>
            </div>
          </div>
        </div>
      </section>

    </div>
  `;
}

export function initLanding() {

  // 1. Setup FAQ Accordion Toggles
  const faqItems = document.querySelectorAll('.faq-item');
  faqItems.forEach(item => {
    const question = item.querySelector('.faq-question');
    question.addEventListener('click', () => {
      const isActive = item.classList.contains('active');
      // Close all first
      faqItems.forEach(i => i.classList.remove('active'));
      // Toggle current
      if (!isActive) {
        item.classList.add('active');
      }
    });
  });

  // 2. Setup Interactive Mock Chat Demo
  const form = document.getElementById('demo-chat-form');
  const input = document.getElementById('demo-chat-input');
  const chatBody = document.getElementById('demo-chat-body');
  
  if (form && input && chatBody) {
    form.addEventListener('submit', (e) => {
      e.preventDefault();
      const text = input.value.trim();
      if (!text) return;
      
      // Append user bubble
      const userBubble = document.createElement('div');
      userBubble.className = 'mock-chat__bubble mock-chat__bubble--user slide-up';
      userBubble.textContent = text;
      chatBody.appendChild(userBubble);
      chatBody.scrollTop = chatBody.scrollHeight;
      
      input.value = '';
      
      // Show typing indicator
      const typingBubble = document.createElement('div');
      typingBubble.className = 'mock-chat__bubble mock-chat__bubble--coach slide-up';
      typingBubble.innerHTML = `
        <div class="typing-indicator" style="margin-left: 0; background: transparent; padding: 0; box-shadow: none;">
          <div class="typing-dot"></div>
          <div class="typing-dot"></div>
          <div class="typing-dot"></div>
        </div>
      `;
      chatBody.appendChild(typingBubble);
      chatBody.scrollTop = chatBody.scrollHeight;
      
      // Generate simulated coach response after 1.5 seconds
      setTimeout(() => {
        typingBubble.remove();
        
        let responseText = '';
        const lower = text.toLowerCase();
        if (lower.includes('job') || lower.includes('work') || lower.includes('career') || lower.includes('quit')) {
          responseText = `### 1. Reflect
* What is the primary source of friction in your current role: is it the work itself, the environment, or the long-term path?
* If you changed jobs today, what specific challenge are you hoping to leave behind, and what might follow you?

### 2. Focus
You seem focused on leaving the current situation rather than what you are moving towards. A potential blind spot is how much of your current exhaustion is career-related versus general burnout.

### 3. Take Action
**Next Step:** List the top 3 core values you want in your next role, and rate your current job against them.`;
        } else {
          responseText = `### 1. Reflect
* What aspect of this decision feels the most high-stakes to you right now?
* If you could fast-forward six months, what would a successful resolution look like?

### 2. Focus
You are treating all components of this issue with equal weight. The key blind spot is separating what you can control from external outcomes.

### 3. Take Action
**Next Step:** Write down the single most important question you need to answer before making this decision.`;
        }
        
        const coachBubble = document.createElement('div');
        coachBubble.className = 'mock-chat__bubble mock-chat__bubble--coach slide-up';
        coachBubble.innerHTML = parseMarkdown(responseText);
        chatBody.appendChild(coachBubble);
        chatBody.scrollTop = chatBody.scrollHeight;
        lucide.createIcons();
      }, 1500);
    });
  }
}
