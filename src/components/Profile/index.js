import React from 'react';
import Timeline from 'components/Timeline';
import Rule from 'components/Rule';
import style from './Profile.module.css';
import Header from 'components/Home/Header';

export const Profile = ({className, data: {who, timeline, links}}) => <div {...{
  className: [ style.profile ].concat(className).join(" ")
}}>
  <Header {...{who, links}}/>


  <Timeline timeline={timeline} />

  <Rule className={style.rule}>⁂</Rule>

  <Footer timeline={timeline} />

</div>



export default Profile;

