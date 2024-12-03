// Scenarios:
// case1: [1,2,3,4,5,6,7]
// case2: [1,2,3,'...',49,50];
// case3: [1,2,'...',48,49,50];
// case4: [1,'...',21,22,23,'...',50];

export const generatePaginationNumbers = (
  currentPage: number,
  totalPages: number
): (string | number)[] => {
  // case1
  if (totalPages <= 7) {
    return Array.from({ length: totalPages }, (_, i) => i + 1);
  }

  // case2
  if (currentPage <= 3) {
    return [1, 2, 3, '...', totalPages - 1, totalPages];
  }

  // case3
  if (currentPage >= totalPages - 2) {
    return [1, 2, '...', totalPages - 2, totalPages - 1, totalPages];
  }

  // case4
  return [
    1,
    '...',
    currentPage - 1,
    currentPage,
    currentPage + 1,
    '...',
    totalPages,
  ];
};
