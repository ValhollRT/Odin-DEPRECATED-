import { createAction, props } from '@ngrx/store';
import { ClipboardTreeNode } from 'src/app/models/clipboard.model';

export const copyToClipboardTreeNode = createAction(
  '[CLIPBOARD TREE NODE] COPY',
  props<{ clipboardTreeNode: ClipboardTreeNode }>()
);

export const pasteToClipboardTreeNode = createAction(
  '[CLIPBOARD TREE NODE] PASTE'
);
