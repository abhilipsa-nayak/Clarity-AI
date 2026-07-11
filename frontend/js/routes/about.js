// Clarity AI — About Page View & Controller

export function renderAbout() {
  return `
    <main class="container" style="padding-block: var(--spacing-xl); display: flex; flex-direction: column; gap: var(--spacing-xl);">
      <div class="section-header text-center" style="max-width: 800px; margin: 0 auto;">
        <span class="badge">Our Philosophy</span>
        <h1 style="font-size: 40px; margin-top: var(--spacing-sm);">Strengthening Human Agency</h1>
        <p style="font-size: 18px; color: var(--text-secondary); margin-top: var(--spacing-sm);">Clarity AI is designed to act as a cognitive mirror, turning raw technology into a strategic companion for self-directed reflection.</p>
      </div>

      <!-- Two Column Layout: Vision vs Problem -->
      <div class="grid grid-cols-2 gap-lg" style="align-items: start;">
        <div class="settings-card" style="padding: var(--spacing-lg); border-radius: var(--radius-lg); border: 1px solid var(--border-color); background-color: var(--bg-secondary); min-height: 280px; display: flex; flex-direction: column; gap: 12px;">
          <h3 style="font-size: 20px; font-weight: 600; display: flex; align-items: center; gap: 8px;">
            <i data-lucide="compass" style="color: var(--accent);"></i>
            <span>Our Vision</span>
          </h3>
          <p style="font-size: 15px; line-height: 1.6; color: var(--text-secondary);">
            Clarity AI is an AI-powered thinking companion that helps users improve their thinking and decision-making skills. 
            Instead of providing direct answers, the application guides users through a structured reflection process, 
            encouraging independent reasoning, deep de-biasing, and meaningful, conscious action.
          </p>
        </div>

        <div class="settings-card" style="padding: var(--spacing-lg); border-radius: var(--radius-lg); border: 1px solid var(--border-color); background-color: var(--bg-secondary); min-height: 280px; display: flex; flex-direction: column; gap: 12px; border-color: rgba(239, 68, 68, 0.2);">
          <h3 style="font-size: 20px; font-weight: 600; display: flex; align-items: center; gap: 8px; color: var(--error);">
            <i data-lucide="alert-triangle"></i>
            <span>The Problem Statement</span>
          </h3>
          <p style="font-size: 15px; line-height: 1.6; color: var(--text-secondary);">
            Most modern AI tools focus on providing instant, commoditized answers. This habituates users to offload critical thinking, reducing their cognitive independence and problem-solving capacities. Clarity AI reverses this dependency, encouraging users to write out and inspect their thoughts first.
          </p>
        </div>
      </div>

      <!-- Target Audience Section -->
      <div style="background-color: var(--bg-secondary); border: 1px solid var(--border-color); padding: var(--spacing-xl); border-radius: var(--radius-lg); margin-top: var(--spacing-md);">
        <h3 style="font-size: 22px; font-weight: 600; display: flex; align-items: center; gap: 8px; margin-bottom: var(--spacing-md);">
          <i data-lucide="users" style="color: var(--accent);"></i>
          <span>Who is Clarity AI built for?</span>
        </h3>
        
        <div class="grid grid-cols-2 gap-lg" style="font-size: 15px; line-height: 1.6;">
          <div style="display: flex; flex-direction: column; gap: 16px;">
            <div style="display: flex; gap: 12px; align-items: start;">
              <div style="width: 32px; height: 32px; border-radius: var(--radius-sm); background-color: var(--accent-light); color: var(--accent); display: flex; align-items: center; justify-content: center; flex-shrink: 0;"><i data-lucide="graduation-cap" style="width: 18px; height: 18px;"></i></div>
              <div>
                <strong>Students & MCA/B.Tech Learners</strong>
                <p style="color: var(--text-secondary); font-size: 14px; margin-top: 4px;">Develop analytical critical thinking and learn to unpack project blockages or study path dilemmas methodically.</p>
              </div>
            </div>
            
            <div style="display: flex; gap: 12px; align-items: start;">
              <div style="width: 32px; height: 32px; border-radius: var(--radius-sm); background-color: var(--accent-light); color: var(--accent); display: flex; align-items: center; justify-content: center; flex-shrink: 0;"><i data-lucide="briefcase" style="width: 18px; height: 18px;"></i></div>
              <div>
                <strong>Freshers & Job Seekers</strong>
                <p style="color: var(--text-secondary); font-size: 14px; margin-top: 4px;">Structure career strategies, inspect interview anxieties, and make balanced choices between competing job offers.</p>
              </div>
            </div>
          </div>

          <div style="display: flex; flex-direction: column; gap: 16px;">
            <div style="display: flex; gap: 12px; align-items: start;">
              <div style="width: 32px; height: 32px; border-radius: var(--radius-sm); background-color: var(--accent-light); color: var(--accent); display: flex; align-items: center; justify-content: center; flex-shrink: 0;"><i data-lucide="user-check" style="width: 18px; height: 18px;"></i></div>
              <div>
                <strong>Professionals & Leaders</strong>
                <p style="color: var(--text-secondary); font-size: 14px; margin-top: 4px;">De-bias strategic business planning, establish healthy workplace boundaries, and mitigate day-to-day burnout factors.</p>
              </div>
            </div>
            
            <div style="display: flex; gap: 12px; align-items: start;">
              <div style="width: 32px; height: 32px; border-radius: var(--radius-sm); background-color: var(--accent-light); color: var(--accent); display: flex; align-items: center; justify-content: center; flex-shrink: 0;"><i data-lucide="heart" style="width: 18px; height: 18px;"></i></div>
              <div>
                <strong>Self-Reflective Thinkers</strong>
                <p style="color: var(--text-secondary); font-size: 14px; margin-top: 4px;">Anyone looking to build a high-performance habit of structured reasoning and introspection for their personal life.</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  `;
}

export function initAbout() {
  // Setup about page logic if any
}
