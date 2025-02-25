import * as yup from 'yup';

const validateUrl = (url, feeds) => {
  const schema = yup.string().url().notOneOf(feeds, 'Этот URL уже добавлен');
  return schema.validate(url);
};

export default validateUrl;
