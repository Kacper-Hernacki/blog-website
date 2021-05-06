import Head from 'next/head';
import Image from 'next/image';
import styles from '../styles/Home.module.css';
import { Toolbar } from '../components/toolbar';
import imageUrlBuilder from '@sanity/image-url';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import TwitterIcon from '@material-ui/icons/Twitter';
import GitHubIcon from '@material-ui/icons/GitHub';
import InstagramIcon from '@material-ui/icons/Instagram';
import LinkedInIcon from '@material-ui/icons/LinkedIn';
import groq from 'groq';

export default function Home({ posts }) {
  const router = useRouter();
  const [mappedPosts, setMappedPosts] = useState([]);
  const [content, setContent] = useState(false);

  console.log(posts);

  useEffect(() => {
    if (posts.length) {
      const imgBuilder = imageUrlBuilder({
        projectId: '78wde2tk',
        dataset: 'production',
      });

      setMappedPosts(
        posts.map((p) => {
          return {
            ...p,
            mainImage: imgBuilder.image(p.mainImage).width(500).height(250),
          };
        })
      );
    } else {
      setMappedPosts([]);
    }
  }, [posts]);

  console.table(mappedPosts);

  const changeBackground = () => {
    if (window.scrollY >= 100) {
      setContent(true);
    } else {
      setContent(false);
    }
  };

  if (typeof window !== 'undefined') {
    // browser code
    window.addEventListener('scroll', changeBackground);
  }

  return (
    <div className={content ? styles.appScrolled : styles.app}>
      <Toolbar content={content} />
      <div className={styles.main}>
        <div className={styles.sectionHeaderContainer}>
          {' '}
          <img className={styles.logoImage} src="/images/WhiteLogo.svg" />
        </div>
        <div className={styles.fadeBottom} />
        <h3 className={styles.recentHeader}>
          <span>Recent Posts:</span>
        </h3>
        <div className={styles.buttons}>
          {' '}
          <div onClick={() => (window.location.href = 'https://twitter.com/')}>
            <TwitterIcon />
          </div>
          <div onClick={() => (window.location.href = 'https://github.com/')}>
            <GitHubIcon />
          </div>
          <div
            onClick={() => (window.location.href = 'https://instagram.com/')}>
            <InstagramIcon />
          </div>
          <div
            onClick={() => (window.location.href = 'https://instagram.com/')}>
            <LinkedInIcon />
          </div>
        </div>
        <div className={styles.feed}>
          {mappedPosts.length ? (
            mappedPosts.map((p, index) => (
              <div
                onClick={() => router.push(`/post/${p.slug.current}`)}
                key={index}
                className={styles.post}>
                <img className={styles.mainImage} src={p.mainImage} />
                <h3>{p.title}</h3>
                <p>
                  By {p.authorName} {new Date(p._createdAt).toDateString()}
                </p>
              </div>
            ))
          ) : (
            <>No Posts Yet</>
          )}
        </div>
      </div>
      <footer className={styles.footer}>
        <p>Copyright 2021 &#169; TheDevsUniverse</p>
        <p>Do you need a support? Email hernackikacper@gmail.com</p>
        <p>Star vector created by vectorpouch - www.freepik.com</p>
      </footer>
    </div>
  );
}

export const getServerSideProps = async (pageContext) => {
  const query = encodeURIComponent('*[ _type == "post" ]');
  const url = `https://78wde2tk.api.sanity.io/v1/data/query/production?query=${query}`;
  const result = await fetch(url).then((res) => res.json());

  if (!result.result || !result.result.length) {
    return {
      props: {
        posts: [],
      },
    };
  } else {
    return {
      props: {
        posts: result.result,
      },
    };
  }
};
