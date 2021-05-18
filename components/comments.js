import { useState } from 'react';
import { useRouter } from 'next/router';
import styles from '../styles/Comments.module.css';
import Button from '@material-ui/core/Button';
// icons

import Image from 'next/image';

export const Comments = ({ comments = [] }) => {
  const router = useRouter();

  return (
    <div className={styles.comments}>
      <h5>Comments:</h5>
      <div className={styles.comments__container}>
        {comments?.map(({ _id, _createdAt, name, email, comment }) => (
          <p className={styles.comment} key={_id}>
            <h4>
              <span>{name}</span> says:
            </h4>
            <p className={styles.date}>{new Date(_createdAt).toDateString()}</p>
            <p>{comment}</p>
          </p>
        ))}
      </div>
    </div>
  );
};
