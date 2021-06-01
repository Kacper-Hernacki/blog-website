import { useState, useEffect } from 'react';
import styles from '../../styles/Post.module.css';
import imageUrlBuilder from '@sanity/image-url';
import BlockContent from '@sanity/block-content-to-react';
import { Toolbar } from '../../components/toolbar';
import client from '../../client';
import { useRouter } from 'next/router';
import DefaultErrorPage from 'next/error';
import Head from 'next/head';
import Avatar from '@material-ui/core/Avatar';
import Button from '@material-ui/core/Button';

import CommentsForm from '../../components/commentsForm';
import { Footer } from '../../components/Footer';
import { Comments } from '../../components/comments';
import urlBuilder from '@sanity/image-url';
import SyntaxHighlighter from 'react-syntax-highlighter';
import { stackoverflowDark } from 'react-syntax-highlighter/dist/cjs/styles/hljs';

import {
  FacebookShareButton,
  TwitterShareButton,
  LinkedinShareButton,
  InstapaperShareButton,
} from 'react-share';
import {
  FacebookIcon,
  TwitterIcon,
  LinkedinIcon,
  InstapaperIcon,
} from 'react-share';
import { dark } from '@material-ui/core/styles/createPalette';

export async function getStaticProps({ params }) {
  const { slug } = params;
  //   const query = groq`
  //   *[_type == 'post' && slug.current == '${slug}'][0]{
  //     ...,
  //     'author': author->name,
  //     'authorAvatar': author->avatarImage,
  //     'authorImage': author->image,
  //     'authorBio': author->bio,
  //     'categories': categories[]->title,
  //     'counter': counter,
  //     'comments':*[_type == "comment" && post._ref == ^._id ]|order(publishedAt desc){
  //       _id,
  //       name,
  //       email,
  //       comment,
  //       _createdAt}
  //   }
  //  `;

  //   const data = await client.fetch(query);

  const data = await client.fetch(`
   *[_type == 'post' && slug.current == '${slug}'][0]{
     ...,
     'author': author->name,
     'authorAvatar': author->avatarImage,
     'authorImage': author->image,
     'authorBio': author->bio,
     'categories': categories[]->title,
     'counter': counter,
     'comments':*[_type == "comment" && post._ref == ^._id ]|order(publishedAt desc){    
       _id, 
       name, 
       email, 
       comment, 
       _createdAt}
   }
  `);

  return {
    revalidate: 60 * 60 * 24,
    props: {
      post: data,
    },
  };
}

export async function getStaticPaths() {
  return {
    fallback: true,
    paths: [],
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
        projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID,
        dataset: 'production',
      });
      setImageUrl(imgBuilder.image(post.mainImage).width(1000).height(500));
      setAuthorImageUrl(
        imgBuilder.image(post.authorImage).width(100).height(100)
      );
      setAuthorAvatarUrl(
        imgBuilder.image(post.authorAvatar).width(50).height(50)
      );
    }
  }, [post]);

  const urlFor = (source) =>
    urlBuilder({
      projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID,
      dataset: 'production',
    }).image(source);

  const serializers = {
    types: {
      code: (props) => (
        // <pre data-language={props.node.language}>
        //   <code>{props.node.code}</code>
        // </pre>
        <SyntaxHighlighter
          className={styles.codeBlock}
          language={props.node.language}
          style={stackoverflowDark}>
          {props.node.code}
        </SyntaxHighlighter>
      ),
      image: (props) => (
        <figure>
          <img
            className={styles.blockImage}
            src={urlFor(props.node.asset).width(500).url()}
            alt=""
          />
        </figure>
      ),
    },
  };

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
    return (
      <div
        style={{
          backgroundColor: '#2f3640',
          height: '100vh',
          display: 'grid',
          placeItems: 'center',
        }}>
        <div className={styles.loader}></div>
      </div>
    );
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
    <div className={styles.postContainer}>
      <Head>
        {' '}
        <title>{post.title}</title>
      </Head>
      <Toolbar />
      <div id="myBar" className={styles.progress}></div>
      <div className={styles.main}>
        <h1>{post.title}</h1>
        <div className={styles.bioFooter}>
          <div className={styles.authorAvatar}>
            {' '}
            <Avatar src={authorAvatarUrl} />
          </div>

          <div className={styles.bioFooter__right}>
            <p>{post.author}</p>{' '}
            <div className={styles.bioFooter__rightDate}>
              <p>{new Date(post.publishedAt).toDateString()}</p>
              <h3>{post.counter} min read</h3>
            </div>
          </div>
        </div>{' '}
        <div className={styles.categories}>
          {post.categories?.map((category) => (
            <p className={styles.category} key={category}>
              # {category}
            </p>
          ))}
        </div>
        <img src={imageUrl} className={styles.frontImage} />
        <div className={styles.body}>
          <BlockContent
            imageOptions={{ fit: 'max' }}
            projectId={process.env.NEXT_PUBLIC_SANITY_PROJECT_ID}
            dataset="production"
            serializers={serializers}
            blocks={post.body}
          />
        </div>
        <div className={styles.share}>
          <h5>Share this:</h5>
          <FacebookShareButton url="" quote={'Hey, see my latest post!'}>
            <FacebookIcon
              size={40}
              round={true}
              logoFillColor="white"></FacebookIcon>
          </FacebookShareButton>
          <TwitterShareButton url="" quote={'Hey, see my latest post!'}>
            <TwitterIcon
              size={40}
              round={true}
              logoFillColor="white"></TwitterIcon>
          </TwitterShareButton>
          <LinkedinShareButton url="" quote={'Hey, see my latest post!'}>
            <LinkedinIcon
              size={40}
              round={true}
              logoFillColor="white"></LinkedinIcon>
          </LinkedinShareButton>
        </div>
      </div>

      <div className={styles.author}>
        <div className={styles.authorContainer}>
          <Avatar className={styles.avatarAuthor} src={authorImageUrl} />
          <div className={styles.author__body}>
            <h5>{post.author}</h5>
            <BlockContent blocks={post.authorBio} />
          </div>
        </div>
      </div>
      <Comments comments={post?.comments} />
      <CommentsForm _id={post._id} />
      <Footer />
    </div>
  );
};

export default Post;
