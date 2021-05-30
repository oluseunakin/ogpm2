import Head from "next/head";
import { NewsComp } from "../components/News";
import { Stack, Heading, Flex, Button, HStack, Box } from "@chakra-ui/react";
import { appointments, dailyAppointment } from "../lib/appointments";
import { useState } from "react";
import { PrayerRequest } from "../components/PrayerRequest";
import { DevotionComp } from "../components/Devotion";
import { TestimonyComp } from "../components/Testimony";
import { Appointment } from "../components/Appointment";
import { dailyNews } from "../lib/news";

export default function Home({admin, dailyAppointment, appointments, dailyNews }) {
  
  const [main, setMain] = useState(
    <Appointment
      admin={admin}
      dailyAppointment={dailyAppointment}
      appointments={appointments}
    />
  );

  return (
    <>
      <Head>
        <title></title>
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
              setMain(
                <PrayerRequest
                  admin={admin}
                  home={() =>
                    setMain(
                      <Appointment
                        admin={admin}
                        dailyAppointment={dailyAppointment}
                        appointments={appointments}
                      />
                    )
                  }
                />
              )
            }
          >
            Request for Prayer
          </Button>
          <Button
            variant="link"
            onClick={() =>
              setMain(
                <TestimonyComp
                  home={() =>
                    setMain(
                      <Appointment
                        admin={admin}
                        dailyAppointment={dailyAppointment}
                        appointments={appointments}
                      />
                    )
                  }
                />
              )
            }
          >
            Testimonies
          </Button>
          <Button
            variant="link"
            onClick={() =>
              setMain(
                <NewsComp
                  admin="admin"
                  home={() =>
                    setMain(
                      <Appointment
                        admin={admin}
                        dailyAppointment={dailyAppointment}
                        appointments={appointments}
                      />
                    )
                  }
                />
              )
            }
          >
            News and Events
          </Button>
          <Button
            variant="link"
            onClick={() =>
              setMain(
                <DevotionComp
                  admin={admin}
                  home={() =>
                    setMain(
                      <Appointment
                        admin={admin}
                        dailyAppointment={dailyAppointment}
                        appointments={appointments}
                      />
                    )
                  }
                />
              )
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

export async function getStaticProps({params}) {
  return {
    props: {
      dailyAppointment: await dailyAppointment(),
      appointments: await appointments(),
      dailyNews: await dailyNews(),
      admin: params.admin
    },
  };
}

export async function getStaticPaths() {
  return {
    paths: [{params: {admin: 'lucas'}}],
    fallback: false
  }
}
