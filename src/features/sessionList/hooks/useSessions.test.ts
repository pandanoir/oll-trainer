/**
 * @jest-environment jsdom
 */
jest.useFakeTimers().setSystemTime(new Date('2020-09-30').getTime());

import { renderHook } from '@testing-library/react-hooks';
import { RecoilRoot } from 'recoil';
import { withPrefix } from '../../../utils/withPrefix';
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
              name: '09-30 session1',
              isLocked: false,
            },
          ],
          selectedSessionIndex: 0,
        },
      ],
      version: 3,
    });
    const { result } = renderHook(() => useSessions(), { wrapper: RecoilRoot });
    expect(result.current.sessions).toEqual([
      {
        variation: { name: '3x3', scramble: '3x3' },
        sessions: [
          {
            times: [],
            name: '09-30 session1',
            isLocked: false,
          },
        ],
        selectedSessionIndex: 0,
      },
    ]);
  });
  test('migration from v1 to v3', () => {
    const sessionData = [
      {
        variation: { name: '3x3', scramble: '3x3' },
        sessions: [
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
            ],
            name: '1.9 333',
          },
          {
            times: [
              {
                penalty: false,
                isDNF: false,
                scramble:
                  "U B' D2 L2 B' D L' R2 B U2 F' L2 B2 D2 R2 F2 D2 R' F",
                date: 1610263269000,
                time: 18153,
              },
              {
                penalty: true,
                isDNF: false,
                scramble:
                  "B' D2 B L2 U2 B' L2 F U2 F' U2 F' L' R U R' F2 R' U2 L'",
                date: 1610263306000,
                time: 20662,
              },
            ],
            name: '1.10 333',
          },
        ],
        selectedSessionIndex: 0,
      },
    ];
    expect(migration({ data: sessionData, version: 2 })).toEqual({
      data: [
        {
          variation: { name: '3x3', scramble: '3x3' },
          sessions: [
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
              ],
              name: '1.9 333',
              isLocked: false,
            },
            {
              times: [
                {
                  penalty: false,
                  isDNF: false,
                  scramble:
                    "U B' D2 L2 B' D L' R2 B U2 F' L2 B2 D2 R2 F2 D2 R' F",
                  date: 1610263269000,
                  time: 18153,
                },
                {
                  penalty: true,
                  isDNF: false,
                  scramble:
                    "B' D2 B L2 U2 B' L2 F U2 F' U2 F' L' R U R' F2 R' U2 L'",
                  date: 1610263306000,
                  time: 20662,
                },
              ],
              name: '1.10 333',
              isLocked: false,
            },
          ],
          selectedSessionIndex: 0,
        },
      ],
      version: 3,
    });
  });
  test('migration from v2 to v3', () => {
    const sessionData = {
      data: [
        {
          variation: { name: '3x3', scramble: '3x3' },
          sessions: [
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
              ],
              name: '1.9 333',
            },
            {
              times: [
                {
                  penalty: false,
                  isDNF: false,
                  scramble:
                    "U B' D2 L2 B' D L' R2 B U2 F' L2 B2 D2 R2 F2 D2 R' F",
                  date: 1610263269000,
                  time: 18153,
                },
                {
                  penalty: true,
                  isDNF: false,
                  scramble:
                    "B' D2 B L2 U2 B' L2 F U2 F' U2 F' L' R U R' F2 R' U2 L'",
                  date: 1610263306000,
                  time: 20662,
                },
              ],
              name: '1.10 333',
            },
          ],
          selectedSessionIndex: 0,
        },
      ],
      version: 2,
    };
    expect(migration(sessionData)).toEqual({
      data: [
        {
          variation: { name: '3x3', scramble: '3x3' },
          sessions: [
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
              ],
              name: '1.9 333',
              isLocked: false,
            },
            {
              times: [
                {
                  penalty: false,
                  isDNF: false,
                  scramble:
                    "U B' D2 L2 B' D L' R2 B U2 F' L2 B2 D2 R2 F2 D2 R' F",
                  date: 1610263269000,
                  time: 18153,
                },
                {
                  penalty: true,
                  isDNF: false,
                  scramble:
                    "B' D2 B L2 U2 B' L2 F U2 F' U2 F' L' R U R' F2 R' U2 L'",
                  date: 1610263306000,
                  time: 20662,
                },
              ],
              name: '1.10 333',
              isLocked: false,
            },
          ],
          selectedSessionIndex: 0,
        },
      ],
      version: 3,
    });
  });
  test('useSessions uses migration', () => {
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
    localStorage.setItem(withPrefix('sessions'), JSON.stringify(sessionData));
    const { result } = renderHook(() => useSessions(), { wrapper: RecoilRoot });
    expect(result.current.sessions).toEqual([
      {
        variation: { name: '3x3', scramble: '3x3' },
        sessions: [
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
                scramble:
                  "R' L2 D' L2 R2 D' F2 D B2 F2 U2 B R2 F U R F R2 B' L",
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
            isLocked: false,
          },
          {
            times: [
              {
                penalty: false,
                isDNF: false,
                scramble:
                  "U B' D2 L2 B' D L' R2 B U2 F' L2 B2 D2 R2 F2 D2 R' F",
                date: 1610263269000,
                time: 18153,
              },
              {
                penalty: true,
                isDNF: false,
                scramble:
                  "B' D2 B L2 U2 B' L2 F U2 F' U2 F' L' R U R' F2 R' U2 L'",
                date: 1610263306000,
                time: 20662,
              },
              {
                penalty: false,
                isDNF: false,
                scramble:
                  "L D2 B D2 R2 B U2 F2 L2 F R2 F2 U2 R U F' R2 D' U' L' B",
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
            isLocked: false,
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
            isLocked: false,
          },
        ],
        selectedSessionIndex: 0,
      },
    ]);
  });
});
