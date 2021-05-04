import { useState } from 'react';
import { useRouter } from 'next/router';
import styles from '../styles/Toolbar.module.css';
// icons
import TwitterIcon from '@material-ui/icons/Twitter';
import GitHubIcon from '@material-ui/icons/GitHub';

export const Toolbar = ({ content }) => {
  const router = useRouter();

  return (
    <div className={content ? styles.mainScrolled : styles.main}>
      <div className={styles.logo} onClick={() => router.push('/')}>
        The<span>Devs</span>Universe
      </div>
     
    </div>
  );
};
