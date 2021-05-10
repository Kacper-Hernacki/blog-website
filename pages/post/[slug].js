import { useState, useEffect } from 'react';
import styles from '../../styles/Post.module.css';
import imageUrlBuilder from '@sanity/image-url';
import BlockContent from '@sanity/block-content-to-react';
import { Toolbar } from '../../components/toolbar';
import groq from 'groq';
import client from '../../client';
import { useRouter } from 'next/router';
import DefaultErrorPage from 'next/error';
import Head from 'next/head';
import Avatar from '@material-ui/core/Avatar';

export function getStaticPaths() {
  return {
    paths: [],
    fallback: true,
  };
}

export async function getStaticProps({ params }) {
  const { slug } = params;
  const query = groq`*[_type == 'post' && slug.current == '${slug}'][0]{
    ...,
    'author': author->name,
    'authorAvatar': author->avatarImage,
    'authorImage': author->image,
    'authorBio': author->bio,
    'categories': categories[]->title,
  }
 `;

  const data = await client.fetch(query);

  return {
    revalidate: 60 * 60 * 24,
    props: {
      post: data,
    },
  };
}

export const Post = ({ post }) => {
  const router = useRouter();
  const [imageUrl, setImageUrl] = useState('');
  const [authorImageUrl, setAuthorImageUrl] = useState('');
  const [authorAvatarUrl, setAuthorAvatarUrl] = useState('');

  useEffect(() => {
    if (post) {
      const imgBuilder = imageUrlBuilder({
        projectId: '78wde2tk',
        dataset: 'production',
      });
      setImageUrl(imgBuilder.image(post.mainImage).width(500).height(250));
      setAuthorImageUrl(
        imgBuilder.image(post.authorImage).width(150).height(250)
      );
      setAuthorAvatarUrl(
        imgBuilder.image(post.authorAvatar).width(50).height(50)
      );
    }
  }, [post]);

  if (typeof window !== 'undefined') {
    //scroll-progress
    window.onscroll = function () {
      myFunction();
    };

    const myFunction = () => {
      var winScroll =
        document.body.scrollTop || document.documentElement.scrollTop;
      var height =
        document.documentElement.scrollHeight -
        document.documentElement.clientHeight;
      var scrolled = (winScroll / height) * 100;
      var myBar = document.getElementById('myBar');
      if (myBar) {
        document.getElementById('myBar').style.width = scrolled + '%';
      }
    };
  }

  if (router.isFallback) {
    return <h1>Loading...</h1>;
  }

  if (!post) {
    return (
      <>
        <Head>
          <meta name="robots" content="noindex" />
        </Head>
        <DefaultErrorPage statusCode={404} />
      </>
    );
  }

  return (
    <div>
      <Toolbar />
      <div id="myBar" className={styles.progress}></div>
      <div className={styles.main}>
        <h1>{post.title}</h1>
        <p>#{post.categories[0]}</p>
        <p>
          By {post.author} on {new Date(post.publishedAt).toDateString()}
        </p>
        <Avatar src={authorAvatarUrl} />
        <img src={imageUrl} />
        <div className={styles.body}>
          <BlockContent blocks={post.body} />
        </div>
      </div>
      <div>
        {' '}
        <img src={authorImageUrl} />
        <BlockContent blocks={post.authorBio} />
      </div>
    </div>
  );
};

export default Post;
