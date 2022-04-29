import React, { ReactElement } from 'react';
import { connect } from 'react-redux';
import IntercomView from './IntercomView';
import { getProfileData, getId, getStoreToken } from 'util/selectors';
import { updateProfile, getProfile } from 'features/User/UserActions';

const IntercomContainer = (props: Object): ReactElement => {
  return <IntercomView {...props} />;
};

const mapStateToProps = (state: Object) => {
  return {
    profile: getProfileData(state),
    id: getId(state),
    token: getStoreToken(state),
  };
};

const mapDispatchToProps = (dispatch) => ({
  updateProfile: (data: Object) => dispatch(updateProfile(data)),
  getProfile: () => dispatch(getProfile()),
});

export default connect(mapStateToProps, mapDispatchToProps)(IntercomContainer);
