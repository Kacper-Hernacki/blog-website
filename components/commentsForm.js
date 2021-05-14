import { useState } from 'react';
import { useRouter } from 'next/router';
import styles from '../styles/CommentsForm.module.css';
import Button from '@material-ui/core/Button';
import { useForm } from 'react-hook-form';

export const CommentsForm = ({ _id }) => {
  const router = useRouter();
  const [formData, setFormData] = useState();
  const [clicked, setClicked] = useState(false);
  const [comment, setComment] = useState('');
  const [name, setName] = useState('');
  const [mail, setMail] = useState('');
  const [website, setWebsite] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [hasSubmitted, setHasSubmitted] = useState(false);

  const postComment = (data) => {
    // setIsSubmitting(true);
    // let response;
    // setFormData(data);
    fetch('api/createComment', {
      method: 'POST',
      body: JSON.stringify(data, _id),
    });

    console.log(data);
  };

  return (
    <>
      <div>Comments</div>
      <div className={styles.commentsForm}>
        <h5>Leave a comment</h5>
        <div className={styles.commentsForm__container}>
          <textarea
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            onClick={(e) => setClicked(true)}
            placeholder="Enter your comment here..."
            rows="3"></textarea>
          {clicked && comment != '' && (
            <form
              onSubmit={postComment}
              className={styles.commentsForm__additionalData}>
              <p>Fill in your details </p>
              <input
                value={mail}
                onChange={(e) => setMail(e.target.value)}
                placeholder="Email (required)  it will be never made public"
                required
              />

              <input
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Name (required)"
                required
              />

              <input
                value={website}
                onChange={(e) => setWebsite(e.target.value)}
                placeholder="your website (optional)"
              />
              <Button
                type="submit"
                className={styles.shareButton}
                variant="contained">
                Post Comment
              </Button>
            </form>
          )}
        </div>
      </div>
    </>
  );
};
