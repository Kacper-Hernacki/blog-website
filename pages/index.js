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
import client from '../client';
import BlockContent from '@sanity/block-content-to-react';

export async function getStaticProps() {
  const query = groq`
  {
    "posts": *[_type == "post"]|order(publishedAt desc){title, mainImage, publishedAt,slug,
    'categories': categories[]->title,
    'authorName': author->name,
    'authorSlug': author->slug,
    
  }
  }`;
  const data = await client.fetch(query);

  return {
    props: {
      posts: data.posts,
    },
  };
}

export default function Home({ posts }) {
  const router = useRouter();
  const [mappedPosts, setMappedPosts] = useState([]);
  const [content, setContent] = useState(false);

  console.table(posts);

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
            mappedPosts.map((p) => (
              <div
                onClick={() => router.push(`/post/${p.slug.current}`)}
                key={p.slug.current}
                className={styles.post}>
                {p.mainImage && (
                  <img className={styles.mainImage} src={p.mainImage} />
                )}

                <h3>{p.title}</h3>

                {p.categories?.map((category) => (
                  <p key={category}># {category}</p>
                ))}
                <p>
                  By {p.authorName} on {new Date(p.publishedAt).toDateString()}
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
