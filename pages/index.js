import Head from "next/head";
import { NewsComp } from "../components/News";
import { Stack, Heading, Flex, Button, HStack, Box } from "@chakra-ui/react";
import { useState } from "react";
import { PrayerRequest } from "../components/PrayerRequest";
import { DevotionComp, Devotion } from "../components/Devotion";
import { TestimonyComp } from "../components/Testimony";
import { dailyNews } from "../lib/news";
import { dailyDevotion } from "../lib/devotion";

export default function Home({ dailyDevotion, dailyNews }) {
  function DailyDevotion() {
    return dailyDevotion ? (
      <Devotion
        title={dailyDevotion.title}
        text={dailyDevotion.text}
        gallery={dailyDevotion.gallery}
        topic={dailyDevotion.topic}
        date={dailyDevotion.date}
      />
    ) : (
      <Heading textAlign="center">There is no devotion for today</Heading>
    );
  }
  const [main, setMain] = useState(<DailyDevotion />);

  return (
    <>
      <Head>
        <title>Oracle of God Prophetic Ministry</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <Stack spacing="5" px="5">
        <Heading textAlign="center">
          Welcome to Oracle God Prophectic Ministry
        </Heading>
        <HStack spacing="3" justifyContent="space-evenly">
          <Button
            variant="link"
            onClick={() =>
              setMain(<PrayerRequest home={() => setMain(<DailyDevotion />)} />)
            }
          >
            Request for Prayer
          </Button>
          <Button
            variant="link"
            onClick={() =>
              setMain(<TestimonyComp home={() => setMain(<DailyDevotion />)} />)
            }
          >
            Testimonies
          </Button>
          <Button
            variant="link"
            onClick={() =>
              setMain(<NewsComp home={() => setMain(<DailyDevotion />)} />)
            }
          >
            News and Events
          </Button>
          <Button
            variant="link"
            onClick={() =>
              setMain(<DevotionComp home={() => setMain(<DailyDevotion />)} />)
            }
          >
            Devotions
          </Button>
        </HStack>
        <Flex>
          <Box flex="2" mr="2">
            {main}
          </Box>
          <Stack spacing="4" flex="1">
            {dailyNews &&
              dailyNews.map((news) => (
                <News
                  title={news.title}
                  news={news.news}
                  date={news.date}
                  gallery={news.gallery}
                />
              ))}
          </Stack>
        </Flex>
      </Stack>
    </>
  );
}

export async function getStaticProps() {
  return {
    props: {
      dailyDevotion: await dailyDevotion(),
      dailyNews: await dailyNews(),
    },
  };
}
