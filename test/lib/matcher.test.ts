import { combinedMatcher, fuzzyMatcher, includesMatcher, startsWithMatcher } from '../../src/lib/matcher';

describe('fuzzyMatcher', () => {
  describe('query に曖昧一致する items のみが返る', () => {
    test('query の長さが 0〜2 なら 1 文字も誤字を許容しない', () => {
      expect(
        fuzzyMatcher('aa', [
          // マッチする
          { key: 0, element: '', searchableText: 'aa', value: '' },
          // マッチしない
          { key: 1, element: '', searchableText: 'ab', value: '' },
        ]),
      ).toStrictEqual([{ key: 0, element: '', searchableText: 'aa', value: '' }]);
    });
    test('query の長さが 3〜5 なら 1 文字まで誤字を許容する', () => {
      expect(
        fuzzyMatcher('aaa', [
          // マッチする
          { key: 0, element: '', searchableText: 'aaa', value: '' },
          { key: 1, element: '', searchableText: 'aab', value: '' },
          // マッチしない
          { key: 2, element: '', searchableText: 'abb', value: '' },
        ]),
      ).toStrictEqual([
        { key: 0, element: '', searchableText: 'aaa', value: '' },
        { key: 1, element: '', searchableText: 'aab', value: '' },
      ]);
    });
    test('query の長さが 6〜8 なら 2 文字まで誤字を許容する', () => {
      expect(
        fuzzyMatcher('aaaaaa', [
          // マッチする
          { key: 0, element: '', searchableText: 'aaaaaa', value: '' },
          { key: 1, element: '', searchableText: 'aaaaab', value: '' },
          { key: 2, element: '', searchableText: 'aaaabb', value: '' },
          // マッチしない
          { key: 3, element: '', searchableText: 'aaabbb', value: '' },
        ]),
      ).toStrictEqual([
        { key: 0, element: '', searchableText: 'aaaaaa', value: '' },
        { key: 1, element: '', searchableText: 'aaaaab', value: '' },
        { key: 2, element: '', searchableText: 'aaaabb', value: '' },
      ]);
    });
    test('query の長さが 9 以上なら 3 文字まで誤字を許容する', () => {
      expect(
        fuzzyMatcher('aaaaaaaaa', [
          // マッチする
          { key: 0, element: '', searchableText: 'aaaaaaaaa', value: '' },
          { key: 1, element: '', searchableText: 'aaaaaaaab', value: '' },
          { key: 2, element: '', searchableText: 'aaaaaaabb', value: '' },
          { key: 3, element: '', searchableText: 'aaaaaabbb', value: '' },
          // マッチしない
          { key: 4, element: '', searchableText: 'aaaaabbbb', value: '' },
        ]),
      ).toStrictEqual([
        { key: 0, element: '', searchableText: 'aaaaaaaaa', value: '' },
        { key: 1, element: '', searchableText: 'aaaaaaaab', value: '' },
        { key: 2, element: '', searchableText: 'aaaaaaabb', value: '' },
        { key: 3, element: '', searchableText: 'aaaaaabbb', value: '' },
      ]);
    });
  });
  describe('曖昧度の昇順で返ってくる', () => {
    expect(
      fuzzyMatcher('aaaaaaaaaaaa', [
        { key: 0, element: '', searchableText: 'aaaaaaaaabbb', value: '' },
        { key: 1, element: '', searchableText: 'aaaaaaaaaccc', value: '' },
        { key: 2, element: '', searchableText: 'aaaaaaaaaabb', value: '' },
        { key: 3, element: '', searchableText: 'aaaaaaaaaacc', value: '' },
        { key: 4, element: '', searchableText: 'aaaaaaaaaaab', value: '' },
        { key: 5, element: '', searchableText: 'aaaaaaaaaaac', value: '' },
        { key: 6, element: '', searchableText: 'aaaaaaaaaaaa', value: '' },
      ]),
    ).toStrictEqual([
      { key: 6, element: '', searchableText: 'aaaaaaaaaaaa', value: '' },
      { key: 4, element: '', searchableText: 'aaaaaaaaaaab', value: '' },
      { key: 5, element: '', searchableText: 'aaaaaaaaaaac', value: '' },
      { key: 2, element: '', searchableText: 'aaaaaaaaaabb', value: '' },
      { key: 3, element: '', searchableText: 'aaaaaaaaaacc', value: '' },
      { key: 0, element: '', searchableText: 'aaaaaaaaabbb', value: '' },
      { key: 1, element: '', searchableText: 'aaaaaaaaaccc', value: '' },
    ]);
  });
  describe('部分一致する', () => {
    expect(
      fuzzyMatcher('foo', [
        { key: 0, element: '', searchableText: 'foo bar', value: '' },
        { key: 1, element: '', searchableText: 'bar foo baz', value: '' },
      ]),
    ).toStrictEqual([
      { key: 0, element: '', searchableText: 'foo bar', value: '' },
      { key: 1, element: '', searchableText: 'bar foo baz', value: '' },
    ]);
  });
  test('マッチは capital-insensitive', () => {
    expect(
      fuzzyMatcher('foo', [
        { key: 0, element: '', searchableText: 'Foo', value: '' },
        { key: 1, element: '', searchableText: 'FOO', value: '' },
        { key: 2, element: '', searchableText: 'fOo', value: '' },
      ]),
    ).toStrictEqual([
      { key: 0, element: '', searchableText: 'Foo', value: '' },
      { key: 1, element: '', searchableText: 'FOO', value: '' },
      { key: 2, element: '', searchableText: 'fOo', value: '' },
    ]);
    expect(
      fuzzyMatcher('FOO', [
        { key: 0, element: '', searchableText: 'Foo', value: '' },
        { key: 1, element: '', searchableText: 'FOO', value: '' },
        { key: 2, element: '', searchableText: 'fOo', value: '' },
      ]),
    ).toStrictEqual([
      { key: 0, element: '', searchableText: 'Foo', value: '' },
      { key: 1, element: '', searchableText: 'FOO', value: '' },
      { key: 2, element: '', searchableText: 'fOo', value: '' },
    ]);
  });
});

