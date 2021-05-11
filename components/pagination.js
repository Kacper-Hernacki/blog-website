import { useState } from 'react';
import { useRouter } from 'next/router';
import styles from '../styles/Pagination.module.css';
import NavigateNextIcon from '@material-ui/icons/NavigateNext';
import NavigateBeforeIcon from '@material-ui/icons/NavigateBefore';

export const Pagination = ({
  postsPerPage,
  totalPosts,
  paginate,
  currentPage,
}) => {
  const router = useRouter();
  const pageNumbers = [];

  for (let i = 1; i <= Math.ceil(totalPosts / postsPerPage); i++) {
    pageNumbers.push(i);
  }

  return (
    <div className={styles.pagination}>
      <div className={styles.pagination__number}>First</div>
      <div className={styles.pagination__number}>
        <NavigateBeforeIcon />
      </div>
      {pageNumbers.map((number) => (
        <div
          className={
            currentPage === number
              ? styles.pagination__numberActive
              : styles.pagination__number
          }
          onClick={() => paginate(number)}
          key={number}>
          {number}
        </div>
      ))}
      <div className={styles.pagination__number}>
        <NavigateNextIcon />
      </div>
      <div className={styles.pagination__number}>Last</div>
    </div>
  );
};
