import { useState } from 'react';
import { useRouter } from 'next/router';
import styles from '../styles/Toolbar.module.css';
// icons

import Image from 'next/image';

export const Toolbar = ({ content }) => {
  const router = useRouter();

  return (
    <div className={content ? styles.mainScrolled : styles.main}>
      <Image
        className={styles.logoImage}
        src={`/images/test.png`}
        alt="Picture of the author"
        width={50}
        height={50}
      />
      <div className={styles.logo} onClick={() => router.push('/')}>
        The<span>Devs</span>Universe
      </div>
    </div>
  );
};
