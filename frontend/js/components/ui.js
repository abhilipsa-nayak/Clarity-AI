// Clarity AI — UI Elements & Loading Skeletons

export function getChatSkeletonHTML() {
  return `
    <div class="chat-bubble chat-bubble--assistant fade-in" style="width: 80%;">
      <div class="skeleton-box" style="width: 35%; height: 18px; margin-bottom: 12px;"></div>
      <div class="skeleton-box" style="width: 90%; height: 15px; margin-bottom: 8px;"></div>
      <div class="skeleton-box" style="width: 85%; height: 15px; margin-bottom: 8px;"></div>
      <div class="skeleton-box" style="width: 60%; height: 15px; margin-bottom: 16px;"></div>
      
      <div class="skeleton-box" style="width: 25%; height: 18px; margin-bottom: 12px;"></div>
      <div class="skeleton-box" style="width: 95%; height: 15px; margin-bottom: 8px;"></div>
      <div class="skeleton-box" style="width: 70%; height: 15px; margin-bottom: 16px;"></div>
      
      <div class="skeleton-box" style="width: 30%; height: 18px; margin-bottom: 12px;"></div>
      <div class="skeleton-box" style="width: 80%; height: 15px;"></div>
    </div>
  `;
}

export function getHistorySkeletonHTML() {
  let items = '';
  for (let i = 0; i < 4; i++) {
    items += `
      <div class="session-item">
        <div style="display: flex; flex-direction: column; gap: 8px; width: 60%;">
          <div class="skeleton-box" style="width: 80%; height: 16px;"></div>
          <div class="skeleton-box" style="width: 40%; height: 12px;"></div>
        </div>
        <div class="skeleton-box" style="width: 30px; height: 30px; border-radius: 50%;"></div>
      </div>
    `;
  }
  return `<div class="recent-sessions-list">${items}</div>`;
}
