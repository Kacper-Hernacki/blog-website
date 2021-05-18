import sanity from '@sanity/client';

export default sanity({
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID,
  dataset: 'production',
  apiVersion: '2021-03-25', // use a UTC date string
  useCdn: false,
});
