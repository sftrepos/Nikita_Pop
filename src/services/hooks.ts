import Axios from 'axios';
import { getApiUrl } from './api';
import { logError } from 'util/log';

export const getQuestions = (
  id: string,
  token: string,
  num: number,
): Promise<Array<any>> => {
  let questions: Array<any> = [];
  return Axios.post(
    `${getApiUrl()}/user/getquestions`,
    { token, num },
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
      params: {
        id,
      },
    },
  )
    .then((resp) => {
      questions = resp.data;
      return questions.slice(0, num);
    })
    .catch((err) => {
      logError(err);
      return questions;
    });
};
