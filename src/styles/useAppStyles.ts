import { createStyles } from "antd-style";

export const useAppStyles = createStyles(({ token, css }) => {
  return {
    layout: css`
      width: 100%;
      height: 100vh;
      display: flex;
      background: ${token.colorBgContainer};
      overflow: hidden;
    `,
    side: css`
      /* 侧边栏整体容器 */
      width: 256px;
      border-right: 1px solid rgba(0, 40, 72, 0.1);
      background: rgba(0, 40, 72, 0.02);
      transition: width 0.5s ease;
      /* 折叠态（先只做简易版，后面需要可以再细调） */

      & .app-sidebar-logo {
        transition: opacity 0.2s ease;
      }

      & .app-sidebar-inner-container {
        display: flex;
        padding: 0 10px;
        flex-direction: column;
        lign-items: center;
        gap: 12px;
        flex-shrink: 0;
        align-self: stretch;
      }
      
      &[data-collapsed="true"] {
        width: 0px;
        align-items: center;

        .app-sidebar-new-chat,
        .app-sidebar-toggle,
        .app-sidebar-logo {
          opacity: 0;
        }

        .app-sidebar-new-chat,
        .app-sidebar-history-header,
        .app-sidebar-history-list {
          display: none;
        }
      }

      /* 1. 顶部：Logo + 折叠按钮 */
      .app-sidebar-header {
        display: flex;
        padding: 16px 0 16px 12px;
        justify-content: space-between;
        align-items: center;
        align-self: stretch;
      }

      .app-sidebar-logo {
        display: flex;
        align-items: center;
      }

      .app-sidebar-logo img {
        width: 100px;
        height: auto;
      }

      .app-sidebar-toggle {
        width: 32px;
        height: 32px;
        display: flex;
        align-items: center;
        justify-content: center;
        cursor: pointer;
        border-radius: 2px;
        transition: background 0.2s ease;
      }

      /* Hover 态 */
      .app-sidebar-toggle:hover {
        background: rgba(26, 32, 37, 0.03);
      }

      /* 选中/激活态 */
      .app-sidebar-toggle-active {
        background: rgba(26, 32, 37, 0.06);
      }

      .app-sidebar-toggle img {
        width: 32px;
        height: 32px;
      }

      /* 2. 新对话按钮 */
      .app-sidebar-new-chat {
        user-select: none;
        display: flex;
        width: 100%;
        height: 36px;
        padding: 0 12px;
        justify-content: center;
        align-items: center;
        gap: 10px;
        border-radius: 8px;
        border: 1px solid #eee;
        box-sizing: border-box;
        border-radius: 8px;
        border: 1px solid rgba(18, 31, 43, 0.10);
        cursor: pointer;
        transition:
          background 0.1s ease,
          border-color 0.1s ease,
          transform 0.1s ease;
      }

      .app-sidebar-new-chat:hover {
        padding: 9px 12px;
        background: rgba(153, 204, 245, 0.1);
        border-color: #99ccf5;
        border-width: 2px;
      }

      /* 点击时的按动效果 */
      .app-sidebar-new-chat:active {
        transform: scale(0.98);
      }

      .app-sidebar-new-chat-icon {
        width: 20px;
        height: 20px;
        display: flex;
        align-items: center;
        justify-content: center;
        flex-shrink: 0;
      }

      .app-sidebar-new-chat-icon img {
        width: 20px;
        height: 20px;
      }

      .app-sidebar-new-chat-text {
        color: #1a2025;
        font-size: 14px;
        font-style: normal;
        font-weight: 500;
        line-height: 24px; /* 150% */
        transition: color 0.2s ease;
      }

      .app-sidebar-new-chat:hover .app-sidebar-new-chat-text {
        color: #1072c3;
      }

      /* 3-1. 历史标题区域 */
      .app-sidebar-history-header {
        display: flex;
        padding: 0 8px 0 8px;
        align-items: center;
        align-self: stretch;
        box-sizing: border-box;
      }

      .app-sidebar-history-title {
        color: rgba(18, 31, 43, 0.3);
        font-size: 12px;
        font-style: normal;
        font-weight: 400;
        line-height: 24px; /* 200% */
      }

      /* 3-2. 会话记录列表容器 */
      .app-sidebar-history-container {
        display: flex;
        flex-direction: column;
        align-items: center;
        align-self: stretch;
        box-sizing: border-box;
        gap: 4px;
      }


      .app-sidebar-history-list {
        display: flex;
        padding: 0;
        flex-direction: column;
        align-items: center;
        align-self: stretch;
        box-sizing: border-box;
      }

      /* Conversations 列表本身 */
      .app-sidebar-conversations {
        width: 100%;
        padding: 0;
        gap: 0;
      }

      .app-sidebar-conversations .ant-conversations-list {
        width: 100%;
        padding-inline-start: 0;
        margin: 0;
      }

      .app-sidebar-conversations .ant-conversations-item {
        display: flex;
        padding: 8px 20px 8px 8px;
        align-items: center;
        align-self: stretch;
        border-radius: 10px;
        box-sizing: border-box;
        margin-bottom: 4px;
        transition: background 0.2s ease;
      }

      /* Hover 态 */
      .app-sidebar-conversations .ant-conversations-item:hover {
        background: rgba(26, 32, 37, 0.03);
      }

      /* 选中态 */
      .app-sidebar-conversations .ant-conversations-item-active {
        background: rgba(26, 32, 37, 0.06);
      }

      .app-sidebar-conversations .ant-conversations-item-active:hover {
        background: rgba(26, 32, 37, 0.06); /* 选中态 hover 时保持选中背景 */
      }

      .app-sidebar-conversations .ant-conversations-item-label {
        display: flex;
        flex-direction: column;
        justify-content: center;
        flex: 1 0 0;
        align-self: stretch;
        overflow: hidden;
        color: rgba(0, 0, 0, 0.9);
        text-overflow: ellipsis;
        white-space: nowrap;
        font-family:
          "PingFang SC",
          -apple-system,
          BlinkMacSystemFont,
          "Segoe UI",
          Roboto,
          "Helvetica Neue",
          Arial,
          "Noto Sans",
          "Liberation Sans",
          sans-serif;
        font-size: 14px;
        font-style: normal;
        font-weight: 400;
        line-height: 20px; /* 142.857% */
      }
    `,
    logo: css`
      /* 兼容旧用法（目前 logo 结构已经转移到 side 内部） */
    `,
    conversations: css`
      /* 兼容旧用法，具体样式已在 side 中定义 */
    `,
    sideFooter: css`
      border-top: 1px solid ${token.colorBorderSecondary};
      height: 40px;
      display: flex;
      align-items: center;
      justify-content: space-between;
    `,
    chat: css`
      position: relative;
      height: 100%;
      flex: 1;
      width: 0;
      overflow: hidden;
      box-sizing: border-box;
      display: flex;
      flex-direction: column;
      gap: 16px;
      padding: 0;
      .ant-bubble-content-updating {
        background-image: linear-gradient(90deg, #ff6b23 0%, #af3cb8 31%, #53b6ff 89%);
        background-size: 100% 2px;
        background-repeat: no-repeat;
        background-position: bottom;
      }
      & .app-styled-decorative-curve {
        position: absolute;
        right: -40px;
        bottom: -20px;
        width: 180px;
        height: auto;
        pointer-events: none;
        user-select: none;
      }
    `,
    chatSidebarToggle: css`
      position: absolute;
      top: 16px;
      left: 16px;
      width: 32px;
      height: 32px;
      display: flex;
      align-items: center;
      justify-content: center;
      cursor: pointer;
      border-radius: 2px;
      background: rgba(255, 255, 255, 0.9);
      box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08);
      z-index: 2;
      transition:
        background 0.2s ease,
        box-shadow 0.2s ease;

      &:hover {
        background: rgba(26, 32, 37, 0.03);
        box-shadow: 0 4px 16px rgba(0, 0, 0, 0.12);
      }

      img {
        width: 32px;
        height: 32px;
      }
    `,
    startPage: css`
      display: flex;
      width: 100%;
      max-width: 840px;
      flex-direction: column;
      align-items: center;
      height: 100%;
    `,
    agentName: css`
      margin-block-start: 25%;
      font-size: 32px;
      margin-block-end: 38px;
      font-weight: 600;
    `,
    chatList: css`
      position: relative;
      z-index: 1;
      display: flex;
      width: 100%;
      flex: 1;
      flex-direction: column;
      align-items: center;
      justify-content: flex-start;
      overflow-y: auto;
      padding-bottom: 24px;
      box-sizing: border-box;
    `,
    senderContainer: css`
      position: relative;
      display: flex;
      width: 100%;
      flex-shrink: 0;
      flex-direction: column;
      align-items: center;
      padding: 10px 0 0;
      box-sizing: border-box;
      && .sender-footer {
        display: flex;
        padding: 8px 0;
        align-items: center;
        color: rgba(18, 31, 43, 0.50);
        text-align: center;
        font-family: "PingFang SC";
        font-size: 10px;
        font-style: normal;
        font-weight: 400;
        line-height: 12px; /* 120% */
      }
    `,
    senderRoot: css`
      &&:hover,
      &&:focus-within {
        box-shadow: 0 6px 30px 0 rgba(18, 31, 43, 0.08);
        border-color: rgba(18, 31, 43, 0.22);
      }

      && .ant-sender-content textarea::placeholder {
        color: rgba(22, 40, 57, 0.3);
        font-size: 16px;
        font-weight: 400;
        line-height: 28px;
      }

      && .ant-sender-content {
        height: auto;
      }
      && .ant-sender-content textarea {
        color: rgba(18, 31, 43, 0.90);
        font-size: 16px;
        font-weight: 400;
        line-height: 28px;
      }

      && .ant-sender-footer {
        padding: 0 !important;
      }

    `,
    senderBackground: css`
      position: absolute;
      top: 0;
      left: 0;
      right: 0;
      height: 50%;
      background: linear-gradient(to bottom, #e2f2ff, #ffffff);
      z-index: 0;
      pointer-events: none;
    `,
    welcomeArea: css`
      display: flex;
      flex: 1;
      width: 100%;
      align-items: center;
      justify-content: center;
      box-sizing: border-box;
    `,
    welcomeContent: css`
      display: flex;
      align-items: center;
      justify-content: center;
      gap: 0;
      transform: translateX(-48px);
    `,
    welcomeText: css`
      position: relative;
      display: flex;
      flex-direction: column;
      gap: 0;
      margin-left: -48px;
    `,
    welcomeTextLine1: css`
      color: #1a2025;
      font-family:
        "PingFang SC",
        -apple-system,
        BlinkMacSystemFont,
        "Segoe UI",
        Roboto,
        "Helvetica Neue",
        Arial,
        "Noto Sans",
        "Liberation Sans",
        sans-serif;
      font-size: 30px;
      font-style: normal;
      font-weight: 600;
      line-height: normal;
    `,
    welcomeTextLine2: css`
      color: #cdd3d7;
      font-family:
        "PingFang SC",
        -apple-system,
        BlinkMacSystemFont,
        "Segoe UI",
        Roboto,
        "Helvetica Neue",
        Arial,
        "Noto Sans",
        "Liberation Sans",
        sans-serif;
      font-size: 30px;
      font-style: normal;
      font-weight: 600;
      line-height: normal;
    `,
    welcomeDecorativeCurve: css`
      position: absolute;
      right: -32px;
      bottom: -12px;
      width: 180px;
      height: auto;
      pointer-events: none;
      user-select: none;
    `,
    sourceSup: css`
      display: inline-block;
      background: rgba(0, 130, 237, 0.05);
      cursor: pointer;
      transition: background 0.2s ease;
      padding: 2px 6px;
      border-radius: 4px;
      vertical-align: super;
      font-size: 0.75em;
      line-height: 1;

      &:hover {
        background: rgba(0, 130, 237, 0.12);
      }
    `,
    sourcesDrawer: css`
      .ant-drawer-header {
        padding: 16px 24px;
        border-bottom: 1px solid rgba(0, 0, 0, 0.06);
      }

      .ant-drawer-title {
        font-family:
          "PingFang SC",
          -apple-system,
          BlinkMacSystemFont,
          "Segoe UI",
          Roboto,
          "Helvetica Neue",
          Arial,
          "Noto Sans",
          "Liberation Sans",
          sans-serif;
        font-size: 16px;
        font-weight: 600;
        color: #1a2025;
      }

      .ant-drawer-body {
        padding: 0;
      }
    `,
    sourcesDrawerContent: css`
      display: flex;
      flex-direction: column;
      padding: 0;
    `,
    sourcesDrawerItem: css`
      display: flex;
      padding: 32px 24px;
      gap: 16px;
      border-bottom: 1px solid rgba(0, 0, 0, 0.06);
      transition: background-color 0.3s ease;

      &:last-child {
        border-bottom: none;
      }

      &.source-item-highlight {
        animation: sourceHighlight 0.5s ease-in-out 3;
      }
    `,
    sourcesDrawerNumber: css`
      display: flex;
      align-items: center;
      justify-content: center;
      width: 20px;
      height: 20px;
      border-radius: 50%;
      color: #0082ed;
      border: 2px solid #0082ed;
      font-size: 14px;
      font-weight: 600;
      flex-shrink: 0;
      line-height: 26px;
    `,
    sourcesDrawerItemContent: css`
      display: flex;
      flex-direction: column;
      flex: 1;
      gap: 20px;
    `,
    sourcesTitleContainer: css`
      display: flex;
      align-items: center;
      justify-content: flex-start;
      gap: 8px;
    `,
    sourcesDrawerItemTitle: css`
      font-family:
        "PingFang SC",
        -apple-system,
        BlinkMacSystemFont,
        "Segoe UI",
        Roboto,
        "Helvetica Neue",
        Arial,
        "Noto Sans",
        "Liberation Sans",
        sans-serif;
      font-size: 14px;
      font-weight: 600;
      color: #1a2025;
      line-height: 20px;
      text-decoration: underline;

      &:hover {
        color: #0082ed;
      }
    `,
    sourcesDrawerItemDescriptionContainer: css`
      display: flex;
      flex-direction: column;
      gap: 4px;
      padding: 0 12px;
    `,
    sourcesDrawerItemDescription: css`
      font-family:
        "PingFang SC",
        -apple-system,
        BlinkMacSystemFont,
        "Segoe UI",
        Roboto,
        "Helvetica Neue",
        Arial,
        "Noto Sans",
        "Liberation Sans",
        sans-serif;
      font-size: 14px;
      font-weight: 400;
      color: rgba(26, 32, 37, 0.8);
      line-height: 20px;
    `,
    sourcesDrawerItemDivider: css`
      height: 1px;
      background: rgba(0, 0, 0, 0.06);
      margin: 4px 0;
    `,
    sourcesDrawerItemFileName: css`
      display: flex;
      align-items: center;
      gap: 8px;
      font-family:
        "PingFang SC",
        -apple-system,
        BlinkMacSystemFont,
        "Segoe UI",
        Roboto,
        "Helvetica Neue",
        Arial,
        "Noto Sans",
        "Liberation Sans",
        sans-serif;
      font-size: 12px;
      font-weight: 400;
      color: rgba(26, 32, 37, 0.6);
    `,
    sourcesDrawerItemFileIcon: css`
      width: 16px;
      height: 16px;
      flex-shrink: 0;
    `,
  };
});
