import React from 'react';
import Profile from '../Profile';
import ashVideo from "./static/ash.mp4";
import ashPoster from "./static/ash.jpg";
import style from './Home.module.css';
import { DefaultPlayer as Video } from 'react-html5video';

const Home = ({data, className}) => {
  data.who.name=undefined; // just dont want it lol

  return <div className={[style.home].concat(className).join(" ")}>
        <VideoBackground />
        <header> <div className="innerText">{data.who.handle}</div> </header>
        <article> <Profile data={data} /> </article>
  </div>
}

class VideoBackground extends React.Component {
  componentDidMount() {
    const { props: { className } } = this;
    const video = document.createElement('video');
    video.autoplay = true;
    video.loop = true;
    video.muted = true; // fixes autoplay in chrome
    video.setAttribute('poster', ashPoster);
    video.setAttribute('playsinline', 'true'); // fixes autoplay in webkit (ie. mobile safari)
    video.setAttribute('class', [style.videoBackground].concat(className).join(" "));

    const source = document.createElement('source');
    source.src = ashVideo;
    source.type = 'video/mp4';
    video.appendChild(source);

    // react probably hates me for this and i also dont care
    this.videoContainer.parentNode.replaceChild(video, this.videoContainer);
  }
  render() {
    return (
      <div ref={(ref) =>  this.videoContainer = ref } />
    );
  }
}

/* pls mr react support 'muted' ty.
const VideoBackground = ({ className }) => <Video {...{
    poster: ashPoster,
    autoPlay: true,
    muted: true,
    playsInline: true,
    className: [style.videoBackground].concat(className).join(" ")
  }}>
  <source src={ashVideo} type="video/mp4" />
</Video>
*/

export default Home;
