import React, { useState, useEffect } from 'react'
import { renderHook, act } from '@testing-library/react-hooks'
import { pipe, subscribe } from 'callbag-common'

import useValueCallbag from './index'

test('the hook works.', () => {
  let res = []

  const { result, unmount } = renderHook(() => {
    const [x, setX] = useState(0)
    const [y, setY] = useState(0)

    const val$ = useValueCallbag(x)
    useEffect(
      () =>
        pipe(
          val$,
          subscribe({
            next: v => res.push(v),
            complete: () => (res = 'DONE'),
          }),
        ),
      [],
    )

    return {
      nextX: () => setX(x + 1),
      nextY: () => setY(y + 1),
    }
  })

  expect(res).toStrictEqual([0])

  act(() => result.current.nextX())
  expect(res).toStrictEqual([0, 1])

  act(() => result.current.nextY())
  expect(res).toStrictEqual([0, 1])

  act(() => result.current.nextX())
  expect(res).toStrictEqual([0, 1, 2])

  unmount()
  expect(res).toBe('DONE')
})
