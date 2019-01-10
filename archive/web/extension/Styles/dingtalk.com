@-moz-document domain("dingtalk.com") {
#layout-main {
    position: absolute;
    top: 0;
    left: 0;
    margin-left: 0;
    margin-top: 0;
    width: 100%;
    height: 100%;
}

#layout-main #header {
    flex: unset;
    height: 50px;
    background-position-x: 10px;
    background-position-y: center;
}
#layout-main #header .search-bar-wraper, #layout-main #header .upload-container-wrap {
    margin-top: 8px;
    margin-bottom: 8px;
}

#layout-main #body {
    height: 100%;
}
#layout-main #body {
    height: 100%;
}
#layout-main #body #menu-pannel {
    width: 50px;
}
#layout-main #body #menu-pannel .profile {
    flex: unset;
    padding-top: 8px;
    padding-bottom: 12px;
}
#layout-main #body #menu-pannel .profile > .user-avatar {
    width: 42px;
    height: 42px;
}
#layout-main #body #menu-pannel .profile > .user-avatar > .avatar-text {
    width: inherit;
    height: inherit;
}
#layout-main #body #menu-pannel-body .layout-resize-right,
#layout-main #body #menu-pannel-body .layout-resize-top {
    border-radius: 10px;
    background-color: rgba(0,0,0,0.05);
}
#layout-main #body #menu-pannel-body .layout-resize-right {
    width: 10px;
    height: 72px;
    top: 50%;
    transform: translateY(-50%);
}
#layout-main #body #menu-pannel-body .layout-resize-top {
    width: 72px;
    height: 10px;
    left: 50%;
    transform: translateX(-50%);
}

#chat-box .chat-item .content-area {
    display: flex;
}
#chat-box .chat-item .content-area > .msg-bubble-box {
    flex-basis: auto;
}
#chat-box .chat-item .content-area > .msg-bubble-box .msg-bubble-area {
    width: calc(100% - 140px);
}

#chat-box .chat-item .content-area > .msg-bubble-box .msg-bubble-area .msg-bubble {
    max-width: 100%!important;
}

::-webkit-scrollbar-thumb {
    background-color: #9993
}
::-webkit-scrollbar-thumb:hover {
    background-color: #9996
}

/* !!! */
#layout-main #body #menu-pannel-body .main-chat.chat-items {
    background-image: none!important;
}
}
