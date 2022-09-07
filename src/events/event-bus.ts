import mitt from 'mitt'
import { ILeagueInfo } from '../types';

export const EventBus = mitt<{
  'draft-clock-expired': void;
  'has-loaded-league': ILeagueInfo | undefined
}>()