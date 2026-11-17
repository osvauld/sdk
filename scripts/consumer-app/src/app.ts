// A tiny app page's logic, written against @osvauld/sdk types only (no loro-crdt of its own).
import type { LoroDoc, Osv } from '@osvauld/sdk';

export async function addNote(osv: Osv, text: string): Promise<LoroDoc> {
  const doc = await osv.doc('review');
  doc.getList('notes').push(text);
  doc.commit();
  return doc;
}
