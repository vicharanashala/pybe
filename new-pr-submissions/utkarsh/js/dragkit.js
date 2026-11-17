/* ==========================================================================
   DRAGKIT — Unified Pointer + Click-to-Place + Keyboard Drag System
   The High Pass v3 · Zero External Dependencies
   ========================================================================== */

const DragKit = (() => {
  let _selected = null;     // Currently selected item (click-to-place mode)
  let _dragging = null;     // Currently dragged item (pointer mode)
  let _dragClone = null;    // Visual clone during drag
  let _dropZones = [];      // Registered drop zones
  let _onDrop = null;       // Global drop callback

  /**
   * Make an element draggable.
   * @param {HTMLElement} el - The draggable element
   * @param {Object} opts
   * @param {string} opts.type - Item type identifier
   * @param {*} opts.data - Payload data
   * @param {Function} opts.onPickup - Called when dragging starts
   */
  function makeDraggable(el, opts = {}) {
    el.setAttribute('draggable', 'false'); // We use Pointer Events
    el.setAttribute('tabindex', '0');
    el.setAttribute('role', 'button');
    el.setAttribute('aria-grabbed', 'false');
    el.dataset.dragType = opts.type || '';
    el._dragData = opts.data || null;

    // --- Pointer Events ---
    let startX, startY, hasMoved;

    el.addEventListener('pointerdown', (e) => {
      if (e.button !== 0) return;
      e.preventDefault();
      startX = e.clientX;
      startY = e.clientY;
      hasMoved = false;
      _dragging = el;
      el.setPointerCapture(e.pointerId);
      el.classList.add('dragging');
      el.setAttribute('aria-grabbed', 'true');

      // Create visual clone
      _dragClone = el.cloneNode(true);
      _dragClone.classList.add('drag-clone');
      _dragClone.style.cssText = `
        position: fixed;
        pointer-events: none;
        z-index: 9999;
        opacity: 0.85;
        transform: scale(1.05);
        transition: none;
        left: ${e.clientX - el.offsetWidth / 2}px;
        top: ${e.clientY - el.offsetHeight / 2}px;
        width: ${el.offsetWidth}px;
      `;
      document.body.appendChild(_dragClone);

      if (opts.onPickup) opts.onPickup(el);
    });

    el.addEventListener('pointermove', (e) => {
      if (_dragging !== el || !_dragClone) return;
      hasMoved = true;
      _dragClone.style.left = `${e.clientX - el.offsetWidth / 2}px`;
      _dragClone.style.top = `${e.clientY - el.offsetHeight / 2}px`;

      // Hit-test drop zones
      _dropZones.forEach(dz => {
        const rect = dz.el.getBoundingClientRect();
        const inside = e.clientX >= rect.left && e.clientX <= rect.right &&
                       e.clientY >= rect.top && e.clientY <= rect.bottom;
        dz.el.classList.toggle('over', inside);
      });
    });

    el.addEventListener('pointerup', (e) => {
      if (_dragging !== el) return;
      el.releasePointerCapture(e.pointerId);
      _cleanupDrag(el);

      if (!hasMoved) {
        // Click: toggle selection for click-to-place mode
        _toggleSelect(el);
        return;
      }

      // Find drop zone under pointer
      const target = _findDropZone(e.clientX, e.clientY);
      if (target && _onDrop) {
        _onDrop(el, target.el, el._dragData, target.data);
      }
    });

    el.addEventListener('pointercancel', () => {
      _cleanupDrag(el);
    });

    // --- Keyboard ---
    el.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        _toggleSelect(el);
      }
    });
  }

  /**
   * Register a drop zone.
   * @param {HTMLElement} el - The drop zone element
   * @param {Object} opts
   * @param {string} opts.accepts - Type string that this zone accepts
   * @param {*} opts.data - Payload data for the zone
   */
  function makeDropZone(el, opts = {}) {
    el.setAttribute('tabindex', '0');
    el.setAttribute('role', 'listbox');
    el.setAttribute('aria-label', opts.label || 'Drop zone');
    el._dropData = opts.data || null;

    const entry = { el, accepts: opts.accepts || '*', data: opts.data || null };
    _dropZones.push(entry);

    // Click-to-place: clicking a drop zone places the selected item
    el.addEventListener('click', () => {
      if (_selected) {
        if (_onDrop) {
          _onDrop(_selected, el, _selected._dragData, el._dropData);
        }
        _clearSelection();
      }
    });

    // Keyboard: Enter on a drop zone places the selected item
    el.addEventListener('keydown', (e) => {
      if ((e.key === 'Enter' || e.key === ' ') && _selected) {
        e.preventDefault();
        if (_onDrop) {
          _onDrop(_selected, el, _selected._dragData, el._dropData);
        }
        _clearSelection();
      }
    });
  }

  /**
   * Set the global drop handler.
   * @param {Function} fn - (sourceEl, targetEl, sourceData, targetData) => void
   */
  function onDrop(fn) {
    _onDrop = fn;
  }

  /**
   * Reset all state (call when changing scenes).
   */
  function reset() {
    _clearSelection();
    _cleanupDrag(_dragging);
    _dropZones = [];
    _onDrop = null;
  }

  // --- Internal helpers ---
  function _toggleSelect(el) {
    if (_selected === el) {
      _clearSelection();
    } else {
      _clearSelection();
      _selected = el;
      el.classList.add('selected');
      el.setAttribute('aria-grabbed', 'true');
    }
  }

  function _clearSelection() {
    if (_selected) {
      _selected.classList.remove('selected');
      _selected.setAttribute('aria-grabbed', 'false');
      _selected = null;
    }
  }

  function _cleanupDrag(el) {
    if (_dragClone) {
      _dragClone.remove();
      _dragClone = null;
    }
    if (el) {
      el.classList.remove('dragging');
      el.setAttribute('aria-grabbed', 'false');
    }
    _dragging = null;
    _dropZones.forEach(dz => dz.el.classList.remove('over'));
  }

  function _findDropZone(x, y) {
    for (const dz of _dropZones) {
      const r = dz.el.getBoundingClientRect();
      if (x >= r.left && x <= r.right && y >= r.top && y <= r.bottom) {
        return dz;
      }
    }
    return null;
  }

  return { makeDraggable, makeDropZone, onDrop, reset };
})();
