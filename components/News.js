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
} from "@chakra-ui/react";
import { useState, useRef, useEffect } from "react";
import { newsByDay, allnews, createNews } from "../lib/news";
import { formatDate } from "../lib/utils";

import _ from "lodash";
import { BsFillCaretLeftFill } from "react-icons/bs";
import { SearchIcon } from "@chakra-ui/icons";

export function NewsComp({ admin, home }) {
  const [news, setNews] = useState({});
  const [date, setDate] = useState(formatDate(new Date()));
  const fileInput = useRef();
  const [allNews, setAllNews] = useState([]);
  const [loading, isLoading] = useState(false);

  useEffect(async () => {
    setAllNews(await allnews());
  }, [news]);

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
                  isLoading = {loading}
                  aria-label="Search for a news or event"
                  icon={<SearchIcon />}
                  onClick={async (e) => {
                    isLoading(true)
                    setAllNews(async () => {
                      await newsByDay(date)
                      isLoading(false)
                    })
                    
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
            placeholder="News/Events title"
            onChange={(e) =>
              !_.isEmpty(news)
                ? setNews({ ...news, title: e.currentTarget.value })
                : setNews({ title: e.currentTarget.value })
            }
          />
          <Textarea
            onChange={(e) => {
              !_.isEmpty(news)
                ? setNews({ ...news, news: e.currentTarget.value })
                : setNews({ news: e.currentTarget.value });
            }}
            placeholder="News/Events in detail"
          />
          <input
            type="file"
            multiple
            ref={fileInput}
            onChange={(e) => {
              setNews({
                ...news,
                media: fileInput.current.files,
              });
            }}
          />
          <Button
            width="max-content"
            alignSelf="flex-end"
            onClick={() => {
              createNews(news);
            }}
          >
            Create News/Events
          </Button>
        </Stack>
      )}
      {allNews && (
        <Stack>
          {allNews.map((news) => (
            <News
              title={news.title}
              news={news.news}
              date={news.date}
              gallery={news.gallery}
            />
          ))}
        </Stack>
      )}
    </Stack>
  );
}

export function News({ news, title, date, gallery }) {
  
    return (
    <Stack>
      <Heading textAlign="center" as="h5">
        {title}
      </Heading>
      <Text fontSize="xs">{date}</Text>
      <Text> {news} </Text>
    </Stack>
  );
}
