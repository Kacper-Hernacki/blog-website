import { useState } from 'react';
import { useRouter } from 'next/router';
import styles from '../styles/Toolbar.module.css';
import Button from '@material-ui/core/Button';
// icons

import Image from 'next/image';

export const Toolbar = ({ content }) => {
  const router = useRouter();

  return (
    <div className={content ? styles.mainScrolled : styles.main}>
      {content ? (
        <Image
          onClick={() => router.push('/')}
          className={styles.logoImage}
          src={`/images/BlackLogo.svg`}
          alt=""
          width={250}
          height={50}
        />
      ) : (
        <Image
          onClick={() => router.push('/')}
          className={styles.logoImage}
          src={`/images/WhiteLogo.svg`}
          alt="Picture of the author"
          width={250}
          height={50}
        />
      )}
      <Button
        onClick={() => router.push('/')}
        className={styles.aboutButton}
        variant="contained">
        Offer
      </Button>
    </div>
  );
};
