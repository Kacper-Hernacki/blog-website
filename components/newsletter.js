import { useState } from 'react';
import { useRouter } from 'next/router';
import styles from '../styles/Newsletter.module.css';
import axios from 'axios';
import Button from '@material-ui/core/Button';

export const Newsletter = () => {
  const [email, setEmail] = useState('');
  const [state, setState] = useState('IDLE');
  const [errorMessage, setErrorMessage] = useState(null);

  const subscribe = async () => {
    setState('LOADING');
    setErrorMessage(null);
    try {
      const response = await axios.post('/api/newsletter', { email });
      setState('SUCCESS');
    } catch (e) {
      setErrorMessage(e.response.data.error);
      setState('ERROR');
    }
  };

  return (
    <div className={styles.newsletter}>
      <h5>Sign for Newsletter </h5>
      <div className={styles.newsletter__inputs}>
        <input
          type="text"
          placeholder="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <Button
          className={styles.button}
          type="button"
          disabled={state === 'LOADING'}
          onClick={subscribe}
          variant="contained">
          Subscribe
        </Button>
      </div>
      {state === 'ERROR' && <p>{errorMessage}</p>}
      {state === 'SUCCESS' && <p>SUCCESS!</p>}
    </div>
  );
};
