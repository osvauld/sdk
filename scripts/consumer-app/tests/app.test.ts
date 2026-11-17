import { expect, it } from 'vitest';
import { fakeHost } from '@osvauld/sdk/testing';
import { addNote } from '../src/app';

const until = async (ok: () => boolean) => {
  for (let i = 0; i < 100 && !ok(); i++) await new Promise(r => setTimeout(r, 10));
  expect(ok()).toBe(true);
};

it('opens a doc and a write reaches the host', async () => {
  const host = fakeHost({ docs: ['review'] });
  const osv = host.connect();
  expect(await osv.writable('review')).toBe(true);
  await addNote(osv, 'hello');
  await until(() => JSON.stringify(host.stored.get('review')!.toJSON()).includes('hello'));
  expect(await osv.me()).toEqual({ name: 'Tester', roles: ['member'] });
});

it('sees a refusal handled: the doc is put back and onRefused hears the code', async () => {
  const host = fakeHost({ docs: ['review'], refuse: 'rule_refused' });
  const osv = host.connect();
  const heard: string[] = [];
  osv.onRefused((_path, why) => heard.push(why));
  await addNote(osv, 'nope');
  await until(() => heard.length > 0);
  expect(heard).toEqual(['rule_refused']);
  expect((await osv.doc('review')).toJSON()).toEqual({});
});

it('reports a read-only document and an undeclared one', async () => {
  const host = fakeHost({ docs: { review: { writer: false } } });
  const osv = host.connect();
  expect(await osv.writable('review')).toBe(false);
  await expect(osv.doc('other')).rejects.toMatchObject({ code: 'undeclared_path' });
});
