/* Sex Education: дополнение к существующим страницам nav_*.html.
 * Не меняет Google Sheets, фильтры, материалы и логику доступа.
 * Подключать перед </body>: <script src="./nav-swipe-back.js"></script>
 */
(function () {
  'use strict';
  const returnTo = 'index.html?view=catalogs';
  let navigating = false;
  function isModalOpen() {
    return document.getElementById('accessModal')?.classList.contains('show');
  }
  function backToCatalogs() {
    if (isModalOpen()) {
      if (typeof window.closeModal === 'function') window.closeModal();
      return;
    }
    if (navigating) return;
    navigating = true;
    window.location.assign(returnTo);
  }
  function installBackButton() {
    const topbar = document.querySelector('.topbar');
    if (topbar && !document.getElementById('sexedNavBack')) {
      const button = document.createElement('button');
      button.id = 'sexedNavBack';
      button.type = 'button';
      button.textContent = '← Назад';
      button.setAttribute('aria-label','Вернуться к выбору каталога');
      button.className = 'back-link';
      button.style.cssText = 'font-family:inherit;line-height:1.3;flex-shrink:0';
      button.addEventListener('click',backToCatalogs);
      const placeholder = topbar.lastElementChild;
      if (placeholder?.tagName === 'DIV' && !placeholder.children.length && !placeholder.textContent.trim()) placeholder.replaceWith(button);
      else topbar.appendChild(button);
    }
    try {
      const back = window.Telegram?.WebApp?.BackButton;
      if (back?.onClick) { back.onClick(backToCatalogs); back.show(); }
    } catch (_) {}
  }
  let start = null;
  document.addEventListener('touchstart',function(event) {
    start = null;
    if(event.touches.length !== 1) return;
    const t = event.touches[0];
    if(t.clientX > 34) return;
    start={x:t.clientX,y:t.clientY,at:Date.now()};
  },{passive:true});
  document.addEventListener('touchend',function(event) {
    if(!start||!event.changedTouches.length) return;
    const t=event.changedTouches[0],dx=t.clientX-start.x,dy=t.clientY-start.y;
    if(dx>78&&Math.abs(dy)<Math.max(40,dx*.45)&&Date.now()-start.at<1250) backToCatalogs();
    start=null;
  },{passive:true});
  document.addEventListener('touchcancel',function(){start=null;},{passive:true});
  if(document.readyState==='loading') document.addEventListener('DOMContentLoaded',installBackButton,{once:true});
  else installBackButton();
})();
