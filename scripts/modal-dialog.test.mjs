import { test } from 'node:test';
import assert from 'node:assert/strict';
import React, { act, useState } from 'react';
import { JSDOM } from 'jsdom';
import { useModalDialog } from '../src/components/experience/useModalDialog.ts';
import { getExperienceModal } from '../src/components/experience/modal-priority.ts';

const dom = new JSDOM('<!doctype html><html><body><button id="trigger">Open dialog</button><div id="root"></div></body></html>', { url: 'http://localhost:3000' });
globalThis.window = dom.window;
globalThis.document = dom.window.document;
globalThis.HTMLElement = dom.window.HTMLElement;
globalThis.IS_REACT_ACT_ENVIRONMENT = true;
const { createRoot } = await import('react-dom/client');
// JSDOM has no layout engine. Give focusable test controls visible rectangles.
dom.window.HTMLElement.prototype.getClientRects = function () { return [{ width: 44, height: 44 }]; };
const click = element => element.dispatchEvent(new dom.window.MouseEvent('click', { bubbles: true }));
const escape = () => document.dispatchEvent(new dom.window.KeyboardEvent('keydown', { key: 'Escape', bubbles: true, cancelable: true }));

function Dialog({ id = 'dialog', onClosed = () => {} }) {
  const [open, setOpen] = useState(true);
  const close = () => { setOpen(false); onClosed(); };
  const props = useModalDialog(open, close, id);
  return open ? React.createElement('div', { ...props, id },
    React.createElement('button', { id: `${id}-close`, onClick: close, 'aria-label': 'Đóng' }, 'X'),
    React.createElement('button', { id: `${id}-content` }, 'Inside content')) : null;
}

test('X, backdrop and Escape close dialogs without content clicks closing them', async () => {
  const root = createRoot(document.getElementById('root'));
  const trigger = document.getElementById('trigger');
  document.body.style.overflow = 'scroll';
  trigger.focus();
  try {
    await act(async () => root.render(React.createElement(Dialog, { key: 'first' })));
    assert.equal(document.activeElement.id, 'dialog');
    assert.equal(document.body.style.overflow, 'hidden');
    await act(async () => click(document.getElementById('dialog-content')));
    assert.ok(document.getElementById('dialog'));
    await act(async () => click(document.getElementById('dialog-close')));
    assert.equal(document.getElementById('dialog'), null);
    assert.equal(document.body.style.overflow, 'scroll');
    assert.equal(document.activeElement, trigger);

    await act(async () => root.render(React.createElement(Dialog, { key: 'second' })));
    await act(async () => click(document.getElementById('dialog')));
    assert.equal(document.getElementById('dialog'), null);

    await act(async () => root.render(React.createElement(Dialog, { key: 'third' })));
    await act(async () => escape());
    assert.equal(document.getElementById('dialog'), null);
    assert.equal(document.body.style.overflow, 'scroll');
  } finally { await act(async () => root.unmount()); }
});

test('Escape dismisses only the top dialog and scroll remains locked until the last closes', async () => {
  const root = createRoot(document.getElementById('root'));
  try {
    await act(async () => root.render(React.createElement(React.Fragment, null,
      React.createElement(Dialog, { id: 'bottom' }), React.createElement(Dialog, { id: 'top' }))));
    await act(async () => escape());
    assert.equal(document.getElementById('top'), null);
    assert.ok(document.getElementById('bottom'));
    assert.equal(document.body.style.overflow, 'hidden');
    await act(async () => escape());
    assert.equal(document.getElementById('bottom'), null);
    assert.equal(document.body.style.overflow, 'scroll');
  } finally { await act(async () => root.unmount()); }
});

test('Trailer, scanner and quest take priority over destination; closing restores the parent', () => {
  const state = { isChatOpen: false, hasLore: false, hasReward: false, hasQuest: false, isScannerOpen: false, isPersonaModalOpen: false, isTrailerOpen: false, hasDestination: true };
  assert.equal(getExperienceModal(state), 'destination');
  assert.equal(getExperienceModal({ ...state, isTrailerOpen: true }), 'trailer');
  assert.equal(getExperienceModal({ ...state, isTrailerOpen: true, isPersonaModalOpen: true }), 'persona');
  assert.equal(getExperienceModal({ ...state, isScannerOpen: true }), 'scanner');
  assert.equal(getExperienceModal({ ...state, hasQuest: true, isScannerOpen: true }), 'quest');
  assert.equal(getExperienceModal({ ...state, hasReward: true, hasQuest: true }), 'reward');
  assert.equal(getExperienceModal({ ...state, isChatOpen: true, hasLore: true }), 'chat');
  assert.equal(getExperienceModal({ ...state, hasDestination: false }), null);
});
