// @flow

import { connect } from 'react-redux';
import Me from '../components/Me';

const mapStateToProps = ({ currentUser, profile }) => ({ currentUser, profile });

export default connect(mapStateToProps)(Me);
