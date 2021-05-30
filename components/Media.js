export function Media(media) {

    if ( media.mimetype.indexOf('image') !== 1 ) return <Image src={media.url}></Image>
    else if ( media.mimetype.indexOf('video') !== 1 ) return <Video src={media.url}></Video>
    else if ( media.mimetype.indexOf('audio') !== 1 ) return <Audio src={media.url}></Audio>
    else return <Text>Bad media format</Text>
    
}