describe('startsWithMatcher', () => {
  test('query に前方一致する items のみが返る', () => {
    expect(
      startsWithMatcher('foo', [
        // マッチする
        { key: 0, element: '', searchableText: 'foo', value: '' },
        { key: 1, element: '', searchableText: 'foo bar', value: '' },
        // マッチしない
        { key: 2, element: '', searchableText: 'bar foo', value: '' },
        { key: 3, element: '', searchableText: 'fo bar', value: '' },
      ]),
    ).toStrictEqual([
      { key: 0, element: '', searchableText: 'foo', value: '' },
      { key: 1, element: '', searchableText: 'foo bar', value: '' },
    ]);
  });
  test('マッチは capital-insensitive', () => {
    expect(
      startsWithMatcher('foo', [
        { key: 0, element: '', searchableText: 'Foo', value: '' },
        { key: 1, element: '', searchableText: 'FOO', value: '' },
        { key: 2, element: '', searchableText: 'fOo', value: '' },
      ]),
    ).toStrictEqual([
      { key: 0, element: '', searchableText: 'Foo', value: '' },
      { key: 1, element: '', searchableText: 'FOO', value: '' },
      { key: 2, element: '', searchableText: 'fOo', value: '' },
    ]);
    expect(
      startsWithMatcher('FOO', [
        { key: 0, element: '', searchableText: 'Foo', value: '' },
        { key: 1, element: '', searchableText: 'FOO', value: '' },
        { key: 2, element: '', searchableText: 'fOo', value: '' },
      ]),
    ).toStrictEqual([
      { key: 0, element: '', searchableText: 'Foo', value: '' },
      { key: 1, element: '', searchableText: 'FOO', value: '' },
      { key: 2, element: '', searchableText: 'fOo', value: '' },
    ]);
  });
});

describe('includesMatcher', () => {
  test('query に部分一致する items のみが返る', () => {
    expect(
      includesMatcher('foo', [
        // マッチする
        { key: 0, element: '', searchableText: 'foo', value: '' },
        { key: 1, element: '', searchableText: 'foo bar', value: '' },
        { key: 2, element: '', searchableText: 'foo bar baz', value: '' },
        { key: 3, element: '', searchableText: 'bar foo baz', value: '' },
        { key: 4, element: '', searchableText: 'bar baz foo', value: '' },
        // マッチしない
        { key: 3, element: '', searchableText: 'fo bar', value: '' },
      ]),
    ).toStrictEqual([
      { key: 0, element: '', searchableText: 'foo', value: '' },
      { key: 1, element: '', searchableText: 'foo bar', value: '' },
      { key: 2, element: '', searchableText: 'foo bar baz', value: '' },
      { key: 3, element: '', searchableText: 'bar foo baz', value: '' },
      { key: 4, element: '', searchableText: 'bar baz foo', value: '' },
    ]);
  });
  test('マッチは capital-insensitive', () => {
    expect(
      includesMatcher('foo', [
        { key: 0, element: '', searchableText: 'Foo', value: '' },
        { key: 1, element: '', searchableText: 'FOO', value: '' },
        { key: 2, element: '', searchableText: 'fOo', value: '' },
      ]),
    ).toStrictEqual([
      { key: 0, element: '', searchableText: 'Foo', value: '' },
      { key: 1, element: '', searchableText: 'FOO', value: '' },
      { key: 2, element: '', searchableText: 'fOo', value: '' },
    ]);
    expect(
      includesMatcher('FOO', [
        { key: 0, element: '', searchableText: 'Foo', value: '' },
        { key: 1, element: '', searchableText: 'FOO', value: '' },
        { key: 2, element: '', searchableText: 'fOo', value: '' },
      ]),
    ).toStrictEqual([
      { key: 0, element: '', searchableText: 'Foo', value: '' },
      { key: 1, element: '', searchableText: 'FOO', value: '' },
      { key: 2, element: '', searchableText: 'fOo', value: '' },
    ]);
  });
});

describe('combinedMatcher', () => {
  test('前方一致 > 部分一致 > 曖昧検索 の順で並び替えられて返される', () => {
    expect(
      combinedMatcher('aaaa', [
        // 曖昧一致する
        { key: 1, element: '', searchableText: 'aaab', value: '' },
        { key: 2, element: '', searchableText: 'aaac', value: '' },
        // 部分一致する
        { key: 3, element: '', searchableText: 'bbbb aaaa cccc', value: '' },
        { key: 4, element: '', searchableText: 'bbbb cccc aaaa', value: '' },
        // 前方一致する
        { key: 5, element: '', searchableText: 'aaaa', value: '' },
        { key: 6, element: '', searchableText: 'aaaa bbbb', value: '' },
        // マッチしない
        { key: 7, element: '', searchableText: 'mizdra', value: '' },
      ]),
    ).toStrictEqual([
      { key: 5, element: '', searchableText: 'aaaa', value: '' },
      { key: 6, element: '', searchableText: 'aaaa bbbb', value: '' },
      { key: 3, element: '', searchableText: 'bbbb aaaa cccc', value: '' },
      { key: 4, element: '', searchableText: 'bbbb cccc aaaa', value: '' },
      { key: 1, element: '', searchableText: 'aaab', value: '' },
      { key: 2, element: '', searchableText: 'aaac', value: '' },
    ]);
  });
});