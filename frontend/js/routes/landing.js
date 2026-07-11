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

      <!-- 3. Features Section -->
      <section class="features" id="features">
        <div class="container">
          <div class="section-header text-center">
            <span class="badge">Built For Deeper Minds</span>
            <h2 style="margin-top: 12px;">Core Capabilities</h2>
            <p style="max-width: 600px; margin: 0 auto;">Everything you need to step away from cognitive shortcuts and engage in structured reflection.</p>
          </div>
          
          <div class="features__grid">
            <div class="feature-card">
              <div class="feature-card__icon"><i data-lucide="refresh-cw"></i></div>
              <h3>Reflect</h3>
              <p>Unpack complex ideas and issues by answering guided, open-ended questions designed to examine details objectively.</p>
            </div>
            
            <div class="feature-card">
              <div class="feature-card__icon"><i data-lucide="eye"></i></div>
              <h3>Focus</h3>
              <p>Identify core assumptions, analyze potential blind spots, and isolate your single highest priority.</p>
            </div>
            
            <div class="feature-card">
              <div class="feature-card__icon"><i data-lucide="compass"></i></div>
              <h3>Take Action</h3>
              <p>Arrive at exactly one concrete, immediate next step. Move from analysis paralysis to meaningful execution.</p>
            </div>

            <div class="feature-card">
              <div class="feature-card__icon"><i data-lucide="clock"></i></div>
              <h3>Conversation History</h3>
              <p>Every session is logged locally in your account history so you can review your thinking journeys over time.</p>
            </div>

            <div class="feature-card">
              <div class="feature-card__icon"><i data-lucide="cpu"></i></div>
              <h3>AI Thinking Coach</h3>
              <p>Advanced LLM prompts behave like a thoughtful mentor, coach, psychologist, and strategic partner combined.</p>
            </div>

            <div class="feature-card">
              <div class="feature-card__icon"><i data-lucide="shield-check"></i></div>
              <h3>Secure Accounts</h3>
              <p>Your session history is securely password-protected and private. Easily manage your preferences.</p>
            </div>
          </div>
        </div>
      </section>

      <!-- 4. How It Works -->
      <section class="how-it-works" id="how-it-works">
        <div class="container">
          <div class="section-header text-center">
            <h2>The Reflection Cycle</h2>
            <p>Our structured thinking model helps you move systematically from chaos to clarity.</p>
          </div>
          
          <div class="steps-flow">
            <div class="step-item">
              <div class="step-num">1</div>
              <h3>Reflect</h3>
              <p style="margin-top: 8px; max-width: 250px;">Uncover context and details through targeted inquiries.</p>
            </div>
            
            <div class="step-arrow"><i data-lucide="chevron-right"></i></div>
            
            <div class="step-item">
              <div class="step-num">2</div>
              <h3>Focus</h3>
              <p style="margin-top: 8px; max-width: 250px;">Challenge assumptions and narrow down priorities.</p>
            </div>
            
            <div class="step-arrow"><i data-lucide="chevron-right"></i></div>
            
            <div class="step-item">
              <div class="step-num">3</div>
              <h3>Take Action</h3>
              <p style="margin-top: 8px; max-width: 250px;">Define one single, practical starting point.</p>
            </div>
          </div>
        </div>
      </section>

      <!-- 5. About / Vision Section -->
      <section class="about" id="about">
        <div class="container" style="display: flex; flex-direction: column; gap: var(--spacing-xl);">
          <div class="about-banner" style="display: grid; grid-template-columns: 1.2fr 0.8fr; gap: var(--spacing-xl); align-items: start;">
            <div class="about-banner__text">
              <span class="badge" style="margin-bottom: 12px;">Vision & Philosophy</span>
              <h2 style="margin-bottom: var(--spacing-md); font-size: 32px;">Technology should strengthen human thinking—not replace it.</h2>
              <p style="line-height: 1.6; font-size: 16px; margin-bottom: var(--spacing-md);">
                Clarity AI is an AI-powered web application that helps users improve their thinking and decision-making skills. Instead of providing direct answers, the application guides you through a structured reflection process, encouraging independent thinking and meaningful action.
              </p>
              <div class="philosophical-badge" style="border-left: 4px solid var(--error); background-color: var(--bg-secondary); padding: 16px; margin-top: 16px;">
                <strong style="display: block; font-size: 14px; text-transform: uppercase; color: var(--error); margin-bottom: 4px; letter-spacing: 0.05em;">The Problem Statement</strong>
                <p style="font-size: 15px; color: var(--text-primary); line-height: 1.5;">
                  Most AI applications provide instant answers, making users increasingly dependent on AI. This reduces critical thinking, analytical reasoning, and long-term problem-solving abilities.
                </p>
              </div>
            </div>
            <div class="about-banner__text" style="background-color: var(--bg-secondary); border: 1px solid var(--border-color); padding: var(--spacing-lg); border-radius: var(--radius-lg); display: flex; flex-direction: column; gap: 16px;">
              <h3 style="font-size: 18px; font-weight: 600; display: flex; align-items: center; gap: 8px;">
                <i data-lucide="users" style="color: var(--accent);"></i>
                <span>Designed For</span>
              </h3>
              <ul style="display: flex; flex-direction: column; gap: 12px; font-size: 14px;">
                <li style="display: flex; gap: 8px; align-items: start; list-style: none;">
                  <i data-lucide="graduation-cap" style="color: var(--accent); width: 18px; height: 18px; flex-shrink: 0; margin-top: 2px;"></i>
                  <div><strong>Students & Learners</strong><br><span style="color: var(--text-secondary);">MCA, B.Tech, and academic thinkers building critical reasoning.</span></div>
                </li>
                <li style="display: flex; gap: 8px; align-items: start; list-style: none;">
                  <i data-lucide="briefcase" style="color: var(--accent); width: 18px; height: 18px; flex-shrink: 0; margin-top: 2px;"></i>
                  <div><strong>Freshers & Job Seekers</strong><br><span style="color: var(--text-secondary);">Graduates navigating career choices and interview dilemmas.</span></div>
                </li>
                <li style="display: flex; gap: 8px; align-items: start; list-style: none;">
                  <i data-lucide="user-check" style="color: var(--accent); width: 18px; height: 18px; flex-shrink: 0; margin-top: 2px;"></i>
                  <div><strong>Professionals & Leaders</strong><br><span style="color: var(--text-secondary);">Managing workplace priority focus and strategic planning.</span></div>
                </li>
                <li style="display: flex; gap: 8px; align-items: start; list-style: none;">
                  <i data-lucide="compass" style="color: var(--accent); width: 18px; height: 18px; flex-shrink: 0; margin-top: 2px;"></i>
                  <div><strong>Anyone</strong><br><span style="color: var(--text-secondary);">Seeking structure to step out of confusion and make choices.</span></div>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      <!-- 6. Testimonials -->
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

      <!-- 6.5 Science of Reflection / Learn More Section -->
      <section class="learn-more" id="learn-more" style="background-color: var(--bg-primary); padding-block: var(--spacing-xxl); border-bottom: 1px solid var(--border-color); border-top: 1px solid var(--border-color);">
        <div class="container">
          <div class="section-header text-center">
            <span class="badge" style="margin-bottom: 12px;">Cognitive Science</span>
            <h2>The Science of Reflection</h2>
            <p style="max-width: 600px; margin: 0 auto; color: var(--text-secondary); margin-top: 8px;">Why answering guided questions creates stronger, more resilient decisions than simply asking an AI for answers.</p>
          </div>
          
          <div class="grid grid-cols-3 gap-lg" style="margin-top: var(--spacing-lg);">
            <div class="settings-card" style="padding: var(--spacing-lg); display: flex; flex-direction: column; gap: 12px; background-color: var(--bg-secondary); border: 1px solid var(--border-color); border-radius: var(--radius-lg);">
              <div class="feature-card__icon" style="background-color: rgba(239, 68, 68, 0.08); color: var(--error); width: 40px; height: 40px; border-radius: var(--radius-sm); display: flex; align-items: center; justify-content: center;"><i data-lucide="zap-off" style="width: 20px; height: 20px;"></i></div>
              <h3 style="font-size: 18px; font-weight: 600;">The Illusion of Competence</h3>
              <p style="font-size: 14px; line-height: 1.6; color: var(--text-secondary);">
                Copying lists of steps generated by instant-answer systems creates an "illusion of competence" in our brains. Because we didn't do the mental work to arrive at the conclusions, we carry zero emotional alignment, resulting in poor follow-through and analysis paralysis.
              </p>
            </div>
            
            <div class="settings-card" style="padding: var(--spacing-lg); display: flex; flex-direction: column; gap: 12px; background-color: var(--bg-secondary); border: 1px solid var(--border-color); border-radius: var(--radius-lg);">
              <div class="feature-card__icon" style="background-color: var(--accent-light); color: var(--accent); width: 40px; height: 40px; border-radius: var(--radius-sm); display: flex; align-items: center; justify-content: center;"><i data-lucide="help-circle" style="width: 20px; height: 20px;"></i></div>
              <h3 style="font-size: 18px; font-weight: 600;">The Socratic Catalyst</h3>
              <p style="font-size: 14px; line-height: 1.6; color: var(--text-secondary);">
                Clarity AI triggers the <em>generation effect</em>—the cognitive science principle that information generated by your own mind is integrated and recalled up to 10x better. By prompting you to write down your context, the AI acts as a mirror to your own wisdom.
              </p>
            </div>
            
            <div class="settings-card" style="padding: var(--spacing-lg); display: flex; flex-direction: column; gap: 12px; background-color: var(--bg-secondary); border: 1px solid var(--border-color); border-radius: var(--radius-lg);">
              <div class="feature-card__icon" style="background-color: rgba(34, 197, 94, 0.08); color: var(--success); width: 40px; height: 40px; border-radius: var(--radius-sm); display: flex; align-items: center; justify-content: center;"><i data-lucide="target" style="width: 20px; height: 20px;"></i></div>
              <h3 style="font-size: 18px; font-weight: 600;">Dissolving Choice Fatigue</h3>
              <p style="font-size: 14px; line-height: 1.6; color: var(--text-secondary);">
                When facing complex decisions, the prefrontal cortex experiences severe overload when presented with multiple options. By strictly restricting the action suggestions to <strong>exactly one immediate micro-step</strong>, Clarity AI helps you build quick momentum.
              </p>
            </div>
          </div>
        </div>
      </section>

      <!-- 7. FAQ Section Accordion -->
      <section class="faq" id="faq" style="background-color: var(--bg-secondary); padding-block: var(--spacing-xxl);">
        <div class="container">
          <div class="section-header text-center">
            <span class="badge" style="margin-bottom: 12px;">Help Desk</span>
            <h2>Frequently Asked Questions</h2>
            <p style="color: var(--text-secondary); margin-top: 8px;">Everything you need to know about the thinking companion.</p>
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
                <span>How does the 3-stage reflection cycle work?</span>
                <i data-lucide="chevron-down" class="faq-chevron"></i>
              </button>
              <div class="faq-answer">
                First, we prompt you to <strong>Reflect</strong> (uncover details). Then, we assist you to <strong>Focus</strong> (highlighting biases, assumptions, and blind spots). Finally, we restrict action outputs to <strong>one next step</strong> so you move forward without distraction.
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
                <span>What are the different AI models in settings and when should I use them?</span>
                <i data-lucide="chevron-down" class="faq-chevron"></i>
              </button>
              <div class="faq-answer">
                In your account settings page, you can choose between:
                <ul style="margin-top: 8px; padding-left: 16px; display: flex; flex-direction: column; gap: 4px; font-size: 14px; color: var(--text-secondary);">
                  <li><strong>Gemini 3.5 Flash (Recommended):</strong> Designed for highly responsive, immediate reflection loops. Excellent for everyday dilemmas.</li>
                  <li><strong>Gemini 2.5 Pro:</strong> Deploys advanced logic matrices for heavy, high-stakes decisions requiring multi-step history and deep context.</li>
                  <li><strong>Gemini 2.0 Flash:</strong> Balanced capabilities suitable for fast-reflecting metrics.</li>
                </ul>
              </div>
            </div>

            <div class="faq-item">
              <button class="faq-question">
                <span>Can I use Clarity AI if I don't have an active API Key?</span>
                <i data-lucide="chevron-down" class="faq-chevron"></i>
              </button>
              <div class="faq-answer">
                Yes! If no \`GEMINI_API_KEY\` is configured in the environment, Clarity AI will automatically fall back to <strong>Demo Mode</strong>. It will generate simulated Socratic questions, prioritize core blind spots, and offer action prompts based on your input content, so you can test the structured reflection workflow completely offline.
              </div>
            </div>
          </div>
        </div>
      </section>

    </div>
  `;
}

export function initLanding() {
  // 0. Setup Theme Toggle Click Handler
  const themeToggle = document.getElementById('theme-toggle-btn');
  if (themeToggle) {
    themeToggle.addEventListener('click', () => {
      if (window.ClarityAI && window.ClarityAI.toggleTheme) {
        window.ClarityAI.toggleTheme();
      }
    });
  }

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
