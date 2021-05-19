import { useState } from 'react';
import { useRouter } from 'next/router';
import styles from '../styles/Footer.module.css';

export const Footer = () => {
  return (
    <footer className={styles.footer}>
      <p style={{ paddingTop: '20px', fontWeight: 'bold' }}>
        Copyright 2021 &#169; TheDevsUniverse
      </p>
      <p
        style={{
          fontWeight: 'bold',
          marginTop: '20px',
          color: '#3498db',
          cursor: 'pointer',
        }}>
        If you want to write a post on this blog, please contact me!
      </p>
      <p>
        Do you need a support? Do you have an idea how to make this blog grow?
        Email{' '}
        <span
          style={{ fontWeight: 'bold', color: '#3498db', cursor: 'pointer' }}>
          thedevsuniverse@gmail.com
        </span>{' '}
      </p>
      <p>Star vector created by vectorpouch - www.freepik.com</p>
    </footer>
  );
};
