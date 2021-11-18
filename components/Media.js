import { Row, Col, Image } from "react-bootstrap";
import _ from "lodash";
//import Image from 'next/image'

function mediaGrid(gallery, screen) {
  if (gallery == 1) return ["col-12"]
  else {
    let result = [];
    do {
      const random = _.random(screen === 'md' ? 3 : 6, 8);
      const size = _.floor(12 / random);
      let rem = 12 % random;
      for (let i = 0; i < size; i++) {
        gallery--;
        result.push("col-" + random);
        if(gallery === 0) {
          rem = 0
          break
        }
      }
      if (rem != 0) {
        result.push("col-" + rem);
        gallery--;
      }
    } while (gallery !== 0);
    return result;
  }
}

export default function MediaComp({ media, screen }) {

  const Media = ({ media, classn }) => {
    classn = classn + " mb-2";
    let render
    if (media.type.startsWith("image"))
      render = <Image width="100%" height="auto" src={media.url} rounded />;
    else if (media.type.startsWith("video"))
      render = <video src={media.url} width="100%" height="auto" controls/>;
    else if (media.type.startsWith("audio"))
      render = <Audio src={media.url} />;
    else render = <p>Bad media format</p>;
    return <Col className={classn}>{render}</Col>;
  }
  
  if(_.isEmpty(media)) return null
  const classes = mediaGrid(media.length, screen);
  return (
    <Row>
      {media.map((m, i) => (
        <Media key={i} media={m} classn={classes[i]}/>
      ))}
    </Row>
  );
}
