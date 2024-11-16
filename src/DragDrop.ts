export class DragDrop {
  private static currentDraggedElement: HTMLElement | null = null;
  private static sourceContainer: HTMLElement | null = null;
  private static originalIndex: number = -1;
  private static placeholder: HTMLElement | null = null;
  private static activeDragZone: HTMLElement | null = null;

  private container: HTMLElement;
  private items: HTMLElement[];
  private draggedElement: HTMLElement | null;
  private isDragging: boolean;

  constructor(container: HTMLElement, items: HTMLElement[]) {
    this.container = container;
    this.items = items;
    this.draggedElement = null;
    this.isDragging = false;
    this.initialize();
  }

  private initialize(): void {
    if (!DragDrop.placeholder) {
      this.setupPlaceholder();
    }
    // 컨테이너에 드롭 이벤트 리스너 추가
    this.container.addEventListener("dragover", this.onDragOver.bind(this));
    this.container.addEventListener("drop", this.onDrop.bind(this));
    this.container.addEventListener("dragenter", this.onDragEnter.bind(this));
    this.container.addEventListener("dragleave", this.onDragLeave.bind(this));

    // 각 아이템에 드래그 이벤트 리스너 추가
    this.items.forEach((item) => {
      item.setAttribute("draggable", "true");
      item.addEventListener("dragstart", this.onDragStart.bind(this));
      item.addEventListener("dragend", this.onDragEnd.bind(this));
    });
  }

  private onDragStart(event: DragEvent): void {
    if (!event.target || !(event.target instanceof HTMLElement)) return;

    this.draggedElement = event.target;
    DragDrop.currentDraggedElement = this.draggedElement;
    DragDrop.sourceContainer = this.container;

    // 드래그 시작된 요소의 원래 인덱스 저장
    DragDrop.originalIndex = Array.from(
      this.container.querySelectorAll(".drag-item")
    ).indexOf(this.draggedElement);

    this.isDragging = true;
    this.draggedElement.style.opacity = "0.5";

    if (event.dataTransfer) {
      event.dataTransfer.effectAllowed = "move";
      event.dataTransfer.setData("text/plain", "");
    }
  }

  private onDragOver(event: DragEvent): void {
    event.preventDefault();
    if (!DragDrop.currentDraggedElement) return;

    const target = event.target as HTMLElement;
    const dropZone = target.closest(".drop-zone");

    if (!dropZone || !this.container.contains(dropZone)) return;

    const currentIndex = this.getCurrentDragIndex(event);

    // 이전 드롭존의 스타일 제거
    if (DragDrop.activeDragZone && DragDrop.activeDragZone !== this.container) {
      DragDrop.activeDragZone.classList.remove("drag-over");
    }

    // 현재 드롭존 업데이트
    DragDrop.activeDragZone = this.container;

    // 같은 드롭존 내에서의 이동
    if (this.container === DragDrop.sourceContainer) {
      // 원래 위치가 아닐 때만 플레이스홀더 표시
      if (
        currentIndex !== DragDrop.originalIndex &&
        currentIndex !== DragDrop.originalIndex + 1
      ) {
        this.container.classList.add("drag-over");
        this.updatePlaceholderPosition(event);
      } else {
        this.removePlaceholder();
      }
    }
    // 다른 드롭존으로의 이동
    else {
      this.container.classList.add("drag-over");
      this.updatePlaceholderPosition(event);
    }
  }

  private getCurrentDragIndex(event: DragEvent): number {
    const items = Array.from(this.container.querySelectorAll(".drag-item"));
    const mouseY = event.clientY;

    for (let i = 0; i < items.length; i++) {
      const item = items[i];
      const rect = item.getBoundingClientRect();
      const midPoint = rect.top + rect.height / 2;

      if (mouseY < midPoint) {
        return i;
      }
    }

    return items.length;
  }

  private updatePlaceholderPosition(event: DragEvent): void {
    if (!DragDrop.placeholder) return;

    const currentIndex = this.getCurrentDragIndex(event);
    const items = Array.from(this.container.querySelectorAll(".drag-item"));

    this.removePlaceholder();

    if (currentIndex >= items.length) {
      this.container.appendChild(DragDrop.placeholder);
    } else {
      this.container.insertBefore(DragDrop.placeholder, items[currentIndex]);
    }
  }

  private removePlaceholder(): void {
    if (DragDrop.placeholder && DragDrop.placeholder.parentNode) {
      DragDrop.placeholder.remove();
    }
  }

  private onDragEnd(event: DragEvent): void {
    if (this.draggedElement) {
      this.draggedElement.style.opacity = "1";
    }

    this.isDragging = false;
    this.draggedElement = null;
    DragDrop.currentDraggedElement = null;
    DragDrop.sourceContainer = null;
    DragDrop.originalIndex = -1;
    DragDrop.activeDragZone = null;

    document.querySelectorAll(".drop-zone").forEach((zone) => {
      zone.classList.remove("drag-over");
    });

    this.removePlaceholder();
  }

  private onDragEnter(event: DragEvent): void {
    event.preventDefault();
    if (DragDrop.currentDraggedElement) {
      this.container.classList.add("drag-over");
    }
  }

  private onDragLeave(event: DragEvent): void {
    event.preventDefault();
    const relatedTarget = event.relatedTarget as HTMLElement;
    if (!relatedTarget || !this.container.contains(relatedTarget)) {
      this.container.classList.remove("drag-over");
    }
  }

  private updateItems(): void {
    this.items = Array.from(this.container.querySelectorAll(".drag-item"));
  }

  private setupPlaceholder(): void {
    DragDrop.placeholder = document.createElement("div");
    DragDrop.placeholder.classList.add("placeholder");
    DragDrop.placeholder.style.height = "2px";
    DragDrop.placeholder.style.background = "#2196f3";
    DragDrop.placeholder.style.margin = "10px 0";
    DragDrop.placeholder.style.transition = "all 0.2s ease";
  }

  private onDrop(event: DragEvent): void {
    event.preventDefault();
    this.container.classList.remove("drag-over");

    if (!DragDrop.currentDraggedElement) return;

    const currentIndex = this.getCurrentDragIndex(event);

    // 같은 드롭존에서 원래 위치로 돌아가는 경우
    if (
      this.container === DragDrop.sourceContainer &&
      (currentIndex === DragDrop.originalIndex ||
        currentIndex === DragDrop.originalIndex + 1)
    ) {
      this.removePlaceholder();
      return;
    }

    // 원래 컨테이너에서 요소 제거
    DragDrop.currentDraggedElement.remove();

    // 새 위치에 요소 추가
    if (DragDrop.placeholder && DragDrop.placeholder.parentNode) {
      this.container.insertBefore(
        DragDrop.currentDraggedElement,
        DragDrop.placeholder
      );
    } else {
      this.container.appendChild(DragDrop.currentDraggedElement);
    }

    this.removePlaceholder();
    this.updateItems();
  }
}
