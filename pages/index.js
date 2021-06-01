import Head from 'next/head';
import Image from 'next/image';
import styles from '../styles/Home.module.css';
import { Toolbar } from '../components/toolbar';
import { Newsletter } from '../components/newsletter';
import { Pagination } from '../components/pagination';
import imageUrlBuilder from '@sanity/image-url';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import TwitterIcon from '@material-ui/icons/Twitter';
import GitHubIcon from '@material-ui/icons/GitHub';
import InstagramIcon from '@material-ui/icons/Instagram';
import LinkedInIcon from '@material-ui/icons/LinkedIn';
import MailIcon from '@material-ui/icons/Mail';
import client from '../client';
import Avatar from '@material-ui/core/Avatar';
import CookieConsent from 'react-cookie-consent';

export async function getStaticProps() {
  // const query = groq`
  // {
  //   "posts": *[_type == "post"]|order(publishedAt desc){title, mainImage, publishedAt,slug,fragment,
  //   'categories': categories[]->title,
  //   'authorName': author->name,
  //   'authorSlug': author->slug,
  //   'authorAvatar': author->avatarImage,
  //   'counter': counter,
  // }
  // }`;
  // const data = await client.fetch(query);

  const data = await client.fetch(` {
    "posts": *[_type == "post"]|order(publishedAt desc){title, mainImage, publishedAt,slug,fragment,
    'categories': categories[]->title,
    'authorName': author->name,
    'authorSlug': author->slug,
    'authorAvatar': author->avatarImage,
    'counter': counter,
  }
  }`);

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

  const [currentPage, setCurrentPage] = useState(1);
  const [postsPerPage, setPostsPerPage] = useState(4);

  useEffect(() => {
    if (posts.length) {
      const imgBuilder = imageUrlBuilder({
        projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID,
        dataset: 'production',
      });
      setMappedPosts(
        posts.map((p) => {
          return {
            ...p,
            mainImage: imgBuilder.image(p.mainImage).width(500).height(250),
            authorAvatar: imgBuilder.image(p.authorAvatar).width(50).height(50),
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

  //Get current posts
  const indexOfLastPost = currentPage * postsPerPage;
  const indexOfFirstPost = indexOfLastPost - postsPerPage;
  const currentPosts = mappedPosts.slice(indexOfFirstPost, indexOfLastPost);

  // change page
  const paginate = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  return (
    <div className={content ? styles.appScrolled : styles.app}>
      <Head>
        <title>TheDevsUniverse - Web dev blog</title>
        <meta name="viewport" content="initial-scale=1.0, width=device-width" />
        <meta charSet="utf-8" />
      </Head>
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
          <div
            onClick={() =>
              (window.location.href = 'https://twitter.com/KacperHernacki')
            }>
            <TwitterIcon />
          </div>
          <div
            onClick={() =>
              (window.location.href = 'https://github.com/Kacper-Hernacki')
            }>
            <GitHubIcon />
          </div>
          <div
            onClick={() =>
              (window.location.href =
                'https://www.instagram.com/kacper.hernacki/')
            }>
            <InstagramIcon />
          </div>
          <div
            onClick={() =>
              (window.location.href =
                'https://pl.linkedin.com/in/kacper-hernacki-965161203')
            }>
            <LinkedInIcon />
          </div>
          <div
            onClick={() =>
              (window.location.href = 'mailto:hernackikacper@gmail.com')
            }>
            <MailIcon />
          </div>
        </div>
        <div className={styles.feed}>
          {currentPosts.length ? (
            currentPosts.map((p) => (
              <div
                onClick={() => router.push(`/post/${p.slug.current}`)}
                key={p.slug.current}
                className={styles.post}>
                {p.mainImage && (
                  <img className={styles.mainImage} src={p.mainImage} />
                )}

                <h3>{p.title}</h3>
                <p className={styles.fragment}>{p.fragment}</p>

                <div className={styles.categories}>
                  {' '}
                  {p.categories?.map((category) => (
                    <p className={styles.category} key={category}>
                      # {category}
                    </p>
                  ))}
                </div>

                <div className={styles.bioFooter}>
                  <div className={styles.authorAvatar}>
                    {' '}
                    <Avatar src={p.authorAvatar} />
                  </div>

                  <div className={styles.bioFooter__right}>
                    <p>{p.authorName}</p>{' '}
                    <div className={styles.bioFooter__rightDate}>
                      <p>{new Date(p.publishedAt).toDateString()}</p>
                      <h3>{p.counter} min read</h3>
                    </div>
                  </div>
                </div>
              </div>
            ))
          ) : (
            <>No Posts Yet</>
          )}
        </div>
      </div>
      <Pagination
        postsPerPage={postsPerPage}
        totalPosts={mappedPosts.length}
        paginate={paginate}
        currentPage={currentPage}
      />
      <Newsletter />
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
      <CookieConsent
        location="bottom"
        buttonText="I accept"
        cookieName="myAwesomeCookieName2"
        style={{ background: '#2B373B' }}
        buttonStyle={{
          backgroundColor: 'white',
          color: '#2f3640',
          fontSize: '13px',
          fontWeight: '700',
          borderRadius: '5px',
        }}
        expires={150}>
        This website uses cookies to enhance the user experience.{' '}
        <span>
          Click the button to accept our
          <span
            style={{ fontWeight: 'bold', color: '#3498db', cursor: 'pointer' }}
            onClick={() =>
              (window.location.href =
                'https://www.freeprivacypolicy.com/live/1990102f-41df-49af-9688-5a225151306e')
            }>
            {' '}
            privace policy
          </span>
        </span>
      </CookieConsent>
    </div>
  );
}
