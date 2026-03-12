import { renderHook, act } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { useDragScroll } from './useDragScroll';

describe('useDragScroll', () => {
  it('初期状態では isDragging が false であること', () => {
    const { result } = renderHook(() => useDragScroll());
    expect(result.current.isDragging).toBe(false);
  });

  it('onMouseDown が呼ばれると isDragging が true になること', () => {
    const { result } = renderHook(() => useDragScroll());

    // ダミーの要素とイベントを作成
    const mockRefInfo = { offsetLeft: 0, scrollLeft: 0 } as HTMLDivElement;
    Object.defineProperty(result.current.ref, 'current', { value: mockRefInfo, writable: true });

    const mockEvent = {
      pageX: 100,
    } as React.MouseEvent<HTMLDivElement>;

    act(() => {
      result.current.onMouseDown(mockEvent);
    });

    expect(result.current.isDragging).toBe(true);
  });

  it('onMouseUp または onMouseLeave が呼ばれると isDragging が false に戻ること', () => {
    const { result } = renderHook(() => useDragScroll());

    const mockRefInfo = { offsetLeft: 0, scrollLeft: 0 } as HTMLDivElement;
    Object.defineProperty(result.current.ref, 'current', { value: mockRefInfo, writable: true });

    // 一旦ドラッグ状態にする
    act(() => {
      result.current.onMouseDown({ pageX: 100 } as React.MouseEvent<HTMLDivElement>);
    });
    expect(result.current.isDragging).toBe(true);

    // MouseUpで解除されるか
    act(() => {
      result.current.onMouseUp();
    });
    expect(result.current.isDragging).toBe(false);

    // もう一度ドラッグ状態にする
    act(() => {
      result.current.onMouseDown({ pageX: 100 } as React.MouseEvent<HTMLDivElement>);
    });
    
    // MouseLeaveで解除されるか
    act(() => {
      result.current.onMouseLeave();
    });
    expect(result.current.isDragging).toBe(false);
  });

  it('ドラッグ中にスクロール量が正しく計算されること', () => {
    const { result } = renderHook(() => useDragScroll());

    const mockRefInfo = { offsetLeft: 0, scrollLeft: 100 } as HTMLDivElement;
    // ref にダミー要素をマウント
    Object.defineProperty(result.current.ref, 'current', { value: mockRefInfo, writable: true });

    // X: 100の位置でクリック（ドラッグ開始）
    act(() => {
      result.current.onMouseDown({ pageX: 100 } as React.MouseEvent<HTMLDivElement>);
    });

    // X: 50の位置にマウスを移動させる（左に50px移動した）
    const mockMoveEvent = {
      pageX: 50, 
      preventDefault: () => {}, // イベントのデフォルト挙動防止のモック
    } as React.MouseEvent<HTMLDivElement>;

    act(() => {
      result.current.onMouseMove(mockMoveEvent);
    });

    // スクロール量の計算式:
    // startX = e.pageX(100) - offsetLeft(0) = 100
    // x = e.pageX(50) - offsetLeft(0) = 50
    // walk = (50 - 100) * 1.5 = -75
    // 新しいscrollLeft = 元のscrollLeft(100) - (-75) = 175
    expect(result.current.ref.current?.scrollLeft).toBe(175);
  });
});
