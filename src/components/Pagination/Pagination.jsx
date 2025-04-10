import { Pagination as PaginationV } from 'antd'

export default function Pagination({ currentPage, totalPages, PageChange }) {
  if (totalPages <= 1) {
    return null
  }

  return (
    <PaginationV
      current={currentPage}
      total={totalPages * 10}
      pageSize={10}
      onChange={PageChange}
      showSizeChanger={false}
      style={{ margin: 'auto' }}
    />
  )
}
