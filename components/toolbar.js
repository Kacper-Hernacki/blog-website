import { useRouter } from 'next/router';
import styles from '../styles/Toolbar.module.css';
// icons
import TwitterIcon from '@material-ui/icons/Twitter';
import GitHubIcon from '@material-ui/icons/GitHub';

export const Toolbar = () => {
  const router = useRouter();

  return (
    <div className={styles.main}>
      <div onClick={() => router.push('/')}>Home</div>
      <div onClick={() => (window.location.href = 'https://twitter.com/')}>
        <TwitterIcon />
      </div>
      <div onClick={() => (window.location.href = 'https://github.com/')}>
        <GitHubIcon />
      </div>
    </div>
  );
};
