export function getExperienceModal(state: {
  isChatOpen: boolean; hasLore: boolean; hasReward: boolean; hasQuest: boolean;
  isScannerOpen: boolean; isPersonaModalOpen: boolean; isTrailerOpen: boolean; hasDestination: boolean;
}) {
  if (state.isChatOpen) return 'chat';
  if (state.hasLore) return 'lore';
  if (state.hasReward) return 'reward';
  if (state.hasQuest) return 'quest';
  if (state.isScannerOpen) return 'scanner';
  if (state.isPersonaModalOpen) return 'persona';
  if (state.isTrailerOpen) return 'trailer';
  if (state.hasDestination) return 'destination';
  return null;
}
