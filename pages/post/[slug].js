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
import Button from '@material-ui/core/Button';
import TwitterIcon from '@material-ui/icons/Twitter';
import FacebookIcon from '@material-ui/icons/Facebook';
import InstagramIcon from '@material-ui/icons/Instagram';
import LinkedInIcon from '@material-ui/icons/LinkedIn';
import CommentsForm from '../../components/commentsForm';
import { Footer } from '../../components/Footer';
import { Comments } from '../../components/comments';

export function getStaticPaths() {
  return {
    paths: [],
    fallback: true,
  };
}

export async function getStaticProps({ params }) {
  const { slug } = params;
  const query = groq`
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
        imgBuilder.image(post.authorImage).width(100).height(100)
      );
      setAuthorAvatarUrl(
        imgBuilder.image(post.authorAvatar).width(50).height(50)
      );
    }
  }, [post]);

  const serializers = {
    types: {
      code: (props) => (
        <pre data-language={props.node.language}>
          <code>{props.node.code}</code>
        </pre>
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
    <div className={styles.postContainer}>
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
        <img src={imageUrl} />
        <div className={styles.body}>
          <BlockContent
            imageOptions={{ fit: 'max' }}
            serializers={serializers}
            blocks={post.body}
          />
        </div>
        <div className={styles.share}>
          <h5>Share this:</h5>
          <div className={styles.shareContainer}>
            <Button className={styles.shareButton} variant="contained">
              <FacebookIcon />
              <span> Facebook</span>
            </Button>
            <Button className={styles.shareButton} variant="contained">
              <InstagramIcon /> <span> Instagram</span>
            </Button>
            <Button className={styles.shareButton} variant="contained">
              {' '}
              <LinkedInIcon /> <span> LinkedIN</span>
            </Button>
            <Button className={styles.shareButton} variant="contained">
              {' '}
              <TwitterIcon /> <span> Twitter</span>
            </Button>
          </div>
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
