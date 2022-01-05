/**
 * @jest-environment jsdom
 */
import '@testing-library/jest-dom';
import {
  render,
  cleanup,
  fireEvent,
  within,
  act,
  waitFor,
} from '@testing-library/react';
import { useMemo } from 'react';
import { IntlProvider, MessageFormatElement } from 'react-intl';
import en from '../../../../compiled-lang/en.json';
import ja from '../../../../compiled-lang/ja.json';
import { Times } from '../../../components/Timer/Times';
import { withPrefix } from '../../../utils/withPrefix';
import { zerofill } from '../../../utils/zerofill';
import { SessionCollection } from '../../timer/data/timeData';
import { useSessions } from '../hooks/useSessions';
import { Session } from './SessionToolbar';

const selectMessages = (
  locale: string
): Record<string, string> | Record<string, MessageFormatElement[]> => {
  switch (locale) {
    case 'en':
      return en;
    case 'ja':
      return ja;
    default:
      return en;
  }
};

Element.prototype.scrollTo = () => void 0;

jest.mock('../../../components/common/ToggleButton.css', () => '');

jest.useFakeTimers();
describe('SessionToolbar', () => {
  const currentSession: { current: null | SessionCollection } = {
    current: null,
  };
  beforeEach(() => {
    currentSession.current = null;
    localStorage.clear();
  });
  afterEach(() => {
    cleanup();
  });
  const TestComponent = () => {
    const {
      sessions,
      currentSessionCollection,
      sessionIndex,
      variationName,
      setSessionIndex,
      changeSessionName,
      addSession,
      deleteSession,

      changeToDNF,
      imposePenalty,
      undoDNF,
      undoPenalty,
      deleteRecord,
      insertRecord,
    } = useSessions();
    currentSession.current = sessions;
    const { times } = currentSessionCollection.sessions[sessionIndex];

    return (
      <IntlProvider
        locale={'ja'}
        defaultLocale="en"
        messages={selectMessages('ja')}
      >
        <Session
          times={times}
          sessionIndex={sessionIndex}
          setSessionIndex={setSessionIndex}
          currentVariation={variationName}
          changeSessionName={changeSessionName}
          sessions={sessions}
          addSession={addSession}
          deleteSession={deleteSession}
          recordListComponent={useMemo(
            () => (
              <div tw="pt-12">
                <Times
                  times={times}
                  changeToDNF={changeToDNF}
                  imposePenalty={imposePenalty}
                  undoDNF={undoDNF}
                  undoPenalty={undoPenalty}
                  deleteRecord={deleteRecord}
                  insertRecord={insertRecord}
                />
              </div>
            ),
            []
          )}
        />
        <div id="portal_root" />
      </IntlProvider>
    );
  };
  test('initial state', () => {
    const { getByRole, queryByTestId } = render(<TestComponent />);
    const session1 = `${zerofill(new Date().getMonth() + 1, 2)}-${zerofill(
      new Date().getDate(),
      2
    )} session1`;

    expect(getByRole('textbox', { name: 'session name' })).toHaveValue(
      session1
    );
    expect(getByRole('button', { name: 'prev session' })).toBeDisabled();
    expect(getByRole('button', { name: 'next session' })).toBeDisabled();
    expect(queryByTestId('record-list')).toBeNull();
  });
  test('initial state with localStorage', () => {
    const data: SessionCollection = [
      {
        sessions: [
          { times: [], name: 'first' },
          { times: [], name: 'second' },
          { times: [], name: 'third' },
        ],
        selectedSessionIndex: 1,
        variation: { name: '3x3', scramble: '3x3' },
      },
    ];
    localStorage.setItem(
      withPrefix('sessions'),
      JSON.stringify({ data, version: 2 })
    );
    localStorage.setItem(withPrefix('variation'), '3x3');

    const { getByRole, queryByRole, queryByTestId } = render(<TestComponent />);
    expect(getByRole('textbox', { name: 'session name' })).toHaveValue(
      'second'
    );
    expect(getByRole('button', { name: 'prev session' })).not.toBeDisabled();
    expect(getByRole('button', { name: 'next session' })).not.toBeDisabled();
    expect(queryByTestId('record-list')).toBeNull();
    expect(queryByRole('button', { name: 'open record list' })).not.toBeNull();
    expect(queryByRole('button', { name: 'close record list' })).toBeNull();
  });
  describe('add new session', () => {
    // カレントセッションが末尾のときにボタンを押すと、追加されたセッションがカレントセッションになる
    test('if user adds session when current session is at end, added session becomes current', () => {
      const { getByRole } = render(<TestComponent />);
      getByRole('button', { name: 'add session' }).click();
      const session1 = `${zerofill(new Date().getMonth() + 1, 2)}-${zerofill(
        new Date().getDate(),
        2
      )} session1`;
      const session2 = `${zerofill(new Date().getMonth() + 1, 2)}-${zerofill(
        new Date().getDate(),
        2
      )} session2`;

      expect(getByRole('button', { name: 'prev session' })).not.toBeDisabled();
      expect(getByRole('button', { name: 'next session' })).toBeDisabled();
      expect(getByRole('textbox', { name: 'session name' })).toHaveValue(
        session2
      );

      getByRole('button', { name: 'prev session' }).click();
      expect(getByRole('button', { name: 'prev session' })).toBeDisabled();
      expect(getByRole('button', { name: 'next session' })).not.toBeDisabled();
      expect(getByRole('textbox', { name: 'session name' })).toHaveValue(
        session1
      );

      getByRole('button', { name: 'add session' }).click();
      expect(getByRole('button', { name: 'prev session' })).toBeDisabled();
      expect(getByRole('button', { name: 'next session' })).not.toBeDisabled();
      expect(getByRole('textbox', { name: 'session name' })).toHaveValue(
        session1
      );
    });
    test(`if user adds session when current session is not at end, current session doesn't change`, () => {
      const { getByRole } = render(<TestComponent />);
      const session1 = `${zerofill(new Date().getMonth() + 1, 2)}-${zerofill(
        new Date().getDate(),
        2
      )} session1`;

      getByRole('button', { name: 'add session' }).click();
      getByRole('button', { name: 'prev session' }).click();
      getByRole('button', { name: 'add session' }).click();
      expect(getByRole('button', { name: 'prev session' })).toBeDisabled();
      expect(getByRole('button', { name: 'next session' })).not.toBeDisabled();
      expect(getByRole('textbox', { name: 'session name' })).toHaveValue(
        session1
      );
    });
  });
  test('toggle record list', () => {
    const { getByRole, queryByRole, getByTestId } = render(<TestComponent />);

    getByRole('button', { name: 'open record list' }).click();
    expect(getByTestId('record-list')).toHaveAttribute('aria-hidden', 'false');
    expect(queryByRole('button', { name: 'close record list' })).not.toBeNull();
    expect(queryByRole('button', { name: 'open record list' })).toBeNull();

    getByRole('button', { name: 'close record list' }).click();
    expect(getByTestId('record-list')).toHaveAttribute('aria-hidden', 'true');
    expect(queryByRole('button', { name: 'open record list' })).not.toBeNull();
    expect(queryByRole('button', { name: 'close record list' })).toBeNull();
  });
  test('change session name', () => {
    const { getByRole } = render(<TestComponent />);

    fireEvent.change(getByRole('textbox', { name: 'session name' }), {
      target: { value: 'replaced' },
    });
    expect(getByRole('textbox', { name: 'session name' })).toHaveValue(
      'replaced'
    );
    expect(currentSession.current[0].sessions[0].name).toBe('replaced');
  });
  describe('session list modal', () => {
    test('toggle sort order', () => {
      const data: SessionCollection = [
        {
          sessions: [
            { times: [{ time: 1234, scramble: '', date: 0 }], name: 'first' },
            { times: [{ time: 1234, scramble: '', date: 0 }], name: 'second' },
            { times: [{ time: 1234, scramble: '', date: 0 }], name: 'third' },
          ],
          selectedSessionIndex: 0,
          variation: { name: '3x3', scramble: '3x3' },
        },
      ];
      localStorage.setItem(
        withPrefix('sessions'),
        JSON.stringify({ data, version: 2 })
      );
      localStorage.setItem(withPrefix('variation'), '3x3');

      const { getByRole } = render(<TestComponent />);
      getByRole('button', { name: 'open record list' }).click();
      act(() => {
        getByRole('button', { name: 'session list' }).click();
      });

      const list = within(
        getByRole('list', { name: 'session list' })
      ).getAllByRole('listitem');
      expect(list[0]).toHaveTextContent('first');
      expect(list[1]).toHaveTextContent('second');
      expect(list[2]).toHaveTextContent('third');

      getByRole('button', { name: 'sort by latest' }).click();
      const list2 = within(
        getByRole('list', { name: 'session list' })
      ).getAllByRole('listitem');
      expect(list2[0]).toHaveTextContent('third');
      expect(list2[1]).toHaveTextContent('second');
      expect(list2[2]).toHaveTextContent('first');
    });
  });
  test('graph', async () => {
    const data: SessionCollection = [
      {
        sessions: [
          { times: [{ time: 1234, scramble: '', date: 0 }], name: 'first' },
          { times: [{ time: 1234, scramble: '', date: 0 }], name: 'second' },
          { times: [{ time: 1234, scramble: '', date: 0 }], name: 'third' },
        ],
        selectedSessionIndex: 0,
        variation: { name: '3x3', scramble: '3x3' },
      },
    ];
    localStorage.setItem(
      withPrefix('sessions'),
      JSON.stringify({ data, version: 2 })
    );

    const { getByRole, container } = render(<TestComponent />);
    const originalWarn = console.warn;
    console.warn = jest.fn(); // Recharts の ResponsiveContainer が width/height 関連で warning 吐くんだけど、
    // 実際の環境ではちゃんと動いているし、そこまでテストで見る必要ないと思う。なので単にログを無効化することにした

    getByRole('button', { name: 'open record list' }).click();
    getByRole('button', { name: 'show graph' }).click();
    expect(
      container.querySelector('.recharts-responsive-container')
    ).not.toBeInTheDocument();
    await waitFor(() =>
      expect(
        container.querySelector('.recharts-responsive-container')
      ).toBeInTheDocument()
    );
    getByRole('button', { name: 'close record list' }).click();
    getByRole('button', { name: 'open record list' }).click();
    expect(
      container.querySelector('.recharts-responsive-container')
    ).toBeInTheDocument();
    console.warn = originalWarn;
  });
});
