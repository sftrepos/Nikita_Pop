import _ from 'lodash';
import { getAccessToken } from 'util/async';
import { logError } from 'util/log';
import { initialFilters } from 'components/Modals/FilterModal/Filter';

export const getToken = async (state): string => {
  try {
    await getAccessToken()
      .then((res) => {
        return res?.token;
      })
      .catch((e) => {});
  } catch (e) {
    logError(e);
  }
};

export const getStoreToken = (state): string => {
  const token =
    state?.login?.token ||
    state?.login?.user?.access?.token ||
    state.register.token;
  return token;
};

export const getId = (state): string => {
  let { id } = state.register.user;
  if (!id) {
    id = (state.login.id || state.login.user?.identityId) ?? '';
  }
  return id;
};

export const getFilters = (state) => {
  const { filters = initialFilters } = state.requests || {};
  return filters;
};

export const getSetupProfile = (state) => {
  const { username, name, hometown, university, gender } = state.setup;
  return {
    username,
    name,
    hometown,
    gender,
    university: {
      major: university.major,
      gradDate: university.year,
      isGrad: university.isGrad,
    },
  };
};

export const getProfileData = (state) => {
  const profile = _.isEmpty(state.user.localUser)
    ? state.register.user
    : state.user.localUser;

  const {
    username,
    name,
    hometown,
    university,
    gender,
    card,
    avatar,
    meta,
    genderV2,
  } = profile;
  return {
    username,
    name,
    hometown,
    gender,
    card,
    avatar,
    meta,
    genderV2,
    university: {
      major: university?.major,
      name: university?.name,
      gradDate: university?.gradDate,
      isGrad: university?.isGrad,
      secondMajor: university?.secondMajor,
    },
  };
};

export const getProfileInterests = (state) => {
  let { user } = state.register;
  if (_.isEmpty(user)) {
    user = state.login.user;
  }
  const interests = user.interest;
  return {
    interests,
  };
};

export const getWidgets = (state) => state.widget.widgets;

export const getNumWidgets = (state) => state.widget.numWidgets;

export const getAvatar = (state) => state.user.localUser?.avatar ?? '';

export const getBrowseCards = (state) => state.requests.cards;

export const getUniversity = (state) => state.login.user.university;

export const getLocalUserData = (state) => state.user?.localUser || {};

export const isUserInSetup = (state) => state.setup.isInSetup;

export const getUpdateProfileIsLoading = (state) => state.user.isFetching;

export const getCurrentRequests = (state) =>
  state.requests?.requests.length ?? 0;

export const getBlockedUsersList = (state) =>
  state.user.localUser.blockedUsers || [];

export const getIsVaccinated = (state) =>
  state.user.localUser?.meta.isVaccinated || false;

export const getNumUnreadChatAndInvite = (state) => {
  return state.requests.requests.length + state.chats.numUnreadChat;
};
