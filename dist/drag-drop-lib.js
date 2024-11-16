var d = Object.defineProperty;
var l = (r, t, e) => t in r ? d(r, t, { enumerable: !0, configurable: !0, writable: !0, value: e }) : r[t] = e;
var a = (r, t, e) => l(r, typeof t != "symbol" ? t + "" : t, e);
class g {
  constructor(t = {}) {
    a(this, "draggedElement", null);
    a(this, "originalPosition", null);
    a(this, "dropZones", /* @__PURE__ */ new Set());
    a(this, "placeholder");
    a(this, "options");
    this.options = {
      dragClass: "dragging",
      dropClass: "drop-zone",
      dragOverClass: "dragover",
      placeholderClass: "drag-placeholder",
      ...t
    }, this.placeholder = document.createElement("div"), this.placeholder.classList.add(this.options.placeholderClass), this.placeholder.style.display = "none", this.onDragStart = this.onDragStart.bind(this), this.onDragEnd = this.onDragEnd.bind(this), this.onDragOver = this.onDragOver.bind(this), this.onDrop = this.onDrop.bind(this), this.onDragEnter = this.onDragEnter.bind(this), this.onDragLeave = this.onDragLeave.bind(this);
  }
  makeDraggable(t) {
    t.setAttribute("draggable", "true"), t.addEventListener("dragstart", this.onDragStart), t.addEventListener("dragend", this.onDragEnd);
  }
  makeDroppable(t) {
    this.dropZones.add(t), t.addEventListener("dragover", this.onDragOver), t.addEventListener("drop", this.onDrop), t.addEventListener("dragenter", this.onDragEnter), t.addEventListener("dragleave", this.onDragLeave), t.classList.add(this.options.dropClass);
  }
  onDragStart(t) {
    var s;
    const e = t.target;
    this.draggedElement = e, this.draggedElement.classList.add(this.options.dragClass), this.originalPosition = {
      parent: e.parentElement,
      nextSibling: e.nextElementSibling
    };
    const i = e.getBoundingClientRect();
    this.placeholder.style.height = `${i.height}px`, this.placeholder.style.width = `${i.width}px`, this.placeholder.style.display = "block", this.draggedElement.style.display = "none", this.originalPosition.parent.insertBefore(
      this.placeholder,
      this.draggedElement
    ), (s = t.dataTransfer) == null || s.setData("text/plain", ""), t.dataTransfer && (t.dataTransfer.effectAllowed = "move");
  }
  onDragOver(t) {
    t.preventDefault(), t.dataTransfer && (t.dataTransfer.dropEffect = "move");
    const e = t.target.closest(
      `.${this.options.dropClass}`
    );
    if (!e || !this.dropZones.has(e)) return;
    this.dropZones.forEach((s) => {
      s.classList.toggle(this.options.dragOverClass, s === e);
    });
    const i = Array.from(e.querySelectorAll(".item")).filter(
      (s) => s !== this.draggedElement
    );
    this.updatePlaceholderPosition(
      e,
      i,
      t.clientY
    );
  }
  updatePlaceholderPosition(t, e, i) {
    let s = null;
    for (const o of e) {
      const n = o.getBoundingClientRect();
      if (i < n.top + n.height / 2) {
        s = o;
        break;
      }
    }
    s ? t.insertBefore(this.placeholder, s) : t.appendChild(this.placeholder);
  }
  onDrop(t) {
    if (t.preventDefault(), !this.draggedElement || !this.originalPosition) return;
    const e = t.target.closest(
      `.${this.options.dropClass}`
    );
    if (!e || !this.dropZones.has(e)) return;
    this.draggedElement.style.display = "", this.draggedElement.classList.remove(this.options.dragClass), this.placeholder.parentNode ? (e.insertBefore(this.draggedElement, this.placeholder), this.placeholder.parentNode.removeChild(this.placeholder)) : e.appendChild(this.draggedElement), e.classList.remove(this.options.dragOverClass);
    const i = {
      item: this.draggedElement,
      previousContainer: this.originalPosition.parent,
      container: e,
      newIndex: Array.from(e.children).indexOf(this.draggedElement)
    };
    document.dispatchEvent(new CustomEvent("drop-complete", { detail: i })), this.draggedElement = null, this.originalPosition = null;
  }
  onDragEnd(t) {
    t.preventDefault(), this.draggedElement && this.originalPosition && (this.draggedElement.style.display = "", this.draggedElement.classList.remove(this.options.dragClass), this.originalPosition.nextSibling ? this.originalPosition.parent.insertBefore(
      this.draggedElement,
      this.originalPosition.nextSibling
    ) : this.originalPosition.parent.appendChild(this.draggedElement)), this.placeholder.parentNode && this.placeholder.parentNode.removeChild(this.placeholder), this.dropZones.forEach((e) => {
      e.classList.remove(this.options.dragOverClass);
    }), this.draggedElement = null, this.originalPosition = null;
  }
  onDragEnter(t) {
    const e = t.target.closest(
      `.${this.options.dropClass}`
    );
    e && this.dropZones.has(e) && e.classList.add(this.options.dragOverClass);
  }
  onDragLeave(t) {
    const e = t.target.closest(
      `.${this.options.dropClass}`
    );
    e && !e.contains(t.relatedTarget) && e.classList.remove(this.options.dragOverClass);
  }
}
export {
  g as DragDrop
};
