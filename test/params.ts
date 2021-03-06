import { Test, test } from 'beater';
import assert from 'power-assert';
import { params } from '../src/params';

const category = '/params ';
const tests: Test[] = [
  test(category + 'template without parameters', () => {
    const p = params('/users');
    assert.deepEqual(p('/users'), {});
    assert.deepEqual(p('/users/'), null);
    assert.deepEqual(p('/users/%20'), null);
    assert.deepEqual(p('/users/123'), null);
    assert.deepEqual(p('/users/abc'), null);
    assert.deepEqual(p('/users/123/'), null);
  }),

  test(category + 'template with parameter', () => {
    const p = params('/users/{id}');
    assert.deepEqual(p('/users'), null);
    assert.deepEqual(p('/users/'), { id: '' });
    assert.deepEqual(p('/users/%20'), { id: ' ' });
    assert.deepEqual(p('/users/123'), { id: '123' });
    assert.deepEqual(p('/users/abc'), { id: 'abc' });
    assert.deepEqual(p('/users/123/'), null);
  }),

  test(category + 'template with strict parameter', () => {
    const p = params('/users/{id}', { id: /^\d+$/ });
    assert.deepEqual(p('/users'), null);
    assert.deepEqual(p('/users/'), null);
    assert.deepEqual(p('/users/%20'), null);
    assert.deepEqual(p('/users/123'), { id: '123' });
    assert.deepEqual(p('/users/abc'), null);
    assert.deepEqual(p('/users/123/'), null);
  }),

  test(category + 'template with parameters', () => {
    const p = params('/users/{userId}/posts/{id}');
    assert.deepEqual(p('/users'), null);
    assert.deepEqual(p('/users/a'), null);
    assert.deepEqual(p('/users/a/posts/'), { userId: 'a', id: '' });
    assert.deepEqual(p('/users/a/posts/1'), { userId: 'a', id: '1' });
    assert.deepEqual(p('/users//posts/'), { userId: '', id: '' });
    assert.deepEqual(p('/users/a/posts/1/'), null);
  }),

  test(category + 'template with strict parameters', () => {
    const p = params(
      '/users/{userId}/posts/{id}',
      { userId: /^\w+$/, id: /^\d+$/ }
    );
    assert.deepEqual(p('/users'), null);
    assert.deepEqual(p('/users/a'), null);
    assert.deepEqual(p('/users/a/posts/'), null);
    assert.deepEqual(p('/users/a/posts/1'), { userId: 'a', id: '1' });
    assert.deepEqual(p('/users//posts/'), null);
    assert.deepEqual(p('/users/a/posts/1/'), null);
  }),

  test(category + 'template with duplicated parameters', () => {
    const p = params('/users/{id}/posts/{id}');
    assert.deepEqual(p('/users'), null);
    assert.deepEqual(p('/users/a'), null);
    assert.deepEqual(p('/users/a/posts/a'), { id: 'a' });
    assert.deepEqual(p('/users/a/posts/b'), null);
    assert.deepEqual(p('/users//posts/'), { id: '' });
    assert.deepEqual(p('/users/%20/posts/%20'), { id: ' ' });
  }),

  // don't use this behavior.
  test(category + 'no separator (`/`)', () => {
    const p1 = params('/{x}{y}');
    assert.deepEqual(p1('/'), { x: '', y: '' });
    assert.deepEqual(p1('/a'), { x: 'a', y: '' });
    assert.deepEqual(p1('/a1'), { x: 'a1', y: '' });
    const p2 = params('/{x}{y}', { x: /\w/, y: /\d/ });
    assert.deepEqual(p2('/'), null);
    assert.deepEqual(p2('/a'), null);
    assert.deepEqual(p2('/a1'), null); // no match (x: 'a1', y: '')
  }),

  test(category + 'parameter pattern is passed the decoded value', () => {
    const p1 = params('/users/{id}', { id: /^ $/ });
    assert.deepEqual(p1('/users/%20'), { id: ' ' });
    const p2 = params('/users/{id}', { id: /^%20$/ });
    assert.deepEqual(p2('/users/%20'), null);
  })
];

export { tests };
