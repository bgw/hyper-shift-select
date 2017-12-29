// https://github.com/xtermjs/xterm.js/issues/1090
// https://github.com/xtermjs/xterm.js/pull/1091

function shouldForceSelection(Browser, event) {
  return Browser.isMac ? event.altKey : event.shiftKey;
}

function patchedOnMouseDown(Browser, event) {
  if (event.button === 2 && this.hasSelection) {
    event.stopPropagation();
    return;
  }
  if (event.button !== 0) {
    return;
  }
  if (!this._enabled) {
    // START PATCH
    if (!shouldForceSelection(Browser, event)) {
      return;
    }
    // END PATCH
    event.stopPropagation();
  }
  event.preventDefault();
  this._dragScrollAmount = 0;
  if (this._enabled && event.shiftKey) {
    this._onIncrementalClick(event);
  }
  else {
    if (event.detail === 1) {
      this._onSingleClick(event);
    }
    else if (event.detail === 2) {
      this._onDoubleClick(event);
    }
    else if (event.detail === 3) {
      this._onTripleClick(event);
    }
  }
  this._addMouseDownListeners();
  this.refresh(true);
};

exports.decorateTerm = (Term, env) => {
  return class TermWrapper extends env.React.Component {
    constructor(props) {
      super(props);
      this._handleRef = this._handleRef.bind(this);
    }

    _handleRef(uid, termRef) {
      this.termRef = termRef;
      return this.props.ref_(uid, termRef);
    }

    componentDidMount() {
      const term = this.termRef.term;
      if (term._isPatched) return;

      term.selectionManager._onMouseDown = function(event) {
        return patchedOnMouseDown.call(this, term.browser, event);
      };

      // Inject before the existing event handler using capture
      term.element.addEventListener('mousedown', (event) => {
        const oldMouseEvents = term.mouseEvents;
        term.mouseEvents =
          oldMouseEvents && !shouldForceSelection(term.browser, event);
        // stopPropagation may have been called, do this to guarentee cleanup
        setImmediate(() => {
          term.mouseEvents = oldMouseEvents;
        });
      }, {capture: true});

      // xterm v3 has a patch that fixes the selection manager's buffer in
      // alt-screen mode. This one line: https://git.io/vbNfU
      //
      // https://github.com/zeit/hyper/issues/2429
      // https://github.com/xtermjs/xterm.js/issues/1049
      const oldSetMode = term.inputHandler.setMode;
      term.inputHandler.setMode = function(params) {
        oldSetMode.call(this, params);
        if (params.length > 1) {
          return;
        }
        // alt-screen buffer
        if (this._terminal.prefix === '?') {
          switch (params[0]) {
            case 1049:
            case 47:
            case 1047:
              this._terminal.selectionManager.setBuffer(
                this._terminal.buffer.lines
              );
              break;
          }
        }
      }

      // terms might get recycled, so only patch once
      term._isPatched = true;
    }

    render() {
      return env.React.createElement(
        Term,
        Object.assign({}, this.props, {ref_: this._handleRef}),
      );
    }
  };
}
