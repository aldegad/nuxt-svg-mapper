// ░▒▓ easeInOut ▓▒░
// ░▒▓ easeInOutCubic ▓▒░
// 커브 강도: ★★★☆☆ (부드러운 가속·감속)
// 특징: 느리게 시작해서 빨라졌다가 다시 느려짐 (자연스러운 흐름)
// 사용 예시: 페이지 전환, 슬라이더, 모달
export const easeInOutCubic = (t: number) => {
  return t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;
};

// ░▒▓ easeOut ▓▒░
// ░▒▓ easeOutQuad ▓▒░
// 커브 강도: ★☆☆☆☆ (완만한 감속)
// 특징: 초반에 빠르게, 후반에 천천히 멈춤 (기본적인 ease-out 느낌)
// 사용 예시: 버튼 클릭, 간단한 팝업
export const easeOutQuad = (t: number) => 1 - (1 - t) * (1 - t);
// ░▒▓ easeOutCubic ▓▒░
// 커브 강도: ★★☆☆☆ (좀 더 극적인 감속)
// 특징: easeOutQuad보다 더 빠르게 출발 후 부드럽게 멈춤
// 사용 예시: 카드 슬라이드, 요소 퇴장
export const easeOutCubic = (t: number) => 1 - Math.pow(1 - t, 3);
// ░▒▓ easeInOutQuint ▓▒░
// 커브 강도: ★★★★★ (가장 극적인 가속·감속)
// 특징: 초반/후반에 매우 느리고, 중간에 급격히 빨라짐 (강한 S커브)
// 사용 예시: 강조 애니메이션, 시네마틱 전환
export const easeInOutQuint = (t: number) => {
  return t < 0.5 ? 16 * t * t * t * t * t : 1 - Math.pow(-2 * t + 2, 5) / 2;
};
