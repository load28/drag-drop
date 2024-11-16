import { DragDrop } from "../src/DragDrop";

document.addEventListener("DOMContentLoaded", () => {
  // 모든 드롭존 컨테이너들을 가져옵니다
  const containers = Array.from(
    document.querySelectorAll(".drop-zone")
  ) as HTMLElement[];

  // 각 드롭존에 대해 DragDrop 인스턴스를 생성합니다
  containers.forEach((container) => {
    const items = Array.from(
      container.querySelectorAll(".drag-item")
    ) as HTMLElement[];
    const dragDrop = new DragDrop(container, items);
  });
});
