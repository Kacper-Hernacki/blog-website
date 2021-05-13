import { useState } from 'react';
import { useRouter } from 'next/router';
import styles from '../styles/CommentsForm.module.css';
import Button from '@material-ui/core/Button';
import { useForm } from 'react-hook-form';

export const CommentsForm = ({ _id }) => {
  const router = useRouter();
  const [clicked, setClicked] = useState(false);

  return (
    <div className={styles.commentsForm}>
      <h5>Leave a comment</h5>
      <div className={styles.commentsForm__container}>
        <textarea
          onClick={(e) => setClicked(true)}
          placeholder="Enter your comment here..."
          rows="3"></textarea>
        {clicked && (
          <div className={styles.commentsForm__additionalData}>
            <input placeholder="Email(required)  it will be never made public" />

            <input placeholder="Name" />

            <input placeholder="your website (optional)" />
            <Button className={styles.shareButton} variant="contained">
              Post Comment
            </Button>
          </div>
        )}
      </div>
    </div>
  );
};
