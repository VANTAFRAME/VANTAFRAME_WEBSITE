import { atom } from 'nanostores';
export const isPrivacyOpen = atom(false);
// Click handler for <a href="/polityka-prywatnosci/"> links: with JavaScript the policy opens in the
// modal, without it (or with a modified click, e.g. open in a new tab) the link goes to the page.
export const openPrivacyFromLink = (event, beforeOpen) => {
  if (event.defaultPrevented || event.button !== 0 || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;
  event.preventDefault();
  if (beforeOpen) beforeOpen();
  else togglePrivacy(true);
};
export const togglePrivacy = (state) => isPrivacyOpen.set(state !== undefined ? state : !isPrivacyOpen.get());