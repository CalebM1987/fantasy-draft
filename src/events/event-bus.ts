import mitt from 'mitt'

export const EventBus = mitt<{
  'draft-clock-expired': void;
}>()