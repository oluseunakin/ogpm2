import {
  Stack,
  Heading,
  Text,
  Input,
  Button,
  HStack,
  Textarea,
  IconButton,
  Icon,
  Flex,
  Spacer,
  Box,
  InputGroup,
  InputRightElement,
  Divider,
} from "@chakra-ui/react";
import { useState, useRef, useEffect } from "react";
import { devotionByDay, devotions } from "../lib/devotion";
import { formatDate } from "../lib/utils";

import _ from "lodash";
import { BsFillCaretLeftFill } from "react-icons/bs";
import { SearchIcon } from "@chakra-ui/icons";

export function DevotionComp({ admin, home }) {
  const [dev, setDev] = useState({});
  const [date, setDate] = useState(formatDate(new Date()));
  const fileInput = useRef();
  const [devs, setDevs] = useState([]);
  const [loading, isLoading] = useState(false);
  const [byDay, setByDay] = useState(undefined)

  useEffect(async () => {
    setDevs(await devotions());
  }, [dev]);

  return (
    <Stack spacing="3">
      <Flex>
        <IconButton
          onClick={() => {
            home();
          }}
          aria-label="Go to the main page"
          icon={<Icon as={BsFillCaretLeftFill} />}
        />
        <Spacer />
        <Box>
          <InputGroup>
            <Input
              type="date"
              value={date}
              onChange={(e) => setDate(formatDate(e.currentTarget.valueAsDate))}
            />
            <InputRightElement
              children={
                <IconButton
                  isLoading={loading}
                  aria-label="Search for a devotion"
                  icon={<SearchIcon />}
                  onClick={async (e) => {
                    isLoading(true);
                    setByDay(await devotionByDay(date));
                  }}
                />
              }
            />
          </InputGroup>
        </Box>
      </Flex>
      {admin && (
        <Stack spacing="3">
          <Input
            placeholder="Title for devotion"
            onChange={(e) =>
              !_.isEmpty(dev)
                ? setDev({ ...dev, title: e.currentTarget.value })
                : setDev({ title: e.currentTarget.value })
            }
          />
          <Input
            placeholder="Bible texts..."
            onChange={(e) =>
              !_.isEmpty(dev)
                ? setDev({ ...dev, text: e.currentTarget.value })
                : setDev({ text: e.currentTarget.value })
            }
          />
          <Textarea
            onChange={(e) => {
              !_.isEmpty(dev)
                ? setDev({ ...dev, topic: e.currentTarget.value })
                : setDev({ topic: e.currentTarget.value });
            }}
            placeholder="Enter devotion here"
          />
          <input
            type="file"
            multiple
            ref={fileInput}
            onChange={(e) => {
              setDev({
                ...dev,
                media: fileInput.current.files,
              });
            }}
          />
          <Button
            width="max-content"
            alignSelf="flex-end"
            onClick={() => {
              createDevotion(dev);
            }}
          >
            Create Devotion
          </Button>
        </Stack>
      )}
      {byDay && (
        <>
          <Devotion
            title={byDay.title}
            topic={byDay.topic}
            text={byDay.text}
            date={byDay.date}
            gallery={byDay.gallery}
          />
          <Divider />
        </>
      )}
      {devs ? (
        <Stack>
          {devs.map((dev) => (
            <Devotion
              title={dev.title}
              topic={dev.topic}
              text={dev.text}
              date={dev.date}
              gallery={dev.gallery}
            />
          ))}
        </Stack>
       ) : (<Heading textAlign='center'>No devotions to show</Heading>)
      }
    </Stack>
  );
}

export function Devotion({ text, title, topic, date, gallery }) {
  return (
    <Stack>
      <Heading textAlign="center" as="h5">
        {title}
      </Heading>
      {text && typeof text === "array" && (
        <HStack>
          <Text>Bible Texts</Text>
          {text.map((t) => (
            <Button>{t}</Button>
          ))}
        </HStack>
      )}
      <Text fontSize="xs">{date}</Text>
      <Text> {topic} </Text>
    </Stack>
  );
}
