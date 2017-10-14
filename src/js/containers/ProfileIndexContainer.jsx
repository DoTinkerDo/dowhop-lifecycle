// @flow

import { connect } from 'react-redux';
import ProfileIndex from '../components/ProfileIndex';

const mapStateToProps = ({ appUsers }) => ({ appUsers });

export default connect(mapStateToProps)(ProfileIndex);
