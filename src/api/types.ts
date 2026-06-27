export type PendingMutationType =
  | 'POST_NNA'
  | 'PATCH_TIMELINE'
  | 'UPLOAD_PHOTO';

export interface PendingMutation {
  id?: number;
  type: PendingMutationType;
  endpoint: string;
  payload: unknown;
  createdAt: number;
  retries: number;
}
