/**
 * @jest-environment jsdom
 */
import '@testing-library/jest-dom';
import { render, cleanup } from '@testing-library/react';
import { useMemo } from 'react';
import { IntlProvider, MessageFormatElement } from 'react-intl';
import en from '../../../../compiled-lang/en.json';
import ja from '../../../../compiled-lang/ja.json';
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

jest.useFakeTimers();
describe('SessionToolbar', () => {
  beforeEach(() => {
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
    } = useSessions();
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
              <div />
            ),
            []
          )}
        />
      </IntlProvider>
    );
  };
  test('initial state', () => {
    const { getByRole } = render(<TestComponent />);
    const session1 = `${zerofill(new Date().getMonth() + 1, 2)}-${zerofill(
      new Date().getDate(),
      2
    )} session1`;

    expect(getByRole('textbox', { name: 'session name' })).toHaveValue(
      session1
    );
    expect(getByRole('button', { name: 'prev session' })).toBeDisabled();
    expect(getByRole('button', { name: 'next session' })).toBeDisabled();
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

    const { getByRole } = render(<TestComponent />);
    expect(getByRole('textbox', { name: 'session name' })).toHaveValue(
      'second'
    );
    expect(getByRole('button', { name: 'prev session' })).not.toBeDisabled();
    expect(getByRole('button', { name: 'next session' })).not.toBeDisabled();
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
});
