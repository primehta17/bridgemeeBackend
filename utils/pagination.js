export const parsePagination = (query, defaultLimit = 10) => {
  const page = Math.max(Number(query.page) || 1, 1);
  const limit = Math.min(Math.max(Number(query.limit) || defaultLimit, 1), 100);
  const skip = (page - 1) * limit;
  return { page, limit, skip };
};

export const paginatedResponse = (items, total, page, limit) => ({
  items,
  pagination: {
    page,
    limit,
    total,
    totalPages: Math.ceil(total / limit) || 1,
  },
});
