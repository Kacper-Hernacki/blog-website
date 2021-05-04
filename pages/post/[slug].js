import { useState, useEffect } from 'react';
import styles from '../../styles/Post.module.css';
import imageUrlBuilder from '@sanity/image-url';
import BlockContent from '@sanity/block-content-to-react';
import { Toolbar } from '../../components/toolbar';

export const Post = ({ title, body, image }) => {
  const [imageUrl, setImageUrl] = useState('');

  useEffect(() => {
    const imageBuilder = imageUrlBuilder({
      projectId: '78wde2tk',
      dataset: 'production',
    });
    setImageUrl(imageBuilder.image(image));
  }, [image]);

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

  return (
    <div>
      <Toolbar />
      <div id="myBar" className={styles.progress}></div>
      <div className={styles.main}>
        <h1>{title}</h1>
        {imageUrl && <img className={styles.mainImage} src={imageUrl} />}
        <div className={styles.body}>
          <BlockContent blocks={body} />
        </div>
      </div>
    </div>
  );
};

export const getServerSideProps = async (pageContext) => {
  const pageSlug = pageContext.query.slug;

  if (!pageSlug) {
    return { notFound: true };
  }

  const query = encodeURIComponent(
    `*[ _type == "post" && slug.current == "${pageSlug}" ]`
  );
  const url = `https://78wde2tk.api.sanity.io/v1/data/query/production?query=${query}`;

  const result = await fetch(url).then((res) => res.json());
  const post = result.result[0];

  if (!post) {
    return {
      notFound: true,
    };
  } else {
    return {
      props: {
        body: post.body,
        title: post.title,
        image: post.mainImage,
      },
    };
  }
};

export default Post;
