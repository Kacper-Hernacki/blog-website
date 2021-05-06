import sanity from '@sanity/client';

export default sanity({
  projectId: '78wde2tk',
  dataset: 'production',
  useCdn: false,
});
