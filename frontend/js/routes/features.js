// Clarity AI — Features Page View & Controller

export function renderFeatures() {
  return `
    <main class="container" style="padding-block: var(--spacing-xl); display: flex; flex-direction: column; gap: var(--spacing-xl);">
      <div class="section-header text-center" style="max-width: 800px; margin: 0 auto;">
        <span class="badge badge--accent">Product Capabilities</span>
        <h1 style="font-size: 40px; margin-top: var(--spacing-sm);">Designed for Mindful Decision-Making</h1>
        <p style="font-size: 18px; color: var(--text-secondary); margin-top: var(--spacing-sm);">Explore the core capabilities built into Clarity AI to guide you from confusion to absolute clarity.</p>
      </div>

      <!-- Feature Grid -->
      <div class="grid grid-cols-3 gap-lg" style="margin-top: var(--spacing-md);">
        <div class="settings-card" style="padding: var(--spacing-lg); border-radius: var(--radius-lg); border: 1px solid var(--border-color); background-color: var(--bg-secondary);">
          <div class="feature-card__icon"><i data-lucide="refresh-cw"></i></div>
          <h3 style="font-size: 20px; font-weight: 600; margin-block: 12px 8px;">The Socratic Loop</h3>
          <p style="font-size: 14px; line-height: 1.6; color: var(--text-secondary);">
            Instead of feeding you answers, the AI prompts you with deep, open-ended questions tailored to your context. It helps you unpack emotional states, discover core priorities, and solve problems on your own terms.
          </p>
        </div>

        <div class="settings-card" style="padding: var(--spacing-lg); border-radius: var(--radius-lg); border: 1px solid var(--border-color); background-color: var(--bg-secondary);">
          <div class="feature-card__icon"><i data-lucide="eye"></i></div>
          <h3 style="font-size: 20px; font-weight: 600; margin-block: 12px 8px;">Cognitive Bias Detection</h3>
          <p style="font-size: 14px; line-height: 1.6; color: var(--text-secondary);">
            Our focus algorithms carefully analyze your input statements to highlight potential blind spots, unchecked assumptions, and cognitive biases—gently reflecting them back to de-bias your thought process.
          </p>
        </div>

        <div class="settings-card" style="padding: var(--spacing-lg); border-radius: var(--radius-lg); border: 1px solid var(--border-color); background-color: var(--bg-secondary);">
          <div class="feature-card__icon"><i data-lucide="target"></i></div>
          <h3 style="font-size: 20px; font-weight: 600; margin-block: 12px 8px;">One-Step Action Enforcer</h3>
          <p style="font-size: 14px; line-height: 1.6; color: var(--text-secondary);">
            To prevent analysis paralysis, the AI strictly limits action items to exactly one concrete, immediate next step. This allows you to build momentum and take action without cognitive overload.
          </p>
        </div>

        <div class="settings-card" style="padding: var(--spacing-lg); border-radius: var(--radius-lg); border: 1px solid var(--border-color); background-color: var(--bg-secondary);">
          <div class="feature-card__icon" style="color: var(--warning); background-color: rgba(245, 158, 11, 0.08);"><i data-lucide="flame"></i></div>
          <h3 style="font-size: 20px; font-weight: 600; margin-block: 12px 8px;">Habit Streaks Tracking</h3>
          <p style="font-size: 14px; line-height: 1.6; color: var(--text-secondary);">
            Gamified streaking tracks how consistently you engage in self-reflection. Build your streak day by day and advance your reflection rank from "Initiate" to "Strategist" and "Philosopher".
          </p>
        </div>

        <div class="settings-card" style="padding: var(--spacing-lg); border-radius: var(--radius-lg); border: 1px solid var(--border-color); background-color: var(--bg-secondary);">
          <div class="feature-card__icon" style="color: var(--accent); background-color: var(--accent-light);"><i data-lucide="cpu"></i></div>
          <h3 style="font-size: 20px; font-weight: 600; margin-block: 12px 8px;">Thinking Model Selection</h3>
          <p style="font-size: 14px; line-height: 1.6; color: var(--text-secondary);">
            Select your preferred thinking companion directly in Settings. Leverage the speed of Gemini 3.5 Flash for fast thoughts, or route details to Gemini 2.5 Pro for deep reasoning.
          </p>
        </div>

        <div class="settings-card" style="padding: var(--spacing-lg); border-radius: var(--radius-lg); border: 1px solid var(--border-color); background-color: var(--bg-secondary);">
          <div class="feature-card__icon" style="color: var(--success); background-color: rgba(34, 197, 94, 0.08);"><i data-lucide="download"></i></div>
          <h3 style="font-size: 20px; font-weight: 600; margin-block: 12px 8px;">History Exports</h3>
          <p style="font-size: 14px; line-height: 1.6; color: var(--text-secondary);">
            Your data belongs fully to you. Download a complete JSON archive of all your thinking sessions, history metrics, and logs with a single click in your Settings panel.
          </p>
        </div>
      </div>
    </main>
  `;
}

export function initFeatures() {
  // Setup feature page logic if any (e.g. dynamic animation binders)
}
