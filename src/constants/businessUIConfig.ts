import { BusinessCategory } from '../store/AppContext';

export interface BusinessUIConfig {
  dashboardTitle: string;
  acceptingLabel: string;
  acceptingSub: string;
  closedLabel: string;
  closedSub: string;
  openAction: string;
  closeAction: string;
  overviewTitle: string;
  waitingLabel: string;
  servingLabel: string;
  doneLabel: string;
  todayLabel: string;
  earningsLabel: string;
  manageQueueTitle: string;
  nextAction: string;
  pauseAction: string;
  resumeAction: string;
  stopAction: string;
  continueAction: string;
  quickActionsTitle: string;
  galleryAction: string;
  staffAction: string;
  settingsAction: string;
}

export const DEFAULT_UI_CONFIG: BusinessUIConfig = {
  dashboardTitle: 'Business Dashboard',
  acceptingLabel: 'Accepting Customers',
  acceptingSub: 'Customers can join queue',
  closedLabel: 'Closed Currently',
  closedSub: 'No new customers',
  openAction: 'Open',
  closeAction: 'Close',
  overviewTitle: 'Today\'s Overview',
  waitingLabel: 'Waiting',
  servingLabel: 'Serving',
  doneLabel: 'Done',
  todayLabel: 'Total Today',
  earningsLabel: 'Earnings',
  manageQueueTitle: 'Manage Queue',
  nextAction: 'Next Customer',
  pauseAction: 'Pause Queue',
  resumeAction: 'Resume Queue',
  stopAction: 'Stop Queue',
  continueAction: 'Continue Queue',
  quickActionsTitle: 'Quick Actions',
  galleryAction: 'Gallery',
  staffAction: 'Staff',
  settingsAction: 'Settings'
};

export const getUIConfig = (category: BusinessCategory | string): BusinessUIConfig => {
  // We can customize this based on category later, returning DEFAULT for now
  return DEFAULT_UI_CONFIG;
};
