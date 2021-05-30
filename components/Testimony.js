import {
  Stack,
  Heading,
  Text,
  Input,
  Button,
  Box,
  IconButton,
  Icon,
  Textarea,
  Flex,
  Spacer,
  InputGroup,
  InputRightElement,
  useToast,
} from "@chakra-ui/react";
import { useState, useRef, useEffect } from "react";
import { SearchIcon } from "@chakra-ui/icons";
import {
  getTestimonies,
  shareTestimony,
  testimonyByDay,
} from "../lib/testimony";
import { BsFillCaretLeftFill } from "react-icons/bs";
import { formatDate } from "../lib/utils";

export function TestimonyComp({ home }) {
  const [testimony, setTestimony] = useState({});
  const fileInput = useRef();
  const [loading, isLoading] = useState('');
  const [testimonies, setTestimonies] = useState();
  const [date, setDate] = useState(formatDate(new Date()));
  const [name, setName] = useState("")
  const toast = useToast()

  useEffect(async () => {
    setTestimonies(await getTestimonies());
  }, [testimony]);

  function Testimony({ testimony, desc, testifier, date, gallery }) {
    return (
      <Stack>
        <Heading textAlign="center" as="h5">
          {testifier}
        </Heading>
        <Heading as='h6'>{desc}</Heading>
        <Text fontSize='xs' as='em'>{date}</Text>
        <Text> {testimony} </Text>
      </Stack>
    );
  }

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
        <Box mr = '4'>
          <InputGroup>
            <Input
              value={name}
              placeholder="Search by member's name"
              onChange={(e) => setName(e.currentTarget.value)}
            />
            <InputRightElement
              children={
                <IconButton
                  isLoading={loading === 'name'}
                  colorScheme="whatsapp"
                  aria-label="Search for testimony by name"
                  icon={<SearchIcon />}
                  onClick={async (e) => {
                    isLoading('name')
                    setTestimonies(async () => {
                      await testimonyByName(name)
                      isLoading('')
                    });
                  }}
                />
              }
            />
          </InputGroup>
        </Box>
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
                  isLoading={loading === 'date'}
                  colorScheme="messenger"
                  aria-label="Search for a testimony"
                  icon={<SearchIcon />}
                  onClick={async (e) => {
                    isLoading('date')
                    setTestimonies(async () => {
                      await testimonyByDay(date)
                      isLoading('')
                    });
                  }}
                />
              }
            />
          </InputGroup>
        </Box>
      </Flex>
      <Stack spacing="3">
        <Input
          placeholder="Your name"
          onChange={(e) =>
            !_.isEmpty(testimony)
              ? setTestimony({ ...testimony, testifier: e.currentTarget.value })
              : setTestimony({ testifier: e.currentTarget.value })
          }
        />
        <Input
          placeholder="What the Lord has done for you"
          onChange={(e) =>
            !_.isEmpty(testimony)
              ? setTestimony({ ...testimony, desc: e.currentTarget.value })
              : setTestimony({ desc: e.currentTarget.value })
          }
        />
        <Textarea
          onChange={(e) => {
            !_.isEmpty(testimony)
              ? setTestimony({ ...testimony, testimony: e.currentTarget.value })
              : setTestimony({ testimony: e.currentTarget.value });
          }}
          placeholder="Your testimony to the glory of the Lord"
        />
        <input
          type="file"
          multiple
          ref={fileInput}
          onChange={(e) => {
            setTestimony({
              ...testimony,
              media: fileInput.current.files,
            });
          }}
        />
        <Button
          width="max-content"
          alignSelf="flex-end"
          onClick={() => {
            shareTestimony(testimony);
            home();
            toast({ description: "Your testimony has been shared" });
          }}
        >
          Share your Testimony
        </Button>
      </Stack>
      {
        <Stack>
          {testimonies ? testimonies.map((t) => (
            <Testimony
              testifier={t.testifier}
              testimony={t.testimony}
              date={t.date}
              gallery={t.gallery}
            />
          )) : (
            <Heading textAlign='center'>No testimonies to show</Heading>
          )}
        </Stack>
      }
    </Stack>
  );
}
