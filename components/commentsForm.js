import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import styles from '../styles/CommentsForm.module.css';
import Button from '@material-ui/core/Button';

export default function CommentsForm({ _id }) {
  const [formData, setFormData] = useState();

  // Sets up our form states
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [hasSubmitted, setHasSubmitted] = useState(false);

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm();

  // Function for handling the form submission
  const onSubmit = async (data) => {
    setIsSubmitting(true);

    setFormData(data);
    console.log(formData);
    try {
      await fetch('/api/createComment', {
        method: 'POST',
        body: JSON.stringify(data),
        type: 'application/json',
      });
      setIsSubmitting(false);
      setHasSubmitted(true);
    } catch (err) {
      setFormData(err);
    }
  };

  if (isSubmitting) {
    // Returns a "Submitting comment" state if being processed
    return <h3>Submitting comment…</h3>;
  }
  if (hasSubmitted) {
    // Returns the data that the user submitted for them to preview after submission
    return (
      <div className={styles.support}>
        <h3 className={styles.support__header}>
          Thanks for your comment! It has to be authorized by an administrator
        </h3>
        <ul>
          <p className={styles.support__dataContainer}>
            <p className={styles.support__data}>
              {' '}
              <span>Name:</span> {formData.name}
            </p>

            <p className={styles.support__data}>
              {' '}
              <span>Email:</span> {formData.email}
            </p>
            <p className={styles.support__data}>
              {' '}
              <span>Comment:</span> {formData.comment}
            </p>
          </p>
        </ul>
      </div>
    );
  }

  return (
    /* "handleSubmit" will validate your inputs before invoking "onSubmit" */
    <form
      className={styles.commentsForm}
      onSubmit={handleSubmit(onSubmit)}
      disabled>
      <input {...register('_id')} type="hidden" name="_id" value={_id} />
      {/* register your input into the hook by invoking the "register" function */}
      <input
        placeholder="name"
        className={styles.input}
        name="name"
        {...register('name', { required: true })}
      />

      {/* include validation with required or other standard HTML validation rules */}
      <input
        placeholder="e-mail"
        className={styles.input}
        name="email"
        type="email"
        {...register('email', { required: true })}
      />

      <textarea
        {...register('comment', { required: true })}
        name="comment"
        rows="8"
        placeholder="Share your comment"></textarea>
      {/* errors will return when field validation fails  */}
      {errors.exampleRequired && <span>This field is required</span>}

      <Button className={styles.shareButton} type="submit">
        Submit
      </Button>
    </form>
  );
}
