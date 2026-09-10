import { atom } from 'nanostores';

export const isPrivacyOpen = atom(false);

export const togglePrivacy = (state) => isPrivacyOpen.set(state !== undefined ? state : !isPrivacyOpen.get());
