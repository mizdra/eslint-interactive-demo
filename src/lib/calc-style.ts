import { JSX } from 'preact';
import { CursorPosition } from '../types';

/** .popup-menu のスタイルを計算する */
export function calcPopupMenuStyle(cursorPosition: CursorPosition): JSX.CSSProperties {
  return { top: cursorPosition.styleTop };
}

/** .triangle のスタイルを計算する */
export function calcTriangleStyle(cursorPosition: CursorPosition, isEmpty: boolean): JSX.CSSProperties {
  return {
    left: cursorPosition.styleLeft,
    ...(isEmpty
      ? {
          borderTopColor: '#555',
        }
      : {}),
  };
}

/** .button-container のスタイルを計算する */
export function calcButtonContainerStyle(
  editorWidth: number,
  buttonContainerWidth: number,
  cursorPosition: CursorPosition,
  isEmpty: boolean,
): JSX.CSSProperties {
  const translateX = (cursorPosition.styleLeft / editorWidth) * 100;
  // 端に寄り過ぎないように、translateX の上限・下限を設定しておく。
  // 値はフィーリングで決めており、何かに裏打ちされたものではないので、変えたかったら適当に変える。
  const minTranslateX = (20 / buttonContainerWidth) * 100;
  const maxTranslateX = 100 - minTranslateX;

  return {
    left: cursorPosition.styleLeft,
    transform: `translateX(-${Math.max(minTranslateX, Math.min(translateX, maxTranslateX))}%)`,
    ...(isEmpty
      ? {
          color: '#eee',
          fontSize: '11px',
          display: 'inline-block',
          padding: '0 5px',
          cursor: 'not-allowed',
          backgroundColor: '#555',
        }
      : {}),
  };
}

/** <SearchInput> のスタイルを計算する */
export function calcSearchInputStyle(editorWidth: number, cursorPosition: CursorPosition): JSX.CSSProperties {
  const translateX = (cursorPosition.styleLeft / editorWidth) * 100;

  return {
    position: 'absolute',
    top: cursorPosition.styleTop,
    left: cursorPosition.styleLeft,
    transform: `translateX(-${translateX}%)`,
  };
}
