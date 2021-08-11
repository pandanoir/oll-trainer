/**
 * @jest-environment jsdom
 */
import { act, renderHook } from '@testing-library/react-hooks';
import { withPrefix } from '../withPrefix';
import { zerofill } from '../zerofill';
import { migration, useSessions } from './useSessions';

describe('migration', () => {
  beforeEach(() => {
    localStorage.clear();
  });
  it('returns default value when null is given', () => {
    expect(migration(null)).toEqual({
      data: [
        {
          variation: { name: '3x3', scramble: '3x3' },
          sessions: [
            {
              times: [],
              name: `${zerofill(new Date().getMonth() + 1, 2)}-${zerofill(
                new Date().getDate(),
                2
              )} session1`,
            },
          ],
          selectedSessionIndex: 0,
        },
      ],
      version: 2,
    });
    const { result } = renderHook(() => useSessions());
    expect(result.current.sessions).toEqual([
      {
        variation: { name: '3x3', scramble: '3x3' },
        sessions: [
          {
            times: [],
            name: `${zerofill(new Date().getMonth() + 1, 2)}-${zerofill(
              new Date().getDate(),
              2
            )} session1`,
          },
        ],
        selectedSessionIndex: 0,
      },
    ]);
  });
  test('migration from v1 to v2', () => {
    const sessionData = [
      {
        times: [
          {
            penalty: false,
            isDNF: false,
            scramble:
              "D B' R2 U F2 U' F2 R2 D2 L2 F2 L2 B2 F' R U' L' D L' R' B",
            date: 1610156937000,
            time: 28205,
          },
          {
            penalty: false,
            isDNF: false,
            scramble:
              "R B' R2 B2 U2 B2 U L2 D2 B2 L2 B2 D B2 L F' R' F U' L2 U'",
            date: 1610156991000,
            time: 32080,
          },
          {
            penalty: false,
            isDNF: false,
            scramble:
              "U' F' R' B2 R' U2 L B2 R' U2 R2 U2 R F' U2 F' D' B2 R' U B'",
            date: 1610157052000,
            time: 32507,
          },
          {
            penalty: false,
            isDNF: false,
            scramble: "R' L2 D' L2 R2 D' F2 D B2 F2 U2 B R2 F U R F R2 B' L",
            date: 1610157101000,
            time: 23400,
          },
          {
            penalty: false,
            isDNF: false,
            scramble: "B' F2 U2 L2 U' L2 F2 D2 U2 R' F2 U2 R F' L U L R2",
            date: 1610157155000,
            time: 24971,
          },
        ],
        name: '1.9 333',
      },
      {
        times: [
          {
            penalty: false,
            isDNF: false,
            scramble: "U B' D2 L2 B' D L' R2 B U2 F' L2 B2 D2 R2 F2 D2 R' F",
            date: 1610263269000,
            time: 18153,
          },
          {
            penalty: true,
            isDNF: false,
            scramble: "B' D2 B L2 U2 B' L2 F U2 F' U2 F' L' R U R' F2 R' U2 L'",
            date: 1610263306000,
            time: 20662,
          },
          {
            penalty: false,
            isDNF: false,
            scramble: "L D2 B D2 R2 B U2 F2 L2 F R2 F2 U2 R U F' R2 D' U' L' B",
            date: 1610263352000,
            time: 24295,
          },
          {
            penalty: false,
            isDNF: false,
            scramble: "B2 D B2 U2 F2 B' L B L2 U2 R' B2 D2 R' U2 R' L2 B2",
            date: 1610263406000,
            time: 21715,
          },
        ],
        name: '1.10 333',
      },
      {
        times: [
          {
            penalty: false,
            isDNF: false,
            scramble:
              "U R2 D' F2 R2 B2 F2 U2 L2 U F2 L' D2 B' F' D2 U' R D2 L D2",
            date: 1610535906000,
            time: 26884,
          },
          {
            penalty: false,
            isDNF: false,
            scramble: "B2 D2 R2 F' D L' U' F2 R2 F R2 L2 F U2 F U2 F2 L B'",
            date: 1610535952000,
            time: 27907,
          },
          {
            penalty: false,
            isDNF: true,
            scramble: "B' L2 D2 B D2 B U2 F' L2 B L D2 U' R D2 U R B'",
            date: 1610536000000,
            time: 28010,
          },
        ],
        name: '1.13 333',
      },
    ];
    expect(migration(sessionData)).toEqual({
      data: [
        {
          variation: { name: '3x3', scramble: '3x3' },
          sessions: sessionData,
          selectedSessionIndex: 0,
        },
      ],
      version: 2,
    });
    localStorage.setItem(withPrefix('sessions'), JSON.stringify(sessionData));
    const { result } = renderHook(() => useSessions());
    expect(result.current.sessions).toEqual([
      {
        variation: { name: '3x3', scramble: '3x3' },
        sessions: sessionData,
        selectedSessionIndex: 0,
      },
    ]);
  });
  test('migration from v1 to v2', () => {
    const sessionData = [
      {
        times: [
          {
            penalty: false,
            isDNF: false,
            scramble:
              "D B' R2 U F2 U' F2 R2 D2 L2 F2 L2 B2 F' R U' L' D L' R' B",
            date: 1610156937000,
            time: 28205,
          },
          {
            penalty: false,
            isDNF: false,
            scramble:
              "R B' R2 B2 U2 B2 U L2 D2 B2 L2 B2 D B2 L F' R' F U' L2 U'",
            date: 1610156991000,
            time: 32080,
          },
          {
            penalty: false,
            isDNF: false,
            scramble:
              "U' F' R' B2 R' U2 L B2 R' U2 R2 U2 R F' U2 F' D' B2 R' U B'",
            date: 1610157052000,
            time: 32507,
          },
          {
            penalty: false,
            isDNF: false,
            scramble: "R' L2 D' L2 R2 D' F2 D B2 F2 U2 B R2 F U R F R2 B' L",
            date: 1610157101000,
            time: 23400,
          },
          {
            penalty: false,
            isDNF: false,
            scramble: "B' F2 U2 L2 U' L2 F2 D2 U2 R' F2 U2 R F' L U L R2",
            date: 1610157155000,
            time: 24971,
          },
        ],
        name: '1.9 333',
      },
      {
        times: [
          {
            penalty: false,
            isDNF: false,
            scramble: "U B' D2 L2 B' D L' R2 B U2 F' L2 B2 D2 R2 F2 D2 R' F",
            date: 1610263269000,
            time: 18153,
          },
          {
            penalty: true,
            isDNF: false,
            scramble: "B' D2 B L2 U2 B' L2 F U2 F' U2 F' L' R U R' F2 R' U2 L'",
            date: 1610263306000,
            time: 20662,
          },
          {
            penalty: false,
            isDNF: false,
            scramble: "L D2 B D2 R2 B U2 F2 L2 F R2 F2 U2 R U F' R2 D' U' L' B",
            date: 1610263352000,
            time: 24295,
          },
          {
            penalty: false,
            isDNF: false,
            scramble: "B2 D B2 U2 F2 B' L B L2 U2 R' B2 D2 R' U2 R' L2 B2",
            date: 1610263406000,
            time: 21715,
          },
        ],
        name: '1.10 333',
      },
      {
        times: [
          {
            penalty: false,
            isDNF: false,
            scramble:
              "U R2 D' F2 R2 B2 F2 U2 L2 U F2 L' D2 B' F' D2 U' R D2 L D2",
            date: 1610535906000,
            time: 26884,
          },
          {
            penalty: false,
            isDNF: false,
            scramble: "B2 D2 R2 F' D L' U' F2 R2 F R2 L2 F U2 F U2 F2 L B'",
            date: 1610535952000,
            time: 27907,
          },
          {
            penalty: false,
            isDNF: true,
            scramble: "B' L2 D2 B D2 B U2 F' L2 B L D2 U' R D2 U R B'",
            date: 1610536000000,
            time: 28010,
          },
        ],
        name: '1.13 333',
      },
    ];
    expect(migration(sessionData)).toEqual({
      data: [
        {
          variation: { name: '3x3', scramble: '3x3' },
          sessions: sessionData,
          selectedSessionIndex: 0,
        },
      ],
      version: 2,
    });
    localStorage.setItem(withPrefix('sessions'), JSON.stringify(sessionData));
    localStorage.setItem(withPrefix('sessionIndex'), JSON.stringify(3));
    const { result } = renderHook(() => useSessions());
    expect(result.current.sessions).toEqual([
      {
        variation: { name: '3x3', scramble: '3x3' },
        sessions: sessionData,
        selectedSessionIndex: 3,
      },
    ]);
  });
});
describe('useSessions', () => {
  beforeEach(() => {
    localStorage.clear();
  });
  it('', () => {
    const { result } = renderHook(() => useSessions());
    act(() => {
      result.current.setSessionIndex(100);
    });
    expect(result.current.sessionIndex).toBe(100);
    act(() => {
      result.current.setSessionIndex((n) => n + 1);
    });
    expect(result.current.sessionIndex).toBe(101);
  });
  test('addSession()', () => {
    const { result } = renderHook(() => useSessions());
    expect(result.current.currentSessionCollection.sessions.length).toBe(1);
    act(() => result.current.addSession());
    expect(result.current.currentSessionCollection.sessions.length).toBe(2);
  });
  test('deleteSession()', () => {
    const { result } = renderHook(() => useSessions());
    expect(result.current.currentSessionCollection.sessions.length).toBe(1);
    act(() => result.current.deleteSession(0));
    expect(result.current.currentSessionCollection.sessions.length).toBe(1);
  });

  test('deleteSession() 2', () => {
    const { result } = renderHook(() =>
      useSessions([
        {
          variation: { name: '3x3', scramble: '3x3' },
          sessions: [
            { name: '3:session1', times: [] },
            { name: '3:session2', times: [] },
            { name: '3:session3', times: [] },
          ],
          selectedSessionIndex: 2,
        },
      ])
    );
    expect(result.current.currentSessionCollection.sessions).toEqual([
      { name: '3:session1', times: [] },
      { name: '3:session2', times: [] },
      { name: '3:session3', times: [] },
    ]);
    act(() => result.current.deleteSession(2));
    expect(result.current.currentSessionCollection.sessions).toEqual([
      { name: '3:session1', times: [] },
      { name: '3:session2', times: [] },
    ]);
    expect(result.current.sessionIndex).toBe(1);
  });
  test('deleteSession() 3', () => {
    const { result } = renderHook(() =>
      useSessions([
        {
          variation: { name: '3x3', scramble: '3x3' },
          sessions: [
            { name: '3:session1', times: [] },
            { name: '3:session2', times: [] },
            { name: '3:session3', times: [] },
          ],
          selectedSessionIndex: 0,
        },
      ])
    );
    expect(result.current.currentSessionCollection.sessions).toEqual([
      { name: '3:session1', times: [] },
      { name: '3:session2', times: [] },
      { name: '3:session3', times: [] },
    ]);
    act(() => result.current.deleteSession(1));
    expect(result.current.currentSessionCollection.sessions).toEqual([
      { name: '3:session1', times: [] },
      { name: '3:session3', times: [] },
    ]);
    expect(result.current.sessionIndex).toBe(0);
  });
  test('setVariation()', () => {
    const { result } = renderHook(() =>
      useSessions([
        {
          variation: { name: '3x3', scramble: '3x3' },
          sessions: [{ name: '3:session1', times: [] }],
          selectedSessionIndex: 0,
        },
        {
          variation: { name: '2x2', scramble: '2x2' },
          sessions: [
            { name: '2:session1', times: [] },
            { name: '2:session2', times: [] },
          ],
          selectedSessionIndex: 1,
        },
        {
          variation: { name: '4x4', scramble: '4x4' },
          sessions: [
            { name: '4:session1', times: [] },
            { name: '4:session2', times: [] },
            { name: '4:session3', times: [] },
            { name: '4:session4', times: [] },
            { name: '4:session5', times: [] },
          ],
          selectedSessionIndex: 3,
        },
      ])
    );
    expect(result.current.sessionIndex).toBe(0);
    expect(
      result.current.currentSessionCollection.sessions[
        result.current.sessionIndex
      ].name
    ).toBe('3:session1');
    expect(result.current.currentSessionCollection.variation.name).toBe('3x3');
    act(() => {
      result.current.setVariation({ name: '2x2', scramble: '2x2' });
    });
    expect(result.current.sessionIndex).toBe(1);
    expect(
      result.current.currentSessionCollection.sessions[
        result.current.sessionIndex
      ].name
    ).toBe('2:session2');
    expect(result.current.currentSessionCollection.variation.name).toBe('2x2');
    act(() => {
      result.current.setVariation({ name: '4x4', scramble: '4x4' });
    });
    expect(result.current.sessionIndex).toBe(3);
    expect(
      result.current.currentSessionCollection.sessions[
        result.current.sessionIndex
      ].name
    ).toBe('4:session4');
    expect(result.current.currentSessionCollection.variation.name).toBe('4x4');
    act(() => {
      result.current.setVariation({ name: '3x3', scramble: '3x3' });
    });
    expect(result.current.sessionIndex).toBe(0);
    expect(
      result.current.currentSessionCollection.sessions[
        result.current.sessionIndex
      ].name
    ).toBe('3:session1');
    expect(result.current.currentSessionCollection.variation.name).toBe('3x3');
  });
  test('changeSessionName()', () => {
    const { result } = renderHook(() =>
      useSessions([
        {
          variation: { name: '3x3', scramble: '3x3' },
          sessions: [{ name: '3:session1', times: [] }],
          selectedSessionIndex: 0,
        },
        {
          variation: { name: '2x2', scramble: '2x2' },
          sessions: [
            { name: '2:session1', times: [] },
            { name: '2:session2', times: [] },
          ],
          selectedSessionIndex: 1,
        },
        {
          variation: { name: '4x4', scramble: '4x4' },
          sessions: [
            { name: '4:session1', times: [] },
            { name: '4:session2', times: [] },
            { name: '4:session3', times: [] },
            { name: '4:session4', times: [] },
            { name: '4:session5', times: [] },
          ],
          selectedSessionIndex: 3,
        },
      ])
    );
    act(() => {
      result.current.setVariation({ name: '4x4', scramble: '4x4' });
    });
    act(() => {
      result.current.changeSessionName('4:renamed-session');
    });
    expect(result.current.sessionIndex).toBe(3);
    expect(result.current.currentSessionCollection.sessions).toEqual([
      { name: '4:session1', times: [] },
      { name: '4:session2', times: [] },
      { name: '4:session3', times: [] },
      { name: '4:renamed-session', times: [] },
      { name: '4:session5', times: [] },
    ]);
  });
});
