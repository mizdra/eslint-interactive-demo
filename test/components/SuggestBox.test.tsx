import { act, fireEvent, render } from '@testing-library/preact';
import userEvent from '@testing-library/user-event';
import { datatype } from 'faker';
import { SuggestionBox } from '../../src/components/SuggestionBox';
import { forwardMatcher } from '../../src/lib/matcher';
import { CursorPosition } from '../../src/types';
import { keydownEnterEvent, keydownEscapeEvent } from '../helpers/key';

// ダミーの props
const cursorPosition: CursorPosition = { styleTop: 0, styleLeft: 0 };
const items = [
  { key: 1, element: <span key="1">a</span>, searchableText: 'a', value: 'a' },
  { key: 2, element: <span key="2">ab</span>, searchableText: 'ab', value: 'ab' },
  { key: 3, element: <span key="3">abc</span>, searchableText: 'abc', value: 'abc' },
  { key: 4, element: <span key="4">z</span>, searchableText: 'z', value: 'z' },
];
const matcher = forwardMatcher;
const props = { cursorPosition, items, matcher };

describe('SuggestionBox', () => {
  describe('open === false の時', () => {
    test('ポップアップも QueryInput も表示されない', () => {
      const { asFragment, queryByTestId } = render(<SuggestionBox open={false} {...props} />);
      expect(queryByTestId('popup-menu')).toBeNull();
      expect(queryByTestId('query-input')).toBeNull();
      expect(asFragment()).toMatchSnapshot();
    });
  });
  describe('open === true の時', () => {
    test('ポップアップと QueryInput が表示される', () => {
      const { asFragment, queryByTestId } = render(<SuggestionBox open {...props} />);
      expect(queryByTestId('popup-menu')).not.toBeNull();
      expect(queryByTestId('query-input')).not.toBeNull();
      expect(asFragment()).toMatchSnapshot();
    });
    test('Esc 押下で onClose が呼び出される', async () => {
      const onClose = jest.fn();
      render(<SuggestionBox open {...props} onClose={onClose} />);
      expect(onClose).toBeCalledTimes(0);
      await act(() => {
        fireEvent(document, keydownEscapeEvent);
      });
      expect(onClose).toBeCalledTimes(1);
    });
    describe('ポップアップに表示されるアイテムが空の時', () => {
      test('emptyMessage でアイテムが空の時のメッセージを変更できる', () => {
        const emptyMessage = datatype.string();
        const { getByText } = render(<SuggestionBox open {...props} items={[]} emptyMessage={emptyMessage} />);
        expect(getByText(emptyMessage)).toBeInTheDocument();
      });
    });
    describe('ポップアップに表示されるアイテムが空でない時', () => {
      test('QueryInput に文字を入力するとアイテムがフィルタされる', () => {
        const { getByTestId } = render(<SuggestionBox open {...props} />);
        const buttonContainer = getByTestId('button-container');
        const queryInput = getByTestId('query-input');

        expect(buttonContainer.childElementCount).toEqual(4);
        userEvent.type(queryInput, 'a');
        expect(buttonContainer.childElementCount).toEqual(3);
        userEvent.type(queryInput, 'b');
        expect(buttonContainer.childElementCount).toEqual(2);
        userEvent.type(queryInput, 'c');
        expect(buttonContainer.childElementCount).toEqual(1);
        userEvent.type(queryInput, 'd');
        expect(buttonContainer.childElementCount).toEqual(0);
      });
      test('Enter 押下で onSelect が呼び出される', async () => {
        const onSelect = jest.fn();
        render(<SuggestionBox open {...props} onSelect={onSelect} />);
        expect(onSelect).toBeCalledTimes(0);
        await act(() => {
          fireEvent(document, keydownEnterEvent);
        });
        expect(onSelect).toBeCalledTimes(1);
      });
    });
  });
  test('open === true になった時に、 QueryInput に入力された文字がリセットされる', () => {
    const { rerender, getByTestId } = render(<SuggestionBox open {...props} />);

    userEvent.type(getByTestId('query-input'), 'a');
    expect(getByTestId('query-input')).toHaveValue('a');

    rerender(<SuggestionBox open={false} {...props} />);
    rerender(<SuggestionBox open {...props} />);

    expect(getByTestId('query-input')).toHaveValue('');
  });
});
