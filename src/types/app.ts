export interface QuasarDialogEmits {
  (e: 'ok', payload: any): true;
  (e: 'hide'): true;
}

export type DraftClockOperation = 'start' | 'pause' | 'reset';

export interface IDraftClockStatus {
  operation: DraftClockOperation;
  time: number;
  /** the public message for non league managers */
  message?: string;
}

export interface ILeagueMember {
  /** the member's name */
  name: string;
  /** team name */
  teamName: string;
  /** draft order */
  draftOrder: number;
  /** email address */
  email: string;
  /** the picks for the member */
  picks?: number[];
}