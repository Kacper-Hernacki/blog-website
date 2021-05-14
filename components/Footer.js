import { useState } from 'react';
import { useRouter } from 'next/router';
import styles from '../styles/Footer.module.css';

export const Footer = () => {
  return (
    <footer className={styles.footer}>
      <p>Copyright 2021 &#169; TheDevsUniverse</p>
      <p>Do you need a support? Email hernackikacper@gmail.com</p>
    </footer>
  );
};
