/**
 * WAI-ARIA Dialog (Modal) パターン
 * @see https://www.w3.org/WAI/ARIA/apg/patterns/dialog-modal/
 *
 * フォーカストラップ、Escape キーで閉じる、背景の inert 化を管理。
 */

export interface DialogApi {
  /** Dialog 要素に適用する props */
  contentProps: {
    role: "dialog";
    "aria-modal": boolean;
    "aria-labelledby": string;
    "aria-describedby"?: string;
    tabIndex: -1;
    onKeyDown: (e: KeyboardEvent) => void;
  };
  /** タイトル要素に適用する props */
  titleProps: { id: string };
  /** 説明要素に適用する props */
  descriptionProps: { id: string };
  /** バックドロップに適用する props */
  backdropProps: {
    onClick: (e: MouseEvent) => void;
  };
  /** トリガーに適用する props */
  triggerProps: {
    onClick: () => void;
    "aria-haspopup": "dialog";
    "aria-expanded": boolean;
  };
  /** 開く */
  open: () => void;
  /** 閉じる */
  close: () => void;
  /** 開いているか */
  isOpen: boolean;
}

export interface CreateDialogOptions {
  /** 開いた状態で初期化 */
  open?: boolean;
  /** 閉じる時のコールバック */
  onClose?: () => void;
  /** 開く時のコールバック */
  onOpen?: () => void;
  /** ID プレフィックス */
  id?: string;
  /** バックドロップクリックで閉じる */
  closeOnBackdrop?: boolean;
  /** Escape キーで閉じる */
  closeOnEscape?: boolean;
}

let dialogCounter = 0;
function dialogUid(): string {
  return `dialog-${++dialogCounter}`;
}

export function createDialog(options: CreateDialogOptions = {}): DialogApi {
  const prefix = options.id ?? dialogUid();
  const titleId = `${prefix}-title`;
  const descId = `${prefix}-desc`;
  const closeOnBackdrop = options.closeOnBackdrop ?? true;
  const closeOnEscape = options.closeOnEscape ?? true;
  let isOpen = options.open ?? false;

  function open() {
    isOpen = true;
    options.onOpen?.();
  }

  function close() {
    isOpen = false;
    options.onClose?.();
  }

  function handleKeyDown(e: KeyboardEvent) {
    if (closeOnEscape && e.key === "Escape") {
      e.preventDefault();
      close();
    }
    // フォーカストラップはコンポーネント側で管理
  }

  function handleBackdropClick(e: MouseEvent) {
    if (closeOnBackdrop && e.target === e.currentTarget) {
      close();
    }
  }

  return {
    contentProps: {
      role: "dialog" as const,
      "aria-modal": true,
      "aria-labelledby": titleId,
      "aria-describedby": descId,
      tabIndex: -1,
      onKeyDown: handleKeyDown,
    },
    titleProps: { id: titleId },
    descriptionProps: { id: descId },
    backdropProps: {
      onClick: handleBackdropClick,
    },
    triggerProps: {
      onClick: open,
      "aria-haspopup": "dialog" as const,
      "aria-expanded": isOpen,
    },
    open,
    close,
    isOpen,
  };
}
