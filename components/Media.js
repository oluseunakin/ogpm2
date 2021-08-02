import { Row, Col, Image } from "react-bootstrap";
import _ from 'lodash'

function mediaGrid(gallery,screen) {
  if(gallery == 1) return ['col-12'] 
  else if(gallery == 0) return 
  const result = [];
  do {
    const random = _.random(screen ? 6 : 4, 8);
    const size = 12 / random;
    const rem = 12 % random;
    for (let i = 0; i < _.floor(size); i++) {
        result.push("col-" + random);
        if(result.length == gallery) break
    }
    if(rem != 0) result.push("col-" + rem);
  } while(result.length != gallery)
  return result;
}

export default function MediaComp({ media, screen }) {
  function Media({ media,classn}) {
    classn = classn + ' mb-2'
    let render = 'Bad media format'
    if (media.type.indexOf("image") !== 1) render =  <Image width="100%" height="auto" src={media.url} rounded/>;
    else if (media.type.indexOf("video") !== 1) render =  <video src={media.url} width="100%" height="auto"/>;
    else if (media.type.indexOf("audio") !== 1) render = <Audio src={media.url} />;
    return <Col className={classn}>{render}</Col>
  }
  const classes = mediaGrid(media.length, screen);
  return <Row>{media.map((m, i) => <Media key={i} media={m} classn={classes[i]}/>)}</Row>
    
}
